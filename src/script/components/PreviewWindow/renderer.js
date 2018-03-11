import React from "react";
import CodeBlock from "./CodeBlock/";
import Image from "./Image";
import Text from "./Text";



let renderer = {
    code: CodeBlock,
    image: Image,
    text: (text) => <Text text={text} />
}

export default renderer;