<template>
        <v-autocomplete
          :items="entries"
          :loading="isLoading"
          search-input="fetchROR"
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
   data() {
    return {
      entries: [],
      isLoading: false,
      search: null,
    }
  },
  methods: {
    fetchROR(val) {
      console.log('VAL: ', val)
    }
  }
}
</script>