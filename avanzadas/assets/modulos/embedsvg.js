Vue.component('embedsvg', {
    props: ['src', 'initclass'],
    data () {
        return {
            body: null
        }
    },
    template: `
        <div :class="[
            'embedsvg',
            (initclass!=undefined?initclass:'')
        ]" ref="embed" v-html="body"></div>
    `,
    methods: {
        init(){
            var _this = this
            var req = new XMLHttpRequest()
            req.open('GET', this.src, true)
            req.onload = function () {
                if(req.status >= 200) {
                    _this.body = req.response
                    _this.$emit('loaded')
                }
            }
            req.send()
        }
    },
    mounted () {
        this.init()
    }
})
