import ReactDOM from "react-dom";
import React from "react";
import Md from "./components/Md";
import "../stylesheet/default.css";
import "../stylesheet/typo.css";

window.MD = {};

ReactDOM.render(<Md />, document.getElementById("markdown"));