import { createRouter, createWebHashHistory } from "vue-router";
import ClientMain from "../views/clientMain.vue";
import loginPage from '../views/loginPage.vue';
import Profil from "../views/profils.vue";
import TicketsListe from '../views/ticketsListe.vue';
import Home from '../views/home.vue';
import Payment from "@/views/payment.vue";

 const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "loginPage",
      component: loginPage
    },
    {
      path: "/client",
      name: "ClientMain",
      component: ClientMain,
      meta: { requiresAuth: true } ,
      children: [
        {
          path: "/client/home",
          component: Home,
          
        },
        {
          path: "/client/profils",
          component: Profil,
          
        },
        {
          path: "/client/ticketsListe",
          component: TicketsListe,
          
        },
        {
          path: "/client/withdraw",
          component: Payment,
          
        },
      ],
    },
  ],
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // ou utilisez une méthode sécurisée
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});
export default router;