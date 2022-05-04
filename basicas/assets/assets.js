/* AUDIOS */
var s_end = new Howl({ src: ['../../assets/asound/end.mp3'] });
var s_error = new Howl({ src: ['../../assets/asound/error.mp3'] });
var s_ok = new Howl({ src: ['../../assets/asound/ok.mp3'] });
var s_select = new Howl({ src: ['../../assets/asound/select.mp3'] });
var s_win = new Howl({ src: ['../../assets/asound/win.mp3'] });

var counterRef = 0





/* ################ */
/* VUE INIT */
var app = new Vue({
    el: '#app',
    data () {
        return {
            r: [],
            d: {},
            g: [],
            right: 0,
            total: 0,
            resultado: false,
            temps: null,
            temps2: null,
            temps3: null,
            tempsobj:{},
            vmcounter:0,
            finalData:{
                score: 0,
                scoresum: 0,
                oks: 0,
                errors: 0,
                answers: 0,
                screen: []
            },
            screen: []
        }
    },
    methods: {
        imgpath(prefix, nm, ext){
            return 'aimg/'+prefix+nm+'.'+(ext==undefined?'png':ext)
        },
        refCount($e){
            let ct = 'rf_'+counterRef
            counterRef = counterRef+1
            return ct
        },
        reset () { location.reload() },
        debugg(content){
            console.log(content)
        },
        finalizar (forceTotal) {
            s_win.play()
            this.total = this.r.length
            this.total += Object.keys(this.d).length

            if(forceTotal!=undefined){
                this.total = forceTotal
            }

            /*
            if(this.total == 0){
                this.total = Object.keys(this.d).length
                console.log(this.total)
            }
            */


            for(var i in this.$refs){
                if(this.$refs[i]!=undefined){
                    if(Array.isArray(this.$refs[i])){
                        if(this.$refs[i][0]!=undefined){
                            this.$refs[i][0].verify()
                        }
                    } else {
                        this.$refs[i].verify()
                    }
                }
            }
            this.resultado = true


            /* screenshot */
            var _this = this
            domtoimage.toPng(document.body).then(function (dataUrl) {
                _this.screen.push(dataUrl)
                _this.ended()
            }).catch(function (error) { console.error(error) })


            //this.ended()
        },
        ended () {
            var _this = this
            _this.finalData.scoresum = Math.round((_this.finalData.score / _this.total) * _this.right)
            _this.finalData.oks = _this.right
            _this.finalData.errors = _this.total-_this.right
            _this.finalData.answers = _this.total
            _this.finalData.screen = _this.screen
            var endData = JSON.stringify(_this.finalData)
            window.top.postMessage(endData, "*")
        },
        loadScreencap(){
            var s = document.createElement("script")
            s.type = "text/javascript"
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js"
            document.head.appendChild(s)

        },
    },
    mounted () {
        var h = parseInt(window.location.hash ? window.location.hash.replace('#s', '') : 100)
        this.finalData.score = h ? h : 100

        this.loadScreencap()
    }
})


