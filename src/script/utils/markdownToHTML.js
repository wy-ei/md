import marked from 'marked';

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
    highlight: function(code, lang, callback) {
        if(!window.monaco){
            callback(null, code);
        }else{
            monaco.editor.colorize(code, lang, {tableSize: 4}).then(highlightedCode => callback(null, highlightedCode));
        }
    }
});


function markdownToHTML(text, callback){
    return marked(text,  { renderer: renderer }, callback);
}

export default markdownToHTML;