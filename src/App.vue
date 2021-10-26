<template>
  <!-- App.vue -->

  <v-app :style="{ 'background-color': 'white'}">
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-card elevation="0">
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <component v-bind:is="currentComponent"></component>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!--        <theme />-->
        <!-- If using vue-router -->
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { VCard, VBtn } from 'vuetify/lib'
import ExampleComponent from '@/components/ExampleComponent.vue'
import ExampleJsonForms from '@/components/ExampleJsonForms.vue'

export default defineComponent({
  name: 'App',
  components: { ExampleComponent, ExampleJsonForms, VCard, VBtn },
  setup () {
    const currentComponent = 'ExampleJsonForms'
    return { currentComponent }
  },
  data: () => ({
    // TODO: wire up theme choice to $vuetify property
    theme: 'light'
  }),
  computed: {
  }
})
</script>
