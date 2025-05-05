<template>
    <div>
      <!-- Bouton pour afficher/masquer le sidebar sur mobile -->
      <div style="padding-top: 50px">
        <button
          class="btn btn-primary d-lg-none"
          @click="toggleSidebar"
          style="position: fixed; top: 10px; left: 10px; z-index: 1200"
        >
          ☰
        </button>
      </div>
  
      <!-- Sidebar -->
      <div
        class="container-fluid sideBar pt-3"
        :class="{ 'sidebar-visible': isSidebarVisible, 'sidebar-hidden': !isSidebarVisible }"
      >
        <div class="row flex-nowrap sidebox">
          <div class="col-auto col-md-12 col-xl-12 px-sm-2 px-0">
            <div
              class="d-flex flex-column align-items-center align-items-sm-start px-2 pt-2 text-white min-vh-100"
            >
              <ul
                class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                id="menu"
              >
                <div class="card">
                  <li class="nav-item mt-3 mb-3">
                    <select
                      name=""
                      id=""
                      v-model="selected"
                      class="form-select"
                      aria-label="Default select example"
                      @change="routerSelect()"
                    >
                      <option value="" disabled selected hidden>
                        Chossissez un routeur
                      </option>
                      <option v-for="option in options" :value="option">
                        {{ option.name }}
                      </option>
                    </select>
                  </li>
                  <li class="nav-item mt-3 mb-3">
                    <router-link
                      to="/client/profils"
                      class="nav-link align-middle px-0 text-decoration-none text-myBlue fw-bold"
                      @click="closeToggleSidebar"
                    >
                      <GalleryThumbnails :size="25" /> Mes tarifs
                    </router-link>
                  </li>
                  <li class="nav-item mb-3">
                    <a
                      href="#"
                      @click.prevent="displayList()"
                      class="nav-link align-middle fw-bold text-myBlue px-0"
                    >
                      <Tickets :size="25" /> Mes tickets
                    </a>
                  </li>
                  <li class="nav-item mb-3">
                    <a
                      href="#submenu3"
                      data-bs-toggle="collapse"
                      @click="openComptabilite()"
                      class="nav-link px-0 align-middle text-myBlue fw-bold"
                    >
                      <Landmark :size="25" /> Ma comptabilité
                      <ChevronUp :size="16" v-if="!chevron" />
                      <ChevronDown :size="16" v-if="chevron" />
                    </a>
                    <ul
                      class="collapse nav flex-column ms-6"
                      id="submenu3"
                      data-bs-parent="#menu"
                    >
                      <li class="w-100">
                        <router-link
                          to="/client/withdraw"
                          class="nav-link px-0 text-decoration-none"
                          @click="closeToggleSidebar"
                        >
                          Effectuer un retrait
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/client/withdrawals"
                          class="nav-link px-0 text-decoration-none"
                          @click="closeToggleSidebar"
                        >
                          Mes retraits
                        </router-link>
                      </li>
                    </ul>
                  </li>
                </div>
  
                <hr />
  
                <div class="card">
                  <li class="nav-item">
                    <a
                      href="#submenu2"
                      data-bs-toggle="collapse"
                      @click.prevent="openComptabilite1()"
                      class="nav-link px-0 align-middle text-myBlue fw-bold"
                    >
                      <FileStack :size="25" /> Templates de tickets
                      <ChevronUp :size="16" v-if="chevron1" />
                      <ChevronDown :size="16" v-if="!chevron1" />
                    </a>
                    <ul
                      class="collapse nav flex-column ms-6"
                      id="submenu2"
                      data-bs-parent="#menu"
                    >
                      <li class="w-100">
                        <router-link
                          to="/client/addTemplate"
                          class="nav-link px-0 text-decoration-none"
                          @click="closeToggleSidebar"
                        >
                          Ajouter un template
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/client/templateList"
                          class="nav-link px-0 text-decoration-none"
                          @click="closeToggleSidebar"
                        >
                          Liste des templates
                        </router-link>
                      </li>
                    </ul>
                  </li>
                </div>
  
                <hr />
  
                <div class="card">
                  <li class="nav-item mt-3 mb-3">
                    <div class="nav-link align-middle px-0">
                      <div
                        class="text-decoration-none text-myBlue fw-bold"
                        @click="LogOut()"
                      >
                        <LogOut :size="25" /> Déconnexion
                      </div>
                    </div>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Contenu principal -->
      <div
        class="col py-3 view"
        :class="{
          'content-expanded': !isSidebarVisible,
          'content-collapsed': isSidebarVisible,
        }"
      >
        <router-view class="routerview"></router-view>
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
            options: [],
            selected: '',
            profils: [],
            routerStore: '',
            chevron: true,
            chevron1: true,
            isSidebarVisible: window.innerWidth > 992, // Afficher le sidebar par défaut sur desktop
        };
    },
    mounted() {
        this.getRouter();
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        async getRouter() {
            let data = new FormData();
            const userStore = useUserStore();
            let user = userStore.user;
            let id = user.id;
            data.append("id", id);
            axios({
                url:
                    Globals.webside_url +
                    "index.php?req=user-get-routers",
                method: "post",
                data: data,
            })
                .then((response) => {
                    let res = response.data.data;
                    this.options = res;
                    console.log(res);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        routerSelect() {
            if (this.options == '') {
                this.$swal({
                    title: 'Erreur',
                    text: 'Vérifiez votre accès à internet et réessayez',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                    background: '#f5f5f5',
                    customClass: {
                        popup: 'my-custom-popup',
                        title: 'my-small-tittle',
                    }
                });
                return;
            }
            this.routerStore = useRouterStore();
            let router = this.selected;
            this.routerStore.setRouter(router);
            this.readProfil();
            setTimeout(() => {
                Globals.DashboardVue.getSuccessTransaction();
            }, 1000);

        },
        async readProfil() {
            let id = this.routerStore.router.id;
            let data = new FormData();
            data.append('router_id', id);
            try {
                const res = await axios({
                    method: "POST",
                    url: "https://templates.mifi.bf/api/index.php?req=read-profilDasbord",
                    data: data,
                });
                let profils = res.data.data;
                let useProfil = useProfilStore();
                useProfil.setProfil(profils);
                profils = Object.values(profils);
                console.log(typeof profils)
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
            if (window.innerWidth < 993){
                this.isSidebarVisible=false;
            }  
            this.$router.push({ path: "/client/ticketsListe" });
            // let useProfil = useProfilStore();
            // useProfil.clearProfil();
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
        closeToggleSidebar(){
            if (window.innerWidth < 993){
                this.isSidebarVisible=false;
            }     
        },
        handleResize() {
            this.isSidebarVisible = window.innerWidth > 992;
        },
        LogOut() {
            let userStore = useUserStore();
            userStore.clearUser();
            let profilStore = useProfilStore();
            profilStore.clearProfil();
            let routerStore = useRouterStore();
            routerStore.clearRouter();
            this.$router.push({ path: "/" })
        }
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

    .sidebox {
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
    padding: 5px;
    width: 220px;
}
</style>