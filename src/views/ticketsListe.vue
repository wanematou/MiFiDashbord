<template>
    <div class=" main">
        <div class=" container mb-5 ">
            <div class="row">
                <h3 class="text-myBlue" >Suivez en ligne vos Tickets sur MiFi</h3>
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
                    <table class=" table table-striped ">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tarif</th>
                                <th scope="col">Mot de passe</th>
                                <th scope="col">Durée</th>
                                <th scope="col">Statut</th>
                                <th scope="col">Nombre d'utilisateur</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(profil, id) in profils" :key="id">
                                <th scope="row">{{ id + 1 }}</th>
                                <td>{{ profil.name }}</td>
                                <td>{{ profil.duration }}</td>
                                <td>{{ profil.price }}</td>
                                <td>{{ profil.limitData }}</td>
                                <td>{{ profil.debitUpDown }}</td>
                                <td>{{ profil.userperticket }}</td>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Globals from "../store/Globals.js";
import {useUserStore, useProfilStore } from "../store/user.js";
import axios from "axios";
export default {
    data() {
        return {
            phone: '',
            password: '',
            tarifName:''
        }
    },
    mounted() {
        this.getTicket();
    },
    methods: {
        async getTicket() {
            let useProfil= useProfilStore();
            this.tarifName=useProfil.profil.name;
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
            
        }
    }
}
</script>
<style></style>