<template>
    <div class=" main">
        <div class=" container mb-5 head">
            <div class="row">
                <h3 class="text-myBlue fw-bold ">Tableau de bord en ligne-MiFi</h3>
            </div>
            <div class="row">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item active">Acceuil</li>
                    </ol>
                </nav>
            </div>
        </div>
        <div class="container m-auto">
            <!-- Ligne 1 -->
            <div class="row mt-3 gx-4">
                <div class="col-12 col-md-5 offset-md-1 mb-3">
                    <div class="card cardd h-100">
                        <div class="card-body">
                            <h5 class="text-myBlue fw-bold">Tickets vendus aujourd'hui</h5>
                            <b class="text-myBlue fw-bold">
                                <Tickets color="#FF6600" /> {{ ticketSoldToday }}
                            </b>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-5 mb-3">
                    <div class="card cardd h-100">
                        <div class="card-body">
                            <h5 class="text-myBlue fw-bold">Recette du jour</h5>
                            <b class="text-myBlue fw-bold">
                                <PiggyBank color="#FF6600" /> {{ todayRecipe }} FCFA
                            </b>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Ligne 2 -->
            <div class="row mt-3 gx-4">
                <div class="col-12 col-md-5 offset-md-1 mb-3">
                    <div class="card cardd h-100">
                        <div class="card-body">
                            <h5 class="text-myBlue fw-bold">Total des tickets vendus</h5>
                            <b class="text-myBlue fw-bold">
                                <Tickets color="#FF6600" /> {{ totalSoldeTickets }}
                            </b>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-5 mb-3">
                    <div class="card cardd h-100">
                        <div class="card-body">
                            <h5 class="text-myBlue fw-bold">Chiffre d'affaire total</h5>
                            <b class="text-myBlue fw-bold">
                                <Banknote color="#FF6600" /> {{ totalSolde }} FCFA
                            </b>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Ligne 3 -->
            <div class="row mt-3 gx-4">
                <div class="col-12 col-md-5 offset-md-1 mb-3">
                    <div class="card cardd h-100">
                        <div class="card-body">
                            <h5 class="text-myBlue fw-bold">Montant total des retraits</h5>
                            <b class="text-myBlue fw-bold">
                                <Banknote color="#FF6600" /> {{ amountWithdrawal }} FCFA
                            </b>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-5 mb-3">
                    <div class="card cardd h-100">
                        <div class="card-body">
                            <h5 class="text-myBlue fw-bold">Solde disponible</h5>
                            <b class="text-myBlue fw-bold">
                                <Banknote color="#FF6600" /> {{ availableBalance }} FCFA
                            </b>
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
            totalSolde: 0,
            amountWithdrawal: 0,
            availableBalance: 0
        }
    },
    created() {
        Globals.DashboardVue = this;
    },
    mounted() {

        this.getSuccessTransaction();
    },
    methods: {

        async getSuccessTransaction() {
            this.todayRecipe = 0;
            this.totalSolde = 0;
            this.totalSoldeTickets = 0;
            this.ticketSoldToday = 0;
            this.todayRecipe = 0;
            const userStore = useUserStore();
            this.routerStore = useRouterStore();
            console.log(this.routerStore.router);
            if (this.routerStore.router == null || !this.routerStore.router) {
                console.log('pas de router selectionné')
                return;
            }
            let id = this.routerStore.router.id;
            console.log(id);
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
                this.getSuccesswithdrawal();
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }

        },
        async getSuccesswithdrawal() {
            this.amountWithdrawal = 0;
            this.availableBalance = 0;
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
                console.log(res);
                let response = res.data.data;
                response.forEach((item) => {
                    console.log(parseInt(item.amount));
                    this.amountWithdrawal = this.amountWithdrawal + parseInt(item.amount);

                })
                this.availableBalance = parseInt(this.totalSolde) - this.amountWithdrawal
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }

        }
    }
}
</script>
<style>
.cardd {
    cursor: pointer !important;
}

.cardd:hover {
    transform: translateY(-8px) scale(1.05) !important;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}


</style>