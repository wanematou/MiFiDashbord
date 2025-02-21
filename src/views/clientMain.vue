<template>
    <div class="navBar">
        <NavBar />
    </div>
    <div class="main-container">
        <SideBar />
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.navBar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px; /* Hauteur fixée pour la barre de navigation */
    z-index: 1000;
}

.main-container {
    margin-top: 60px!important;
    /* Décalage pour éviter la superposition avec navBar */
    
}
</style>

<script>
import NavBar from '../components/navbar.vue';
import SideBar from '../components/sideBar.vue';

export default {
    name: 'ClientMain',
    components: {
        SideBar, NavBar
    },
    data() {
        return {

        }
    }
}

</script>