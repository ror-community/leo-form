import Vue from 'vue'
import Router from 'vue-router'
import NewRecord from '../components/NewRecord.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/new',
      name: 'NewRecord',
      component: NewRecord
    }
  ]
})
