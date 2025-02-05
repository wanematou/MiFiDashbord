<template>
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-light">
                <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                    <a href="/"
                        class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-myBlue text-decoration-none">
                       <router-link to="/client/home" class="text-decoration-none"><span class="fs-5 d-none d-sm-inline text-myOrange ">MiFi</span></router-link>
                    </a>
                    <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                        id="menu">
                        <li class="nav-item">
                            <a href="#" class="nav-link align-middle px-0  ">
                                <router-link to="/client/profils" class="text-decoration-none " > <span class="ms-1 d-none text-decoration-none text-myBlue d-sm-inline">Mes
                                        tarifs</span></router-link>
                            </a>
                        </li>
                        <li class="nav-item">
                            <button @click.prevent="displayList()" class="nav-link align-middle px-0">
                                 <span class=" text-decoration-none ms-1 d-none text-myBlue d-sm-inline">Mes
                                        tickets</span>
                            </button>
                        </li>
                        <li>
                            <a href="#submenu1" data-bs-toggle="collapse" class="nav-link px-0 align-middle">
                                <i class="fs-4 bi-speedometer2"></i> <a @click.prevent="openComptabilite()"
                                    class="ms-1 d-none d-sm-inline  text-decoration-none text-myBlue">Ma comptabilité <ChevronUp :size="16" v-if="!chevron" /> <ChevronDown :size="16" v-if="chevron"/> </a>  </a>
                            <ul class="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                                <li class="w-100">
                                    <a href="#" class="nav-link px-0"> <router-link to="/client/withdraw" ><span
                                        class="d-none soustitre d-sm-inline text-mylittltBlue">Effectuer un retrait</span></router-link>  
                                    </a>
                                </li>
                                <li>
                                    <a href="#" class="nav-link px-0"> <span
                                            class="d-none soustitre d-sm-inline text-mylittltBlue">Mes retraits</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <hr>
                        <li>
                            <a href="#" class="nav-link px-0 align-middle">
                                <i class="fs-4 bi-table"></i> <span class="ms-1 d-none d-sm-inline text-myBlue ">Votre
                                    compte</span></a>
                        </li>
                        <li>
                            <a href="#" class="nav-link px-0 align-middle">
                                <i class="fs-4 bi-table"></i> <span
                                    class="ms-1 d-none d-sm-inline text-myBlue ">Contacter le support</span></a>
                        </li>
                        <li>
                            <a href="#" class="nav-link px-0 align-middle">
                                <i class="fs-4 bi-table"></i> <span
                                    class="ms-1 d-none d-sm-inline text-myBlue">Deconnexion</span></a>
                        </li>
                    </ul>



                </div>
            </div>
            <div class="col py-3 view">
                <router-view class="routerview"></router-view>
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
            profils: [],
            chevron:true
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
                    if (dataLimit > '1024') {
                        dataLimit = parseInt(dataLimit) / 1024 + 'Go'
                    } else {
                        dataLimit = dataLimit + 'Mo'
                    }
                    let timestamp= pname[12];
                    let profil = {
                        name: name,
                        duration: duration,
                        userperticket: userperticket,
                        price: price,
                        debitUpDown: debitUpDown,
                        limitData: dataLimit,
                        timestamp:timestamp
                    }
                    this.profils.push(profil);
                })
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }
        },
        displayList(){
            this.$router.push({path:"/client/ticketsListe"});
            let useProfil= useProfilStore();
            useProfil.clearProfil();
        },
        openComptabilite(){
            this.chevron=!this.chevron;
        }
    }
}


</script>
<style scoped>
hr {
    background-color: #FB8C00;
    width: 100px;
    height: 3px;
}

.view {
    background-color: rgb(241, 240, 247);
}
.soustitre{
    font-size: 14px !important;
}

</style>