Vue.component('finalize', {
    props: ['resultado', 'right', 'total', 'fieldsText', 'ifrightsis'],
    data() {
        return {
            ftext: 'preguntas',
            rights: 0,
            totalquestions: 0
        }
    },
    computed: {
        finalRights() {
            let rights = this.right
            if(this.ifrightsis != undefined){
                let sep = this.ifrightsis.split('=')
                rights = (rights == sep[0]) ? sep[1] : rights
                this.totalquestions = sep[1]
            }
            return rights
        }
    },
    watch: {
        total () {
            if(this.ifrightsis == undefined){
                this.totalquestions = this.total
            }
        }
    },
    methods: {
        
    },
    mounted () {
        if(this.fieldsText != undefined){
            this.ftext = this.fieldsText
        }
        this.totalquestions = this.total
    },
    template: `
        <div class="finalize">
            <div class="d-flex justify-content-center mt-5" v-if="!resultado">
                <button class="finalizar" @click="$emit('evaluate')">Finalizar</button>
            </div>

            <div class="d-flex justify-content-center mt-5 resultado" v-if="resultado">
                <h3>Resultado</h3>
                <div><strong>{{finalRights}} correctas </strong> de {{totalquestions}} {{ftext}}</div>
                <button class="finalizar" @click="$emit('reset')">Volver a intentar</button>
            </div>
        
        </div>
    `
})