import marked from 'marked';
import LazyLoad from '../lib/lazyload';
import ep from "./ep";

let renderer = new marked.Renderer();

renderer.image = function(href, title, text){
    let style = '';
    let description = '';

    if(text){
        let paramList = text.split('&amp;');
        
        paramList.forEach(function(param){
            var pair = param.split("=");
            var key = pair.shift();
            var value = pair.join('=');
    
            if(key === 'text'){
                description = `<div class="img-description"><p>${value}</p></div>`;
            }else if(key==='center'){
                style += 'display: block;margin: 0 auto;';                
            }else{
                style += `${key}:${value};`;
            }
        });
    }

    return `<img src=${href} style="${style}">` + description;
}

marked.setOptions({
    highlight: function (code, lang) {

        if(!window.MD.hljs_loading){
            window.MD.hljs_loading = true;
            LazyLoad.css('https://cdn.bootcss.com/highlight.js/9.12.0/styles/atom-one-light.min.css');
            LazyLoad.js(['https://cdn.bootcss.com/highlight.js/9.12.0/highlight.min.js'], function(){
                let blocks = document.querySelectorAll('pre code');
                    for(let i=0;i<blocks.length;i++){
                    hljs.highlightBlock(blocks[i]);
                }
            });
        }
        if(window.hljs){
            return hljs.highlightAuto(code).value;
        }else{
            return code;
        }
    }
});


function markdownToHTML(text, callback){
    return marked(text,  { renderer: renderer }, callback);
}

export default markdownToHTML;