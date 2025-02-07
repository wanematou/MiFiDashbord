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
                        <li class="breadcrumb-item" aria-current="page">Tickets</li>
                        <li class="breadcrumb-item active" aria-current="page">Tarifs {{ tarifName }} </li>
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
                console.log(this.profils)
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
                let count = 1;
                response.forEach((data) => {
                    let timestamp = data.profil;
                    let date = this.timestampToDate(timestamp);
                    let profil = this.profils[timestamp].profilData;
                    let userperticket = profil.split(',')[1].split(':')[1].replaceAll('\"', '').replaceAll('}', '');
                    let price = profil.split(',')[0].split(':')[1].split(';')[2];
                    let limitData = profil.split(',')[0].split(':')[1].split(';')[4];
                    let duration = profil.split(',')[0].split(':')[1].split(';')[5];
                    duration = duration.replace("d", "j");
                    duration = duration.replace("h", "h");
                    duration = duration.replace("m", "min");
                    if (limitData > '1024') {
                        limitData = parseInt(limitData) / 1024 + 'Go'
                    } else {
                        limitData = limitData + 'Mo'
                    }
                    if (!tickets[timestamp]) {
                        tickets[timestamp] = { date, count, userperticket, price, limitData, duration }
                    } else {
                        tickets[timestamp].count++
                    }

                })
                console.log(tickets)
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