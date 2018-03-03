import "../lib/lazyload";

class Slide{
    constructor(){
        this.urls = [];
        this.inited = false;
        this.updated = false;
    }
    show(index){
        let dynamicEl = this.urls.map(url => {
            return {src: url, thumb: url}
        });

        if($('#lg-container').data('lightGallery') && this.updated === true){
            $('#lg-container').data('lightGallery').destroy(true);
        }

        $('#lg-container').lightGallery({
            mode: 'lg-fade',
            download: false,
            dynamic: true,
            share: false,
            zoom: false,
            pause: 3000,
            progressBar: false,
            hideBarsDelay: 1000,
            showThumbByDefault: false,
            dynamicEl: dynamicEl
        });

        //console.log(index)
        setTimeout(()=>{
            $('#lg-container').data('lightGallery').slide(index);
        })
    }

    has_update(new_urls){
        if(this.urls.length !== new_urls.length){
            return true;
        }

        for(let i=0;i<new_urls.length;i++){
            if(this.urls[i] !== new_urls[i]){
                return true;
            }
        }
        return false;
    }

    init(urls){
        this.updated = this.has_update(urls);
        
        this.urls = urls;

        if(this.inited){
            return Promise.resolve();
        }

        let div = document.createElement('div');
        div.setAttribute('id', 'lg-container');
        document.body.appendChild(div);

        let _this = this;
        
        LazyLoad.css('https://cdn.bootcss.com/lightgallery/1.6.6/css/lightgallery.css')
        
        return new Promise(function(resolve, reject){
            LazyLoad.js(['https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js', 'https://cdn.bootcss.com/lightgallery/1.6.6/js/lightgallery-all.min.js'], function(){
                _this.inited = true;
                resolve()
            });
        });
    }
}

let slide = new Slide

export default slide;