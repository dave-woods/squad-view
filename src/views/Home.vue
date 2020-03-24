<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Esvi
        </h1>
        <p class="subheading font-weight-regular">
          The code for this project is open source,
          <br>and is hosted on
          <a href="https://github.com/dave-woods/squad-view" target="_blank">GitHub</a>.
        </p>
      </v-flex>

      <v-flex
        xs12
        mb-5
      >
				<p>This performance tracking app is still under development, so expect things to be broken for now. Feel free to look around in the meantime, and if you have any suggestions, please contact me via the GitHub repo link above.</p>
			</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    links: [
      {
        text: 'Times of Flight',
        to: '/graph',
      },
			{
				text: 'About',
				to: '/about'
			},
			{
				text: 'Sessions',
				to: '/sessions'
			},
			{
				text: 'Training Plans',
				to: '/plans'
      },
      {
        text: 'Members',
        to: '/members'
      },
			{
				text: 'Competition Scores',
				to: '/scores'
			}
    ]
  })
};
</script>
