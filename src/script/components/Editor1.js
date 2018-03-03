import React, {Component} from "react";
import ep from "../utils/ep";

let theme = {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
        'editor.foreground': '#444444',
        'editor.background': '#fafafa'        
    }
};

window.require.config({ paths: { 'vs': 'https://cdn.bootcss.com/monaco-editor/0.10.1/min/vs'}});

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

        window.addEventListener('keydown', function(event){
            if((event.ctrlKey || event.metaKey) && event.key === 's'){
                event.preventDefault();
            }
        });
    }
    componentWillReceiveProps(props){
        if(this.props.content === props.content){
            return;
        }
        if(this.editor){
            this.editor.setValue(props.content);
        }else{
            this.textarea.value = props.content;
        }
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
                minimap: {
                    enabled: false
                },
                lineHeight: 28,
                wordWrap: "on",

                theme: 'md',
                contextmenu: false,
                scrollBeyondLastLine: false,
                fontFamily: 'PingFang SC',
                scrollbar: {
                    useShadows: false
                },
                lineNumbers: 'off',
                renderLineHighlight: 'none',
                roundedSelection: false
            });

            _this.editor = editor;

            editor.onDidChangeModelContent(() => {
                let value = editor.getValue();
                _this.props.onContentChange(value);            
            });

            ep.emit("preview:update");
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