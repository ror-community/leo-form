<template>
  <div>
  <vue-bootstrap-typeahead
    class="mb-4"
    v-model="addressSearch"
    :data="users"
    :serializer="item => item.login"
    @hit="selectedUser = $event"
    placeholder="Search GitHub Users"
  />

 <h3>Selected User JSON</h3>
</div>
</template>



<script>
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import axios from 'axios'
import _ from 'underscore'
export default {
  components: { VueBootstrapTypeahead },
  data() {
    return {
      addressSearch: '',
      selectedUser: null,
      users: []
    }
  },
  methods: {
    async getAddresses(query) {
      axios.get(`https://api.github.com/search/users?q=${query}`)
        .then((res) => {
          this.users = res.data.items
        })
    }
  },
  watch: {
    addressSearch: _.debounce(function(addr) { this.getAddresses(addr) }, 500)
  }
}
</script>