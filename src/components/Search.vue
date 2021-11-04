<template>
        <v-autocomplete
          v-model="model"
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
      isLoading: false,
      model: null,
      search: null,
      entries: []
    }
  },
  watch: {
    search: function (val, oldVal) {
      console.log(val, oldVal)
      if (!val) {
        return
      }
      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      this.clearEntries()
      this.isLoading = true
      this.fetchEntriesDebounced(val)
    }
  },
  methods: {
    clearEntries () {
      this.count = 0
      this.entries = []
    },
    fetchEntriesDebounced (val) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        this.fetchEntries(val)
      }, 500) /* 500ms throttle */
    },
    fetchEntries (val) {
      console.log(val)
      fetch(`https://api.ror.org/organizations?query=${val}`)
        .then(res => res.json())
        .then(res => {
          const { items } = res
          console.log(items)
          this.entries = items
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
    fetchROR (val) {
      console.log('VAL: ', val)
    }
  }
}
</script>
