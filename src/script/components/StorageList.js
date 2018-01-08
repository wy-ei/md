import React,{Component} from "react";
import List from "./List/index";
import ep from "../utils/ep";
import Alert from "../utils/Alert";
import message from "../utils/message";
import Button from "./Button";

const STORAGE_PREFIX = 'md-';

class StorageList extends Component{
    constructor(props){
        super();
        this.state = {
            list: [],
            visible: false
        }
        this.workspaceContent = '';
        this.clear = this.clear.bind(this);
        this.addEventListener();

        this.timer = null;
    }

    componentDidMount(){
        this.restore();
        // 三分钟存一次
        this.timer = setInterval(()=>{
            let content = this.workspaceContent;
            ep.emit("storage:new", [content]);
        }, 1000 * 60 * 3);

        window.addEventListener('unload', ()=>{
            ep.emit("storage:new", [this.workspaceContent]);
        });
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    close(){
        this.setState({visible: false});
    }

    addEventListener(){
        ep.on("storage:show", ()=>{
            this.setState({visible: true});
        });

        ep.on("storage:restore", (index) => {
            Alert.alert('请确保当前工作区已经暂存，恢复后将覆盖。', [{
                text: "确定",
                callback: ()=>{
                    ep.emit('content:update', [this.state.list[index].content]);            
                },
                className: "btn--danger",
                close: true
            },{
                text: "取消",
                close: true
            }]);
        });

        ep.on("storage:new", (content) => {
            let list = this.state.list;
            if(!content || (list.length > 0 && list[0].content === content)){
                return;
            }
            let item = {
                content: content,
                date: (new Date).valueOf()
            };
            list.unshift(item);

            localStorage.setItem(STORAGE_PREFIX + item.date, JSON.stringify(item));

            while(list.length >100){
                let item = list.pop();
                LS.removeItem(STORAGE_PREFIX + item.id);
            }

            this.setState({
                list: list
            });
        });

        ep.on('content:update', (content)=>{
            this.workspaceContent = content;
        });
    }

    restore(){
        let LS = window.localStorage;
        let list = this.state.list;

        let length = LS.length;
        let r = /md-\d+$/;
        for(let i=0;i<length;i++){
            let id = LS.key(i);
            if(r.test(id)){
                let content = JSON.parse(LS.getItem(id));
                list.unshift(content);
            }
        }

        if(list.length>0){
            list.sort((a, b)=>{
                return b.date - a.date;
            });
            this.setState({list: list});
            ep.emit('content:update', [list[0].content]);            
        }
    }

    clear(){
        Alert.alert("确认清空吗？清空后不可恢复。", [{
            text: "确定",
            close: true,
            className: "btn--danger",
            callback: () => {
                let LS = window.localStorage;
                let length = LS.length;

                // localStorage 添加或者删除后长度会变化
                let r = /md-\d+$/;
                let willBeRemovedId = [];
                for(let i=0;i<length;i++){
                    let id = LS.key(i);
                    if(r.test(id)){
                        willBeRemovedId.push(id);
                    }
                }
                willBeRemovedId.forEach(id => LS.removeItem(id));
                this.setState({list: []});
            }
        },{
            text: "取消",
            close: true
        }]);


    }
    
    add(){
        let list = this.state.list;
        if(list.length !== 0 && this.workspaceContent === this.state.list[0].content){
            message.info('最近一条历史记录，和当前工作区内容一致，无需新增');
        }else{
            ep.emit('storage:new', [this.workspaceContent]);
        }
    }

    render(){
        let {list, visible} = this.state;
        return (
            <div className={"storage " + (visible ? "storage--visible": "")} onClick={() => this.close()}>
                <div
                    className={"storage__sidebar " + (visible ? "storage__sidebar--visible": "")}
                    onClick={(event)=>event.stopPropagation()}
                >
                    <header className="storage__header">
                        <div className="storage__header-title">历史记录</div>
                        <p className="storage__header-hint">三分钟自动保存一次历史记录</p>
                        {/* <div className="storage__search">
                            <input className="storage__search-input" />
                        </div> */}
                        <div>
                            <Button className={'btn--danger'} text="清空历史记录" onClick={this.clear} />
                            <Button text="新增历史记录" onClick={() => this.add()} />
                        </div>
                    </header>
                    <List className="storage__list" list={list}/>
                    <p className="storage__warning">注意：所有数据均存储在本地浏览器中，清除浏览器记录、更换浏览器都会导致数据丢失，此工具系作者日常编辑预览 Markdown 所有，不保证可靠性。</p>
                    </div>
            </div>
        )
    }
}

export default StorageList;