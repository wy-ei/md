import React,{Component} from "react";
import EditWindow from "./EditWindow/index";
import PreviewWindow from "./PreviewWindow/index";
import StorageList from "./StorageList";

import ep from "../utils/ep";
import throttle from "../utils/throttle";

const LAYOUT = {
    default: 'split',
    fullscreenEdit: 'edit:fullscreen',
    fullscreenPreview: 'edit:preview',   
};


class Md extends Component{
    constructor(){
        super();
        this.state = {
            content: "",
            layout: LAYOUT.default
        }
        this.addEventListener();
    }

    addEventListener(){
        ep.any(['content:update', 'content:replace'], (content)=>{
            this.setState({
                content: content
            });
        });

        ep.on('md_layout:update', (layout) => {
            this.setState({
                layout: layout
            }, ()=>{
                if(layout === LAYOUT.fullscreenEdit || layout === LAYOUT.default){
                    ep.emit('editor:resize');                
                }
            });
        });

        ep.on('md_layout:reset', (layout) => {
            this.setState({
                layout: LAYOUT.default
            }, () => {
                ep.emit('editor:resize');                
            });
        });

        window.addEventListener('resize', throttle(()=>{
            ep.emit('editor:resize');
        }, 100));
    }

    componentDidMount(){
        ep.emit('storage:init');
    }

    render(){
        let {content, layout} = this.state;

        let fullscreenEdit = layout === LAYOUT.fullscreenEdit;
        let fullscreenPreview = layout === LAYOUT.fullscreenPreview;

        let layoutClassName = '';
        if(fullscreenEdit){
            layoutClassName = 'fullscreen-edit';
        }else if(fullscreenPreview){
            layoutClassName = 'fullscreen-preview';
        }

        return (
            <>
            <StorageList/>
            <div className={'md-container ' + layoutClassName }>
                <EditWindow
                    content={content}
                    fullscreenEdit={fullscreenEdit}
                />
                <PreviewWindow
                    fullscreenEdit={fullscreenEdit}
                    fullscreenPreview={fullscreenPreview}
                    content={content}
                />
            </div>
            </>
        )
    }
}

export {LAYOUT};
export default Md;