Vue.component('checkmark', {
    template: `<img src="../../assets/aimg/check.svg" class="animate__animated animate__heartBeat">`
})

Vue.component('numbers', {
    props: ['c', 'small', 'smaller'],
    template: `<div :class="
            'numbers ' +
            (c!=undefined?'c'+c:' ' ) +
            ' ' +
            (small!=undefined?'small':' ') +
            ' ' +
            (smaller!=undefined?'smaller':'')
        "><slot></slot></div>`
})

Vue.component('labeltext', {
    props: ['num'],
    template: `<div :class="'label '">
            <strong v-if="num">{{num}}</strong>
            <slot></slot>
        </div>`
})

Vue.component('markex', {
    template: `<img src="../../assets/aimg/markex.svg" class="animate__animated animate__heartBeat">`
})

Vue.component('recuadropalabras', {
    props: ['palabras', 'c'],
    template: `
        <div class="recuadropalabras row flex-wrap justify-content-around align-items-center" :class="'c'+c">
            <div v-for="(i, index) in palabras">
                <strong>{{i}}</strong>
            </div>
        </div>
    `
})




Vue.component('imgbg', {
    props: ['initclass', 'img'],
    template: `
        <div :class="'imgbgMod ' + initclass + ' animate__animated animate__pulse animate__delay-2s'">
            <img :src="img" class="w-100 ">
            <div class="inputs">
                <slot></slot>
            </div>
        </div>
        `
})





Vue.component('embedvideo', {
    props: ['urlid', 'title'],
    data () { return {
        openvideo: false
    }},
    template: `
        <div class="embedvideo">
            <div class="embedvideo_btn animate__animated animate__pulse animate__infinite animate__slower" @click="openvideo=true">
                <div class="embedvideo_vervideo">Ver Video</div>
                <img src="../../assets/aimg/playbutton.svg">
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
                    <div class="embedvideo_close" @click="openvideo=false"><img src="../../assets/aimg/closebutton.svg"></div>
                    <div class="embedvideo_txt">
                        <div>{{title}}</div>
                        <div><strong>Montenegro hasta tu casa</strong></div>
                    </div>
                </div>
            </div>
        </div>
    `,
})