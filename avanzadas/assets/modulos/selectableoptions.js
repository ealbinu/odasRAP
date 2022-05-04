Vue.component('selectableoptions', {
    props: ['value', 'text', 'answer', 'id', 'watch', 'options', 'customclass'],
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
        clicked (val) {
            if(this.evaluate) {
                return false
            }
            this.status = val
            //this.status = !this.status
            this.$emit('input', this.status)

            this.$emit('clicked', this.status)
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
    <div :class="'row justify-content-center align-items-center selectableoptions '+setclass">
        <div :class="customclass" v-for="option in options" @click="clicked(option.val)">
            <slot name="option" :option="option" />
            <div :class="status == option.val ? 'circledactive' : ''"></div>
        </div>
        <div class="result" v-if="evaluate" :class="setclass + ' animate__animated animate__heartBeat'"></div>
    </div>
    `
})


/*
<selectableoptions v-model="r[0]" ref="q0" @isright="right++" answer="yes" :options="[{val:'yes', img:'aimg/i2.png'},  {val:'no', img:'aimg/i2.png'}]" customclass="col-sm-6">
    <template v-slot:option="{option}">
        <img :src="option.img" class="img-fluid">
    </template>
</selectableoptions>
*/