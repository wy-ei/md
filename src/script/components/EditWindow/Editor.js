import React, {Component} from "react";
import ep from "../../utils/ep";

let theme = {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
        'editor.foreground': '#444',
        'editor.background': '#fff'
        
    }
};


window.MonacoEnvironment = {
    getWorkerUrl: function(workerId, label) {
        return 'monaco-editor-worker-loader-proxy.js';
    }
};

class Editor extends Component{
    constructor(props){
        super(props);
        this.editor = null;
        this.addEventListener();
    }

    addEventListener(){
        ep.on('editor:resize', ()=>{
            this.editor.layout();
        });

        ep.on("content:replace", (content) => {
            if(this.editor){
                this.editor.setValue(content);
            }else{
                this.textarea.value = content;
            }
            
        });

        window.addEventListener('keydown', function(event){
            if((event.ctrlKey || event.metaKey) && event.key === 's'){
                event.preventDefault();
            }
        });
    }

    format_image(markdown){
        let r = /!\[(.*?)\]\((.+?)\)/mg;
        markdown = markdown.replace(r, function(match, alt, url){
            let attrs = {};
            if(alt.indexOf('=') != -1){
                let qs = new URLSearchParams(alt);
                for(let [key, value] of qs){
                    attrs[key] = value;
                }
            }else if(alt){
                attrs['alt'] = alt;
            }
            if('text' in attrs){
                attrs['alt'] = attrs['text']
                delete attrs['text'];
            }

            let align = 'center';
            if('align' in attrs){
                align = attrs['align']
                delete attrs['align']
            }

            let attr_text = ''
            for(let attr in attrs){
                attr_text += `${attr}="${attrs[attr]}" `
            }

            return `<div align="${align}"><img src="${url}" ${attr_text}/></div>`
        });
        return markdown;
    }

    render_math_as_img(markdown){
        let rinline = /(`\$)([\s\S]+?)\$`/gm;
        let rBlock = /(```)tex([\s\S]+?)```/gm;

        function replacer(match, wrap, tex){
            tex = tex.replace(/\s/g, '');
            let tex_encode = encodeURIComponent(tex);

            let url = `https://latex.codecogs.com/gif.latex?${tex_encode}`;
            if(wrap == '\`$'){
                return `<img src="${url}" class="tex" alt="${tex}" />`
            }else{
                return `<div align="center"><img src="${url}" class="tex" alt="${tex}"/></div>`
            }
        }

        markdown = markdown.replace(rinline, replacer);
        markdown = markdown.replace(rBlock, replacer);

        return markdown
    }

    addActionForEditor(editor){
        let _this = this;
        editor.addAction({
            // An unique identifier of the contributed action.
            id: 'md-001',
            label: 'Convert Tex to Image',
            precondition: null,
            keybindingContext: null,
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1.5,
            run: function(ed) {
                let markdown = ed.getValue();
                try{
                    markdown = _this.render_math_as_img(markdown);
                }catch(e){
                    console.log(e);
                }
                ed.executeEdits('', [{
                    range: new monaco.Range(0, 0, 100000, 1),
                    text: markdown
                }]);
                return null;
            }
        });

        editor.addAction({
            // An unique identifier of the contributed action.
            id: 'md-002',
            label: 'Format Images',
            precondition: null,
            keybindingContext: null,
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1.6,
            run: function(ed) {
                let markdown = ed.getValue();
                try{
                    markdown = _this.format_image(markdown);
                }catch(e){
                    console.log(e);
                }
                ed.executeEdits('', [{
                    range: new monaco.Range(0, 0, 100000, 1),
                    text: markdown
                }]);
                return null;
            }
        });
    }

    componentDidMount(){
        let _this = this;
        let container = document.getElementById('container');

        window.require(['vs/editor/editor.main'], function() {

            monaco.editor.defineTheme('md', theme);

            container.removeChild(container.firstElementChild);
            
            var editor = monaco.editor.create(document.getElementById('editor'), {
                value: _this.props.content,
                language: 'markdown',
                lineHeight: 28,
                wordWrap: "on",
                theme: 'md',
                contextmenu: false,
                scrollBeyondLastLine: false,
                fontFamily: 'Source Code Pro, PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans',
                scrollbar: {
                    useShadows: false
                },
                lineNumbers: 'off'
            });

            _this.addActionForEditor(editor);
            

            _this.editor = editor;

            editor.onDidChangeModelContent(() => {
                let value = editor.getValue();
                _this.props.onContentChange(value);            
            });
        });
    }

    shouldComponentUpdate(){
        return false;
    }

    render(){
        
        let {content} = this.props;

        return <div className="editor-container" id="container">
            <textarea
                value={content}
                ref={ref => this.textarea = ref}
                onChange={(event)=>{
                    this.props.onContentChange(event.target.value);
                }}
            ></textarea>
            <div className="text-editor" id="editor"></div>
        </div>
    }
}


export default Editor;