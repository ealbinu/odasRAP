Vue.component('inputbox', {
    props: ['value', 'text', 'answer', 'num', 'type', 'placeh'],
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
    methods: {
        inputed () {
            if(this.evaluate) {
                return false
            }
            this.$emit('input', this.status)
            if(this.status) {
                s_ok.play()
            } else {
                s_error.play()
            }
        },
        verify () { 
            this.evaluate = true
            if(this.type == 'text'){
                this.status = this.status.toLowerCase()
            }
            if(this.status == this.answer.replace(/\.$/, "")) {
                this.$emit('isright', true)
                this.result = true
            }
        }
    },
    mounted () {
        this.$emit('input', "")
    },
    template: `
        <div class="inputbox" :class="setclass">
            <slot name="before"></slot>
            <input v-model="status" :placeholder="placeh" :type="type" @input="inputed" :disabled="evaluate" />
            <slot name="after"></slot>
            <div class="result" v-if="evaluate" :class="setclass + ' animate__animated animate__heartBeat'"></div>
        </div>
    `
})


/*
<inputbox v-model="r[29]" ref="q29" @isright="right++" :answer="90" type="number" placeh="#"></inputbox>
*/