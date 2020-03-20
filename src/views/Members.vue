<template>
    <v-container v-if="currentMember">
        <v-row>
            <v-col cols="auto">
                <v-btn icon :disabled="!mid || mid === 1" @click="selectMember(mid - 1)">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
                <h1 class="display-1 font-weight-bold">{{ currentMember.name }}</h1>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
                <v-btn icon :disabled="!mid || mid === members.length" @click="selectMember(mid + 1)">
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-tabs v-model="currentTab" grow dark background-color="primary">
            <v-tabs-slider color="primary lighten-3"></v-tabs-slider>
            <v-tab>Time of Flight</v-tab>
            <v-tab>Competitions</v-tab>
        </v-tabs>
        <v-tabs-items v-model="currentTab">
            <v-tab-item>
                <v-card flat class="mx-auto px-4">
                    <v-card-title class="pb-0">Stats for {{ currentMember.name.split(' ')[0] }}</v-card-title>
                </v-card>
                <line-chart :chart-data="chartData" :options="chartOptions" :styles="{marginBottom: '1em'}"></line-chart>
                <v-card flat class="mx-auto px-4">
                    <v-list light>
                        <v-list-item>
                            <v-list-item-content>
                                Number of sessions
                            </v-list-item-content>
                            <v-list-item-content>
                                {{ avgTimesFiltered.length }}
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-content>
                                Personal best time
                            </v-list-item-content>
                            <v-list-item-content>
                                {{ highestTime }}
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-content>
                                Mean time
                            </v-list-item-content>
                            <v-list-item-content>
                                {{ overallMeanTime }}
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-content>
                                Overall trend
                            </v-list-item-content>
                            <v-list-item-content>
                                {{ trendText }}
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-content>
                                Deviation from mean
                            </v-list-item-content>
                            <v-list-item-content>
                                {{ stdDev }}
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-content>
                                Deviation from trend
                            </v-list-item-content>
                            <v-list-item-content>
                                {{ trendDev }}
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <h1>Comp stats</h1>
            </v-tab-item>
        </v-tabs-items>
    </v-container>
    <v-container v-else >
        <v-row>
            <v-col cols="12">
		        <h1 style="text-align: center" class="display-1 font-weight-bold">Members</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="6"
                v-for="(m, i) in memberCards"
                :key="`member-card-${i}`"
            >
		        <member-card :member="m" @select-member="selectMember"></member-card>
            </v-col>
        </v-row>
	</v-container>
</template>

<script>
import LineChart from '@/components/LineChart'
import MemberQuickCard from '../components/MemberQuickCard'
import util from '@/mixins/util'
export default {
    data() {
        return {
            chartData: {},
            chartOptions: {
                spanGaps: true,
                responsive: true,
                maintainAspectRatio: false
            },
            currentTab: null,
            slope: 0,
            mid: parseInt(this.id),
            correlationStrength: 0,
            trendLine: [],
            unsubscribeStore: null
        }
    },
    props: ['id'],
    mixins: [util],
    components: {
        'line-chart': LineChart,
		'member-card': MemberQuickCard
	},
    computed: {
        showSingleSession() {
            return this.$store.state.settings.showSingleSession
        },
        trimEmpty() {
            return this.$store.state.settings.trimEmpty
        },
        // use mapState for the above?
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
                var b = -1, e = -1;
                for (var i = 0; i < tmx.length; i++) {
                    if (tmx[i] !== 0) {
                        b = b === -1 ? i : b
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
                    str = 'Very weakly'
                } else if (this.correlationStrength < .3) {
                    str = 'Weakly'
                } else if (this.correlationStrength < .4) {
                    str = 'Moderately'
                } else if (this.correlationStrength < .7) {
                    str = 'Strongly'
                } else {
                    str = 'Very strongly'
                }
                return `${str} ${this.slope > 0 ? 'increasing' : 'decreasing'} (${Math.round(this.correlationStrength * 10000) / 100}%)`
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
    created() {
        this.unsubscribeStore = this.$store.subscribe(({ type }) => {
            if (['setTrimEmpty', 'setStartDate', 'setEndDate'].includes(type)) {
                this.fillData()
            }
        })
    },
    mounted() {
        this.fillData()
    },
    beforeDestroy() {
        this.unsubscribeStore()
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
		}
    }
}
</script>
