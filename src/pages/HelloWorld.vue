<template>
    <div class="helloworld">
        <h1>HelloWorld</h1>
        <img src="@/assets/img/img1.jpg" />
    </div>
</template>
<script>
export default {
    name: "HelloWorld",
    title () {
        return this.$route.meta.title
    }
}
</script>
<style lang="scss" scoped>
    .helloworld {
        img {
            margin-top: 10px;
        }
    }
</style>