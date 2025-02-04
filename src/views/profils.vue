<template>
    <div class=" main">
        <div class=" container mb-5 ">
            <div class="row">
                <h3 class="text-myBlue" >Suivez en ligne vos Tarifs sur MiFi</h3>
            </div>
            <div class="row">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#">Acceuil</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Tarifs</li>
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
                                <th scope="col">Nom du forfait</th>
                                <th scope="col">Durée</th>
                                <th scope="col">Tarif</th>
                                <th scope="col">Limite des données</th>
                                <th scope="col">Débit</th>
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
import { useUserStore } from "../store/user.js";
import axios from "axios";
export default {
    data() {
        return {
            phone: '',
            password: '',
            profils: []
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
                profils.forEach((data) => {
                    data = data.profilData.split(',');
                    let pname = data[0].split(';');
                    let name = pname[0].split(':')[1].substring(14);
                    let duration = pname[5];
                    duration = duration.replace("d", "j");
                    duration = duration.replace("h", "h");
                    duration = duration.replace("m", "min");
                    let price = pname[2] + 'F CFA';
                    let userperticket = data[1].split(':')[1];
                    userperticket = userperticket.replaceAll('\"', '');
                    userperticket = userperticket.replaceAll('\}', '');
                    let debitUpDown = pname[3];
                    let dataLimit = pname[4];
                    if (dataLimit>'1024'){
                        dataLimit=parseInt(dataLimit)/1024+'Go'
                    }else{
                        dataLimit=dataLimit+'Mo'
                    }
                    let profil = {
                        name: name,
                        duration: duration,
                        userperticket: userperticket,
                        price: price,
                        debitUpDown: debitUpDown,
                        limitData: dataLimit,
                    }
                    this.profils.push(profil);
                })
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }
        }
    }
}
</script>
<style scoped>
.main {

    min-height: 100vh;
    width: 100%;
}
</style>