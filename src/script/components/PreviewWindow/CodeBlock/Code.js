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
        if(window.Prism){
            Prism.highlightElement(this.code);
        }else{
            LazyLoad.css(['https://cdn.jsdelivr.net/npm/prismjs@1.15.0/themes/prism.css'])
            window.require(['https://cdn.jsdelivr.net/npm/prismjs@1.15.0/prism.min.js', 'https://cdn.jsdelivr.net/npm/prismjs@1.15.0/plugins/autoloader/prism-autoloader.min.js'], () => {
                Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.15.0/components/';
                this.highlight();
            });
        }
    }



    render() {
        let {code, language} = this.props;

        return (
            <pre>
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