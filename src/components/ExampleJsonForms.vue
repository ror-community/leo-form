<template>
  <v-row>
    <v-col cols="8">
      <json-forms
        v-bind:data="example.input.data"
        v-bind:schema="example.input.schema"
        v-bind:uischema="example.input.uischema"
        v-bind:renderers="renderers"
        @change="onChange"
      />
      <a name="download" href="#" v-if="validForm">Download</a>
    </v-col>
    <v-col cols="4">
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { ErrorObject } from 'ajv'
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue2'
import { vuetifyRenderers } from '@jsonforms/vue2-vuetify'
import  { entry } from './CustomRenderer.vue';
import  { langEntry } from './ShowLanguageRenderer.vue';
import  { typeEntry } from './ShowTypes.vue';
import  { genListEntry } from './GenerateListRenderer.vue';
import { examples } from "@/jsonSchema";

const renderers = [
  ...vuetifyRenderers,
entry,
langEntry,
typeEntry,
genListEntry
];
export default defineComponent({
  name: 'ExampleJsonForms',
  components: {
    JsonForms
  },

  setup() {
    // declare a reactive property within the composition API's setup method
    const example = ref(examples[1])
    // return properties - these get merged with data() below
    return { examples, example }
  },
  data () {
    const example = ref(examples[1])
    const data = ref({});
    const errors: Ref<ErrorObject[] | undefined> = ref(undefined)
    const validForm: boolean = false
    return {
      // freeze renderers for performance gains
      renderers: Object.freeze(renderers),
      data: data,
      errors: errors,
      validForm
    }
  },
  methods: {
    onChange (event: JsonFormsChangeEvent) {
      this.data = event.data
      this.errors.value = event.errors
      this.validForm = this.errors.value?.length == 0 ? true : false
    }
  }
})
</script>
