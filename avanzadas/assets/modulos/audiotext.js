Vue.component('audiotext', {
    props: ['text', 'audio', 'autoplay', 'initclass', 'speedOffset'],
    data() {
        return {
            playing: false,
            textrender: [],
            wordcount: 0,
            speedtime: 0,
            sound: null,
            speedOff: 1.0
        }
    },
    template: `
        <div :class="'audiotext ' + (initclass?initclass:' ')">
            <div class="audiotextBtn">
                <div @click="stop" v-if="playing" ><embed src="../../assets/aanim/Dialog_a.svg" class="animate__animated animate__rubberBand"></embed></div>
                <img v-else src="../../assets/aanim/Dialog.svg" class="animate__animated animate__pulse" @click="play">
            </div>
            <div class="audiotextTxt">
                <template v-for="txt in textrender" >
                    <div :class="(txt.on ? 'on' : 'off') + ' ' + (txt.txt=='<br>' ? 'br' : '') " v-html="txt.txt"></div>&nbsp;
                </template>
            </div>
        </div>
    `,
    methods: {
        stop(){
            this.playing = false
            this.sound.stop()
            this.$emit('completed')
            for(txt in this.textrender){
                this.textrender[txt].on = true
            }
        },
        textanimation (duration) {
            
            var _this = this
            var speedtime = (duration*1000) / (_this.textrender.length)
            var counted = 0
            
            var interval = setInterval(function(){
                _this.textrender[counted].on = true
                counted++
                if(counted == _this.textrender.length){
                    clearInterval(interval)
                }
            }, (speedtime/1.5) * this.speedOff)
        },
        play () {
            var _this = this
            if(_this.playing){
                return false
            }
            for(w in this.textrender) { this.textrender[w].on = false; }
            _this.playing = true
            _this.sound.play()
        },
        separatetxt () {
            var _this = this
            _this.textrender = []
            var words = _this.text.split(" ")
            for(var w in words){
                _this.textrender.push({txt:words[w], on: false})
            }
        },
        loadAudio() {
            var _this = this
            _this.sound = new Howl({
                src: [this.audio],
                autoplay: false,
                loop: false,
                onplay: function () {
                    _this.textanimation(_this.sound.duration())
                },
                onend: function () {
                    _this.playing = false
                    _this.$emit('completed')
                },
                onstop: function () {
                    _this.playing = false
                }
            });
            //console.log(_this.sound._state)
        }
    },
    mounted () {
        this.separatetxt()
        this.loadAudio()
        if(this.autoplay){
            this.play()
        } else {
            for(txt in this.textrender){
                this.textrender[txt].on = true
            }
        }
        if(this.speedOffset != undefined){
            this.speedOff = this.speedOffset
        }
    }
})