import Vue from 'vue'
import Router from 'vue-router'
import NewRecord from '../components/NewRecord.vue'
import Main from '../components/Main.vue'
import ExistingRecord from '../components/ExistingRecord.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/new',
      name: 'NewRecord',
      component: NewRecord
    },
    {
      path: '/exist',
      name: 'ExistingRecord',
      component: ExistingRecord,
      props: true
    }
  ]
})
