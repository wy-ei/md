import React,{Component} from "react";
import Button from "./Button";
import marked from "marked";
import {LAYOUT} from "./Md";
import ep from "../utils/ep";

class PreviewWindow extends Component{
    constructor(props){
        super();
        this.toggleFullscreenPreview = this.toggleFullscreenPreview.bind(this);

    }

    print(){
        window.print();
    }

    toggleFullscreenPreview(){
        let {fullscreenPreview} = this.props;
        if(fullscreenPreview){
            ep.emit('layout:reset');
        }else{
            ep.emit('layout:update', [LAYOUT.fullscreenPreview]);
        }
    }


    render(){
        let {fullscreenPreview, content} = this.props;

        return (
            <section className='view-window'>
                <header className='tool-bar'>
                    <Button text={fullscreenPreview ?"退出全屏":"全屏预览" } onClick={this.toggleFullscreenPreview}/>
                    <Button text="打印" onClick={this.print}/>                    
                </header>
                <div className='preview-box'>
                    <div 
                        ref={(ref) => {this.container = ref}} 
                        className="content typo"
                        dangerouslySetInnerHTML={{__html: marked(content)}}
                    >
                    </div>
                </div>
            </section>
        )
    }
}

PreviewWindow.defaultProps = {
    content: ""
}


export default PreviewWindow;