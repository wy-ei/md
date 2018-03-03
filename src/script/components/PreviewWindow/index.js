import React,{Component} from "react";
import Button from "../Button";
const ReactMarkdown = require('react-markdown')
import {LAYOUT} from "../Md";
import ep from "../../utils/ep";
import renderer from './renderer';



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

    render(){
        let {fullscreenPreview, content, fullscreenEdit} = this.props;


        return (
            <section className='view-window'>
                <header className='tool-bar'>
                    <Button text={fullscreenPreview ?"退出全屏":"全屏预览" } onClick={() => this.toggleFullscreenPreview()}/>
                    <Button text="打印" onClick={window.print}/>                    
                </header>
                <div className='preview-box'>
                    <ReactMarkdown 
                        source={fullscreenEdit ? "" : content}
                        className="content typo"
                        renderers={renderer}
                        escapeHtml={false}
                        vScrollBarAlwaysVisible={true}
                    />
                </div>
            </section>
        )
    }
}

PreviewWindow.defaultProps = {
    content: ""
}


export default PreviewWindow;