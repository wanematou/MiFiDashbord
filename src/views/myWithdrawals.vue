<template>
    <div class=" main">
        <div class=" container mb-5 ">
            <div class="row">
                <h3 class="text-myBlue">Suivez en ligne vos retraits</h3>
            </div>
            <div class="row">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item "><router-link to="/client/home" class="text-decoration-none" >Acceuil</router-link></li>
                        <li class="breadcrumb-item">Ma comptabilité</li>
                        <li class="breadcrumb-item active" aria-current="page">Mes retraits</li>
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
                    <v-data-table :items="items"></v-data-table>
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
            items: [],
        }
    },
    mounted() {
        this.readwithdrawals();
    },
    methods: {
        async readwithdrawals() {
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
                        data: data,
                    }
                );
                let response = res.data.data;
                response.forEach((item)=>{
                    console.log(item);
                    let DateDeRequete= item.created_at;
                    let EffectuerLe= item.completed_at;
                    let Montant= item.amount+' FCFA';
                    let Numéro= item.transfertPhone;
                    let withdraw={DateDeRequete,Numéro,Montant,EffectuerLe};
                    this.items.push(withdraw);
                })
                console.log(this.items);
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }
        },
        
    }
}
</script>
<style></style>