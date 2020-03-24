<template>
    <v-container>
        <v-row>
            <v-col cols="auto" class="mx-auto">
                <h1>Exercise Sessions <v-btn text @click.stop="newSessionDialog = true"><v-icon>mdi-plus</v-icon></v-btn></h1>
                <v-dialog v-model="newSessionDialog" max-width="700px">
                    <v-card>
                        <v-card-title><span class="headline">New Session</span></v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="6">
                                        <date-picker v-model="newSession.date" label="Exercise session date"></date-picker>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-text-field v-model="newSession.minutes" label="Minutes"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-select
                                            v-model="newSession.memberIds"
                                            :items="members"
                                            label="Select a member"
                                            multiple
                                            :rules="[v => v.length > 0]"
                                        ></v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" text @click="newSessionDialog = false">Cancel</v-btn>
                            <v-btn color="primary" text @click="addNewSession">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row v-for="(s, idx) in sessions" :key="idx"><v-col cols="12"><v-card>
            <v-data-table
                :headers="tableData[idx].headers"
                :items="tableData[idx].items"
                disable-sort
                :loading="tableData.length < 1"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title>{{ new Date(s.date).toLocaleDateString('en-IE', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }) }}</v-toolbar-title>
                        <v-divider
                            class="mx-4"
                            inset
                            vertical
                        ></v-divider>
                        <span>{{ timeString(s.minutes) }}</span>
                        <v-spacer></v-spacer>
                        <v-btn v-if="editsAllowed" color="primary" dark class="mb-2" @click.stop="openAddExerciseDialog(idx)">Add Exercise</v-btn>
                        <v-dialog v-model="addExerciseDialog[idx]" max-width="700px" @input="v => v || closeAddExerciseDialog()">
                            <v-card>
                                <v-card-title><span class="headline">Exercise Details</span></v-card-title>
                                <v-card-text>
                                    <v-container v-if="newItems.length > 0">
                                        <v-row>
                                            <v-col cols="5">
                                                <v-text-field v-model="newItems[idx].exercise" label="Exercise" autofocus></v-text-field>
                                            </v-col>
                                            <v-spacer></v-spacer>
                                            <v-col cols="auto">
                                                <v-checkbox v-model="newItems[idx].perSide" label="Each side"></v-checkbox>
                                            </v-col>
                                            <v-col cols="auto">
                                                <v-checkbox v-model="newItems[idx].stretch" label="Stretch"></v-checkbox>
                                            </v-col>
                                            <v-col cols="auto">
                                                <v-checkbox :disabled="s.memberIds.length < 2" v-model="sameForAll" label="Same for all"></v-checkbox>
                                            </v-col>
                                        </v-row>
                                        <template v-if="!sameForAll">
                                            <v-row v-for="(m, midx) in s.memberIds" :key="`ni-${m}`">
                                                <v-col cols="auto">
                                                    <v-text-field disabled class="disabled-nostyle name" :value="getMemberName(m)" label="Name"></v-text-field>
                                                </v-col>
                                                <v-spacer></v-spacer>
                                                <v-col cols="2">
                                                    <v-text-field v-model="newItems[idx].data[midx].sets" label="Sets" :rules="[v => parseInt(v) >= 0]"></v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-text-field v-model="newItems[idx].data[midx].reps" label="Reps" :rules="[v => parseInt(v) >= 0]"></v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-text-field v-model="newItems[idx].data[midx].seconds" label="Seconds" :rules="[v => parseInt(v) >= 0]"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </template>
                                        <template v-else>
                                            <v-row>
                                                <v-col cols="auto">
                                                    <v-text-field disabled class="disabled-nostyle name" :value="getMemberName(newItems[idx].data[0].id)" label="Name"></v-text-field>
                                                </v-col>
                                                <v-spacer></v-spacer>
                                                <v-col cols="2">
                                                    <v-text-field v-model="newItems[idx].data[0].sets" label="Sets" :rules="[v => parseInt(v) >= 0]"></v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-text-field v-model="newItems[idx].data[0].reps" label="Reps" :rules="[v => parseInt(v) >= 0]"></v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-text-field v-model="newItems[idx].data[0].seconds" label="Seconds" :rules="[v => parseInt(v) >= 0]"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row v-for="m in s.memberIds.slice(1)" :key="`ni-${m}`">
                                                <v-col cols="auto">
                                                    <v-text-field disabled class="disabled-nostyle name" :value="getMemberName(m)" label="Name"></v-text-field>
                                                </v-col>
                                                <v-spacer></v-spacer>
                                                <v-col cols="2">
                                                    <v-text-field disabled class="disabled-nostyle" v-model="newItems[idx].data[0].sets" label="Sets"></v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-text-field disabled class="disabled-nostyle" v-model="newItems[idx].data[0].reps" label="Reps"></v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-text-field disabled class="disabled-nostyle" v-model="newItems[idx].data[0].seconds" label="Seconds"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </template>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" text @click="closeAddExerciseDialog()">Cancel</v-btn>
                                    <v-btn color="primary" text @click="addExercise(idx)">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.exercise="{ item }">
                    <span :class="item.stretch && 'font-italic'">{{ item.exercise }}</span>
                </template>
            </v-data-table>
        </v-card></v-col></v-row>
    </v-container>
</template>


<style lang="sass">
.disabled-nostyle
    &.name
        input[disabled="disabled"]
            color: rgba(0,0,0,0.87)
        .v-input__slot::before
            border: none
    .v-input__slot::before
        border-image: unset !important
</style>

<script>
import { requestsMixin } from '@/mixins/requestsMixin'
import DatePicker from '@/components/DatePicker'
export default {
    mixins: [requestsMixin],
    components: {
        'date-picker': DatePicker
    },
    watch: {
        sessions(val) {
            this.addExerciseDialog = this.sessions.map(() => false)
        }
    },
    computed: {
        members() {
            return this.$store.getters.getAllMembers.map(m => ({
				text: m.name,
				value: m.id
			}))
        },
        editsAllowed() {
            return this.$store.state.settings.editSessions
        },
        sessions() {
            return this.$store.getters.getExerciseSessions.slice().reverse()
        },
        tableData() {
            return this.sessions.map(s => {
                return {
                    headers: [
                        {
                            text:'Exercise',
                            value:'exercise'
                        },
                        ...s.memberIds.map(m => ({
                            text: this.getMemberName(m).split(' ')[0],
                            value: `${m}`
                        }))
                    ],
                    items: s.exercises.map(this.exerciseMap)
                }
            })
        }
    },
    data() {
        return {
            sameForAll: false,
            addExerciseDialog: [],
            newSessionDialog: false,
            newItems: [],
            defaultSession: {
                date: new Date().toISOString().substr(0, 10),
                minutes: 0,
                memberIds: [],
                exercises: []
            },
            newSession: {
                date: new Date().toISOString().substr(0, 10),
                minutes: 0,
                memberIds: [],
                exercises: []
            }
        }
    },
    methods: {
        getMemberName(id) {
            return this.$store?.getters.getMemberById(id)?.name
        },
        exerciseMap(e) {
            return {
                exercise: e.exercise,
                stretch: e.stretch,
                ...Object.fromEntries(e.data.map(d => 
                    [
                        `${d.id}`,
                        d.sets > 0 ? 
                            `${ d.sets } set${parseInt(d.sets) === 1 ? '' : 's'} of ${ parseInt(d.reps) > 0 ? d.reps + " reps" : d.seconds + " seconds" }${ e.perSide ? " per side" : ""}`
                            : ''
                    ]
                ))
            }
        },
        addExercise(sessionIdx) {
            if (this.sameForAll) {
                // set all member data as the same
                this.newItems[sessionIdx].data.forEach((d,i,a) => {
                    d.sets = a[0].sets
                    d.reps = a[0].reps
                    d.seconds = a[0].seconds
                })
            }
            this.$store.dispatch('addExercise', {
                sessionIdx: (this.sessions.length - 1) - sessionIdx ,
                exercise: this.newItems[sessionIdx]
            }).then(this.saveStateToDB).then(() => { this.closeAddExerciseDialog() })
        },
        closeAddExerciseDialog() {
            this.addExerciseDialog = this.sessions.map(() => false)
        },
        getNewItems() {
            return this.sessions.map(s => {
                return {
                    exercise: '',
                    perSide: false,
                    stretch: false,
                    data: s.memberIds.map(m => ({
                        id: m,
                        sets: 0,
                        reps: 0,
                        seconds: 0
                    }))
                }
            })
        },
        async saveStateToDB() {
			await this.setStateToDB(this.$store.state)
        },
        openAddExerciseDialog(sessionIdx) {
            this.addExerciseDialog[sessionIdx] = true
            this.sameForAll = false
            this.newItems = this.getNewItems()
        },
        addNewSession() {
            this.$store.dispatch('addExerciseSession', this.newSession).then(this.saveStateToDB).then(() => {
                this.newSessionDialog = false
                this.newSession = {...this.defaultSession}
            })
        },
        timeString(minutes) {
            var h = Math.floor(minutes / 60)
            var m = minutes % 60
            return h > 0 ? `${h}h ${m}m` : `${m}m`
        }
    }
}
</script>