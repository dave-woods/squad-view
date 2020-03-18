import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/graph',
    name: 'graph',
    component: () => import('../views/Graph.vue')
  },
  {
    path: '/sessions',
    name: 'sessions',
    component: () => import('../views/Sessions.vue')
  },
  {
    path: '/members',
    name: 'members',
    component: () => import('../views/Members.vue')
  },
  {
    path: '/members/:id',
    props: true,
    name: 'member',
    component: () => import('../views/Members.vue')
  },
  {
    path: '/temp',
    name: 'temp',
    component: () => import('../views/Temp.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import('../components/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
