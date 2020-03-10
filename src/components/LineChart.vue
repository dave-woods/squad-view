<script>
import { Line, mixins } from 'vue-chartjs'
var { reactiveProp } = mixins
export default {
    extends: Line,
    mixins: [reactiveProp],
    props: ['options'],
    mounted() {
        this.renderChart(this.chartData, this.options)
    }
}
</script>
