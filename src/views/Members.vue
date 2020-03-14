<template>
    <v-container>
        <h1>Members</h1>
        <h2 v-if="currentMember">{{ currentMember.name }}</h2>
        <line-chart :chart-data="chartData" :options="chartOptions"></line-chart>
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
            mid: parseInt(this.id)
        }
    },
    props: ['id'],
    computed: {
        members() {
            return this.$store.getters.getAllMembers
        },
        currentMember() {
            return this.mid ? this.$store.getters.getMemberById(this.mid) : undefined
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
                    label: this.currentMember.name,
                    fill: this.fillUnderLine,
                    backgroundColor: this.rainbow(this.members.length, this.currentMember.id-1) + '44',
                    data: this.$store.getters.getAvgTimesById(this.currentMember.id).map(t => t === 0 ? null : Math.round(t*100)/100)
                }] : this.members.map(m => {
                    return {
                        label: m.name,
                        fill: this.fillUnderLine,
                        backgroundColor: this.rainbow(this.members.length, m.id-1) + '44',
                        data: this.$store.getters.getAvgTimesById(m.id).map(t => t === 0 ? null : Math.round(t*100)/100)
                    }
                })
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
