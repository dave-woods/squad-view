<template>
	<v-app style="background: #fcfcf7">
		<nav-bar></nav-bar>
			<v-content>
				<router-view></router-view>
			</v-content>
		<settings-drawer></settings-drawer>
	</v-app>
</template>

<script>
import { requestsMixin } from '@/mixins/requestsMixin'
import Settings from '@/components/Settings'
import NavBar from '@/components/NavBar'
export default {
  name: 'App',
  components: {
    'settings-drawer': Settings,
    'nav-bar': NavBar
  },
	mixins: [requestsMixin],
	beforeMount() {
		this.loadStateFromDB()
	}
};
</script>
