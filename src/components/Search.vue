<template>
  <div>
     <v-text-field
              label="Enter organization name or ROR ID"
              placeholder="Start Typing..."
              filled
              rounded
              dense
              clearable
              @input="findROR"
              @click:clear="clearResults"
              @blur="clearResults"
            ></v-text-field>
          <v-card class="mx-auto" max-width="500" v-if="hasItems">
            <!--<v-list dense rounded>
              <v-list-item-group active-class="active" v-model="entries">
                <v-list-item v-for="(item, i) in entries" :key="i" @click="testMe(item)">
                    <v-list-item-title> {{ item.name }}</v-list-item-title>
               </v-list-item>
              </v-list-item-group>
            </v-list>-->
            <ul v-if="hasItems">
               <li v-for="(entry,index) in entries" :key="entry.id" @mousedown="pickRecord(entry)" @mousemove="setActive(index)" :class="activeClass(index)">{{ entry.name }}</li>
             </ul>
          </v-card>

        </div>
</template>

<script>
import router from '@/router'
export default {
  data () {
    return {
      hasItems: false,
      entries: [],
      current: -1
    }
  },
  methods: {
    testMe (v) {
      console.log('V: ', v)
    },
    findROR (val) {
      if (val?.length < 3) {
        return
      }
      this.fetchEntriesDebounced(val)
    },
    clearResults () {
      this.entries = []
    },
    pickRecord (ror) {
      router.push({
        name: 'ExistingRecord',
        params: {
          item: ror
        }
      })
    },
    setActive (index) {
      this.current = index
      console.log('HERE: ', this.current)
    },
    activeClass (index) {
      return {
        active: this.current === index
      }
    },
    fetchEntriesDebounced (val) {
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(() => {
        this.fetchEntries(val)
      }, 200) /* 200ms throttle */
    },
    fetchEntries (val) {
      console.log(val)
      fetch(`https://api.ror.org/organizations?query=${val}`)
        .then(res => res.json())
        .then(res => {
          const { items } = res
          this.hasItems = items.length > 0
          this.current = -1
          this.entries = items.slice(0, 5)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style scoped>
ul {
  position: absolute;
  padding: 0;
  margin-top: 8px;
  min-width: 100%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0, 0.25);
  z-index: 1000;
}
li {
  padding: 10px 16px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
.active {
  background-color: #3aa373;
  font-weight: bold;
}

</style>

<!-- credit to https://github.com/pespantelis/vue-typeahead for using large parts of their code -->
