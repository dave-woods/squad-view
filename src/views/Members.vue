<template>
    <v-container v-if="currentMember">
        <div style="display: flex">
            <v-btn icon :disabled="!mid || mid === 1" @click="selectMember(mid - 1)">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <h1>{{ currentMember.name }}</h1>
            <v-spacer></v-spacer>
            <v-btn icon :disabled="!mid || mid === members.length" @click="selectMember(mid + 1)">
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </div>
        <line-chart :chart-data="chartData" :options="chartOptions" :styles="{marginBottom: '1em'}"></line-chart>
        <ul>
            <li>Personal best: {{ highestTime }}</li>
            <li>Mean time: {{ overallMeanTime}}</li>
            <li>{{ trendText }}</li>
            <li>Deviation: (Standard) {{ stdDev }}, (from trend) {{ trendDev }}</li>
        </ul>
    </v-container>
    <v-container v-else style="position: relative; display: grid; grid-template-columns: 1fr 1fr; grid-gap: 10px">
		<h1 style="grid-column: 1 / span 2; text-align: center">Members</h1>
		<v-switch v-model="showSingleSession" label="Show members with only one session" style="position: absolute; bottom: -40px; left: 10px"></v-switch>
		<member-card
			v-for="(v, i) in memberCards"
			:key="`member-card-${i}`"
			:member="v"
		>
		</member-card>
	</v-container>
</template>

<script>
import LineChart from '@/components/LineChart'
import MemberQuickCard from '../components/MemberQuickCard'
export default {
    data() {
        return {
            chartData: {},
            chartOptions: {
                spanGaps: true,
                responsive: true,
                maintainAspectRatio: false
            },
            slope: 0,
            mid: parseInt(this.id),
            correlationStrength: 0,
            trendLine: [],
            // below should be props from settings
			showSingleSession: false,
            trimEmpty: true
        }
    },
    props: ['id'],
    components: {
        'line-chart': LineChart,
		'member-card': MemberQuickCard
	},
    computed: {
        members() {
            return this.$store.getters.getAllMembers
        },
        overallMeanTime() {
            return Math.round(this.avgTimesFiltered.reduce((acc, cur) => acc + cur, 0) / this.avgTimesFiltered.length * 10000) / 10000
        },
        avgTimes() {
            return this.$store.getters.getAvgTimesById(this.mid).slice(...this.trim)
        },
        avgTimesFiltered() {
            return this.avgTimes.filter(time => time > 0)
        },
        currentMember() {
            return this.mid ? this.$store.getters.getMemberById(this.mid) : undefined
        },
        trim() {
            var tmx = this.$store.getters.getAvgTimesById(this.mid)
            if (this.trimEmpty) {
                var b = 0, e = 0;
                for (var i = 0; i < tmx.length; i++) {
                    if (tmx[i] !== 0) {
                        b = b === 0 ? i : b
                        e = i
                    }
                }
                return [b, e+1]
            }
            return [0]
        },
        trendText () {
            if (this.slope === 0) {
                return 'No change'
            } else {
                // https://www.statisticshowto.datasciencecentral.com/probability-and-statistics/correlation-coefficient-formula/
                // https://www.itrcweb.org/gsmc-1/Content/GW%20Stats/5%20Methods%20in%20indiv%20Topics/5%205%20Trend%20Tests.htm
                var str = ''
                if (this.correlationStrength < .2) {
                    str = 'very weak'
                } else if (this.correlationStrength < .3) {
                    str = 'weak'
                } else if (this.correlationStrength < .4) {
                    str = 'moderate'
                } else if (this.correlationStrength < .7) {
                    str = 'strong'
                } else {
                    str = 'very strong'
                }
                return `Overall ${str} ${this.slope > 0 ? 'increasing' : 'decreasing'} trend (${Math.round(this.correlationStrength * 10000) / 100}%)`
            }
        },
        stdDev() {
            if (this.avgTimesFiltered.length < 2) {
                return 0
            }
            var sqDiffs = this.avgTimesFiltered.map(y => {
                var diff = y - this.overallMeanTime
                return diff * diff
            })
            return Math.round(Math.sqrt(sqDiffs.reduce((a, c) => a + c, 0) / sqDiffs.length) * 10000) / 10000
        },
        trendDev() {
            var data = this.avgTimes.map((y, idx) => [y, idx]).filter(y => y[0] > 0)
            if (data.length < 2) {
                return 0
            }
            var sqDiffs = data.map(([y, idx]) => {
                var diff = y - this.trendLine[idx]
                return diff * diff
            })
            return Math.round(Math.sqrt(sqDiffs.reduce((a, c) => a + c, 0) / sqDiffs.length) * 10000) / 10000
        },
        highestTime() {
            var times = this.$store.getters.getAllAttendancesById(this.mid).filter(a => a).map(a => a.times)
            return times.reduce((acc, cur) => {
                if (cur.length === 0) {
                    return acc
                } else {
                    return Math.max(...cur, acc)
                }
            }, 0)
        },
        // originally from /graph
        namesAndTimes() {
			return this.$store.getters.getAllMembers.map(m => {
				return {
					id: m.id,
					name: m.name,
					avgTimes: this.$store.getters.getAvgTimesById(m.id)
				}
			})
		},
		memberCards() {
			return this.showSingleSession ? this.namesAndTimes : this.namesAndTimes.filter(n => n.avgTimes.filter(t => t > 0).length > 1)
		}
    },
    watch: {
        id(val) {
            this.mid = parseInt(val)
            this.fillData()
        }
    },
    mounted() {
        this.fillData()
    },
    methods: {
        fillData() {
            if (!this.currentMember) {
                return
            }
            var { trendSlope, pearsons, equation } = this.getTrendEquation(this.avgTimes)
            this.slope = trendSlope
            this.correlationStrength = Math.abs(pearsons)
            this.trendLine = this.avgTimes.map((v, idx) => equation(idx))
            var sessions = this.$store.getters.getSessions.slice(...this.trim)
            this.chartData = {
                labels: sessions.map(s => s.date),
                datasets: [{
                    label: this.currentMember.name.split(' ')[0],
                    backgroundColor: this.rainbow(this.members.length, this.mid-1) + '44',
                    data: this.avgTimes.map(t => t === 0 ? null : Math.round(t * 10000) / 10000),
                    borderColor: '#00000066',
                    pointRadius: 5
                },{
                    label: 'Trend',
                    data: this.trendLine.map(d => Math.round(d * 10000) / 10000),
                    pointStyle: 'triangle',
                    backgroundColor: '#FFFFFF00',
                    borderColor: this.rainbow(this.members.length, this.mid-1) + '44'
                },{
                    label: `Mean (${this.overallMeanTime})`,
                    borderDash: [10, 10],
                    backgroundColor: '#FFFFFF00',
                    data: this.avgTimes.map(() => this.overallMeanTime),
                    pointRadius: 0,
                    borderColor: '#00000033'
                }]
            }
        },
        getTrendEquation(data) {
            // https://math.stackexchange.com/questions/204020/what-is-the-equation-used-to-calculate-a-linear-trendline
            var yData = data.filter(y => y > 0)
            if (yData.length === 1) {
                return {
                    trendSlope: 0,
                    pearsons: 0,
                    equation: x => (yData[0])
                }
            }
            var xData = data.map((y, idx) => y > 0 ? idx : -1).filter(x => x >= 0)
            var n = xData.length
            var xSum = 0
            var ySum = 0
            var xySum = 0
            var xxSum = 0
            var yySum = 0
            for (var i = 0; i < n; i++) {
                xySum += xData[i]*yData[i]
                xxSum += xData[i]*xData[i]
                yySum += yData[i]*yData[i]
                xSum += xData[i]
                ySum += yData[i]
            }
            var top = (n * xySum) - (xSum * ySum)
            var bottomLeft = (n * xxSum) - (xSum * xSum)
            var bottomRight = (n * yySum) - (ySum * ySum)
            var trendSlope = top / bottomLeft
            var yIntercept = (ySum - (trendSlope * xSum)) / n
            return {
                trendSlope,
                pearsons: Math.round(top / Math.sqrt(bottomLeft * bottomRight) * 10000) / 10000,
                equation: x => ((trendSlope * x) + yIntercept)
            }
        },
        selectMember(id) {
			this.$router.push(`/members/${id}`)
		},
        rainbow(numOfSteps, step) {
            /* from https://stackoverflow.com/questions/1484506/random-color-generator */
            // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
            // Adam Cole, 2011-Sept-14
            // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
            var r, g, b;
            var h = step / numOfSteps;
            var i = ~~(h * 6);
            var f = h * 6 - i;
            var q = 1 - f;
            switch(i % 6){
                case 0: r = 1; g = f; b = 0; break;
                case 1: r = q; g = 1; b = 0; break;
                case 2: r = 0; g = 1; b = f; break;
                case 3: r = 0; g = q; b = 1; break;
                case 4: r = f; g = 0; b = 1; break;
                case 5: r = 1; g = 0; b = q; break;
            }
            var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
            return (c);
        }
    }
}
</script>
