Vue.component('clickable', {
    props: [
        'value',// v-model | tracking de clickables en la escena
        'hoverSound', //Sonido al pasar envima
        'clickSound', // sonido al dar click
        'clickErrorSound', // sonido al dar click si es ERROR
        'clickOkSound', // sonido al dar click si es OK
        'oksound', // sonido al dar click si es error
        'errorsound', // sonido al dar click si es ok
        'particleColor', // color de particulas
        'initclass', // class de inicio
        'isok', // es ok?,
        'blockIfError', // Si es error no permitirá que sea seleccionado,
        'simpleOk', //No checa, sólo manda isOK,
        'extValidation', // Se llama la función de evaluación desde afuera
        'noAnimations', //Deshabilita las animaciones
        'ignoreAlreadyOk', // Ignorar "already ok" y poder dar click,
        'noErrorSound', // No reproducir sonido de error
        'example', // seleccionado sin funcionalidad
    ],
    data() {
        return {
            status: false,
            alreadyOk: false,
            validateok: false,
        }
    },
    template: `
        <div ref="clickable" :class="'clickable ' + (initclass!=undefined?initclass:'') +' '+ (status?'clicked':'')  + ' ' + (alreadyOk?'alreadyok':'') " @click="clicked" @mouseover="hoverFn">
            <slot></slot>
            <embed class="anim" v-if="status" src="../../assets/aanim/Select.svg" />
        </div>
    `,

    methods: {
        reset() {  
            this.status = false
        },
        hoverFn () {

            if(this.hoverSound!=undefined){
                var allmuted = true
                for(var hw in Howler._howls){
                    if(Howler._howls[hw].playing() && Howler._howls[hw]._state == 'loaded' ){
                        allmuted = false
                    }
                }
                if(allmuted){
                    var sound = new Howl({ src: [this.hoverSound], autoplay:true })
                }
            }
        },
        clicked (e) {
            if(this.example != undefined){ return false }
            if(this.alreadyOk && this.ignoreAlreadyOk == undefined) {
                return false
            }
            if(this.ignoreAlreadyOk != undefined){
                this.alreadyOk = false
            }
            var click = this.$refs.clickable
            
            this.status = !this.status

            this.clicksoundsFn()
            if(this.extValidation==undefined){
                this.isOkOrError(e)
            } else {

                if(this.isok == this.status){
                    this.$emit('itsok')
                    this.validateok = true
                } else {
                    this.$emit('itserror')
                }
            }
            s_select.play()
        },
        clicksoundsFn () {
            if(this.clickSound!=undefined){
                var sound = new Howl({ src: [this.clickSound], autoplay:true })
            }
            var okerrorsound = null
            if(this.clickErrorSound!=undefined && this.isok != this.status){
                okerrorsound = new Howl({ src: [this.clickErrorSound]})
            }
            else if(this.clickOkSound!=undefined && this.isok == this.status){
                okerrorsound = new Howl({ src: [this.clickOkSound]})
            }
            setTimeout(function () {
                if(okerrorsound){
                    okerrorsound.play()
                }
            }, 600)

        },
        isOkOrError (e) {
            var _this = this
            if(this.alreadyOk && this.ignoreAlreadyOk == undefined) {
                return false
            }
            

        if(_this.isok == _this.status){
            //OK
            
            //EventBus.$emit('clicked', 'ok')
            setTimeout(function () {
            
                if(_this.simpleOk != undefined){
                    setTimeout(function () {
                        EventBus.$emit('isok')
                        _this.$emit('isok')
                    },400)
                } else {
                    _this.$emit('input', true)
                }

                if(_this.extValidation == undefined){
                    _this.$emit('wasclicked')

                    
                } else {
                    EventBus.$emit('isok')

                }
                
                

                _this.setClassAnimation('ok', _this.$refs.clickable)
                if(e){app.particleAnimation({clientX: e.clientX, clientY: e.clientY}, 100, null, null, _this.particleColor)}
                setTimeout(function(){
                    if(!s_ok.playing()){
                        s_ok.play()
                    }
                },100)
            }, 400)
            _this.alreadyOk = true
                
            } else {
                //ERROR
                
                if(this.noErrorSound == undefined){
                    if(!s_error.playing()){
                        s_error.play()
                    }
                }

                if(_this.extValidation == undefined){
                    _this.$emit('wasclickederror')
                    
                }


                this.setClassAnimation('error', this.$refs.clickable)
                this.blockIfErrorFn()
                this.$emit('input', false)
                //EventBus.$emit('clicked', 'error')
            }
        },
        validate(){
            if(this.isok == this.status){
                this.$emit('isok')
                return true
            } else {
                this.status = false
                return false
            }
        },
        blockIfErrorFn(){
            if(!this.isok && this.extValidation == undefined) {
                this.status = false
                return false
            }
        },
        setClassAnimation(nome, obj) {
            var _this = this
            if(this.noAnimations){
                return false
            }
            var theclass
            switch(nome) {
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
            obj.children[0].classList.add(theclass)
            setTimeout(function () {
                obj.children[0].classList.remove(theclass)
            }, 1000)
        },
        dropzoneStatusClass(status, dropzone){
            var _this = this
            if(status == 'ok' && _this.dropzoneOkClass!=undefined) {
                dropzone.classList.add(_this.dropzoneOkClass)
                if(dropzone.classList.contains(_this.dropzoneErrorClass)){ dropzone.classList.remove(_this.dropzoneErrorClass) }
            }
            if(status == 'error' && _this.dropzoneErrorClass!=undefined) {
                dropzone.classList.add(_this.dropzoneErrorClass)
                if(dropzone.classList.contains(_this.dropzoneOkClass)){ dropzone.classList.remove(_this.dropzoneOkClass) }

            }
        }
    },
    mounted () {
        if(this.isok == this.status){this.$emit('input', true)}else{this.$emit('input', false)}
        this.$refs.clickable.children[0].classList.add('animate__animated')

        if(this.example != undefined && this.isok){
            this.status = true
        }
    }
})

/*
.row.wrap.around: clickable(v-for="(i, index) in ['30','40']" :key="'p3'+index" :isok="index == 0" simple-ok initclass="pa-1"): number(randomc smaller) {{i}}

clickable(:isok="true" simple-ok initclass="pa-1")
*/