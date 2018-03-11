import React,{PureComponent} from "react";


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