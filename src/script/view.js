import ReactDOM from "react-dom";
import React,{Component} from "react";
import renderer from "./components/PreviewWindow/renderer";
const Markdown = require('react-markdown')
import "../stylesheet/view.css";

class View extends Component{
    constructor(){
        super();
        this.state = {
            content: ""
        }
    }

    convert_images_url(page_url){
        let path = page_url.substring(0, page_url.lastIndexOf('/') + 1);
        let imgs = document.querySelectorAll('.view-container img');
        console.log(imgs)
        for(let i = 0, len = imgs.length; i < len; i++){
            let img = imgs[i];
            let src = img.getAttribute('src');
            if(!src.match(/^http/)){
                img.setAttribute('src', path + src);
            }
        }
    }

    componentDidMount(){
        let url = new URL(location.href);
        let md_url = url.searchParams.get('url');
        if(md_url){
            fetch(md_url).then(res => res.text()).then(text => {
                this.setState({
                    content: text
                }, () => {
                    this.convert_images_url(md_url);
                });
            });
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