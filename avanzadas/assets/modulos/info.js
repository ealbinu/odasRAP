Vue.component('info', {
    props: ['title', 'text', 'textaudio', 'type', 'autoplay', 'speedOffset'],
    data () {
        return {
            score: 0,
            showPlayer: true,
        }
    },
    template: `
        <div class="info">
            <h1>{{title}}</h1>
            <template v-if="showPlayer">
                <h2><audiotext :text="text" :speed-offset="speedOffset==undefined?1:speedOffset" :audio="textaudio" ref="instructions" :autoplay="autoplay!=undefined ? autoplay : true" @completed="$emit('completedinstructions')"></audiotext></h2>
            </template>
            <slot></slot>
            <div class="bottom">
                <scorebox :score="score"></scorebox>
                <div class="instype">
                    <lottie-player v-if="type=='dragdrop'" src="../../assets/lottie/DragNDrop.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                    <lottie-player v-if="type=='seleccionar'" src="../../assets/lottie/Seleccionar.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                    <lottie-player v-if="type=='relacionar'" src="../../assets/lottie/Relacionar.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                    <lottie-player v-if="type=='input'" src="../../assets/lottie/Input.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                    <lottie-player v-if="type=='keydown'" src="../../assets/lottie/Keydown.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                    <lottie-player v-if="type=='video'" src="../../assets/lottie/Video.json"  background="transparent"  speed="1"  style="width: 100%; height: 100%;"  loop autoplay></lottie-player>
                </div>
            </div>
            <button class="reset button" @click="reset">Reiniciar</button>
        </div>
    `,
    methods: {
        reset () { location.reload() }
    },
    mounted () {
        //this.$ref.instructions
        this.score = this.$parent.score
    },
    created () {
        if(this.textaudio == undefined){
            this.showPlayer = false
        }
    }
})








Vue.component('embedvideo', {
    props: ['urlid', 'title', 'small', 'smaller'],
    data () { return {
        openvideo: false
    }},
    template: `
        <div :class="[
            'embedvideo',
            small!=undefined ? 'small':'',
            smaller!=undefined ? 'smaller':''
        ]">
            
            <div class="embedvideo_btn animate__animated animate__pulse animate__infinite animate__slower" @click="openvideo=true">
                <div class="embedvideo_vervideo">Ver Video</div>
                <img src="../../assets/aanim/playbutton.svg">
                <div class="embedvideo_title">{{title}}</div>
                <div><strong>Montenegro hasta tu casa</strong></div>
            </div>
            <div class="embedvideo_container" v-if="openvideo">
                <div class="embedvideo_content">
                <iframe
                    width="560"
                    height="315"
                    :src="'https://www.youtube.com/embed/'+urlid"
                    frameborder="0"
                    allow="accelerometer;
                    autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <div class="embedvideo_close" @click="openvideo=false"><img src="../../assets/aanim/closebutton.svg"></div>
                    <div class="embedvideo_txt">
                        <div>{{title}}</div>
                        <div><strong>Montenegro hasta tu casa</strong></div>
                    </div>
                </div>
            </div>
        </div>
    `,
})