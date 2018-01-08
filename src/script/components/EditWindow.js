import React,{Component} from "react";
import Button from "./Button";
import {LAYOUT} from "./Md";
import Alert from "../utils/Alert";
import ep from "../utils/ep";
import throttle from "../utils/throttle";

class EditWindow extends Component{
    constructor(props){
        super();
        this.state = {
            content: props.content
        }
        this.oldContent = props.content;
        this.handleChange = this.handleChange.bind(this);
        this.toggleFullscreenEdit = this.toggleFullscreenEdit.bind(this);
        this.showStoreList = this.showStoreList.bind(this);

        this.emitUpdate = throttle(this.emitUpdate, 500);
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
            ep.emit('layout:reset');
        }else{
            ep.emit('layout:update', [LAYOUT.fullscreenEdit]);
        }
    }

    showStoreList(){
        ep.emit("storage:show");
    }

    render(){
        let {fullscreenEdit} = this.props;
        let {content} = this.state;

        return (
            <section className='edit-window'>
                <header className='tool-bar'>
                    <a href='https://github.com/wy-ei/md'>Md</a>
                    <Button text={ fullscreenEdit ? "退出全屏":"全屏编辑" } onClick={this.toggleFullscreenEdit}/>
                    {/* <Button text="上传图片" onClick={()=>1}/> */}
                    <Button text="历史记录" onClick={this.showStoreList}/>
                    <span className="tool-bar__text">{ content.length } 字</span>
                </header>
                <div className='edit-box'>
                    <textarea
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