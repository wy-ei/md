import React from "react";
import CodeBlock from "./CodeBlock/";
import Text from "./Text";



let renderer = {
    code: CodeBlock,
    text: (text) => <Text text={text} />
}

export default renderer;