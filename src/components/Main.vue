<template lang="html">
    <v-content>
      <v-container fluid grid-list-md>
        <v-layout row>
          <v-flex xs5>
            <v-btn elevation="2" @click= "showTypeAhead()" v-if="!isExisting" id="exist">Existing Record</v-btn>
            <template>
              <div>
                <Search v-if="isExisting"></Search>
              </div>
            </template>
          </v-flex>
          <v-flex xs5>
            <v-btn elevation="2" href="/new">New Record</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
</template>
<script>
import Search from './Search.vue'
export default {
  components: { Search },
  data: function () {
    return {
      isExisting: false,
      entries: [],
      isLoading: false,
      model: null,
      search: null
    }
  },
  methods: {
    showTypeAhead () {
      this.isExisting = true
    },
    passRorId () {
      return '/exist/1234'
    }
  }
}
</script>
<style lang="css">
.hide {
  display: none
}
.show {
  display: inline
}
</style>
