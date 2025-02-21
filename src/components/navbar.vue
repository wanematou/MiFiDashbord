<template>
    <nav class="navbar navbar-light ">
        <div class="container-fluid form">
            <a href="#" class=" text-myBlue dashboard text-decoration-none">
                <router-link to="/client/home" class="text-decoration-none">
                    Tableau de Bord
                </router-link>
            </a>
            <img src="../assets/images/logo.png" alt="" width="50">
            <div class="text-white disconect " @click="userLogout()">
                <LogOut /> Se deconnecter
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    background-color: rgb(228, 229, 243) !important;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
    height: 70px;
}

.form {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    position: relative;
}
img{
    position: absolute;
    left: 210px;
}
.disconect {
    background-color: black;
    cursor: pointer;
    font-size: 13px;
}
.dashboard{
    font-size: 14px;
}
</style>

<script>
import Globals from "../store/Globals.js";
import axios from "axios";
import { useUserStore } from "../store/user.js";
export default {
    data() {
        return {
            phone: '',
            password: ''
        }
    },
    methods: {
        userLogout() {
            const userStore = useUserStore();
            userStore.clearUser();
            localStorage.removeItem('token');
            this.$router.push({ path: "/" });
        },

    }
}
</script>