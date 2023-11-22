import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/homeIndex.vue"),
    meta: { title: "总后台" },
    children: [
        {
            path: "/menu/approvalProcess",
            name: "approvalProcess",
            meta: { title: "审批流", isShow: true },
            component: () => import("@/views/approvalProcess/approvalProcess.vue"),
        },
      ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
