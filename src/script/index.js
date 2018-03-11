import ReactDOM from "react-dom";
import React from "react";
import Md from "./components/Md";
import "../stylesheet/index.css";

window.require.config({
    paths: {
        'vs': 'https://cdn.bootcss.com/monaco-editor/0.10.1/min/vs'
    }
});


ReactDOM.render( < Md / > , document.getElementById("markdown"));