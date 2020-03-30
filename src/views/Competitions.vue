<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="display-1 font-weight-bold text-center">Competitions <v-btn text @click.stop="newCompetitionDialog = true"><v-icon>mdi-plus</v-icon></v-btn></h1>
        <v-dialog v-model="newCompetitionDialog" max-width="700px" persistent>
          <v-card>
            <v-card-title><span class="headline">{{ newCompetition.name || 'New Competition' }}</span></v-card-title>
            <v-card-text>
              <v-form v-model="formValid" ref="form">
                <v-window v-model="newCompetitionFormStep">
                  <v-window-item :value="1">
                    <v-container>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field v-model="newCompetition.name" label="Competition name" :rules="[v => v.length > 0]"></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="newCompetition.location" label="Competition location" :rules="[v => v.length > 0]"></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6">
                          <date-picker v-model="newCompetition.startDate" label="Start date"></date-picker>
                        </v-col>
                        <v-col cols="6">
                          <date-picker v-model="newCompetition.endDate" label="End date"></date-picker>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <v-select
                            :value="selectedCompetitors"
                            @input="selectCompetitor"
                            :items="members"
                            label="Select competitors"
                            multiple
                            :rules="[v => v.length > 0]"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-window-item>
                  <v-window-item :value="2">
                    <v-expansion-panels>
                      <v-expansion-panel v-for="(c, cidx) in newCompetition.competitors.slice((page-1)*pageSize, (page-1)*pageSize+pageSize)" :key="c.id">
                        <v-expansion-panel-header>{{ getMemberName(c.id) }}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-container>
                            <v-row dense>
                              <v-col cols="6">
                                <v-text-field
                                  label="Level"
                                  :rules="[v => v.length > 0]"
                                  v-model="newCompetition.competitors[(page-1)*pageSize + cidx].individual.level"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6">
                                <v-select
                                  label="Gender"
                                  :rules="[v => v.length > 0]"
                                  :items="['Men', 'Ladies']"
                                  v-model="newCompetition.competitors[(page-1)*pageSize + cidx].individual.gender"
                                ></v-select>
                              </v-col>
                            </v-row>
                            <v-row dense v-for="(_,i) in 2" :key="i">
                              <v-col cols="1" class="font-weight-bold" align-self="center">
                                <span>R{{ i + 1 }}</span>
                              </v-col>
                              <v-col cols="3">
                                <v-text-field
                                  label="Execution scores"
                                  :value="newCompetition.competitors[(page-1)*pageSize + cidx].individual.routines[i].execution.join(', ')"
                                  @input="v => newCompetition.competitors[(page-1)*pageSize + cidx].individual.routines[i].execution = v.split(', ')"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="2">
                                <v-text-field
                                  label="HD scores"
                                  :value="newCompetition.competitors[(page-1)*pageSize + cidx].individual.routines[i].hd.join(', ')"
                                  @input="v => newCompetition.competitors[(page-1)*pageSize + cidx].individual.routines[i].hd = v.split(', ')"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="1">
                                <v-text-field
                                  label="Tariff"
                                  v-model="newCompetition.competitors[(page-1)*pageSize + cidx].individual.routines[i].tariff"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="1">
                                <v-text-field
                                  label="Penalty"
                                  v-model="newCompetition.competitors[(page-1)*pageSize + cidx].individual.routines[i].penalty"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="1">
                                <v-text-field
                                  label="Bonus"
                                  v-model="newCompetition.competitors[(page-1)*pageSize + cidx].individual.routines[i].bonus"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="2">
                                <v-text-field
                                  label="Score"
                                  v-model="newCompetition.competitors[(page-1)*pageSize + cidx].individual.routines[i].total"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="1">
                                <v-text-field
                                  label="Skills"
                                  v-model="newCompetition.competitors[(page-1)*pageSize + cidx].individual.routines[i].skills"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row dense>
                              <v-spacer></v-spacer>
                              <v-col cols="2">
                                <v-text-field
                                  label="Total"
                                  v-model="newCompetition.competitors[(page-1)*pageSize + cidx].individual.total"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="1">
                                <v-text-field
                                  label="Rank"
                                  v-model="newCompetition.competitors[(page-1)*pageSize + cidx].individual.rank"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <v-pagination v-if="newCompetition.competitors.length > pageSize" v-model="page" :length="Math.ceil(newCompetition.competitors.length / pageSize)"></v-pagination>
                  </v-window-item>
                </v-window>
              </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="newCompetitionFormStep === 1" color="primary" text @click="resetForm">Cancel</v-btn>
                <v-btn v-else color="primary" text @click="newCompetitionFormStep -= 1">Back</v-btn>
                <v-btn v-if="newCompetitionFormStep === 2" color="primary" text @click="addNewCompetition" :disabled="!formValid">Save</v-btn>
                <v-btn v-else color="primary" text @click="newCompetitionFormStep += 1">Next</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-item-group>
      <v-row v-for="(comp, compIdx) in competitions" :key="`competition-${comp.id}`" dense>
        <v-col>
          <v-item v-slot:default="{ active, toggle }">
            <v-card>
              <v-container>
                <v-row @click="toggle" style="cursor: pointer">
                  <v-col>
                    <v-card-title>{{ comp.name }}</v-card-title>
                    <v-card-subtitle>{{ duration(comp.startDate, comp.endDate) }} in {{ comp.location }}</v-card-subtitle>
                  </v-col>
                  <v-col cols="auto" align-self="center">
                    <v-card-actions>
                      <v-icon large>
                        {{ active ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                      </v-icon>
                    </v-card-actions>
                  </v-col>
                </v-row>
              </v-container>
              <v-slide-y-transition>
                <v-card-text v-show="active">
                  <v-data-table
                    :headers="individualHeaders"
                    :items="comp.competitors.map(individualItemsMap)"
                    disable-sort
                    :loading="comp.competitors.length < 1"
                    show-expand
                    single-expand
                    item-key="name"
                    :expanded.sync="expandedRow[compIdx]"
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
              </v-slide-y-transition>
          </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
  </v-container>
</template>

<script>
import DatePicker from '@/components/DatePicker'
import { requestsMixin } from '@/mixins/requestsMixin'
import util from '@/mixins/util'
export default {
  mixins: [util, requestsMixin],
  components: {
    'date-picker': DatePicker
  },
  data() {
    return {
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
      ],
      page: 1,
      pageSize: 5,
      newCompetitionDialog: false,
      newCompetitionFormStep: 1,
      selectedCompetitors: [],
      formValid: false,
      newCompetition: {
        name: '',
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        location: '',
        competitors: []
      },
      defaultCompetition: {
        name: '',
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        location: '',
        competitors: []
      }
    }
  },
  computed: {
    members() {
      return this.$store.getters.getAllMembers.map(m => ({
				text: m.name,
				value: m.id
			}))
    },
    expandedRow() {
      return this.competitions.map(c => [])
    },
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
    },
    addNewCompetition() {
      this.$store.dispatch('addCompetition', this.newCompetition)
        .then(() => { this.saveStateToDB('competitions') })
        .then(() => { this.resetForm() })
    },
    resetForm() {
      this.newCompetitionDialog = false
      this.newCompetition = {...this.defaultCompetition}
      this.selectedCompetitors = []
      this.page = 1
      this.newCompetitionFormStep = 1
      this.$refs.form.resetValidation()
    },
    selectCompetitor(e) {
      this.newCompetition.competitors = e.map(mid => ({
        id: mid,
        individual: {
          rank: '',
          total: '',
          level: '',
          gender: '', //TODO: get from profile?
          routines: [
            {
              skills: '10',
              execution: [],
              hd: [],
              tariff: '0',
              penalty: '0',
              bonus: '0',
              total: ''
            },
            {
              skills: '10',
              execution: [],
              hd: [],
              tariff: '',
              penalty: '0',
              bonus: '0',
              total: ''
            }
          ]
        }
      }))
    }
  }
}
</script>