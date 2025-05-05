<template>
    <div class="main py-4">
      <div class="container">
        <div class="row mb-3">
          <div class="col">
            <h3 class="text-myBlue">Effectuer une demande pour un retrait</h3>
          </div>
        </div>
  
        <div class="row mb-4">
          <div class="col">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/client/home" class="text-decoration-none">Accueil</router-link>
                </li>
                <li class="breadcrumb-item">Ma comptabilité</li>
                <li class="breadcrumb-item active" aria-current="page">Effectuer un retrait</li>
              </ol>
            </nav>
          </div>
        </div>
  
        <div class="row g-4 mb-4">
          <div class="col-12 col-md-6">
            <div class="card bg-light h-100">
              <div class="card-body">
                <h5 class="text-myBlue fw-bold">Statut de votre compte</h5>
                <b class="text-myBlue fw-bold">
                  <PiggyBank color="#FF6600" /> {{ status }}
                </b>
              </div>
            </div>
          </div>
  
          <div class="col-12 col-md-6">
            <div class="card bg-light h-100">
              <div class="card-body">
                <h5 class="text-myBlue fw-bold">Solde disponible</h5>
                <b class="text-myBlue fw-bold">
                  <PiggyBank color="#FF6600" /> {{ availableBalance }} FCFA
                </b>
              </div>
            </div>
          </div>
        </div>
  
        <div class="card bg-light mb-4">
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-6 mb-2">
                <h5 class="text-myBlue fw-bold">
                  <Users color="#FF6600" /> {{ userName }}
                </h5>
              </div>
              <div class="col-md-6 mb-2">
                <h5 class="text-myBlue fw-bold">
                  <Mail color="#FF6600" /> {{ userEmail }}
                </h5>
              </div>
            </div>
  
            <div class="row">
              <div class="col-12 col-md-8 offset-md-2">
                <form @submit.prevent="sendmail()">
                  <div class="mb-4">
                    <label for="phone" class="form-label">Téléphone</label>
                    <input
                      type="tel"
                      class="form-control"
                      v-model="tel"
                      id="phone"
                      placeholder="Votre numéro"
                    />
                  </div>
  
                  <div class="mb-4">
                    <label for="amount" class="form-label">Montant</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="amount"
                      id="amount"
                      placeholder="Montant à retirer"
                    />
                  </div>
  
                  <div class="mb-4">
                    <label for="password" class="form-label">Confirmez votre mot de passe</label>
                    <input
                      type="password"
                      class="form-control"
                      v-model="password"
                      id="password"
                      placeholder="Mot de passe de connexion"
                    />
                  </div>
  
                  <div class="text-center">
                    <button type="submit" class="btn btn-primary">Soumettre</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script>
import Globals from "../store/Globals.js";
import { useUserStore, useProfilStore, useRouterStore } from "../store/user.js";
import axios from "axios";
export default {
    data() {
        return {
            phone: '',
            password: '',
            tarifName: '',
            ticketSoldToday: 0,
            todayRecipe: 0,
            totalSoldeTickets: 0,
            userName: '',
            userEmail: '',
            userId: '',
            tel: '',
            amount: '',
            amountWithdrawal: 0,
            availableBalance: 0,
            totalSolde: 0,
            isSubmeeting: false,
            status: ''
        }
    },
    mounted() {
        this.getSuccessTransaction();
        this.getData()
    },
    methods: {
        getData() {
            const userStore = useUserStore();
            let user = userStore.user;
            console.log(user);
            this.userEmail = user.email;
            this.userName = user.name;
            this.userId = user.id;
            this.phone = user.phone;

        },

        async getSuccessTransaction() {
            this.totalSolde = 0;
            const userStore = useUserStore();
            this.routerStore = useRouterStore();
            if (!this.routerStore.router) {
                this.$swal({
                    title: 'MiFi',
                    text: 'Veuillez selectionner un routeur,puis actualiser!',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                    background: '#f5f5f5',
                    customClass: {
                        popup: 'my-custom-popup',
                        title: 'my-small-tittlepayment',
                    }
                });
                return;
            }
            let id = this.routerStore.router.id;
            let data = new FormData();
            data.append('router_id', id)
            try {
                const res = await axios(
                    {
                        method: "POST",
                        url: "https://templates.mifi.bf/api/index.php?req=get-successTransaction",
                        data: data
                    }
                );
                let successTransaction = res.data.data;
                successTransaction.forEach((item) => {
                    if (item.status == "SUCCESS") {
                        this.totalSolde = this.totalSolde + parseInt(item.amount);
                    }
                })
                console.log('this.totalSolde this.totalSolde this.totalSolde this.totalSolde')
                console.log(this.totalSolde);
                this.getSuccesswithdrawal();
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }

        },
        async getSuccesswithdrawal() {
            this.amountWithdrawal = 0;
            const userStore = useUserStore();
            this.routerStore = useRouterStore();
            let id = this.routerStore.router.id;
            let data = new FormData();
            data.append('router_id', id)
            try {
                const res = await axios(
                    {
                        method: "POST",
                        url: "https://templates.mifi.bf/api/index.php?req=get-withdrawal",
                        data: data
                    }
                );
                let response = res.data.data;
                response.forEach((item) => {
                    this.amountWithdrawal = this.amountWithdrawal + parseInt(item.amount);
                })
                this.availableBalance = parseInt(this.totalSolde) - this.amountWithdrawal;
                if (this.availableBalance > 0) {
                    this.status = 'Compte fourni'
                } else if (this.availableBalance == 0) {
                    this.status = 'Compte vide'
                }
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }

        },
        async sendmail() {
            if (this.isSubmeeting) {
                console.log('attend que la première soumissions finisse')
                return;
            }
            this.isSubmeeting = true;
            if (this.amount > this.availableBalance) {
                this.isSubmeeting = false;
                this.$swal({
                    title: 'Erreur',
                    text: 'Le montant du retrait est supérieur à votre solde',
                    confirmButtonText: 'Réessayer',
                    confirmButtonColor: '#3085d6',
                    background: '#f5f5f5',
                    customClass: {
                        popup: 'my-custom-popup',
                        title: 'my-small-tittle',
                    }
                });
                return;
            }
            if (await this.passwordCheck() == false) {
                this.isSubmeeting = false;
                this.$swal({
                    title: 'Erreur',
                    text: 'Le mot de passe est incorrect!',
                    confirmButtonText: 'Réessayer',
                    confirmButtonColor: '#3085d6',
                    background: '#f5f5f5',
                    customClass: {
                        popup: 'my-custom-popup',
                        title: 'my-small-tittle',
                    }
                });
                return;
            }
            if (await this.createWithDrawalTransaction() == false) {
                this.isSubmeeting = false;
                this.$swal({
                    title: 'Erreur',
                    text: 'Vérifiez votre connexion à internet et réessayer!',
                    confirmButtonText: 'ok',
                    confirmButtonColor: '#3085d6',
                    background: '#f5f5f5',
                    customClass: {
                        popup: 'my-custom-popup',
                        title: 'my-small-tittle',
                    }
                });
            }

            let message = `Le client ${this.userName} a soumis une demande de retrait de ${this.amount} sur son numero: ${this.tel}`;
            let object =
                "Le client" +
                " " +
                this.userName +
                " " +
                "a soumis une demande de retrait ";
            let data = new FormData();
            data.append("user_id", this.userId);
            data.append("fname", this.userName);
            data.append("email", this.userEmail);
            data.append("object", object);
            data.append("message", message);
            axios({
                method: "POST",
                url: Globals.webside_url + "userMailSender.php",
                data: data,
            })
                .then((response) => {
                    this.message = "";
                    console.log(response);
                    let r = JSON.stringify(response.data);
                    console.log(r);
                    this.$swal({
                        title: 'MiFi',
                        text: 'Votre requête a été transmise avec success!',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                        background: '#f5f5f5',
                        customClass: {
                            popup: 'my-custom-popup',
                            title: 'my-small-tittlepayment',
                        }
                    });
                    this.isSubmeeting = false;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        async passwordCheck() {
            let data = new FormData();
            data.append("tel", this.phone);
            data.append("password", this.password);
            try {
                const res = await axios({
                    method: "POST",
                    url: Globals.webside_url + "index.php?req=user-login",
                    data: data,
                })
                if (res.data.data == false) {
                    return false
                } else {
                    return true;
                }
            } catch (error) {
                if (error.code == 'ERR_NETWORK') {

                }
                console.log(error);
            }

        },
        generateToken() {
            return (
                Math.random().toString(36).substring(2, 15) +
                "-" +
                Math.random().toString(36).substring(2, 15) +
                "-" +
                Date.now().toString(36)
            );
        },
        async createWithDrawalTransaction() {
            this.routerStore = useRouterStore();
            let router_id = this.routerStore.router.id;
            let data = new FormData();
            data.append("router_id", router_id);
            data.append("user_id", this.userId);
            data.append("phone", this.phone);
            data.append("transfertPhone", this.tel);
            data.append("amount", this.amount);
            data.append("request_id", this.generateToken());
            try {
                const res = await axios({
                    method: "POST",
                    url: Globals.webside_url + "index.php?req=create-withdrawal",
                    data: data,
                })
                console.log(res);
                console.log(res.data.success);
                if (res.data.data == true && res.data.success == true) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                if (error.code == 'ERR_NETWORK') {

                }
                console.log(error);
            }

        },
    }
}
</script>
<style>
.conainer {
    border: none !important;
}
</style>