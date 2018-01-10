import React,{Component} from "react";
import Button from "./Button";
import {LAYOUT} from "./Md";
import Alert from "../utils/Alert";
import ep from "../utils/ep";
import throttle from "../utils/throttle";
import message from "../utils/message";

class EditWindow extends Component{
    constructor(props){
        super();
        this.state = {
            content: props.content
        }
        this.lastSavedContent = '';
        this.handleChange = this.handleChange.bind(this);

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
        })
    }

    emitUpdate(content){
        ep.emit('content:update', [content]);
    }

    handleChange(){
        let content = this.textarea.value;
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
        let {fullscreenEdit, width} = this.props;
        let {content} = this.state;

        let padding = '20px'
        if(width > 800){
            width -= 800;
            padding = padding + ' ' + (width / 2) + 'px'; 
        }

        return (
            <section className='edit-window'>
                <header className='tool-bar'>
                    <a href='https://github.com/wy-ei/md'>Md</a>
                    <Button text={ fullscreenEdit ? "退出全屏":"全屏编辑" } onClick={() => this.toggleFullscreenEdit()}/>
                    {/* <Button text="上传图片" onClick={()=>1}/> */}
                    <Button text="新增暂存" onClick={() => this.add()} />
                    <Button text="查看暂存" onClick={() => this.showStoreList()}/>
                    <span className="tool-bar__text">{ content.length } 字</span>
                </header>
                <div className='edit-box'>
                    <textarea
                        style={{padding: padding}}
                        ref={(ref) => {this.textarea=ref }}
                        value={content}
                        onChange={this.handleChange}>
                    </textarea>
                </div>
            </section>
        )
    }
}

EditWindow.defaultProps = {
    content: ""
};



export default EditWindow;