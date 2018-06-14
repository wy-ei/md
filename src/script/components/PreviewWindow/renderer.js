import React from "react";
import CodeBlock from "./CodeBlock/";
import Tex from "./Tex";
import TOC from "./TOC"
import Heading from './Heading'

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


        let rTOC = /__TOC__/
        if (rTOC.test(props.value)){
            return <TOC />
        }

        return <code>{props.value}</code>;
    },
    heading: Heading
}

export default renderer;