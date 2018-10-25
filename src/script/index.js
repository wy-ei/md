import ReactDOM from "react-dom";
import React from "react";
import Md from "./components/Md";
import "../stylesheet/index.css";

window.require.config({
    paths: {
        'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.14.3/min/vs'
    }
});


ReactDOM.render( < Md / > , document.getElementById("markdown"));