<template>
    <div class=" main">
        <div class=" container mb-5 ">
            <div class="row">
                <h3 class="text-myBlue">Tableau de bord en ligne-MiFi</h3>
            </div>
            <div class="row">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item "><a href=""> <router-link to="/client/home">Acceuil</router-link>
                            </a></li>
                        <li class="breadcrumb-item"><a href="#">Ma comptabilité</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Effectuer un retrait</li>
                    </ol>
                </nav>
            </div>
        </div>
        <div class="card conainer p-3">
            <div class="row mt-3">
                <div class=" ms-5 card bg-light col-sm-5">
                    <div class="card-body">
                        <h5 class="text-myBlue fw-bold ">Statut de votre compte</h5>
                        <b class="text-myBlue fw-bold">
                            <PiggyBank /> {{ todayRecipe }} FCFA
                        </b>
                    </div>
                </div>
                <div class="offset-1 card col-sm-5 bg-light ">
                    <div class="card-body">
                        <h5 class="text-myBlue fw-bold bg-light ">Solde disponilbe</h5>
                        <b class="text-myBlue fw-bold">
                            <PiggyBank /> {{ totalSolde }} FCFA
                        </b>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="card bg-light col-sm-11 ms-5 ">
                    <div class="card-body ">
                        <div class="row text-myBlue fw-bold ">
                            <h5 class=" offset-5 col-sm-6">
                                <Users /> {{ userName }}
                            </h5>
                            <h5 class=" offset-5 col-sm-6">
                                <Mail /> {{ userEmail }}
                            </h5>
                        </div>
                        <div class="row">
                            <form action class="loginform offset-3 col-7" @submit.prevent="sendmail()">
                                <div class="mb-5">
                                    <label for="exampleFormControlInput1" class="form-label">Telephone</label>
                                    <input type="tel" class="form-control tel " v-model="tel" id="phone" placeholder="">
                                </div>
                                <div class="mb-5">
                                    <label for="exampleFormControlInput1" class="form-label">Montant</label>
                                    <input type="text" class="form-control amount" v-model="amount" id="amount"
                                        placeholder="">
                                </div>
                                <div class="mb-5">
                                    <label for="exampleFormControlInput1" class="form-label">Confirmez votre mot de
                                        passe</label>
                                    <input type="password" class="form-control password" v-model="password"
                                        id="password" placeholder="confirmer votre mot de passe de connexion">
                                </div>
                                <div>
                                    <button type="submit" class="btn bbtn btn-primary  " id="sendBtn">Soumettre</button>
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
import { useUserStore, useProfilStore } from "../store/user.js";
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
            totalSolde: 0,
            userName: '',
            userEmail: '',
            userId: '',
            tel: '',
            amount: '',
            amountWithdrawal: 0,
            availableBalance: 0,
            totalSolde: 0
        }
    },
    mounted() {
        this.getTicket();
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
        async getTicket() {
            try {
                const res = await axios(
                    {
                        method: "POST",
                        url: "https://templates.mifi.bf/api/index.php?req=get-Tickets",

                    }
                );
                console.log(res)
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }

        },
        async getSuccessTransaction() {
            this.totalSolde = 0;
            const userStore = useUserStore();
            let user = userStore.user;
            let id = user.id;
            let data = new FormData();
            data.append('user_id', id)
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
            let user = userStore.user;
            let id = user.id;
            let data = new FormData();
            data.append('user_id', id)
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
                console.log('--------------------------------------------------');
                console.log(this.availableBalance)
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }

        },
        async sendmail() {
            if (this.amount > this.availableBalance) {
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
            console.log(message);
            let object =
                "Le client" +
                " " +
                this.userName +
                " " +
                "a soumis une demande de retrait ";
            let data = new FormData();
            console.log(message)
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
            let data = new FormData();
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
<style></style>