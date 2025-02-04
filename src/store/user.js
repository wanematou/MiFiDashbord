import { defineStore } from 'pinia';

// Store for user
const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage, 
      },
    ],
  },
});
// Store for currentProfil
const useProfilStore = defineStore('profil', {
  state: () => ({
    profil: null,
  }),
  actions: {
    setProfil(profil) {
      this.profil = profil;
    },
    clearProfil() {
      this.profil = null;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'profil',
        storage: localStorage, 
      },
    ],
  },
});

// Store for currentPaymentMode
const usePaymentStore = defineStore('payment', {
  state: () => ({
    payment: null,
  }),
  actions: {
    setPayment(payment) {
      this.payment = payment;
    },
    clearPayment() {
      this.payment = null;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'payment',
        storage: localStorage, 
      },
    ],
  },
});

export {
  useUserStore,
  useProfilStore,
  usePaymentStore,
};
