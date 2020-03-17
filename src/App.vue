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
        <span class="mr-2">Members</span>
      </v-btn>
      <v-btn
        text
				to="/admin"
      >
        <span class="mr-2">Admin</span>
        <v-icon>mdi-settings</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
			<router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { requestsMixin } from '@/mixins/requestsMixin'
export default {
  name: 'App',
	mixins: [requestsMixin],
	methods: {
		async loadStateFromDB() {
			const { data } = await this.getStateFromDB()
			this.$store.dispatch('updateMembersState', data.members)
			this.$store.dispatch('updateSessionsState', data.sessions)
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
