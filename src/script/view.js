import ReactDOM from "react-dom";
import React,{Component} from "react";
import renderer from "./components/PreviewWindow/renderer";
const Markdown = require('react-markdown')
import ep from "./utils/ep";
import "../stylesheet/view.css";

class View extends Component{
    constructor(){
        super();
        this.state = {
            content: ""
        }
        this.addEventListener();
    }

    addEventListener(){
        ep.any(['content:update', 'content:replace'], (content)=>{
            this.setState({
                content: content
            });
        });

    }

    componentDidMount(){
        let url = new URLSearchParams(location.search).get('url');
        if(url){
            fetch(url).then(res => res.text()).then(text => ep.emit('content:update', text));
        }
    }

    render(){
        let {content} = this.state;


        return (
            <div className="view-container wrap">
                <Markdown
                    source={content}
                    className="content typo"
                    renderers={renderer}
                    escapeHtml={false}
                    vScrollBarAlwaysVisible={true}
                />
            </div>
        )
    }
}


ReactDOM.render( < View / >, document.getElementById("markdown"));