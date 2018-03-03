import React,{Component} from "react";
import CodeBlock from "./CodeBlock";
import Image from "./Image";


let renderer = {
    code: CodeBlock,
    image: Image
}

export default renderer;