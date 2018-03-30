import React,{PureComponent} from "react";
import Chart from "./Chart";
import Code from "./Code";
import Tex from "../Tex";


class CodeBlock extends PureComponent {

    constructor(props) {
        super(props);
    }


    render() {

        let {language, value} = this.props;

        if(language === 'chart'){
            return <Chart data={value} />
        }else if(language === 'tex'){
            return <Tex block={true} content={value}/>
        }
        else{
            return <Code code={value} language={language} />
        }
    }
}

export default CodeBlock;