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
    path: '/competitions',
    name: 'competitions',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Competitions.vue')
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
    path: '/exercise',
    name: 'exercise',
    component: () => import('../views/Exercise.vue')
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
