<template>
    <v-container>
        <v-row><v-col cols="auto" class="mx-auto"><h1>Exercise Sessions</h1></v-col></v-row>
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
                        <v-spacer></v-spacer>
                        <v-dialog v-model="addExerciseDialog" max-width="700px">
                            <template v-slot:activator="{ on }">
                                <v-btn color="primary" dark class="mb-2" v-on="on" @click="newItems = getNewItems(); sameForAll = false">New Exercise</v-btn>
                            </template>
                            <v-card>
                                <v-card-title><span class="headline">Exercise Details</span></v-card-title>
                                <v-card-text>
                                    <v-container v-if="newItems.length > 0">
                                        <v-row>
                                            <v-col cols="7">
                                                <v-text-field v-model="newItems[idx].exercise" label="Exercise"></v-text-field>
                                            </v-col>
                                            <v-spacer></v-spacer>
                                            <v-col cols="auto">
                                                <v-checkbox v-model="newItems[idx].perSide" label="Each side"></v-checkbox>
                                            </v-col>
                                            <v-col cols="auto">
                                                <v-checkbox v-model="sameForAll" label="Same for all"></v-checkbox>
                                            </v-col>
                                        </v-row>
                                        <template v-if="!sameForAll">
                                            <v-row v-for="(m, midx) in s.members" :key="`ni-${m.id}`">
                                                <v-col cols="auto">
                                                    <v-text-field readonly :value="getMemberName(m.id)" label="Name"></v-text-field>
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
                                                    <v-text-field readonly :value="getMemberName(newItems[idx].data[0].id)" label="Name"></v-text-field>
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
                                            <v-row v-for="(m, midx) in s.members.slice(1)" :key="`ni-${m.id}`">
                                                <v-col cols="auto">
                                                    <v-text-field readonly :value="getMemberName(m.id)" label="Name"></v-text-field>
                                                </v-col>
                                                <v-spacer></v-spacer>
                                                <v-col cols="2">
                                                    <v-text-field readonly v-model="newItems[idx].data[0].sets" label="Sets"></v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-text-field readonly v-model="newItems[idx].data[0].reps" label="Reps"></v-text-field>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-text-field readonly v-model="newItems[idx].data[0].seconds" label="Seconds"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </template>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="addExercise(idx)">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
            </v-data-table>
        </v-card></v-col></v-row>
    </v-container>
</template>

<script>
import { requestsMixin } from '@/mixins/requestsMixin'
export default {
    mixins: [requestsMixin],
    computed: {
        sessions() {
            return this.$store.getters.getExerciseSessions
        },
        tableData() {
            return this.sessions.map(s => {
                return {
                    headers: [
                        {
                            text:'Exercise',
                            value:'exercise'
                        },
                        ...s.members.map(m => ({
                            text: this.getMemberName(m.id),
                            value: `${m.id}`
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
            addExerciseDialog: false,
            defaultItem: {
                exercise: '',
                perSide: false,
                data: [{
                    id: -1,
                    sets: 0,
                    reps: 0,
                    seconds: 0
                }]
            },
            newItems: []
        }
    },
    methods: {
        getMemberName(id) {
            return this.$store?.getters.getMemberById(id)?.name
        },
        exerciseMap(e) {
            return {
                exercise: e.exercise,
                ...Object.fromEntries(e.data.map(d => 
                    [`${d.id}`, `${ d.sets } sets of ${ d.reps ? d.reps + " reps" : d.seconds + " seconds" }${ e.perSide ? " per side" : ""}`]
                ))
            }
        },
        addExercise(sessionIdx) {
            this.$store.dispatch('addExercise', {
                sessionIdx,
                exercise: this.newItems[sessionIdx]
            }).then(this.saveStateToDB).then(this.closeDialog)
        },
        closeDialog() {
            this.addExerciseDialog = false
        },
        getNewItems() {
            return this.sessions.map(s => {
                return {
                    exercise: '',
                    perSide: false,
                    data: s.members.map(m => ({
                        id: m.id,
                        sets: 0,
                        reps: 0,
                        seconds: 0
                    }))
                }
            })
        },
        async saveStateToDB() {
			await this.setStateToDB(this.$store.state)
		}
    }
}
</script>