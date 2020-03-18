<template>
  <v-app>
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

      <v-btn
        text
				to="/members"
      >
        <span>Members</span>
      </v-btn>
      <v-btn
        text
        @click="drawer = !drawer"
      >
        <span>

        <v-icon>mdi-tune</v-icon>
        </span>
      </v-btn>
    </v-app-bar>

    <v-content>
			<router-view></router-view>
    </v-content>
    <settings v-model="drawer"></settings>
  </v-app>
</template>

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
