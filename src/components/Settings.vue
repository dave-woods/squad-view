<template>
    <v-navigation-drawer
        right
        temporary
        app
        width="512px"
        :value="value"
        @input="drawer"
    >
        <v-container class="primary white--text">
            <v-row class="px-4">
                <v-col>
                    <span class="title">Settings</span>
                </v-col>
                <v-col cols="auto">
                    <v-btn icon tile dark @click="drawer(false)"><v-icon>mdi-close</v-icon></v-btn>
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
    </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'
import { requestsMixin } from '@/mixins/requestsMixin'
import DatePicker from '@/components/DatePicker'
export default {
    props: ['value'],
    mixins: [requestsMixin],
    components: {
        'date-picker': DatePicker
    },
    computed: {
        ...mapState({
            showSingleSession: state => state.settings.showSingleSession,
            trimEmpty: state => state.settings.trimEmpty,
            editSessions: state => state.settings.editSessions,
            startDate: state => new Date(state.settings.startDate).toISOString().substr(0, 10),
            endDate: state => new Date(state.settings.endDate).toISOString().substr(0, 10)
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
        }
    },
    methods: {
        async drawer(val) {
            this.$emit('input', val)
            if (!val) {
                this.$nextTick(async () => await this.setStateToDB(this.$store.state))
            }
        }
    }
}
</script>