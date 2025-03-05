<template>
    <!-- <div class="navBar">
        <NavBar />
    </div> -->
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

/* .navBar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px; 
    z-index: 1000;
} */


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