import React,{Component} from "react";
import EditWindow from "./EditWindow";
import PreviewWindow from "./PreviewWindow";
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
            layout: LAYOUT.default,
            windowWidth: 0
        }
        this.addEventListener();
    }

    addEventListener(){
        ep.on('content:update', (content)=>{
            this.setState({
                content: content
            });
        });

        ep.on('md_layout:update', (layout) => {
            this.setState({
                layout: layout
            });
        });

        ep.on('md_layout:reset', (layout) => {
            this.setState({
                layout: LAYOUT.default
            });
        });

        window.addEventListener('resize', throttle(()=>{
            this.setState({windowWidth: window.innerWidth});
        }, 100));
    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({windowWidth: window.innerWidth});        
        }, 2000);
    }

    render(){
        let {content, layout, windowWidth} = this.state;

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
            <div className={layoutClassName}>
                <EditWindow
                    content={content}
                    width={fullscreenEdit ? windowWidth : windowWidth / 2}
                    fullscreenEdit={fullscreenEdit}
                />
                <PreviewWindow
                    width={fullscreenPreview ? windowWidth : windowWidth / 2}
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