import React,{Component} from "react";
import ep from "../../utils/ep";


class CodeBlock extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if(window.monaco){
            monaco.editor.colorizeElement(this.code, {tableSize: 4});
        }else{
            ep.once('codeblock:highlight', ()=>{
                monaco.editor.colorizeElement(this.code, {tableSize: 4});
            });
        }
        
    }

    componentDidUpdate() {
        window.monaco && monaco.editor.colorizeElement(this.code, {tableSize: 4});
    }

    render() {
        return (
            <pre>
                <code
                    ref={ref=>this.code = ref}
                    data-lang={this.props.language}
                    className={`language-${this.props.language}`}
                >
                {this.props.value}
                </code>
            </pre>
        )
    }
}

export default CodeBlock;