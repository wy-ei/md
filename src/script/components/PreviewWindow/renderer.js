import React from "react";
import CodeBlock from "./CodeBlock/";
import Tex from "./Tex";


let renderer = {
    code: CodeBlock,
    inlineCode: (props) => {
        let rInlineMath = /\$([\s\S]+?)\$/mg;

        // inline Tex command
        let match = rInlineMath.exec(props.value);
        if(match){
            let content = match[1].trim();
            return <Tex block={false} content={content}/>
        }
        return <code>{props.value}</code>;
    }
}

export default renderer;