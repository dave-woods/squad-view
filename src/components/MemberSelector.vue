<template>
    <v-container>
        <v-row>
            <v-col>
		        <h1 class="display-1 font-weight-bold text-center">Members</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                cols="6"
                v-for="(m, i) in memberCards"
                :key="`member-card-${i}`"
            >
		        <member-card :member="m" @select-member="selectMember"></member-card>
            </v-col>
        </v-row>
	</v-container>
</template>

<script>
import MemberQuickCard from '@/components/MemberQuickCard'
export default {
    props: ['selectMember'],
    components: {
        'member-card': MemberQuickCard
    },
    computed: {
        memberCards() {
			return this.showSingleSession ? this.namesAndTimes : this.namesAndTimes.filter(n => n.avgTimes.filter(t => t > 0).length > 1)
        },
        namesAndTimes() {
			return this.$store.getters.getAllMembers.map(m => {
				return {
					id: m.id,
					name: m.name,
					avgTimes: this.$store.getters.getAvgTimesById(m.id)
				}
			})
        },
        showSingleSession() {
            return this.$store.state.settings.showSingleSession
        }
    }
}
</script>