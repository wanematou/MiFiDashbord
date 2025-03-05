<template>
    <div>
        <!-- Bouton pour afficher/masquer le sidebar sur mobile -->
        <button class="btn btn-primary d-lg-none" @click="toggleSidebar"
            style="position: fixed; top: 10px; left: 10px; z-index: 1200;">
            ☰
        </button>

        <!-- Sidebar -->
        <div class="container-fluid sideBar pt-3"
            :class="{ 'sidebar-visible': isSidebarVisible, 'sidebar-hidden': !isSidebarVisible }">
            <div class="row flex-nowrap sidebox">
                <div class="col-auto col-md-12 col-xl-12 px-sm-2 px-0 ">
                    <div
                        class="d-flex flex-column align-items-center align-items-sm-start px-2 pt-2 text-white min-vh-100">

                        
                        <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                            id="menu">
                            <div class="card">
                                <li class="nav-item mt-3 mb-3">
                                    <a href="" class="nav-link align-middle px-0">
                                        <router-link to="/client/profils"
                                            class="text-decoration-none text-myBlue fw-bold">
                                            <GalleryThumbnails  :size="25" /> Mes tarifs
                                        </router-link>
                                    </a>
                                </li>
                                <li class="nav-item mb-3">
                                    <a href="" @click.prevent="displayList()"
                                        class="nav-link align-middle fw-bold text-myBlue px-0">
                                        <Tickets  :size="25" />
                                        Mes tickets
                                    </a>
                                </li>
                                <li class="nav-item  mb-3">
                                    <a href="#submenu3" data-bs-toggle="collapse" @click="openComptabilite()" class="nav-link 
                   px-0 align-middle  text-myBlue fw-bold">
                                        <Landmark  :size="25" />
                                        Ma comptabilité
                                        <ChevronUp :size="16" v-if="!chevron" />
                                        <ChevronDown :size="16" v-if="chevron" />
                                    </a>
                                    <ul class="collapse  nav flex-column ms-6" id="submenu3" data-bs-parent="#menu">
                                        <li class="w-100">
                                            <a href="#" class="nav-link px-0">
                                                <router-link to="/client/withdraw"
                                                    class="text-decoration-none">Effectuer un
                                                    retrait</router-link>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" class="nav-link px-0">
                                                <router-link to="/client/withdrawals" class="text-decoration-none">Mes
                                                    retraits</router-link>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </div>
                            <hr>
                            <div class="card">
                                <li class="nav-item">
                                    <a href="#submenu2" data-bs-toggle="collapse" @click.prevent="openComptabilite1()"
                                        class="nav-link px-0 align-middle  text-myBlue fw-bold">
                                        <FileStack  :size="25" />
                                        Templates de tickets
                                        <ChevronUp :size="16" v-if="chevron1" />
                                        <ChevronDown :size="16" v-if="!chevron1" />
                                    </a>
                                    <ul class="collapse nav flex-column ms-6 " id="submenu2" data-bs-parent="#menu">
                                        <li class="w-100">
                                            <a href="#" class="nav-link px-0 ">
                                                <router-link to="/client/addTemplate"
                                                    class="text-decoration-none ">Ajouter
                                                    un template</router-link>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" class="nav-link px-0">
                                                <router-link to="/client/templateList"
                                                    class="text-decoration-none">Liste
                                                    des templates</router-link>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </div>

                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contenu principal -->
        <div class="col py-3 view"
            :class="{ 'content-expanded': !isSidebarVisible, 'content-collapsed': isSidebarVisible }">
            <router-view class="routerview"></router-view>
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
            profils: [],
            chevron: true,
            chevron1: true,
            isSidebarVisible: window.innerWidth > 992, // Afficher le sidebar par défaut sur desktop
        };
    },
    mounted() {
        this.readProfil();
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        async readProfil() {
            const userStore = useUserStore();
            let user = userStore.user;
            let id = user.id;
            let data = new FormData();
            data.append('user_id', id);
            try {
                const res = await axios({
                    method: "POST",
                    url: "https://templates.mifi.bf/api/index.php?req=read-profilDasbord",
                    data: data,
                });
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
                        dataLimit = parseInt(dataLimit) / 1024 + 'Go';
                    } else {
                        dataLimit = dataLimit + 'Mo';
                    }
                    let timestamp = pname[12];
                    let profil = {
                        name: name,
                        duration: duration,
                        userperticket: userperticket,
                        price: price,
                        debitUpDown: debitUpDown,
                        limitData: dataLimit,
                        timestamp: timestamp,
                    };
                    this.profils.push(profil);
                });
            } catch (error) {
                console.error("Erreur :", error);
            }
        },
        displayList() {
            this.$router.push({ path: "/client/ticketsListe" });
            let useProfil = useProfilStore();
            useProfil.clearProfil();
        },
        openComptabilite() {
            this.chevron = !this.chevron;
        },
        openComptabilite1() {
            this.chevron1 = !this.chevron1;
        },
        toggleSidebar() {
            this.isSidebarVisible = !this.isSidebarVisible;
        },
        handleResize() {
            this.isSidebarVisible = window.innerWidth > 992;
        },
    },
};
</script>

<style scoped>
.sideBar {
    background-color: #FF6600 !important;
    width: 250px;
    height: 100vh;
    position: fixed;
    left: 0;
    transition: transform 0.3s ease;
    z-index: 1000;
}

.sidebar-visible {
    transform: translateX(0);
}

.sidebar-hidden {
    transform: translateX(-250px);
}

.view {
    margin-left: 250px;
    transition: margin-left 0.3s ease;
    background-color: #fcf9f9;
}

.content-expanded {
    margin-left: 0;
}

.content-collapsed {
    margin-left: 250px;
}

@media (max-width: 992px) {
    .view {
        margin-left: 0;
    }
    .sidebox{
        padding-top: 30px;
    }
}

hr {
    background-color: white;
    width: 100%;
    height: 2px;
}

.soustitre {
    font-size: 14px !important;
}

.tableauDeBord {
    margin-bottom: 18px !important;

}

.tableauDeBord a {
    font-size: 25px !important;
    font-weight: bold;
}

.card {
    background-color: white;
    padding-left: 30px;
    width: 210px;
}
</style>