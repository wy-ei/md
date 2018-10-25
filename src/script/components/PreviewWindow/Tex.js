import React,{PureComponent} from "react";
import LazyLoad from "../../lib/lazyload";
import ep from "../../utils/ep";

let loading = null;
let katex = null;

class Tex extends PureComponent {
    constructor(props){
        super();
        if(!window.katex && !loading){
            loading = true;
            LazyLoad.css('https://cdn.jsdelivr.net/npm/katex@0.10.0-rc.1/dist/katex.min.css')
            window.require(['https://cdn.jsdelivr.net/npm/katex@0.10.0-rc.1/dist/katex.min.js'], (_katex) => {
                katex = _katex;
                ep.emit('katex:loaded');
            });
        }
    }
    
    componentDidMount(){
        if(!katex){
            ep.once('katex:loaded', () => this.forceUpdate());
        }
    }

    render(){
        let {content, block} = this.props;
        let html = content;
        let error = false;

        if(katex){
            try{
                html = katex.renderToString(content, {
                    errorColor: '#F44336',
                    //throwOnError: false,
                    displayMode: block
                });  
            }catch(e){
                error = true;
                html = e.message;
            }
        }

        return (
            <span
                className={error ? "katex--error" : ''}
                dangerouslySetInnerHTML={{__html: html}}
            >
            </span>
        )
    }
}

export default Tex;