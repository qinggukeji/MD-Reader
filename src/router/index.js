import Vue from 'vue'
import Vuex from 'vuex'
import iView from 'iview'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import 'iview/dist/styles/iview.css'
import Index from '@/components/Index'

Vue.use(Vuex)
Vue.use(Router)
Vue.use(iView)
Vue.use(VueResource)

Vue.http.options.emulateJSON = true

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
})
