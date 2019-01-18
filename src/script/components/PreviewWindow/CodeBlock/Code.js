import React,{PureComponent} from "react";
import LazyLoad from "../../../lib/lazyload";


class Code extends PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.highlight();
    }

    componentDidUpdate() {
        this.highlight();
    }


    highlight(){
        // if(window.Prism){
        //     try{
        //         Prism.highlightElement(this.code);
        //     }catch(e){}
        // }else{
        //     LazyLoad.css(['https://cdn.jsdelivr.net/npm/prismjs@1.15.0/themes/prism.css'])
        //     window.require(['https://cdn.jsdelivr.net/npm/prismjs@1.15.0/prism.min.js'], () => {
        //         window.require(['https://cdn.jsdelivr.net/npm/prismjs@1.15.0/plugins/autoloader/prism-autoloader.min.js'],()=>{
        //             Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.15.0/components/';
        //             this.highlight();
        //         });
        //     });
        // }
        if(window.monaco){
            let firstChild = this.code && this.code.firstChild;
            if(firstChild && firstChild.nodeValue && firstChild.nodeValue.trim()){
                try{
                    window.monaco && monaco.editor.colorizeElement(this.code, {tableSize: 4});
                }catch(err){}
            }
        }else{
            window.require(['vs/editor/editor.main'], () => {
                this.highlight();            
            });
        }
    }



    render() {
        let {code, language} = this.props;

        return (
            <pre className="code-block">
                <code
                    ref={ref=>this.code = ref}
                    data-lang={language}
                    className={`language-${language}`}
                >
                {code}
                </code>
            </pre>
        )
    }
}

export default Code;