Vue.component('inputbox', {
    props: ['value', 'text', 'answer', 'num',
        'type',
        'placeh',
        'textarea',
        'caseSensitive',
        'example', 
        'min', 'max', //evalua el valor entre min y max
        'hidetilok', // oculto hasta que se evalua
        'initclass', //extraclass
        'placehshowok'
    ],
    data() {
        return {
            status: "",
            evaluate: false,
            result: false
        }
    },
    watch: {
        value (nval){
            this.status = nval
        }
    },
    computed:{
        setclass () {
            if(this.evaluate) {
                return this.result ? 'isright':'iswrong'
            } else {
                return ''
            }
        },
        hideorshow (){
            if(this.hidetilok!=undefined){
                if(!this.evaluate){
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
        }
    },
    methods: {
        inputed () {
            if(this.evaluate) {
                return false
            }
            this.$emit('input', this.status)
            this.$emit('changed', this.status)
            s_ok.play()
            /*
            if(this.status) {
                s_ok.play()
            } else {
                s_error.play()
            }
            */
        },
        cleanLowText (txt) {
            if(txt.length>3){
                txt = txt.replace(/\.$/, "")
            }
            return txt.toLowerCase().trim()
        },
        verify () { 
            this.evaluate = true
            var theanswer = this.answer
            let userAnswer = this.status
            


            if(this.type == 'text' && this.caseSensitive==undefined){


                userAnswer = this.cleanLowText(userAnswer)
                
                /* IS ARRAY? */
                if(Array.isArray(theanswer)){
                    for(u in theanswer){
                        theanswer[u] = this.cleanLowText(theanswer[u])
                    }
                } else {
                    //Simple text
                    theanswer = this.cleanLowText(theanswer)
                }
/*
                userAnswer = userAnswer.toLowerCase().trim()
                if(userAnswer.length>3){
                    userAnswer = userAnswer.replace(/\.$/, "")
                }
*/

            }
            /* FINAL RESULT */
            //Verificar Array
            if(Array.isArray(theanswer)){
                for(u in theanswer){
                    if(theanswer[u]==userAnswer){
                        this.$emit('isright', true)
                        this.result = true
                    }
                }
            } else {
                if(this.min!=undefined && this.max!=undefined){
                    // Evaluación entre min y max
                    if(userAnswer > this.min && userAnswer < this.max){
                        this.$emit('isright', true)
                        this.result = true
                    }
                } else {
                    // Evaluacion directa numérica
                    if(userAnswer == theanswer) {
                        this.$emit('isright', true)
                        this.result = true
                    }
                    
                }
                
            }
        }
    },
    mounted () {
        this.$emit('input', "")
    },
    template: `
        <div :class="[
                'inputbox',
                setclass,
                initclass,
            ]" v-show="hideorshow" :data="answer">
            <slot name="before"></slot>
            <template v-if="example!=undefined">
                <div class="inp_example"><numbers>{{answer}}</numbers></div> 
            </template>
            <template v-else>
                <input v-model="status" :placeholder="placehshowok ? answer : placeh" :type="type" @input="inputed" :disabled="evaluate" v-if="textarea==undefined" />
                <textarea v-model="status" :placeholder="placehshowok ? answer : placeh" @input="inputed" :disabled="evaluate" v-if="textarea!=undefined"></textarea>
            </template>
            <slot name="after"></slot>
            <div class="result" v-if="evaluate" :class="setclass + ' animate__animated animate__heartBeat'"></div>
        </div>
    `
})


/*
inputbox(v-model="r[0]" :ref="refCount()" @isright="right++" answer="v" type="text" placeh="-")

<inputbox v-model="r[0]" :ref="refCount()" @isright="right++" answer="txt" type="text" placeh="-"></inputbox>
<inputbox v-model="r[0]" :ref="refCount()" @isright="right++" :answer="90" type="number" placeh="#"></inputbox>

<inputbox v-model="r[index]" :ref="refCount()" @isright="right++" :answer="90" type="number" placeh="#"></inputbox>
*/