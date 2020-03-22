<template>
    <v-container>
        <v-row><v-col cols="auto" class="mx-auto"><h1>Exercise Sessions</h1></v-col></v-row>
        <v-row v-for="(s, idx) in sessions" :key="idx"><v-col cols="12"><v-card>
            <v-card-title>{{ new Date(s.date).toLocaleDateString('en-IE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }) }}</v-card-title>
            <v-data-table
                :headers="tableData[idx].headers"
                :items="tableData[idx].items"
                disable-sort
            >
            </v-data-table>
        </v-card></v-col></v-row>
    </v-container>
</template>

<script>
export default {
    computed: {
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
            sessions: this.$store.getters.getExerciseSessions
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
        }
    }
}
</script>