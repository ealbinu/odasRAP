Vue.component('desplegar', {
    props: [
        'initclass', // clase inicial
        'options', // array de opciones que se duplicará
        'answer', // valor que se compara con el campo answer de options
        'answerNum', // valor ok en el array -
        'showOk', // Cuando OK todos los ERROR se ocultan
        'modalOptions', //Mostrar las opciones "flotando",
        'initialStatus', // initial state = 'open' ?
        'disableok', //deshabilita el emit ok,
        'anyOk', //cualquier respuesta es correcta
    ],
    data () {
        return {
            status: null,
            selected: null,
            desplegaropt: null,
            theanswer: null,
        }
    },
    template: `
        <div :class="[
            'desplegar',
            (initclass!=undefined?initclass:''),
            (status ? status : ''),
            (modalOptions!=undefined? 'modaloptions': ''),
            ]
            ">
            <div class="deployer" v-if="status==null" @click="status='open'"></div>
            <div v-if="optionsVisible" :class="['options', optionsClasses]">
                <template  v-for="(opt,index) in desplegaropt">
                    <div :class="'option ' + (selected == opt.theanswer ? 'ok':'') " :ref="'opt'+index" @click="clicked('opt'+index, opt.theanswer)" >
                        <slot name="option" :option="opt" />
                        <embed class="anim" v-if="selected == opt.theanswer " src="../../assets/aanim/Select.svg" />
                    </div>
                </template>
            </div>
            <div class="reseter" v-if="disableok != undefined && status == 'ok'" @click="reseter">
                x
            </div>
        </div>
    `,
    computed: {
        optionsClasses () {
            var showok = this.showOk!=undefined && this.status == 'ok' ? 'showok' : ''
            var modal = this.modalOptions!=undefined && this.status != 'ok' ? 'modaloptions' : ''
            return showok + ' ' + modal + ' ' + this.status
        },
        optionsVisible() {
            if(this.showOk != undefined) {
                if(this.status == 'open' || this.status == 'ok') {
                    return true
                } else {
                    return false
                }
            }
        }
    },
    methods: {
        reseter () {
            this.selected = null
            this.status = 'open'
            this.$emit('current', this.selected)
        },
        clicked(ref, optionAnswer){
            if(this.selected != null){
                return false
            }
            
            if(this.disableok != undefined){
                this.selected = optionAnswer
                this.status = 'ok'
                this.$emit('current', this.selected)
                return false
            }

            
            if(optionAnswer == this.theanswer || (this.anyOk!=undefined)) {
                // OK
                this.selected = optionAnswer
                EventBus.$emit('isok')
                this.$emit('wasclicked')
                this.setClassAnimation('ok', this.$refs[ref][0])
                s_ok.play()
                this.status = 'ok'
                var _this = this
                setTimeout(function (){
                    if(_this.$refs[ref][0]){
                        _this.$refs[ref][0].classList.add('invoker')
                    }
                }, 200)
            } else {
                //ERROR
                s_error.play()
                this.setClassAnimation('error', this.$refs[ref][0])
            }
        },
        setClassAnimation(name, obj) {
            var _this = this
            var theclass
            switch(name) {
                case 'start':
                    theclass = 'animate__rubberBand'
                    break
                case 'error':
                    theclass = 'animate__wobble'
                    break
                case 'ok':
                    theclass = 'animate__rubberBand'
                    break
            }
            obj.children[0].classList.add('animate__animated')
            obj.children[0].classList.add(theclass)
            setTimeout(function () {
                obj.children[0].classList.remove(theclass)
            }, 1000)
        },
        array2obj () {
            var array2obj = []
            for(op in this.options){
                var opt = this.options[op]
                if(typeof opt === 'object') {
                } else {
                    array2obj.push( {theanswer: opt, text: opt} )
                }
            }
            this.desplegaropt = array2obj.length ? array2obj : this.options
        }
    },
    mounted () {
        this.array2obj()
        if(this.initialStatus != undefined){
            this.status = this.initialStatus
        }
        if(this.answerNum != undefined){
            this.theanswer = this.options[this.answerNum]
        } else {
            this.theanswer = this.answer
        }
    }
})