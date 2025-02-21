<template>
    <div class=" main">
        <div class=" container mb-5 ">
            <div class="row">
                <h3 class="text-myBlue">Suivez en ligne vos Tickets sur MiFi</h3>
            </div>
            <div class="row">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#">Acceuil</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Tickets</li>
                    </ol>
                </nav>
            </div>
        </div>
        <div class="card conainer">
            <div class="row mt-3">
                <h5 class=" offset-1 col-sm-6 text-myBlue">Vos forfaits WiFi</h5>
            </div>
            <div class="row">
                <div class="col-sm-11 m-3">
                    <v-data-table :items="tickets"></v-data-table>
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
            tickets: [],
            profils: {}
        }
    },
    mounted() {
        this.readProfil();
    },
    methods: {
        async readProfil() {
            const userStore = useUserStore();
            let user = userStore.user;
            let id = user.id;
            let data = new FormData();
            data.append('user_id', id)
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
            const userStore = useUserStore();
            let user = userStore.user;
            let id = user.id;
            let data = new FormData();
            data.append('user_id', id)
            try {
                const res = await axios(
                    {
                        method: "POST",
                        url: "https://templates.mifi.bf/api/index.php?req=get-Tickets",

                    }
                );
                let response = res.data.data;
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