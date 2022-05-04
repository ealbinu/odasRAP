Vue.component('check', {
    props: ['value', 'text', 'answer', 'num', 'setMark', 'initclass', 'allok', 'ex'],
    data() {
        return {
            status: false,
            evaluate: false,
            result: false,
            mark: '../../assets/aimg/check.svg'
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

            if(this.allok != undefined || this.allok){
                this.$emit('isright', true)
                this.result = true
                return false
            }

            if(this.status == this.answer) {
                this.$emit('isright', true)
                this.result = true
            }
        }
    },
    mounted () {
        this.$emit('input', false)
        if(this.setMark!=undefined){
            this.mark = this.setMark
        }
        if(this.ex!=undefined){
            this.mark = '../../assets/aimg/markex.svg'
        }
    },
    template: `
        <div class="check" :class="setclass + ' ' + (status ? 'activecheck':'') + ' ' + (initclass?initclass:'')">
        <div class="result" v-if="evaluate" :class="setclass + ' animate__animated animate__heartBeat'"></div>
        <div class="label" @click="clicked"><strong v-if="num">{{num}}</strong> <slot></slot></div>
            <div class="checkbox" @click="clicked">
                <img v-if="status" :src="mark" class="animate__animated animate__heartBeat">
            </div>
            <div class="label checktext" @click="clicked" v-html="text"></div>
        </div>
    `
})

/*
check(v-model="r[index]" :ref="refCount()"  @isright="right++" :answer="i.val" :text="i.text")
 <check v-model="r[4]" ref="q4" num="1." @isright="right++" :answer="false" text="Figurillas de arcilla" />
 <check v-model="r[index]" :ref="'q'+index"  @isright="right++" :answer="i.val" :text="i.text" />
*/