<template>
    <div class=" main">
        <div class=" container mb-5 ">
            <div class="row">
                <h3 class="text-myBlue">Tableau de bord en ligne-MiFi</h3>
            </div>
            <div class="row">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item "><a href=""> <router-link to="/client/home">Acceuil</router-link>
                            </a></li>
                        <li class="breadcrumb-item">Templates de tickets</li>
                        <li class="breadcrumb-item active" aria-current="page">Ajouter un template</li>
                    </ol>
                </nav>
            </div>
        </div>
        <div class=" card align-items-center pt-5 pb-5 vh-auto main">
            <div class="container-fluid " id="formContainer">
                <div id="form_div row  ">
                    <form action class="col-sm-8 offset-2 bg-light card p-3 " id="monFormulaire"
                        @submit.prevent="submitForm()">
                        <div class="mb-3">
                            <label for="imageURl" class="form-label">Image</label>
                            <input type="file" @change="checkImage($event)" class="form-control" id="url" name="url">
                        </div>
                        <div class="mb-3">
                            <label for="code" class="form-label">Code</label>
                            <textarea class="form-control" v-model="codeOfTemplate" name="code" rows="10"
                                placeholder="Si votre template concerne les tickets de type user veuillez Ajouter {{user}} et {{code}} respectivement dans les balise o첫 vous souhaitez stocker le user et le password. Si votre template concerne les tickets de type code veuillez Ajouter {{code}}  dans les balises o첫 vous souhaiter stocker le code."></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="mt" class="form-label">Hauteur du ticket</label>
                            <input type="text" class="form-control h-12" name="mt" v-model="ticketHeight"
                                placeholder="100px">
                        </div>
                        <div class="mb-3">
                            <label for="mb" class="form-label">Hauteur entre les
                                tickets</label>
                            <input type="text" class="form-control" v-model="gapHeight" name="mb" placeholder="15px">
                        </div>

                        <div class="mb-4">
                            <label for="type" class="form-label">Type</label>
                            <select name="type" v-model="type" class="form-select h-4 form-select-sm mb-3"
                                aria-label=".form-select-lg example">
                                <option value="user">User</option>
                                <option value="code">Code</option>
                                <option value="qrcode">QrCode</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label for="type" class="form-label">Visibilité</label>
                            <select name="type" v-model="visibilite" class="form-select h-4 form-select-sm mb-3"
                                aria-label=".form-select-lg example">
                                <option value="public">Public</option>
                                <option value="private">Privée</option>
                            </select>
                        </div>
                        <button type="submit" class="btn bbtn btn-primary mb-2 w-25">
                            {{ isEdit ? "Modifier" : "Enregistrer" }}
                        </button>
                        <button type="button" @click="cancel()" v-if="isEdit" class="btn bbtn btn-primary w-25 "
                            id="cancelBtn">Annuler</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Globals from "../store/Globals.js";
import { useUserStore, useTemplateStore} from "../store/user.js";
import axios from "axios";
export default {
    data() {
        return {
            image: '',
            ticketHeight: '',
            gapHeight: '',
            codeOfTemplate: '',
            type: '',
            isEdit: false,
            userId:'',
            visibilite:'',
            editId:''

        }
    },
    mounted() {
        this.getData();
        this.getEditData();
    },
    methods: {
        getData() {
            const userStore = useUserStore();
            let user = userStore.user;
            this.userEmail = user.email;
            this.userName = user.name;
            this.userId = user.id;
            this.phone = user.phone;
        },
        getEditData(){
            const templateStore = useTemplateStore();
            let template=templateStore.template;
            if(template){
                this.isEdit=true;
                this.codeOfTemplate=template.code;
                this.type=template.type;
                this.visibilite=template.visibility;
                this.ticketHeight=template.ticketHeight;
                this.gapHeight=template.gapHeight;
                this.editId=template.id
            }
            templateStore.clearTemplate()
        },
        cancel(){
            const templateStore = useTemplateStore();
                this.isEdit=false;
                this.codeOfTemplate='';
                this.type='';
                this.visibilite='';
                this.ticketHeight='';
                this.gapHeight='';
                templateStore.clearTemplate()
        },
        checkImage(event) {
            this.image = event.target.files[0];
        },
        submitForm() {
            if (this.isEdit) {
                this.updateTemplate();
            } else {
                this.createTemplate();
            }
        },
        async createTemplate() {
            //verifie si une image est ajoutée
            if (!this.image) {
                this.$swal({
                    title: 'Erreur',
                    text: 'Veuillez Ajouter une image de votre template',
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

            //A partir de la taille standard d'une page(111px), avec la hauteur et l'espace entre les tickets calculer la marge du bas pour que les tickets ne soit pas coupés. la marge du haut est fixé sur Pdf endpoint que j'utilise pour le téléchargement des pdf.
            const ticketHeightForCalcul = parseInt(this.ticketHeight.replace(/[^\d.]/g, "")); // Conserve uniquement les chiffres et le point
            const gapHeightForCalcul = parseInt(this.gapHeight.replace(/[^\d.]/g, ""));
            const marginBottom = (1111 % (ticketHeightForCalcul + gapHeightForCalcul)) + "px";

            // Vérifie si {{code}} {{user}} sont présent, e vue de stocker les informations dedans dans le php.
            const hasUser = /{{user}}/.test(this.codeOfTemplate);
            const hasCode = /{{code}}/.test(this.codeOfTemplate);
            if (this.type == "user" && !hasUser && !hasCode) {
                this.$swal({
                    title: 'Erreur',
                    text: 'Dans le champ code,veuillez ajouter le {{user}} et {{code}} dans les balise où vous souhaitez afficher le user et le password !',
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
            if (this.type == "code" && !hasCode) {
                this.$swal({
                    title: 'Erreur',
                    text: 'Dans le champ code,veuillez ajouter  {{code}} dans la balise où vous souhaitez afficher le code !',
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
            if (this.type == "code" && hasUser) {
                this.$swal({
                    title: 'Erreur',
                    text: 'votre template de type code ne doit pas contenir de donnée {{user}} !',
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
            const data = new FormData();
            data.append("image", this.image);
            data.append("userId", this.userId);
            data.append("code", this.codeOfTemplate);
            data.append("mb", marginBottom);
            data.append("mt", "0px");
            data.append("ml", "2px");
            data.append("mr", "2px");
            data.append("th", this.ticketHeight);
            data.append("gh", this.gapHeight);
            data.append("type", this.type);
            data.append("visibilite", this.visibilite);
            try {
                const res = await axios(
                    {
                        method: "POST",
                        url: "https://templates.mifi.bf/api/index.php?req=store-templates",
                        data: data
                    }
                );
                console.log(res)
                this.codeOfTemplate='';
                this.ticketHeight='';
                this.gapHeight='';
                this.type='';
                this.$swal({
                    title: 'MiFi',
                    text: 'Votre template à été ajouté avec succès',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                    background: '#f5f5f5',
                    customClass: {
                        popup: 'my-custom-popup',
                        title: 'my-small-tittlepayment',
                    }
                });

            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
                this.$swal({
                    title: 'Erreur',
                    text: 'Veuillez verifier votre accès à internet',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                    background: '#f5f5f5',
                    customClass: {
                        popup: 'my-custom-popup',
                        title: 'my-small-tittle',
                    }
                });
            }

        },
        async updateTemplate() {
            //A partir de la taille standard d'une page(111px), avec la hauteur et l'espace entre les tickets calculer la marge du bas pour que les tickets ne soit pas coupés. la marge du haut est fixé sur Pdf endpoint que j'utilise pour le téléchargement des pdf.
            const ticketHeightForCalcul = parseInt(this.ticketHeight.replace(/[^\d.]/g, "")); // Conserve uniquement les chiffres et le point
            const gapHeightForCalcul = parseInt(this.gapHeight.replace(/[^\d.]/g, ""));
            const marginBottom = (1111 % (ticketHeightForCalcul + gapHeightForCalcul)) + "px";

            // Vérifie si {{code}} {{user}} sont présent, e vue de stocker les informations dedans dans le php.
            const hasUser = /{{user}}/.test(this.codeOfTemplate);
            const hasCode = /{{code}}/.test(this.codeOfTemplate);
            if (this.type == "user" && !hasUser && !hasCode) {
                this.$swal({
                    title: 'Erreur',
                    text: 'Dans le champ code,veuillez ajouter le {{user}} et {{code}} dans les balise où vous souhaitez afficher le user et le password !',
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
            if (this.type == "code" && !hasCode) {
                this.$swal({
                    title: 'Erreur',
                    text: 'Dans le champ code,veuillez ajouter  {{code}} dans la balise où vous souhaitez afficher le code !',
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
            if (this.type == "code" && hasUser) {
                this.$swal({
                    title: 'Erreur',
                    text: 'votre template de type code ne doit pas contenir de donnée {{user}} !',
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
            const data = new FormData();
            data.append("code", this.codeOfTemplate);
            data.append("mb", marginBottom);
            data.append("mt", "0px");
            data.append("ml", "2px");
            data.append("mr", "2px");
            data.append("th", this.ticketHeight);
            data.append("gh", this.gapHeight);
            data.append("type", this.type);
            data.append("visibilite", this.visibilite);
            data.append("id", this.editId);
            data.append("image",this.image);
           console.log(marginBottom,this.ticketHeight,this.gapHeight,
           this.type,this.visibilite,this.editId,this.image)
            try {
                const res = await axios(
                    {
                        method: "POST",
                        url: "https://templates.mifi.bf/api/index.php?req=template-update",
                        data:data
                    }
                );
                console.log(res)
                this.$router.push({path:"/client/templateList"});
            } catch (error) {
                // Gestion des erreurs
                console.error("Erreur :", error);
            }

        },
    }
}
</script>
<style></style>