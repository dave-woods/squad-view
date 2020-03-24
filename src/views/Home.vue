<template>
  <v-container>
    <v-row>
      <v-col>
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="mx-auto mb-4 text-center">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Esvi
        </h1>
        <p class="subheading font-weight-regular">
          The code for this project is open source, and is hosted on <a href="https://github.com/dave-woods/squad-view" target="_blank">GitHub</a>.
        </p>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="subheading font-weight-regular text-center">
				<p class="mb-1">This performance tracking app is still under development, so expect things to be broken for now.</p>
        <p>Feel free to look around in the meantime, and if you have any suggestions, please contact me via the GitHub repo link above.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center">
        <v-dialog v-model="dialog" max-width="200px">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" large fab color="primary"><v-icon>mdi-power</v-icon></v-btn>
          </template>
          <v-card dark color="primary">
            <v-card-title><span class="text-center" style="width: 100%">Close the app?</span></v-card-title>
            <v-card-actions>
              <v-btn @click="closeApp" text>Yes</v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="dialog = false" color="error">No</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { remote } from 'electron'
export default {
  data() {
    return {
      dialog: false,
      window: remote.getCurrentWindow()
    }
  },
  methods: {
    closeApp() {
      this.window.close()
    }
  }
}
</script>
