<template>
    <div class="home">
        <h1>Home</h1>
        <div>模拟请求：{{items}}</div>
    </div>
</template>
<script>
export default {
    name: "Home",
    asyncData ({ store, route }) {
        // 触发 action 后，会返回 Promise
        return store.dispatch('getItem')
    },
    computed: {
        items () {
            return this.$store.state.items
        }
    }
}
</script>
<style lang="scss" scoped>
    .home {
        div {
            font-weight: bold;
            margin-top: 10px;
        }
    }
</style>