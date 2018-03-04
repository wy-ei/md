import React, {Component} from "react";
import ep from "../../utils/ep";


class Editor extends Component{
    constructor(props){
        super(props);
        this.editor = null;
        this.addEventListener();
    }

    addEventListener(){
        ep.on('editor:resize', ()=>{
            this.editor.resize(); 
        });

        ep.on("content:replace", (content) => {
            if(this.editor){
                this.editor.setValue(content);
            }else{
            }
        });

        window.addEventListener('keydown', function(event){
            if((event.ctrlKey || event.metaKey) && event.key === 's'){
                event.preventDefault();
            }
        });
    }

    componentWillReceiveProps(props){
        if(this.props.padding !== props.padding){
            this.editor.renderer.setPadding(props.padding);     
        }
    }

    componentDidMount(){
        let _this = this;

            let editor = ace.edit("editor", {
                fontFamily: 'Source Code Pro, PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans',
                wrap: true,
                mode: "ace/mode/markdown",
                showGutter: false,
                showPrintMargin: false,
                highlightActiveLine: false
            });

           _this.editor = editor;

           editor.renderer.setPadding(100);

            editor.session.on('change', () => {
                let value = editor.getValue();
                _this.props.onContentChange(value);
            });

            ep.emit("preview:update");
    }

    shouldComponentUpdate(){
        return false;
    }

    render(){
        
        let {content} = this.props;

        return <div
            className="editor-container"
            id="container"
            ref={ref => this.container = ref}
        >
            <div
                id="editor"
                className="text-editor"
            ></div>
        </div>
    }
}


export default Editor;