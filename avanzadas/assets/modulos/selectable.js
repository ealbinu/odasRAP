Vue.component('selectable', {
    props: ['value', 'text', 'answer', 'id', 'watch'],
    data() {
        return {
            status: "",
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
    watch: {
        value () {
            if(this.watch){
                this.status = this.value
            }
        }
    },
    methods: {
        clicked () {
            if(this.evaluate) {
                return false
            }
            this.status = this.id
            //this.status = !this.status
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
        this.$emit('input', "")
    },
    template: `
        <div class="selectable" :class="setclass"  @click="clicked">
            <div :class="this.status == this.id ? 'circledactive' : ''"></div>
            <slot></slot>
            <div class="result" v-if="evaluate" :class="setclass + ' animate__animated animate__heartBeat'"></div>
        </div>
    `
})