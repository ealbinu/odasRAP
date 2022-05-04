Vue.component('activity', {
    props: ['title', 'instruction', 'type', 'score'],
    template: `
        <div class="activity">
            <slot></slot>
        </div>
    `,
    data(){
        return {
        }
    },
    methods: {
        notfoundimg () {
            document.addEventListener("DOMContentLoaded", function(event) {
                document.querySelectorAll('img').forEach(function(img){
                   img.onerror = function(){ this.src='../../assets/aanim/notfound.svg';};
                })
             });
        },
    },
    mounted () {
        this.notfoundimg()
    }
})