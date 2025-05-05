<template>
    <div class=" main">
        <div class=" container mb-5 ">
            <div class="row">
                <h3 class="text-myBlue">Suivez en ligne vos Tickets sur MiFi</h3>
            </div>
            <div class="row">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><router-link to="/client/home" class="text-decoration-none" >Acceuil</router-link></li>
                        <li class="breadcrumb-item active" aria-current="page">Tickets</li>
                    </ol>
                </nav>
            </div>
        </div>
        <div class="card conainer">
            <div class="row mt-3">
                <h5 class=" offset-1 col-sm-6 text-myBlue">Vos Tickets WiFi</h5>
            </div>
            <div class="row">
                <div class="table-responsive">
                    <v-data-table :items="tickets"></v-data-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Globals from "../store/Globals.js";
import { useUserStore, useProfilStore,useRouterStore } from "../store/user.js";
import axios from "axios";
export default {
    data() {
        return {
            phone: '',
            password: '',
            tarifName: '',
            tickets: [],
            profils: {}
        }
    },
    mounted() {
       this.readProfil();
    },
    methods: {
        async readProfil() {
            this.routerStore = useRouterStore();
            if(!this.routerStore.router){
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
            data.append('router_id', id);

            try {
                const res = await axios(
                    {
                        method: "POST",
                        url: "https://templates.mifi.bf/api/index.php?req=read-profilDasbord",
                        data: data,
                    }
                );
                let profils = res.data.data;
                profils.forEach((item) => {
                    this.profils[item.timestamp] = item

                })
                this.getTicket();
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }
        },
        async getTicket() {
            let useProfil = useProfilStore();
            if (useProfil.profil) {
                this.tarifName = useProfil.profil.name;
            }
            
            this.routerStore = useRouterStore();
            let id = this.routerStore.router.id;
            let data = new FormData();
            data.append('router_id', id)
            try {
                const res = await axios(
                    {
                        method: "POST",
                        url: "https://templates.mifi.bf/api/index.php?req=get-Tickets",
                        data:data

                    }
                );
                let response = res.data.data;
                console.log( res);
                console.log(response);
                let tickets = {};
                let timestamp = 1737976520903; // Exemple timestamp
                let date = new Date(timestamp);

                console.log(date.toLocaleString()); // Affiche une date lisible
                let Nombre = 1;
                response.forEach((data) => {
                    let timestamp = data.profil;
                    let Date = this.timestampToDate(timestamp);
                    let profil = this.profils[timestamp].profilData;
                    let UtilisateurParTicket = profil.split(',')[1].split(':')[1].replaceAll('\"', '').replaceAll('}', '');
                    let Prix = profil.split(',')[0].split(':')[1].split(';')[2];
                    let LimiteDeDonnée = profil.split(',')[0].split(':')[1].split(';')[4];
                    let Durée = profil.split(',')[0].split(':')[1].split(';')[5];
                    Durée = Durée.replace("d", "j");
                    Durée = Durée.replace("h", "h");
                    Durée = Durée.replace("m", "min");
                    let TicketsVendus=0;
                    if (LimiteDeDonnée > '1024') {
                        LimiteDeDonnée = parseInt(LimiteDeDonnée) / 1024 + 'Go'
                    } else {
                        LimiteDeDonnée = LimiteDeDonnée + 'Mo'
                    }
                    if (!tickets[timestamp]) {
                        if(data.status=='achete'){
                            TicketsVendus++;
                        }
                        tickets[timestamp] = { Date, Nombre, UtilisateurParTicket, Prix, LimiteDeDonnée, Durée, TicketsVendus }
                    } else {
                        if(data.status=='achete'){
                            tickets[timestamp].TicketsVendus++
                        }
                        tickets[timestamp].Nombre++
                    }

                })
                this.tickets= Object.values(tickets);
                this.tickets.forEach((item)=>{
                    let TicketsNonVendus=  parseInt(item.Nombre) - parseInt(item.TicketsVendus);
                    item.TicketNonVendu=TicketsNonVendus;
                    console.log(item);
                });
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }

        },
        timestampToDate(timestamp) {
            timestamp = parseInt(timestamp);
            let date = new Date(timestamp);
            return date.toLocaleString();
        }
    }
}
</script>
<style></style>