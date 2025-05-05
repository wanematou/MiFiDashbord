<template>
    <div class="login-container">
      <div class="login-wrapper">
        <!-- Partie gauche avec le GIF et le logo -->
        <div class="login-branding">
          <div class="animation-container">
            <img src="../assets/images/anim-1.gif" alt="Animation" class="brand-animation">
          </div>
          <img src="../assets/images/mifi.png" alt="MiFi Logo" class="brand-logo">
        </div>
  
        <!-- Partie droite avec le formulaire -->
        <div class="login-form-container">
          <img src="../assets/images/mifi.png" alt="MiFi Logo" class="mobile-logo">
          
          <div class="login-card">
            <div class="login-header">
              <h2>Bienvenue !</h2>
              <p>Connectez-vous à votre tableau de bord</p>
            </div>
            
            <form class="login-form" @submit.prevent="userLogin()">
              <div class="form-group">
                <label for="phone">Téléphone</label>
                <input 
                  type="text" 
                  id="phone" 
                  v-model="phone" 
                  class="form-control"
                  placeholder="Votre numéro de téléphone"
                >
              </div>
              
              <div class="form-group">
                <label for="password">Mot de passe</label>
                <input 
                  type="password" 
                  id="password" 
                  v-model="password" 
                  class="form-control"
                  placeholder="Votre mot de passe"
                >
              </div>
              
              <button type="submit" class="login-button">Connexion</button>
            </form>
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
  .login-container {
    width: 100%;
    min-height: 100vh;
    background-color: #fc690e;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  
  .login-wrapper {
    width: 100%;
    max-width: 1200px;
    display: flex;
    background-color: #fff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .login-branding {
    flex: 1;
    background-color: #fc690e;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .animation-container {
    margin-bottom: 60px;
  }
  
  .brand-animation {
    width: 150px;
    height: auto;
  }
  
  .brand-logo {
    width: 250px;
    height: auto;
    margin-top: 40px;
  }
  
  .login-form-container {
    flex: 1;
    padding: 60px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .mobile-logo {
    display: none;
    width: 150px;
    height: auto;
    margin: 0 auto 30px;
  }
  
  .login-card {
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
    background: #fff;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .login-header h2 {
    color: #333;
    font-size: 28px;
    margin-bottom: 10px;
  }
  
  .login-header p {
    color: #666;
    font-size: 16px;
  }
  
  .form-group {
    margin-bottom: 25px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
  }
  
  .form-control {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s;
  }
  
  .form-control:focus {
    border-color: #fc690e;
    outline: none;
  }
  
  .login-button {
    width: 100%;
    padding: 14px;
    background-color: #fc690e;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .login-button:hover {
    background-color: #e55d0c;
  }
  
  /* Responsive Design */
  @media (max-width: 992px) {
    .login-wrapper {
      flex-direction: column;
    }
    
    .login-branding {
      padding: 30px;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
    }
    
    .animation-container {
      margin-bottom: 0;
    }
    
    .brand-logo {
      margin-top: 0;
      width: 200px;
    }
  }
  
  @media (max-width: 768px) {
    .login-branding {
      display: none;
    }
    
    .mobile-logo {
      display: block;
    }
    
    .login-form-container {
      padding: 40px 20px;
    }
    
    .login-card {
      padding: 25px;
    box-shadow: none;
    }
  }
  
  @media (max-width: 480px) {
    .login-container {
      padding: 15px;
    }
    
    .login-wrapper {
      border-radius: 10px;
    }
    
    .login-form-container {
        margin: auto;
      padding: 30px 15px;
    }
    
    .login-header h2 {
      font-size: 24px;
    }
  }
  </style>