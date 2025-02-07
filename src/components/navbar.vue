<template>
    <nav class="navbar navbar-light">
        <div class="container-fluid">
            <a class="navbar-brand text-myBlue "><router-link to="/client/home" class="text-decoration-none">Tableau de bord</router-link> 
                 </a>
            <form class="d-flex">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                <img src="../assets/images/logo.png" alt="" width="50" >
            </form>
        </div>
    </nav>
</template>

<style scoped>
    .navbar{
        background-color: rgb(228, 229, 243) !important;
        z-index: 10;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15)!important;
    }
</style>

<script>

</script>