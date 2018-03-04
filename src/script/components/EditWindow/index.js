import React,{Component} from "react";
import Button from "../Button";
import Editor from "./Editor";
import {LAYOUT} from "../Md";
import Alert from "../../utils/Alert";
import ep from "../../utils/ep";
import throttle from "../../utils/throttle";
import message from "../../utils/message";
import viewport from "../../utils/viewport";


class EditWindow extends Component{
    constructor(props){
        super();
        this.state = {
            content: props.content
        }
        this.lastSavedContent = '';
        this.onContentChange = this.onContentChange.bind(this);

        this.emitUpdate = throttle(this.emitUpdate, 1000);        
    }

    componentDidMount(){

        window.addEventListener('unload', ()=>{
            ep.emit("storage:save", [this.state.content]);
        });

        setInterval(()=>{
            let content = this.state.content;
            if(this.lastSavedContent !== content){
                ep.emit("storage:save", [content]);
                this.lastSavedContent = content;
            }
        }, 3000);
        
    }

    componentWillReceiveProps(props){
        this.setState({
            content: props.content 
        });
    }

    emitUpdate(content){
        ep.emit('content:update', [content]);
    }

    onContentChange(content){
        this.setState({content: content});
        this.emitUpdate(content);
    }
    toggleFullscreenEdit(){
        let {fullscreenEdit} = this.props;
        if(fullscreenEdit){
            ep.emit('md_layout:reset');
        }else{
            ep.emit('md_layout:update', [LAYOUT.fullscreenEdit]);
        }
    }

    showStoreList(){
        ep.emit("storage_list:show");
    }

    add(){
        ep.emit('storage:add', [this.state.content]);
    }

    render(){
        let {fullscreenEdit} = this.props;
        let {content} = this.state;

        let width = viewport.width();

        if(!fullscreenEdit){
            width = width / 2;
        }

        let padding = 10;
        if(width > 800){
            width -= 800;
            padding = width / 2;
        }

        return (
            <section className='edit-window'>
                <header className='tool-bar'>
                    <a href='https://github.com/wy-ei/md'>MD</a>
                    <Button text={ fullscreenEdit ? "退出全屏":"全屏编辑" } onClick={() => this.toggleFullscreenEdit()}/>
                    <Button text="新增暂存" onClick={() => this.add()} />
                    <Button text="查看暂存" onClick={() => this.showStoreList()}/>
                    <span className="tool-bar__text">{ content.length } 字</span>
                </header>
                <div className='edit-box'>
                    <Editor padding={padding} content={content} onContentChange={this.onContentChange} />
                </div>
            </section>
        )
    }
}

EditWindow.defaultProps = {
    content: ""
};



export default EditWindow;