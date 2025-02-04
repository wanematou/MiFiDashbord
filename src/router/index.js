import { createRouter, createWebHistory } from "vue-router";
import ClientMain from "../views/clientMain.vue";
import loginPage from '../views/loginPage.vue';
import Profil from "../views/profils.vue";
import TicketsListe from '../views/ticketsListe.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      children: [
        {
          path: "/client/profils",
          component: Profil,
        },
        {
          path: "/client/ticketsListe",
          component: TicketsListe,
        },
      ],
    },
  ],
});
