import React,{Component} from "react";
import EditWindow from "./EditWindow";
import PreviewWindow from "./PreviewWindow";
import StorageList from "./StorageList";
import ep from "../utils/ep";

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

    componentDidMount(){
        let LS = window.localStorage;
        let text = LS.getItem('markdown-text');
        if(text){
            ep.emit('content:update', [text]);
            LS.removeItem('markdown-text');
        }
    }

    addEventListener(){
        ep.on('content:update', (content)=>{
            this.setState({
                content: content
            });
        });

        ep.on('layout:update', (layout) => {
            this.setState({
                layout: layout
            })
        });

        ep.on('layout:reset', (layout) => {
            this.setState({
                layout: LAYOUT.default
            });
        });
    }

    render(){
        let {content, layout} = this.state;

        let layoutClassName = '';
        if(layout === LAYOUT.fullscreenEdit){
            layoutClassName = 'fullscreen-edit';
        }else if(layout === LAYOUT.fullscreenPreview){
            layoutClassName = 'fullscreen-preview';
        }

        return (
            <>
            <StorageList/>
            <div className={layoutClassName}>
                <EditWindow
                    content={content}
                    fullscreenEdit={layout === LAYOUT.fullscreenEdit}
                />
                <PreviewWindow
                    fullscreenPreview={layout === LAYOUT.fullscreenPreview}
                    content={content}
                />
            </div>
            </>
        )
    }
}

export {LAYOUT};
export default Md;