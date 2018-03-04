let width = -1;

window.addEventListener('resize', ()=>{
    width = window.innerWidth;
}, 100);


let viewport = {
    width: function(){
        if(width === -1){
            return window.innerWidth;
        }else{
            return width;
        }
    }
}


export default viewport;