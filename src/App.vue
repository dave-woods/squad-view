<template>
  <v-app style="background: #fcfcf7">
    <v-app-bar
      app
      color="primary"
      dark
			style="background: linear-gradient(to right, #134E5E, #71B280)"
    >
			<router-link to="/">
      <div class="d-flex align-center">
        <v-img
          alt="Logo"
          class="shrink mr-2"
          contain
          :src="require('./assets/logo.png')"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          :src="require('./assets/app-name.png')"
          width="100"
        />
      </div>
			</router-link>

      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            to="/graph"
            tile
            v-on="on"
          >
            <v-icon>mdi-chart-line</v-icon>
          </v-btn>
        </template>
        <span>Time of Flight</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            to="/sessions"
            tile
            v-on="on"
          >
            <v-icon>mdi-calendar-text</v-icon>
          </v-btn>
        </template>
        <span>Sessions</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            to="/members"
            tile
            v-on="on"
          >
            <v-icon>mdi-account-group</v-icon>
          </v-btn>
        </template>
        <span>Members</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            @click="drawer = !drawer"
            tile
            v-on="on"
          >
            <v-icon>mdi-tune</v-icon>
          </v-btn>
        </template>
        <span>Settings</span>
      </v-tooltip>
    </v-app-bar>

    <v-content>
			<router-view></router-view>
    </v-content>
    <settings v-model="drawer"></settings>
  </v-app>
</template>

<style lang="sass" scoped>
.v-btn--active
  &::before
    opacity: 0
  &:hover::before
    opacity: 0.08
</style>

<script>
import { requestsMixin } from '@/mixins/requestsMixin'
import Settings from '@/components/Settings'
export default {
  name: 'App',
  data() {
    return {
      drawer: false
    }
  },
  components: {
    'settings': Settings
  },
	mixins: [requestsMixin],
	methods: {
		async loadStateFromDB() {
			const data = await this.getStateFromDB()
			this.$store.dispatch('updateMembersState', data.members)
			this.$store.dispatch('updateSessionsState', data.sessions)
			this.$store.dispatch('updateSettingsState', data.settings)
		},
		async saveStateToDB() {
			await this.setStateToDB(this.$store.state)
		}
	},
	beforeMount() {
		this.loadStateFromDB()
	}
};
</script>
