import React,{Component} from "react";
import Button from "./Button";
import marked from "marked";
import {LAYOUT} from "./Md";
import ep from "../utils/ep";

class PreviewWindow extends Component{
    constructor(props){
        super();
    }

    toggleFullscreenPreview(){
        let {fullscreenPreview} = this.props;
        if(fullscreenPreview){
            ep.emit('md_layout:reset');
        }else{
            ep.emit('md_layout:update', [LAYOUT.fullscreenPreview]);
        }
    }


    render(){
        let {fullscreenPreview, fullscreenEdit, content, width} = this.props;

        let padding = '20px'
        if(width > 800){
            width -= 800;
            padding = padding + ' ' + (width / 2) + 'px'; 
        }

        return (
            <section className='view-window'>
                <header className='tool-bar'>
                    <Button text={fullscreenPreview ?"退出全屏":"全屏预览" } onClick={() => this.toggleFullscreenPreview()}/>
                    <Button text="打印" onClick={window.print}/>                    
                </header>
                <div className='preview-box'>
                    <div 
                        style={{padding: padding}}
                        ref={(ref) => {this.container = ref}} 
                        className="content typo"
                        dangerouslySetInnerHTML={{__html: fullscreenEdit ? "" : marked(content)}}
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