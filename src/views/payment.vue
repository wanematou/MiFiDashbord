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
                <div class=" ms-5 card col-sm-5">
                    <div class="card-body">
                        <h5 class="text-myBlue fw-bold">Statut de votre compte</h5>
                        <b class="text-myBlue fw-bold">
                            <PiggyBank /> {{ todayRecipe }} FCFA
                        </b>
                    </div>
                </div>
                <div class="offset-1 card col-sm-5">
                    <div class="card-body">
                        <h5 class="text-myBlue fw-bold">Solde disponilbe</h5>
                        <b class="text-myBlue fw-bold">
                            <PiggyBank /> {{ totalSolde }} FCFA
                        </b>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="card col-sm-11 ms-5 ">
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
                            <form action class="loginform offset-3 col-7" @submit.prevent="sendmail()" >
                                <div class="mb-5">
                                    <label for="exampleFormControlInput1" class="form-label">Telephone</label>
                                    <input type="tel" class="form-control tel " v-model="tel" id="phone"
                                        placeholder="">
                                </div>
                                <div class="mb-5">
                                    <label for="exampleFormControlInput1" class="form-label">Montant</label>
                                    <input type="text" class="form-control password" v-model="amount" id="password"
                                        placeholder="">
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
            userId:'',
            tel:'',
            amount:''
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
            this.todayRecipe = 0;
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
                console.log(res.data.data)
                let date = new Date();
                date = new Intl.DateTimeFormat("fr-CA").format(date);
                let successTransaction = res.data.data;
                successTransaction.forEach((item) => {
                    let completed_at = item.completed_at.split(" ")[0];
                    if (item.status == "SUCCESS") {
                        this.totalSoldeTickets++;
                        this.totalSolde = this.totalSolde + parseInt(item.amount);
                    }
                    if (item.status == "SUCCESS" && completed_at == date) {
                        this.ticketSoldToday++;
                        this.todayRecipe = this.todayRecipe + parseInt(item.amount);
                    }
                })
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }

        },
        sendmail() {
            if(this.amount>this.totalSolde){
                console.log('Le montant de retrait est supérieur à votre solde')
                return;
            }
            let message=`Le client ${this.userName} a soumis une demande de retrait de ${this.amount} sur son numero: ${this.tel}`;

            let object =
                "Le client" +
                " " +
                this.userName +
                " " +
                "a soumis une demande de retrait ";
            let data = new FormData();
            console.log(message)
            return;
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
                    let r = JSON.stringify(response.data);
                    console.log(r);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    }
}
</script>
<style></style>