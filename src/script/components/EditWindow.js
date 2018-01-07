import React,{Component} from "react";
import Button from "./Button";
import {LAYOUT} from "./Md";
import Alert from "../utils/Alert";
import ep from "../utils/ep";

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
        this.timer = null;

        this.addEventListener();
    }

    addEventListener(){
        ep.on('edit:store', ()=>{
            let content = this.state.content;
            if(content){
                ep.emit("storage:new", [this.state.content]);                 
            }else{
                Alert.alert('当前内容为空，无需保存');
            }
        })
    }

    componentWillReceiveProps(props){
        this.setState({
            content: props.content 
        })
    }

    componentDidMount(){
        // 三分钟存一次
        this.timer = setInterval(()=>{
            let content = this.state.content;
            if(content && content!==this.oldContent){
                this.oldContent = content;
                ep.emit("storage:new", [content]);                
            }
        }, 1000 * 60 * 3);

        window.addEventListener('unload', ()=>{
            ep.emit('edit:store');
        })
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    handleChange(){
        let content = this.textarea.value;
        this.setState({content: content});
        ep.emit('content:update', [content]);
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
                    <Button text="上传图片" onClick={()=>1}/>
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