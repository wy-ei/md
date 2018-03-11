import React,{Component} from "react";
import List from "./List/index";
import ep from "../utils/ep";
import Alert from "../utils/Alert";
import Button from "./Button";
import message from "../utils/message";


const STORAGE_PREFIX = 'markdown-';
const STORAGE_PREFIX_REGEX = /markdown-\d+$/;

class StorageList extends Component{
    constructor(props){
        super();
        this.state = {
            list: [],
            visible: false
        }
        //this.workspaceContent = '';
        this.clear = this.clear.bind(this);
        this.addEventListener();

        this.timer = null;
        this.content = '';
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    close(){
        this.setState({visible: false});
    }

    addEventListener(){
        
        ep.on("storage:init", ()=>{
            this.read();
        });

        ep.on("storage_list:show", ()=>{
            this.setState({visible: true});
        });

        ep.on("storage:restore", (index) => {
            Alert.alert('请确保当前工作区已经暂存，恢复后将覆盖。', [{
                text: "确定",
                callback: ()=>{
                    ep.emit('content:replace', [this.state.list[index].content]);            
                },
                className: "btn--danger",
                close: true
            },{
                text: "取消",
                close: true
            }]);
        });

        ep.on("storage:delete", (index) => {
            Alert.alert('确定要删除吗？', [{
                text: "确定",
                callback: ()=>{
                    this.delete(index);       
                },
                className: "btn--danger",
                close: true
            },{
                text: "取消",
                close: true
            }]);
        });

        ep.on("storage:add", (content) => {
            this.add(content);
        });

        ep.on("storage:save", (content) => {
            let LS = window.localStorage;
            this.content = content;
            localStorage.setItem('markdown-text', content);
        });
    }

    delete(index){
        let list = this.state.list;
        
        let LS = window.localStorage;
        LS.removeItem(STORAGE_PREFIX + list[index].date);
        list.splice(index, 1);

        this.setState({
            list: list
        });
    }

    add(content){
        let list = this.state.list;
        if(!content){
            return;
        }

        if(list.length > 0 && list[0].content === content){
            message.info('最近的一条暂存和当前工作区内容一致，无需新增。');
            return;
        }

        let item = {
            content: content,
            date: (new Date).valueOf()
        };
        list.unshift(item);

        localStorage.setItem(STORAGE_PREFIX + item.date, JSON.stringify(item));

        this.setState({
            list: list
        });
    }

    read(){
        let LS = window.localStorage;
        let list = this.state.list;

        let length = LS.length;
        
        for(let i=0;i<length;i++){
            let id = LS.key(i);
            if(STORAGE_PREFIX_REGEX.test(id)){
                let content = JSON.parse(LS.getItem(id));
                list.unshift(content);
            }
        }

        if(list.length>0){
            list.sort((a, b)=>{
                return b.date - a.date;
            });
            this.setState({list: list});            
        }

        let text = LS.getItem('markdown-text');
        if(text){
            ep.emit('content:replace', [text]);
        }else{
            fetch('./src/description.md')
            .then(res => res.text())
            .then(text => {
                if(!this.content){
                    ep.emit('content:replace', [text]);
                }
            }); 
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
                let willBeRemovedId = [];
                for(let i=0;i<length;i++){
                    let id = LS.key(i);
                    if(STORAGE_PREFIX_REGEX.test(id)){
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

    render(){
        let {list, visible} = this.state;
        return (
            <div className={"storage " + (visible ? "storage--visible": "")} onClick={() => this.close()}>
                <div
                    className={"storage__sidebar " + (visible ? "storage__sidebar--visible": "")}
                    onClick={(event)=>event.stopPropagation()}
                >
                    <header className="storage__header">
                        <div className="storage__header-title">暂存列表</div>
                        <p className="storage__header-warning">注意：所有数据均存储在本地浏览器中，清除浏览器记录、更换浏览器都会导致数据丢失，请谨慎操作。</p>
                        {/* <div className="storage__search">
                            <input className="storage__search-input" />
                        </div> */}
                    </header>
                    <List className="storage__list" list={list}/>
                    <div className="storage__list-footer">
                        <Button className={'btn--danger'} text="清除所有暂存" onClick={this.clear} />
                    </div>
                </div>
            </div>
        )
    }
}

export default StorageList;