<template>
        <v-autocomplete
          :items="entries"
          :loading="isLoading"
          :search-input.sync="search"
          color="white"
          hide-no-data
          hide-selected
          item-text="name"
          item-value="id"
          label="Public APIs"
          placeholder="Start typing to Search"
          prepend-icon="mdi-database-search"
          return-object
        ></v-autocomplete>
</template>

<script>

export default {
  data () {
   return {
    entries: [],
    isLoading: false,
    search: null,
    }
  },

  watch: {
    search (val) {
      console.log('VAL: ', val)
      // Items have already been loaded
      if (this.entries.length > 0) return

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      // Lazily load input items
      fetch(`https://api.ror.org/organizations?query=${val}`)
        .then(res => res.json())
        .then(res => {
          this.entries = res.items
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
  }
}