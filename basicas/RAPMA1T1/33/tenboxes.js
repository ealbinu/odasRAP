
Vue.component('tenboxes', {
    props: ['howmany'],
    data () {
        return {
            cols: [],
            col1: false,
            evaluate: false,
            result: false,
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
        clicked (index) {
            if(this.result){
                return false
            }
            this.$set(this.cols, index, true)
        },
        verify () {
            let counter = 0
            this.result = true
            this.evaluate = true

            for(c in this.cols){
                if(this.cols[c]==true){ counter++ }
            }
            if(counter == this.howmany){
                s_ok.play()
                this.$emit('isright', true)
                this.result = true
            } else {
                s_error.play()
                this.result = false
            }
            this.$emit('input', this.result)
        },
        
    },
    mounted () {
        for(var i=0; i< 10; i++){
            this.$set(this.cols, i, false)
        }
    },
    template: `
        <div class="boxes">
            <div class="selectable" v-for="(i, index) in cols" @click="clicked(index)" :class="i ? 'on' : 'off'">
                <div class="box" v-for="(i, index) in 10"></div>
            </div>
            <div class="result" v-if="evaluate" :class="setclass + ' animate__animated animate__heartBeat'"></div>
        </div>
    `
})