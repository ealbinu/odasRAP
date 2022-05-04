Vue.component('number', {
    props: [
        'initclass', // clase inicial
        'small', // tamano pequeno
        'smaller', // tamano mas pequeno
        'c', // Clase de color que se asigna (1-8)
        'randomc', //color aleatorio
    ],
    data () {
        return {

        }
    },
    template: `
        <div :class="
            'number ' +
            (initclass!=undefined?initclass:'') + ' ' +
            (small!=undefined?'small':'') + ' ' +
            (smaller!=undefined?'smaller':'') + ' ' +
            (c!=undefined?'c'+c:'') + ' ' +
            ranc
            " >
            <slot />
        </div>
    `,
    computed: {
        ranc() {
            if(this.randomc!=undefined){
                return 'c' + (Math.round(Math.random()*7)+1)
            } else {
                return false
            }
        }
    }
})


/*
<number small c="1">Uno</number>
<number c="2">Uno</number>
<number randomc>Uno</number>
*/