<template>
  <v-row>
    <v-col cols="10">
      <div id="nav">
      <v-btn style="background-color: #656374; color: white;margin-left:200px"><router-link to="/" style="color: white;text-decoration:none">Add New Record</router-link></v-btn> <v-btn style="background-color: #656374; color: white;margin-left: 10px"><router-link to="/" style="color: white;text-decoration:none">Search Existing Records</router-link></v-btn>
      </div>
      <json-forms
        v-bind:data="data"
        v-bind:schema="ror.schema"
        v-bind:uischema="ror.uischema"
        v-bind:renderers="renderers"
        @change="onChange"
        :ajv="handleDefaultsAjv"
      />
      <a name="download" :href="download()" v-if="validForm && data.id" :download="getID(data.id)" style="background-color: #656374; color: white; text-decoration: none; padding:10px; border-radius: 10px;">Download</a>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent, ref, Ref } from '@vue/composition-api'
import { ErrorObject } from 'ajv'
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue2'
import {  createAjv,vuetifyRenderers } from '@jsonforms/vue2-vuetify'
import  { entry } from './CustomRenderer.vue';
import  { langEntry } from './ShowLanguageRenderer.vue';
import  { typeEntry } from './ShowTypes.vue';
import  { genListEntry } from './GenerateListRenderer.vue';
import { input as rorSchema } from "@/jsonSchema/rorSchema";

const renderers = [
  ...vuetifyRenderers,
entry,
langEntry,
typeEntry,
genListEntry
];
const handleDefaultsAjv = createAjv({useDefaults: true});
export default defineComponent({
  name: 'ExistingRecord',
  components: {
    JsonForms
  },

  setup() {
    // declare a reactive property within the composition API's setup method
    const ror = ref(rorSchema)
    // return properties - these get merged with data() below
    return { ror }
  },
  data () {
    //const data: Record<string, undefined> = {};
    const errors: any = ref(undefined)
    const validForm: boolean = errors?.value?.length == 0 ? true : false
    return {
      // freeze renderers for performance gains
      renderers: Object.freeze(renderers),
      handleDefaultsAjv: handleDefaultsAjv,
      id: this.$route.query.id,
      data: this.$route.params.item,
      errors: errors,
      validForm
    }
  },
  mounted() {
    if (this.data === undefined) {
      router.push({
        name: 'NewRecord'
      })
    }
  },
  methods: {
    download() {
      var dataStr = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data, null, 2))
      return dataStr
    },
    getID (id: string) {
      const fname = id.replace(/^http.*?org\//, '') + '.json'
      return fname
    },
    onChange (event: JsonFormsChangeEvent) {
      this.data = event.data
      this.errors.value = event.errors
      this.validForm = this.errors.value?.length == 0 ? true : false
    }
  }
})
</script>
