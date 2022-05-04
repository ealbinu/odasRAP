Vue.component('desplegar', {
    props: [
        'initclass', //clase inicial
    ],
    data () {
        return {
            status: null
        }
    },
    template: `
        <div :class="'desplegar ' + (initclass!=undefined?initclass:'') + ' ' + (status ? status : '')">
            Desp
        </div>
    `,
    methods: {
        clickok () {
            
        }
    }
})