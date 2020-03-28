<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="display-1 font-weight-bold text-center">Competitions</h1>
      </v-col>
    </v-row>
    <v-row v-for="comp in competitions" :key="comp.id">
      <v-col>
        <v-card>
          <v-container>
          <v-row>
            <v-col>
              <v-card-title>{{ comp.name }}</v-card-title>
              <v-card-subtitle>{{ duration(comp.startDate, comp.endDate) }} in {{ comp.location }}</v-card-subtitle>
            </v-col>
            <v-col cols="auto">
              <v-card-actions><v-checkbox v-model="selectedComp" :value="comp.id"></v-checkbox></v-card-actions>
            </v-col>
          </v-row>
          </v-container>
          <v-card-text v-if="selectedComp.includes(comp.id)">
            <v-data-table
              :headers="individualHeaders"
              :items="comp.competitors.map(individualItemsMap)"
              disable-sort
              :loading="comp.competitors.length < 1"
              show-expand
              single-expand
              item-key="name"
              :expanded.sync="expandedRow"
            >
              <template v-slot:item.rank="{ item }">
                <v-chip style="pointer-events: none" v-if="parseInt(item.rank) === 1" color="#D4AF37" dark>{{ item.rank }}</v-chip>
                <v-chip style="pointer-events: none" v-else-if="parseInt(item.rank) === 2" color="#BFC1C2" dark>{{ item.rank }}</v-chip>
                <v-chip style="pointer-events: none" v-else-if="parseInt(item.rank) === 3" color="#A97142" dark>{{ item.rank }}</v-chip>
                <v-chip style="pointer-events: none" v-else color="transparent">{{ item.rank }}</v-chip>
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" style="background: #DEDEDE66">
                  <v-data-table
                    :headers="['Skills', 'Execution', 'HD', 'Tariff', 'Bonus', 'Penalty', 'Total'].map(s => ({text: s, value: s.toLowerCase()}))"
                    :items="item.rest.individual.routines"
                    disable-sort
                    disable-pagination
                    disable-filtering
                    hide-default-footer
                    style="pointer-events: none"
                    class="transparent"
                  >
                    <template v-slot:item.execution="{ item }">
                      <span>{{ item.execution.join(', ')}}</span>
                    </template>
                    <template v-slot:item.hd="{ item }">
                      <span>{{ item.hd.join(', ')}}</span>
                    </template>
                  </v-data-table>
                </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import util from '@/mixins/util'
export default {
  mixins: [util],
  data() {
    return {
      expandedRow: [],
      selectedComp: [],
      individualHeaders: [
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Level',
          value: 'level'
        },
        {
          text: 'Routine 1',
          value: 'routine1'
        },
        {
          text: 'Routine 2',
          value: 'routine2'
        },
        {
          text: 'Total',
          value: 'total'
        },
        {
          text: 'Rank',
          value: 'rank'
        },
        {
          text: '',
          value: 'data-table-expand'
        }
      ]
    }
  },
  computed: {
    competitions() {
      return this.$store.getters.getCompetitions
    }
  },
  methods: {
    getMemberName(id) {
      return this.$store.getters.getMemberById(id).name
    },
    duration(start, end) {
      var s = this.dateToDateString(start)
      var e = this.dateToDateString(end)
      return s === e ? s : `${s} - ${e}`
    },
    individualItemsMap(competitor) {
      return {
        name: this.getMemberName(competitor.id),
        level: [competitor.individual.level, competitor.individual.gender].join(' '),
        routine1: competitor.individual.routines[0].total,
        routine2: competitor.individual.routines[1].total,
        total: competitor.individual.total,
        rank: competitor.individual.rank,
        rest: { ...competitor }
      }
    }
  }
}
</script>