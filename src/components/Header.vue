<template>
    <div class="header">
        <span class="link_span" v-for="(item, index) in link_list" :key="index">
            <router-link :to="item.to">{{item.text}}</router-link>
        </span>
    </div>
</template>
<script>
export default {
    name: "Header",
    data () {
        return {
            link_list: [
                {
                    to: '/',
                    text: '首页'
                },
                {
                    to: '/helloworld',
                    text: '欢迎'
                }
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
    .header {
        .link_span {
            margin: 20px 10px 20px;
            display: inline-block;
        }
    }
</style>