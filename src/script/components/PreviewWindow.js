import React,{Component} from "react";
import Button from "./Button";
import markdownToHTML from '../utils/markdownToHTML';
import {LAYOUT} from "./Md";
import ep from "../utils/ep";

class PreviewWindow extends Component{
    constructor(props){
        super();
        this.addEventListener();        
    }


    addEventListener(){
        ep.on("preview:update", () => {
            this.forceUpdate();
        });
    }
    toggleFullscreenPreview(){
        let {fullscreenPreview} = this.props;
        if(fullscreenPreview){
            ep.emit('md_layout:reset');
        }else{
            ep.emit('md_layout:update', [LAYOUT.fullscreenPreview]);
        }
    }

    componentDidUpdate(){
        let {content, fullscreenEdit} = this.props;
        if(fullscreenEdit){
            return;
        }
        
        markdownToHTML(content, (err, content)=>{
            this.container.innerHTML = content;
        })
    }

    render(){
        let {fullscreenPreview, content} = this.props;


        return (
            <section className='view-window'>
                <header className='tool-bar'>
                    <Button text={fullscreenPreview ?"退出全屏":"全屏预览" } onClick={() => this.toggleFullscreenPreview()}/>
                    <Button text="打印" onClick={window.print}/>                    
                </header>
                <div className='preview-box'>
                    <div
                        ref={(ref) => {this.container = ref}} 
                        className="content typo"
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