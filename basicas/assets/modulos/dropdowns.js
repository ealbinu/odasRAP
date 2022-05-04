Vue.component('dropdowns', {
    props: ['value', 'options', 'alt'],
    data() {
        return {
            status: "",
            evaluate: false,
            result: false,
            answers: [],
            uuid: 0,
            altopen: [],
            firstClick: false
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

            this.result = true
            

            for(var i in this.options){
                let op = this.options[i]
                if(op.options){
                    if(op.answer == this.answers[i]){
                        console.log('OKAY', op.answer, this.answers[i])
                    } else {
                        console.log('ERRORW', op.answer, this.answers[i])
                        this.result = false
                    }
                }
            }

            //FINISHI
            if(this.result){
                this.$emit('isright', true)
                this.result = true
            }
        },
        altclick (in1, in2, opt){
            this.$set(this.answers,in1,opt)
            this.altopen[in1] = false
        },
        arrowclick (altopen, index, bol) {
            this.$set(altopen,index,bol)
            this.firstClick = true
        }
    },
    mounted () {
        this.$emit('input', "")

        this.uuid = Math.random().toString(36).substring(10)

        for( var o in this.options){
            this.answers[o] = ''
            this.altopen[o] = false
        }

    },
    template: `
        <div class="dropdowns" :class="setclass">
            <template v-for="(i, index) in options">
                <div v-if="i.text" v-html="i.text"></div>
                <template v-if="alt!=undefined">
                    <div>
                        <div class="alt-opt">{{answers[index]}}</div>
                        <div :class="[
                            'alt-arrow',
                            (!firstClick ? 'animate__animated animate__heartBeat animate__infinite' : '')
                            ]" @click="arrowclick(altopen,index,true)" v-if="!altopen[index] && !evaluate"></div>
                        <div class="alt-options" v-if="altopen[index]">
                            <div class="alt-option" v-for="(opt, index2) in i.options" @click="altclick(index, index2, opt)">
                                {{opt}}
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <select :ref="uuid" :id="uuid" v-if="i.options" v-model="answers[index]" :disabled="evaluate">
                        <option v-if="i.placeholder" selected>{{i.placeholder}}</option>
                        <option v-for="(op, opindex) in i.options" v-html="op"></option>
                    </select>
                </template>
                
                <div class="result" v-if="evaluate" :class="setclass + ' animate__animated animate__heartBeat'"></div>
            </template>
        </div>
    `
})


/*

<dropdowns v-model="r[0]" :ref="refCount()"  @isright="right++" :options="[
    {options: [0,1, 2, 3, 4, 5, 6, 7,8,9, 10, 11, 12], answer: 4, placeholder: '0'},
    {text: ' : '},
    {options: ['00',15, 20, 25, 30, 35, 40, 45, 50, 55], answer: 15, placeholder: '00'}
]"></dropdowns>
*/