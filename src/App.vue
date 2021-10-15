<template>
  <!-- App.vue -->

  <v-app :style="{background: backgroundColour}">
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-row class="mt-1">
          <v-col cols="12">
            <v-card>
              <v-card-text class="pa-6">
                <v-btn color="primary">Primary action</v-btn>
                <v-btn class="ml-4" outlined color="primary">Secondary action</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card elevation="0">
              <v-card-text>
                <v-row>
                  <v-col md="6">
                    <p>Page contents</p>
                    <example-component></example-component>
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
import { defineComponent, computed } from '@vue/composition-api'
import { VCard, VBtn } from 'vuetify/lib'
import { provideToggleService } from '@/statemachines/example.machine'
import { useActor } from 'xstate-vue2'
import colors from 'vuetify/lib/util/colors'
import ExampleComponent from '@/components/ExampleComponent.vue'

export default defineComponent({
  name: 'App',
  components: { ExampleComponent, VCard, VBtn },
  setup () {
    const toggleService = provideToggleService()
    const toggleMachine = useActor(toggleService)
    // Declare a computed value
    const backgroundColour = computed(() => {
      return toggleMachine.state.value.value === 'active' ? colors.blue.lighten3 : colors.pink.lighten3
    })
    return { backgroundColour: backgroundColour }
  },
  data: () => ({
    // TODO: wire up theme choice to $vuetify property
    theme: 'light'
  }),
  computed: {
  }
})
</script>
