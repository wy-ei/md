import React,{Component} from "react";
import LazyLoad from "../../lib/lazyload";


class CodeBlock extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    load_hljs(callback){
        LazyLoad.css('https://cdn.bootcss.com/highlight.js/9.12.0/styles/vs.min.css');                      
        LazyLoad.js(['https://cdn.bootcss.com/highlight.js/9.12.0/highlight.min.js'], ()=>{
            callback && callback();
        });
    }

    componentDidMount() {

        if(CodeBlock.hljs_state == 'wait_load'){
            CodeBlock.hljs_state = 'loading';
            this.load_hljs(()=>{
                CodeBlock.hljs_state = 'loaded';
                CodeBlock.wait_highlight_queue.forEach(code => {
                    hljs.highlightBlock(code);
                });
            });
        }

        if(CodeBlock.hljs_state == 'loading'){
            CodeBlock.wait_highlight_queue.push(this.code);
        }

        if(CodeBlock.hljs_state == 'loaded'){
            hljs.highlightBlock(this.code);
        }
    }

    componentDidUpdate() {
        if(CodeBlock.hljs_state == 'loaded'){
            hljs.highlightBlock(this.code);            
        }
    }

    render() {
        return (
            <pre>
                <code
                    ref={ref=>this.code = ref}
                    className={`language-${this.props.language}`}
                >
                {this.props.value}
                </code>
            </pre>
        )
    }
}

CodeBlock.hljs_state = 'wait_load';
CodeBlock.wait_highlight_queue = [];

export default CodeBlock;