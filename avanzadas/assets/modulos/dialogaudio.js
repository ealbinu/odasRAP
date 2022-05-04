Vue.component('dialogaudio', {
    props: ['text', 'audio', 'autoplay', 'showOnPlay', 'showWhilePlay', 'alwaysVisible', 'initclass'],
    data() {
        return {
            playing: false,
            sound: null,
            visibleContent: false,
            sound: null,
        }
    },
    template: `
        <div :class="'dialogaudio '+(playing?'playing ':' ') + (initclass!=undefined?initclass:'')" @click="playstop">
            <div class="audiotextBtn">
                <div  v-if="playing" ><embed src="../../assets/aanim/Dialog_a.svg" class="animate__animated animate__rubberBand"></embed></div>
                <img  v-else src="../../assets/aanim/Dialog.svg" class="animate__animated animate__pulse" >
            </div>
            <div class="dialog-content" v-if="visibleContent">
                <slot></slot>
            </div>
        </div>
    `,
    methods: {
        playstop(){
            var _this = this
            if(_this.playing){
                _this.playing = false
                _this.sound.stop()
            } else {
                _this.playing = true
                _this.sound.play()
            }
            _this.visibleContentFn()
        },
        stop(){
            this.playing = false
            this.sound.stop()
            _this.$emit('completed')
            _this.visibleContentFn()
        },
        play () {
            var _this = this
            if(_this.playing){
                return false
            }
            _this.playing = true
            _this.sound.play()
            _this.visibleContentFn()
        },
        loadAudio() {
            var _this = this
            _this.sound = new Howl({
                src: [this.audio],
                autoplay: false,
                onplay: function () {
                },
                onend: function () {
                    _this.playing = false
                    _this.$emit('completed')
                    _this.visibleContentFn()
                },
                onstop: function () {
                    _this.playing = false
                    _this.visibleContentFn()
                    _this.$emit('completed')
                }
            })
        },
        visibleContentFn () {
            if(this.alwaysVisible!=undefined) {
                this.visibleContent = true
            }
            if(this.showOnPlay!=undefined && this.playing) {
                this.visibleContent = true
            }
            if(this.showWhilePlay!=undefined) {
                this.visibleContent = this.playing
            }
        }
    },
    mounted () {
        this.loadAudio()
        this.visibleContentFn()
        if(this.autoplay){
            this.play()
        } else {
            for(txt in this.textrender){
                this.textrender[txt].on = true
            }
        }
    },
})