<template>
    <div class="container-fluid main bg-dark">
        <div class="row h-100 mainBox">
            <div class="col-sm-5 bg-myOrange part1">
                <div class="row">
                    <div class="col-sm-3">
                        <img src="../assets/images/anim-1.gif" width="150px" alt="">
                    </div>
                </div> <br> <br> <br> <br>
                <div class="row">
                    <div class=" offset-1 col-sm-6">
                        <img class="logoMiFiPart1" src="../assets/images/mifi.png" alt="">
                    </div>
                </div>
            </div>
            <div class="col-sm-5 part2">
                <img class="logoMiFi" src="../assets/images/mifi.png" alt="">
                <div class="row  Bienvenue">
                    <div class=" card col-sm-10 p-3 ">
                        <div class="text-center">
                            <h5>Bienvenue!</h5>
                            <p>Connectez vous à votre tableau de bord</p>
                        </div>
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
                timeout: Globals.timeout
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
                                title: 'my-small-tittle',
                            }
                        });

                        return;
                    } else {
                        let user = r.data.data;
                        const userStore = useUserStore();
                        userStore.setUser(user);
                        localStorage.setItem('token', this.generateToken());
                        this.$router.push({ path: "/client/home" });
                    }
                })
                .catch((error) => {
                    if (error) {
                        this.$swal({
                            title: 'Erreur',
                            text: 'Veuillez verifier votre accès à internet',
                            confirmButtonText: 'Réessayer',
                            confirmButtonColor: '#3085d6',
                            background: '#f5f5f5',
                            customClass: {
                                popup: 'my-custom-popup',
                                title: 'my-small-tittle',
                            }
                        });

                    }
                    console.log(error);
                });

        },
        generateToken() {
            return (
                Math.random().toString(36).substring(2, 15) +
                "-" +
                Math.random().toString(36).substring(2, 15) +
                "-" +
                Date.now().toString(36)
            );
        },
    }
}

</script>

<style scoped>
.main {
    height: 100vh;
    width: 100%;
}

.mainBox {
    width: 100%;

}

.part2 {
    margin: auto;
    height: 100vh;
}

.Bienvenue {
    height: 100vh;
}

.card {
    margin: auto !important;
    height: 50% !important;

}

.logoMiFi {
    display: none;
}

.logoMiFiPart1 {
    width: 250px !important;
    height: auto !important;
}

@media screen and (min-width: 570px) and (max-width: 800px) {
    .part1 {
        display: none !important;
    }

    .main {
        background-color: #fc690e !important;
    }

    .part2 {
        width: 100% !important;
        height: 100vh;
    }

    .Bienvenue {
        background-color: rgb(0, 0, 5);
        height: 80vh;
    }

    .card {
        margin: auto !important;
        height: 50% !important;

    }

    .logoMiFi {
        width: 150px !important;
        height: auto !important;
        display: block;
    }
}

@media screen and (min-width: 200px) and (max-width: 570px) {
    .part1 {
        display: none !important;
    }

    .main {
        background-color: #fc690e !important;
        width: 100%!important;
        overflow: hidden;
    }

    .part2 {
        width: 100% !important;
        margin: auto !important;
        height: 100vh;
       
    }

    .Bienvenue {
        background-color: rgb(0, 0, 5);
        margin: auto !important;
        height: 80vh;
        width: 100% !important;
    }

    .card {
        margin: auto !important;
        height: 50% !important;
        width: 80%!important;

    }

    .logoMiFi {
        width: 150px !important;
        height: auto !important;
        display: block;
    }
}
</style>