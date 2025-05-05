<template>
    <div class="main">
      <div class="container mb-5">
        <div class="row">
          <h3 class="text-myBlue">Liste des templates de ticket</h3>
        </div>
        <div class="row">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link to="/client/home">Accueil</router-link>
              </li>
              <li class="breadcrumb-item">Templates de tickets</li>
              <li class="breadcrumb-item active" aria-current="page">Liste des templates</li>
            </ol>
          </nav>
        </div>
  
        <div class="row">
          <div
            class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4"
            v-for="(template, id) in templates"
            :key="id"
          >
            <div class="card carrd">
              <h6 style="position: absolute; top: 1px; padding: 1px; border-radius: 5px; z-index: 1;">
                <span class="badge text-white">{{ template.type }}</span>
              </h6>
              <img :src="template.image" class="card-img-top pt-5" alt="...">
              <div
                class="carrd-body hidden-content p-1"
                v-if="template?.userId == userId"
              >
                <span class="me-3 edit" @click="edit(template)">
                  <UserPen :size="16" color="#4CAF50" />
                </span>
                <span @click="remove(template)" class="delete">
                  <Trash2 :size="16" color="#e22222" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script>
import Globals from "../store/Globals.js";
import { useUserStore, useTemplateStore } from "../store/user.js";
import axios from "axios";
export default {
    data() {
        return {
            items: [],
            templates: [],
            userId: ''
        }
    },
    mounted() {
        this.getData();
        this.readTemplates();
    },
    methods: {
        getData() {
            const userStore = useUserStore();
            let user = userStore.user;
            this.userId = user.id;
            console.log(this.userId)
        },

        async readTemplates() {
            const userStore = useUserStore();
            let user = userStore.user;
            let id = user.id;
            let data = new FormData();
            data.append('user_id', id)
            try {
                const res = await axios(
                    {
                        method: "POST",
                        url: "https://templates.mifi.bf/api/index.php?req=read-template",
                        data: data,
                    }
                );
                this.templates = res.data.data;
                console.log(this.templates)
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }
        },
        edit(template) {
            const userStore = useTemplateStore();
            userStore.setTemplate(template);
            setTimeout(() => {
                this.$router.push({ path: "/client/addTemplate" })
            }, 1000)
        },
        async remove(template) {
            let data = new FormData();
            data.append('id', template.id)
            try {
                const res = await axios(
                    {
                        method: "POST",
                        url: "https://templates.mifi.bf/api/index.php?req=delete-template",
                        data: data,
                    }
                );
                this.templates = res.data.data;
                this.readTemplates();
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }
        }

    }
}
</script>
<style scoped>
.carrd-body {
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  background-color: white;
}

.carrd-body.hidden-content {
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.carrd:hover .carrd-body.hidden-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  z-index: 1000;
}

.carrd {
  position: relative;
  width: 210px;
  overflow: hidden;
  cursor: pointer;
  height: auto;
  display: flex;
  flex-direction: column;
  padding-top: 3px;
  padding-bottom: 2px;
}

.edit,
.delete:hover {
  background-color: rgb(222, 224, 240);
}

.badge {
  background-color: #FF6600;
}

</style>