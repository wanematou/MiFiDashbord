<template>
    <div class="main" >
        <NavBar />
        <SideBar />
       
    </div>
</template>

<style>
    .main{
        display: flex;
        flex-direction: column;
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