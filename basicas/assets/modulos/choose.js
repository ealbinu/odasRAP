Vue.component('choose', {
    props: ['value', 'text', 'options', 'answer', 'num', 'initclass', 'answerNum', 'autoSelectNum'],
    data() {
        return {
            status: null,
            evaluate: false,
            result: false,
            correctAnswer: '',
            extraCorrectAnswer: ''
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
        slugy(Text)
        {
            return Text
                .toLowerCase()
                .replace(/ /g,'_')
                .replace(/[^\w-]+/g,'')
                ;
        },
        clicked (op, playsound) {
            if(this.evaluate) {
                return false
            }
            this.status = op
            this.$emit('input', this.status)
            if(this.status && playsound) {
                s_ok.play()
            }
        },
        verify () { 
            this.evaluate = true

            /* check double */
            if(Array.isArray(this.answerNum)){
                if(this.status == this.correctAnswer || this.status == this.extraCorrectAnswer) {
                    this.$emit('isright', true)
                    this.result = true
                }
                return false
            }
            /* normal flux */
            if(this.status == this.correctAnswer) {
                this.$emit('isright', true)
                this.result = true
            }
        }
    },
    mounted () {
        this.$emit('input', null)
        if(this.answerNum != undefined){
            if(Array.isArray(this.answerNum)){
                this.correctAnswer = this.options[this.answerNum[0]]
                this.extraCorrectAnswer = this.options[this.answerNum[1]]
                return false
            }
            /* normal flux */
            this.correctAnswer = this.options[this.answerNum]
        } else {
            this.correctAnswer = this.answer
        }
        if(this.autoSelectNum!=undefined){
            this.clicked(this.options[this.autoSelectNum], false)
        }
    },
    //"choose" :class="setclass + ' ' + (initclass?initclass:' ')"
    template: `
        <div :class="['choose',
            (initclass?initclass:''),
            (status?slugy(status):'')
        ]">
            <div class="result" v-if="evaluate" :class="setclass + ' animate__animated animate__heartBeat'"></div>
            <div class="label"><strong v-if="num">{{num}}</strong> <span v-html="text"></span></div>
            <div class="options">
                <template v-for="op in options">  
                    <div @click="clicked(op, true)" v-if="status!=op" v-html="op"></div>
                    <div @click="clicked(op, true)" v-if="status==op" class="active animate__animated animate__heartBeat" v-html="op"></div>
                </template>
            </div>
        </div>
    `
})

/*
choose(v-model="r[0]" :ref="refCount()" num="1." text="Texto" :options="['rojo', 'amarillo', 'azul']" @isright="right++" answer="amarillo")
choose(v-model="r[0]" :ref="refCount()" num="1." text="Texto" :options="['']" @isright="right++" :answer-num="0")

<choose v-model="r[4]" :ref="refCount()" num="1." text="El vestido de la niña es:" :options="['rojo', 'amarillo', 'azul']" @isright="right++" answer="amarillo"></choose>
*/