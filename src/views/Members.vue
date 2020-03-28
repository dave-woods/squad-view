<template>
    <v-container v-if="currentMember">
        <v-row>
            <v-col cols="auto">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn icon :disabled="!mid || mid === 1" @click="selectMember(mid - 1)" v-on="on">
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                    </template>
                    <span>Previous Member</span>
                </v-tooltip>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
                <h1 class="display-1 font-weight-bold text-center">{{ currentMember.name }}</h1>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn icon :disabled="!mid || mid === members.length" @click="selectMember(mid + 1)" v-on="on">
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </template>
                    <span>Next Member</span>
                </v-tooltip>
            </v-col>
        </v-row>
        <v-tabs v-model="currentTab" grow dark background-color="primary">
            <v-tabs-slider color="primary lighten-3"></v-tabs-slider>
            <!-- <v-tab>Info</v-tab> -->
            <v-tab>Time of Flight</v-tab>
            <v-tab>Competitions</v-tab>
            <v-tab>Session Goals</v-tab>
            <v-tab>Conditioning</v-tab>
            <v-tab>...</v-tab>
        </v-tabs>
        <v-tabs-items v-model="currentTab">
            <!-- <v-tab-item>General Information</v-tab-item> -->
            <v-tab-item>
                <v-card flat class="mx-auto px-4">
                    <v-card-title class="pb-0">Time of flight stats for {{ currentMember.name.split(' ')[0] }}</v-card-title>
                </v-card>
                <line-chart :chart-data="chartData" :options="chartOptions" :styles="{marginBottom: '1em'}"></line-chart>
                <stat-list :stats="timeOfFlightStats" long></stat-list>
            </v-tab-item>
            <v-tab-item>
                <v-card flat class="mx-auto px-4">
                    <v-card-title>Competition details for {{ currentMember.name.split(' ')[0] }}</v-card-title>
                </v-card>
                <v-data-table
                    :headers="['Name', 'Date', 'Level', 'Score', 'Rank'].map(s => ({ text: s, value: s.toLowerCase() }))"
                    :items="competitions"
                ></v-data-table>
            </v-tab-item>
            <v-tab-item>
                <h1>Session goals</h1>
            </v-tab-item>
            <v-tab-item>
                <v-card flat class="mx-auto px-4">
                    <v-card-title class="pb-0">Conditioning for {{ currentMember.name.split(' ')[0] }}</v-card-title>
                </v-card>
                <v-container>
                    <v-data-iterator :items="exerciseData">
                        <template v-slot:default="{ items }">
                            <v-row>
                                <v-col cols="6" v-for="(es, esidx) in items" :key="`conditioning-${esidx}`">
                                    <v-card>
                                        <v-card-title>{{ es.date }}</v-card-title>
                                        <v-list dense height="400px" style="overflow-y: auto">
                                            <v-list-item dense v-for="(e, eidx) in es.exercises" :key="`ex-${esidx}-${eidx}`">
                                                <v-list-item-content>{{ e.exercise }}</v-list-item-content>
                                                <v-list-item-content class="align-end">{{ exerciseString(e.data.find(d => d.id === mid), e.perSide) }}</v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </template>
                    </v-data-iterator>
                </v-container>
            </v-tab-item>
            <v-tab-item>
                <h1>Notes</h1>
            </v-tab-item>
        </v-tabs-items>
    </v-container>
    <member-selector v-else :selectMember="selectMember"></member-selector>
</template>

<script>
import LineChart from '@/components/LineChart'
import MemberSelector from '@/components/MemberSelector'
import StatList from '@/components/StatList'
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
        'member-selector': MemberSelector,
        'stat-list': StatList
	},
    computed: {
        timeOfFlightStats() {
            return [
                {
                    text: {
                        long: 'Number of sessions',
                        short: '# times'
                    },
                    value: this.avgTimesFiltered.length
                },
                {
                    text: {
                        long: 'Personal best time',
                        short: 'PBT'
                    },
                    value: this.highestTime
                },
                {
                    text: {
                        long: 'Mean time',
                        short: 'Mean'
                    },
                    value: this.overallMeanTime
                },
                {
                    text: {
                        long: 'Median time',
                        short: 'Median'
                    },
                    value: this.overallMedianTime
                },
                {
                    text: {
                        long: 'Overall trend',
                        short: 'Trend'
                    },
                    value: this.trendText
                },
                {
                    text: {
                        long: 'Deviation from mean',
                        short: 'Std dev'
                    },
                    value: this.stdDev
                },
                {
                    text: {
                        long: 'Deviation from trend',
                        short: 'Trend dev'
                    },
                    value: this.trendDev
                }
            ]
        },
        competitions() {
            return this.$store.getters.getCompetitionsByMember(this.mid).map(comp => {
                var currentCompetitor = comp.competitors.find(c => c.id === this.mid)
                return {
                    name: comp.name,
                    date: this.dateToDateString(comp.startDate),
                    level: currentCompetitor.individual.level,
                    score: currentCompetitor.individual.total,
                    rank: currentCompetitor.individual.rank
                }
            })
        },
        trimEmpty() {
            return this.$store.state.settings.trimEmpty
        },
        members() {
            return this.$store.getters.getAllMembers
        },
        overallMeanTime() {
            return Math.round(this.avgTimesFiltered.reduce((acc, cur) => acc + cur, 0) / this.avgTimesFiltered.length * 10000) / 10000
        },
        overallMedianTime() {
            var times = this.$store.getters.getAllAttendancesById(this.mid).filter(a => a).flatMap(a => a.times).sort((a, b) => a - b)
            var mid = Math.floor(times.length / 2)
            return times.length % 2 !== 0 ? times[mid] : (times[mid - 1] + times[mid]) / 2
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
        exerciseData() {
            var es = this.$store.getters.getExerciseSessions.filter(s => s.memberIds.includes(this.mid))
            return es.length > 0 ? es : undefined
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
        },
        exerciseString(d, ps) {
            return d.sets > 0 ?
                `${ d.sets } set${
                    parseInt(d.sets) === 1 ? '' : 's'
                } of ${
                    parseInt(d.reps) > 0 ? d.reps + " reps" : d.seconds + " seconds"
                }${
                    ps ? " per side": ""
                }` : ''
        }
    }
}
</script>
