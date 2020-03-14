<template>
    <v-container>
        <div v-if="currentMember" style="display: flex">
            <v-btn icon :disabled="!mid || mid === 1" @click="mid--; fillData()">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <h1>{{ currentMember.name }}</h1>
            <v-spacer></v-spacer>
            <v-btn icon :disabled="!mid || mid === members.length" @click="mid++; fillData()">
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
        </div>
        <h1 v-else>Members</h1>
        <line-chart :chart-data="chartData" :options="chartOptions" :styles="{marginBottom: '1em'}"></line-chart>
        <ul v-if="currentMember">
            <li>Trend: {{ slope.toFixed(4) }} || {{ normalisedSlope.toFixed(4) }} </li>
            <li>Consistency: {{ stdDev }}</li>
            <li>Highest Single Time: {{ highestTime }}</li>
            <li>Average Time: {{ averageTime}}</li>
        </ul>
    </v-container>
</template>

<script>
import LineChart from '@/components/LineChart'
export default {
    data() {
        return {
            chartData: {},
            chartOptions: {
                spanGaps: true,
                responsive: true,
                maintainAspectRatio: false
            },
            fillUnderLine: true,
            mid: parseInt(this.id),
            slope: 0,
            stdDev: 0
        }
    },
    props: ['id'],
    computed: {
        members() {
            return this.$store.getters.getAllMembers
        },
        averageTime() {
            var times = this.$store.getters.getAvgTimesById(this.mid).filter(y => y > 0)
            return (times.reduce((acc, cur) => acc + cur, 0) / times.length).toFixed(2)
        },
        currentMember() {
            return this.mid ? this.$store.getters.getMemberById(this.mid) : undefined
        },
        trendLine() {
            if (!this.mid) {
                this.slope = 0
                return undefined
            }
            var data = this.$store.getters.getAvgTimesById(this.mid)
            console.log(data)
            var { tslope, equation } = this.getTrendEquation(data)
            this.slope = tslope
            return data.map((v, idx) => equation(idx))
        },
        normalisedSlope() {
            if (!this.mid) {
                return 0
            }
            var data = this.$store.getters.getAvgTimesById(this.mid).filter(y => y > 0)
            if (data.length < 2) {
                return 0
            }
            var min = Math.min(...data)
            var max = Math.max(...data)
            var norm = data.map(xi => ((xi - min) / (max - min)) + 1)
            return this.getTrendEquation(norm).tslope
        },
        highestTime() {
            if (!this.mid) {
                return undefined
            }
            var times = this.$store.getters.getAllAttendancesById(this.mid).filter(a => a).map(a => a.times)
            return times.reduce((acc, cur) => {
                if (cur.length === 0) {
                    return acc
                } else {
                    return Math.max(...cur, acc)
                }
            }, 0)
        }
    },
    mounted() {
        this.fillData()
    },
    components: {
        'line-chart': LineChart
    },
    methods: {
        fillData() {
            var sessions = this.$store.getters.getSessions
            this.chartData = {
                labels: sessions.map(s => s.date),
                datasets: this.currentMember ? [{
                    label: this.currentMember.name.split(' ')[0],
                    fill: this.fillUnderLine,
                    backgroundColor: this.rainbow(this.members.length, this.currentMember.id-1) + '44',
                    data: this.$store.getters.getAvgTimesById(this.currentMember.id).map(t => t === 0 ? null : Math.round(t * 10000) / 10000)
                },{
                    label: 'Trend',
                    fill: false,
                    data: this.trendLine?.map((d, idx) => idx === 0 || idx === this.trendLine.length - 1 ? Math.round(d * 10000) / 10000 : undefined),
                    pointStyle: 'triangle'
                }] : this.members.map(m => {
                    return {
                        label: m.name,
                        fill: this.fillUnderLine,
                        backgroundColor: this.rainbow(this.members.length, m.id-1) + '44',
                        data: this.$store.getters.getAvgTimesById(m.id).map(t => t === 0 ? null : Math.round(t * 10000) / 10000)
                    }
                })
            }
        },
        getTrendEquation(data) {
            var yData = data.filter(y => y > 0)
            if (yData.length === 1) {
                console.log(yData)
                return {
                    tslope: 0,
                    equation: x => (yData[0])
                }
            }
            var xData = data.map((y, idx) => y > 0 ? idx : -1).filter(x => x >= 0)
            var n = xData.length
            var xSum = 0
            var ySum = 0
            var xySum = 0
            var xxSum = 0
            for (var i = 0; i < n; i++) {
                xySum += xData[i]*yData[i]
                xxSum += xData[i]*xData[i]
                xSum += xData[i]
                ySum += yData[i]
            }
            var t1 = n * xySum
            var t2 = xSum * ySum
            var t3 = n * xxSum
            var t4 = xSum * xSum
            var tslope = (t1 - t2) / (t3 - t4)
            var t5 = tslope * xSum
            var yIntercept = (ySum - t5) / n
            return {
                tslope,
                equation: x => ((tslope * x) + yIntercept)
            }
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
