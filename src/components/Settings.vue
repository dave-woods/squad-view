<template>
    <v-navigation-drawer
        right
        temporary
        app
        width="512px"
        v-model="settingsDrawerOpenModel"
    >
        <v-container class="primary white--text">
            <v-row class="px-4">
                <v-col>
                    <span class="title">Settings</span>
                </v-col>
                <v-col cols="auto">
                    <v-btn icon tile dark @click.stop="settingsDrawerOpenModel = false"><v-icon>mdi-close</v-icon></v-btn>
                </v-col>
            </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-list class="pa-4">
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Show members with only one session
                    </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <v-checkbox
                        v-model="showSingleSessionModel"
                    ></v-checkbox>
                </v-list-item-action>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Omit sessions before and after member attended
                    </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <v-checkbox
                        v-model="trimEmptyModel"
                    ></v-checkbox>
                </v-list-item-action>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Editing sessions allowed
                    </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <v-checkbox
                        v-model="editSessionsModel"
                    ></v-checkbox>
                </v-list-item-action>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>
                        Date range
                    </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <v-list-item-action-text>
                        Start <date-picker v-model="startDateModel" :min="dateRange[0]" :max="dateRange[1]"></date-picker>
                        End <date-picker v-model="endDateModel" :min="startDateModel" :max="new Date().toISOString().substr(0, 10)"></date-picker>
                    </v-list-item-action-text>
                </v-list-item-action>
            </v-list-item>
        </v-list>
        <div v-if="editSessions" class="manual-state my-3">
            <v-btn :disabled="!editSessions" @click="loadStateManual" text>Reload State</v-btn>
            <v-btn :disabled="!editSessions" @click="saveStateManual" text>Save State</v-btn>
        </div>
        <v-overlay absolute :value="loader">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-navigation-drawer>
</template>

<style lang="sass" scoped>
.manual-state
    display: flex
    justify-content: space-evenly
    position: fixed
    bottom: 0
    width: 100%
</style>

<script>
import { mapState } from 'vuex'
import { requestsMixin } from '@/mixins/requestsMixin'
import DatePicker from '@/components/DatePicker'
export default {
    mixins: [requestsMixin],
    components: {
        'date-picker': DatePicker
    },
    data() {
        return {
            loader: false
        }
    },
    computed: {
        ...mapState({
            showSingleSession: state => state.settings.showSingleSession,
            trimEmpty: state => state.settings.trimEmpty,
            editSessions: state => state.settings.editSessions,
            startDate: state => new Date(state.settings.startDate).toISOString().substr(0, 10),
            endDate: state => new Date(state.settings.endDate).toISOString().substr(0, 10),
            settingsDrawerOpen: state => state.settingsDrawerOpen
        }),
        dateRange() {
            return this.$store.getters.getDateRange
        },
        showSingleSessionModel: {
            get () {
                return this.showSingleSession
            },
            set (value) {
                this.$store.dispatch('setShowSingleSession', value)
            }
        },
        trimEmptyModel: {
            get() {
                return this.trimEmpty
            },
            set(value) {
                this.$store.dispatch('setTrimEmpty', value)
            }
        },
        editSessionsModel: {
            get() {
                return this.editSessions
            },
            set(value) {
                this.$store.dispatch('setEditSessions', value)
            }
        },
        startDateModel: {
            get() {
                return this.startDate
            },
            set(value) {
                this.$store.dispatch('setStartDate', new Date(value))
            }
        },
        endDateModel: {
            get() {
                return this.endDate
            },
            set(value) {
                this.$store.dispatch('setEndDate', new Date(value))
            }
        },
        settingsDrawerOpenModel: {
            get() {
                return this.settingsDrawerOpen
            },
            set(value) {
                if (this.settingsDrawerOpen && !value){
                    this.saveStateToDB('settings').then(() => this.$store.dispatch('setSettingsDrawerOpen', value))
                } else {
                    this.$store.dispatch('setSettingsDrawerOpen', value)
                }
            }
        }
    },
    methods: {
        async loadStateManual() {
            this.loader = true
            this.loadStateFromDB().then(() => {
                this.loader = false
            })
        },
        async saveStateManual() {
            this.loader = true
            this.saveStateToDB().then(() => {
                this.loader = false
            })
        }
    }
}
</script>