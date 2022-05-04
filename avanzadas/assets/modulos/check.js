Vue.component('check', {
    props: ['value', 'text', 'answer', 'num'],
    data() {
        return {
            status: false,
            evaluate: false,
            result: false
        }
    },
    computed:{
        setclass () {
            if(this.evaluate) {
                return this.result ? 'isright':'iswrong'
            } else {
                return ''
            }
        }
    },
    methods: {
        clicked () {
            if(this.evaluate) {
                return false
            }
            this.status = !this.status
            this.$emit('input', this.status)
            if(this.status) {
                s_ok.play()
            } else {
                s_error.play()
            }
        },
        verify () { 
            this.evaluate = true
            if(this.status == this.answer) {
                this.$emit('isright', true)
                this.result = true
            }
        }
    },
    mounted () {
        this.$emit('input', false)
    },
    template: `
        <div class="check" :class="setclass">
        <div class="result" v-if="evaluate" :class="setclass + ' animate__animated animate__heartBeat'"></div>
        <div class="label"><strong v-if="num">{{num}}</strong></div>
            <div class="checkbox" @click="clicked">
                <img v-if="status" src="../../assets/aimg/check.svg" class="animate__animated animate__heartBeat">
            </div>
            <div class="label" @click="clicked">{{text}}</div>
        </div>
    `
})