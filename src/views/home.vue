<template>
    <div class=" main">
        <div class=" container mb-5 ">
            <div class="row">
                <h3 class="text-myBlue">Tableau de bord en ligne-MiFi</h3>
            </div>
            <div class="row">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item active">Acceuil</li>
                    </ol>
                </nav>
            </div>
        </div>
        <div class="card conainer p-3">
            <div class="row ps-3 pe-5  mt-3">
                <div class="offset-1 card col-sm-5">
                    <div class="card-body">
                        <h5 class="text-myBlue fw-bold" >Tickets vendus aujourd'hui</h5>
                        <b class="text-myBlue fw-bold" > <Tickets/> {{ ticketSoldToday }}</b>
                    </div>
                </div>
                <div class=" offset-1 card col-sm-5">
                    <div class="card-body">
                        <h5 class="text-myBlue fw-bold" >Recette du jour</h5>
                        <b class="text-myBlue fw-bold" > <PiggyBank/> {{ todayRecipe }} FCFA </b>
                    </div>
                </div>
            </div>
            <div class="row ps-3 mt-3 pe-5 ">
                <div class="offset-1 card col-sm-5 ">
                    <div class="card-body">
                        <h5 class="text-myBlue fw-bold" >Total des tickets vendus</h5>
                        <b class="text-myBlue fw-bold" > <Tickets/> {{ totalSoldeTickets }}</b>
                    </div>
                </div>
                <div class=" offset-1 card  col-sm-5 ">
                    <div class="card-body">
                        <h5 class="text-myBlue fw-bold" >Chiffre d'affaire total </h5>
                        <b class="text-myBlue fw-bold" > <Banknote/> {{ totalSolde }} FCFA</b>
                    </div>
                </div>
            </div>
            <div class="row ps-3 pe-5 mt-3">
                <div class="card offset-1 col-sm-5">
                    <div class="card-body">
                        <h5 class="text-myBlue fw-bold" > <Banknote/> Montant total des retraits</h5>
                        <b class="text-myBlue fw-bold" > <Banknote/> {{ amountWithdrawal }} FCFA</b>
                    </div>
                </div>
                <div class="card offset-1 col-sm-5">
                    <div class="card-body">
                        <h5 class="text-myBlue fw-bold" > <Banknote/> Solde disponible</h5>
                        <b class="text-myBlue fw-bold" > <Banknote/> {{ availableBalance }} FCFA</b>
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
            ticketSoldToday:0,
            todayRecipe:0,
            totalSoldeTickets:0,
            totalSolde:0,
            amountWithdrawal:0,
            availableBalance:0
        }
    },
    mounted() {
        this.getTicket();
        this.getSuccessTransaction();
    },
    methods: {
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
            this.todayRecipe=0;
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
                        data:data
                    }
                );
                console.log(res.data.data)
                let date= new Date();
                date= new Intl.DateTimeFormat("fr-CA").format(date);
                let successTransaction=res.data.data;
                successTransaction.forEach((item)=>{
                    let completed_at=item.completed_at.split(" ")[0];
                    if(item.status=="SUCCESS"){
                        this.totalSoldeTickets++;
                        this.totalSolde=this.totalSolde+parseInt(item.amount);
                    }
                    if(item.status=="SUCCESS" && completed_at==date ){
                        this.ticketSoldToday++;
                        this.todayRecipe=this.todayRecipe+parseInt(item.amount);
                    }
                })
                this.getSuccesswithdrawal();
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }

        },
        async getSuccesswithdrawal() {
            this.amountWithdrawal=0;
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
                        data:data
                    }
                );
                let response=res.data.data;
                response.forEach((item)=>{
                    console.log(parseInt(item.amount));
                    this.amountWithdrawal=this.amountWithdrawal+parseInt(item.amount) ;
                    
                })
                this.availableBalance= parseInt(this.totalSolde)-this.amountWithdrawal
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }

        }
    }
}
</script>
<style></style>