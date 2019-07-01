let config = {
    http: 'http://localhost:3001',

    // html 模板配置
    template_context: {
        title: 'vue-ssr-template',
        meta: `
            <link rel="stylesheet" href="/css/bootstrap.min.css">
            <script src="/js/jquery.min.js"></script>
            <script src="/js/bootstrap.min.js"></script>
        `
    }
}

module.exports = config
