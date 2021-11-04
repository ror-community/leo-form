<template>
        <v-autocomplete
          v-model="model"
          :items="entries"
          :loading="isLoading"
          :search-input.sync="search"
          @change="pickRecord"
          color="green"
          filled
          dense
          outlined
          rounded
          hide-no-data
          hide-selected
          item-text="name"
          item-value="id"
          label="ROR Organization Search"
          placeholder="Start typing name or ROR ID"
          return-object
        ></v-autocomplete>
</template>

<script>
import router from '@/router'
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
    search: function (val) {
      if (val.length < 3) {
        return
      }
      this.fetchEntriesDebounced(val)
    }
  },
  methods: {
    pickRecord(ror) {
      console.log("ROR NAME: ", ror)
      // const id = ror.id.replace(/^http.*?org\//, '')
      router.push({
        name: 'ExistingRecord',
        params: {
          item: ror
        }
      });
      //window.location.href = '/exist?id=' + id + '&data=' + ror
    },
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
    },
    fetchROR (val) {
      console.log('VAL: ', val)
    }
  }
}
</script>
