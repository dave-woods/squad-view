<template>
    <v-app-bar
        app
        color="primary"
        dark
        style="background: linear-gradient(to right, #134E5E, #71B280)"
    >
        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <router-link to="/">
                    <v-img
                        alt="Logo"
                        contain
                        :src="require('@/assets/logo.png')"
                        width="40"
                        v-on="on"
                    ></v-img>
                </router-link>
            </template>
            <span>Home</span>
        </v-tooltip>

        <v-spacer></v-spacer>

        <v-tooltip bottom v-for="(navLink, nli) in renderedNavLinks" :key="nli">
            <template v-slot:activator="{ on }">
                <v-btn text :to="navLink.link" tile v-on="on">
                    <v-icon>{{ navLink.icon }}</v-icon>
                </v-btn>
            </template>
            <span>{{ navLink.text }}</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn text @click="toggleSettingsDrawer" tile v-on="on">
                    <v-icon>mdi-tune</v-icon>
                </v-btn>
            </template>
            <span>Settings</span>
        </v-tooltip>
    </v-app-bar>
</template>

<script>
export default {
    data() {
        return {
            navLinks: [
                {
                    text: 'Exercise',
                    link: '/exercise',
                    icon: 'mdi-run-fast',
                    render: this.showExercises
                },
                {
                    text: 'Competitions',
                    link: '/competitions',
                    icon: 'mdi-podium',
                    render: true
                },
                {
                    text: 'Time of Flight',
                    link: '/graph',
                    icon: 'mdi-chart-line',
                    render: true
                },
                {
                    text: 'Sessions',
                    link: '/sessions',
                    icon: 'mdi-calendar-text',
                    render: true
                },
                {
                    text: 'Members',
                    link: '/members',
                    icon: 'mdi-account-group',
                    render: true
                }
            ]

        }
    },
    computed: {
        showExercises() {
            return this.$store.state.settings.editSessions // for now TODO: when admin logged in
        },
        renderedNavLinks() {
            return this.navLinks.filter(nl => nl.render)
        }
    },
    watch: {
        showExercises(value) {
            this.navLinks.find(nl => nl.text === 'Exercise').render = value
        }
    },
    methods: {
        toggleSettingsDrawer() {
            this.$store.dispatch('setSettingsDrawerOpen', !this.$store.state.settingsDrawerOpen)
        }
    }
}
</script>