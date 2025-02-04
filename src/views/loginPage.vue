<template>
    <div class="main align-items-center">
        <h3>Template Design Login Form</h3>
        <h5>MiFi</h5>
        <div class="formBox">
            <form action class="loginform" @submit.prevent="userLogin()">
                <div class="mb-5">
                    <label for="exampleFormControlInput1" class="form-label">Telephone</label>
                    <input type="text" class="form-control tel " v-model="phone" id="phone" placeholder="">
                </div>
                <div class="mb-5">
                    <label for="exampleFormControlInput1" class="form-label">Mot de passe</label>
                    <input type="password" class="form-control password" v-model="password" id="password"
                        placeholder="">
                </div>
                <div>
                    <button type="submit" class="btn bbtn btn-primary  " id="sendBtn">Connexion</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Globals from "../store/Globals.js";
import axios from "axios";
import {useUserStore} from "../store/user.js";
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
                        return;
                    } else {
                        let user= r.data.data;
                        const userStore = useUserStore();
                        userStore.setUser(user);
                        this.$router.push({ path: "/client/profils" });
                    }
                })
                .catch((error) => {
                    if (error.code == 'ERR_NETWORK') {
                        this.$swal.fire.fire({
                            title: "Erreur",
                            text: "Veuillez vérifier votre accès à internet",
                            icon: "error"
                        });
                    }
                    console.log(error);
                });

        },
    }
}

</script>

<style scoped >
body {
    font-family: Helvetica;
    background: #eee;
    -webkit-font-smoothing: antialiased;
}

.main {
    background-color: #eee;
    min-height: 100vh;
    width: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.formBox {
    width: 35% !important;
    background-color: white;
    border-radius: 7px;
    padding: 50px;
}

h5 {
    color: #f37907 !important;
    margin-bottom: 20px !important;
}
</style>