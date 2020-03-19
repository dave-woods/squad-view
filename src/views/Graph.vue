<template>
	<v-container>
        <h1>Time of Flight</h1>
        <line-chart :chart-data="chartData" :options="chartOptions"></line-chart>
    </v-container>
</template>

<script>
import LineChart from '@/components/LineChart'
import util from '@/mixins/util'
export default {
	data() {
		return {
			chartData: {},
            chartOptions: {
                spanGaps: true,
                responsive: true,
                maintainAspectRatio: false
            }
		}
	},
	mixins: [util],
	components: {
        'line-chart': LineChart
    },
	computed: {
		members() {
            return this.$store.getters.getAllMembers
        }
	},
    methods: {
        fillData() {
            var sessions = this.$store.getters.getSessions
            this.chartData = {
                labels: sessions.map(s => s.date),
                datasets: this.members.map(m => {
                    return {
                        label: m.name,
                        fill: false,
                        borderColor: this.rainbow(this.members.length, m.id-1) + '44',
                        data: this.$store.getters.getAvgTimesById(m.id).map(t => t === 0 ? null : Math.round(t * 10000) / 10000)
                    }
                })
            }
		}
	},
	mounted() {
		this.fillData()
	}
}
</script>
