<template>
    <div id="app">
        <h1>vue-ssr-template 脚手架</h1>
        <Header></Header>
        <router-view></router-view>
    </div>
</template>
<script>
import Header from './components/Header'
export default {
    name: "App",
    components: {
        Header
    }
}
</script>
<style lang="scss">
    @import './assets/scss/base.scss';

    #app {
        padding: 20px;
    }
</style>