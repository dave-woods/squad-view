<template>
	<v-app style="background: #fcfcf7">
		<nav-bar></nav-bar>
			<v-content>
				<router-view></router-view>
			</v-content>
		<settings-drawer></settings-drawer>
	</v-app>
</template>

<style lang="sass">
.hidden-scrollbar::-webkit-scrollbar
	display: none
</style>

<script>
import { requestsMixin } from '@/mixins/requestsMixin'
import { remote } from 'electron'
import Settings from '@/components/Settings'
import NavBar from '@/components/NavBar'
export default {
	name: 'App',
	components: {
		'settings-drawer': Settings,
		'nav-bar': NavBar
	},
	data() {
		return {
			unsubscribeStore: null,
			window: remote.getCurrentWindow()
		}
	},
	computed: {
		hideScrollbar() {
			return this.$store.state.hideScrollbar
		}
	},
	methods: {
		resizeListener(e) {
			var nv = e.sender.isFullScreen()
			if (this.$store.state.isFullScreen !== nv) {
				this.$store.dispatch('setFullScreen', nv)
			}
		}
	},
	mixins: [requestsMixin],
	watch: {
		hideScrollbar(v) {
			if (v) {
				document.querySelector('body').classList.add('hidden-scrollbar')
			} else {
				document.querySelector('body').classList.remove('hidden-scrollbar')
			}
		}
	},
	created() {
		this.window?.setFullScreen(this.$store.state.isFullScreen)
		this.window?.addListener('enter-full-screen', this.resizeListener)
		this.window?.addListener('leave-full-screen', this.resizeListener)
		this.unsubscribeStore = this.$store.subscribe(({ type, payload }) => {
            if (type === 'setFullScreen') {
                this.window?.setFullScreen(payload)
            }
		})
		if (this.hideScrollbar) {
			document.querySelector('body').classList.add('hidden-scrollbar')
		}
	},
	beforeMount() {
		this.loadStateFromDB()
	},
	beforeDestroy() {
		this.unsubscribeStore()
		this.window.removeListener('enter-full-screen', this.resizeListener)
		this.window.removeListener('leave-full-screen', this.resizeListener)
	}
};
</script>
