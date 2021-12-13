<template>
  <v-row>
    <v-col cols="8">
      <div id="nav">
      <v-btn @click="clear()" style="background-color: #656374; color: white;margin-left:200px">Clear/Add Next</v-btn> <v-btn style="background-color: #656374; color: white;margin-left: 10px"><router-link to="/" style="color: white;text-decoration:none">Back</router-link></v-btn>
      </div>
      <json-forms
        :key="index"
        v-model="data"
        v-bind:data="ror.data"
        v-bind:schema="ror.schema"
        v-bind:uischema="ror.uischema"
        v-bind:renderers="renderers"
        @change="onChange"
        :ajv="handleDefaultsAjv"
      />
      <v-btn v-if="validForm && data.id" @click="download">Download</v-btn>
    </v-col>
    <v-col cols="4">
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@vue/composition-api'
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
  name: 'NewRecord',
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
    const data: Record<string, any> = {};
    const errors: any = ref(undefined)
    const validForm: boolean = false
    return {
      // freeze renderers for performance gains
      renderers: Object.freeze(renderers),
      handleDefaultsAjv: handleDefaultsAjv,
      data: data,
      errors: errors,
      validForm,
      index: 1
    }
  },
  methods: {
    clear() {
      this.index++
    },
    getRORId () {
      const url = new URL(process.env.VUE_APP_GENERATE_ID)
      return new Promise(resolve => { 
        fetch(url.toString()).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              this.data.id = data['id']
              resolve('resolved');
            });
          }
          else {
            alert("ERROR in response: " + response);
          }
        }).catch((error) => {
          alert("NETWORK ERROR: " + error)
        });
      });
    },
    async download() {
      await this.getRORId()
      await this.generateFile()
    },
    generateFile() {
      var a = document.createElement('a')
      a.href = "data:application/octet-stream,"+encodeURIComponent(JSON.stringify(this.data, null, 2))
      a.download = this.data.id.replace(/^http.*?org\//, '') + '.json'
      a.click()
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
<style scoped>
v-btn {
  background-color: #656374; color: white;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
