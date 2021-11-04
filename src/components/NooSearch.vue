<template>
    <v-combobox
      :search-input.sync="search"
      :items="users"
      item-text="name"
      item-value="id"
      label="Search for an organization name or ROR ID"
      solo
      clearable
      />
</template>

<script>
import axios from 'axios'
import _ from 'underscore'

export default {
   data() {
    return {
      addressSearch: '',
      selectedUser: null,
      users: []
    }
  },
  computed: {
      suggestions(val) {
          console.log('VAL: ', val)
      }
  },
  watch: {
      search (val) {
        axios.get(`https://api.github.com/search/users?q=${val}`)
        .then((res) => {
          console.log('DATA: ', res)
        })
      }
  }
}
</script>