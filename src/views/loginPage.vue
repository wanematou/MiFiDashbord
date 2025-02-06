<template>
    <div class="container-fluid w-100 main">
        <div class="row h-100">
            <div class="col-sm-6 bg-myOrange">
                <div class="row">
                    <div class="col-sm-3">
                        <img src="../assets/images/anim-1.gif" width="150px" alt="">
                    </div>
                </div> <br> <br> <br> <br>
                <div class="row">
                    <div class=" offset-2 col-sm-6">
                        <img src="../assets/images/mifi.png" alt="">
                    </div>
                </div>
            </div>
            <div class="col-sm-5 bg-light">
                <div class="row">
                    <div class=" ms-5 card col-sm-10 text-center p-3">
                        <h5>Bienvenue!</h5>
                        <p>Connectez vous à votre tableau de bord</p>
                        <div class="formBox">
                            <form action class="loginform" @submit.prevent="userLogin()">
                                <div class="mb-5">
                                    <label for="exampleFormControlInput1" class="form-label">Telephone</label>
                                    <input type="text" class="form-control tel " v-model="phone" id="phone"
                                        placeholder="">
                                </div>
                                <div class="mb-5">
                                    <label for="exampleFormControlInput1" class="form-label">Mot de passe</label>
                                    <input type="password" class="form-control password" v-model="password"
                                        id="password" placeholder="">
                                </div>
                                <div>
                                    <button type="submit" class="btn bbtn btn-primary  " id="sendBtn">Connexion</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

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
        userLogin() {
            console.log(Globals.webside_url + "index.php?req=user-login");
            let error = false;
            if (this.phone.length < 8) {
                error = true;
            }
            if (this.password.length == 0) {
                error = true;
            }
            if (error) {
                return;
            }
            let data = new FormData();
            data.append("tel", this.phone);
            data.append("password", this.password);
            axios({
                method: "POST",
                url: Globals.webside_url + "index.php?req=user-login",
                data: data,
            })
                .then((response) => {
                    console.log(response);
                    let r = response;
                    if (r.data.data == false || r.data.success == false) {
                        this.$swal({
                            title: 'Erreur',
                            text: 'Numéro ou mot de passe incorrect',
                            confirmButtonText: 'Réessayer',
                            confirmButtonColor: '#3085d6',
                            background: '#f5f5f5',
                            customClass: {
                                popup: 'my-custom-popup',
                                title:'my-small-tittle',
                            }
                        });

                        return;
                    } else {
                        let user = r.data.data;
                        const userStore = useUserStore();
                        userStore.setUser(user);
                        this.$router.push({ path: "/client/home" });
                    }
                })
                .catch((error) => {
                    if (error.code == 'ERR_NETWORK') {
                        this.$swal({
                            title: 'Erreur',
                            text: 'Veuillez verifier votre accès à internet',
                            confirmButtonText: 'Réessayer',
                            confirmButtonColor: '#3085d6',
                            background: '#f5f5f5',
                            customClass: {
                                popup: 'my-custom-popup',
                                title:'my-small-tittle',
                            }
                        });
                        
                    }
                    console.log(error);
                });

        },
    }
}

</script>

<style scoped>
.main {
    height: 100vh;
}

.card {
    margin-top: 100px;
}



</style>