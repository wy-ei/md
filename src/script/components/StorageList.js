import React,{Component} from "react";
import List from "./List/index";
import ep from "../utils/ep";
import Alert from "../utils/Alert";
import Button from "./Button";

class StorageList extends Component{
    constructor(props){
        super();
        this.state = {
            list: [],
            visible: false
        }
        this.clear = this.clear.bind(this);
        this.addEventListener();
    }

    componentDidMount(){
        this.restore();
    }

    close(){
        this.setState({visible: false});
    }

    addEventListener(){
        ep.on("storage:show", ()=>{
            this.setState({visible: true});
        });

        ep.on("storage:restore", (index) => {
            Alert.alert('请确保当前工作区已经暂存，恢复后将覆盖', [{
                text: "确定",
                callback: ()=>{
                    ep.emit('content:update', [this.state.list[index].content]);            
                },
                close: true
            },{
                text: "取消",
                close: true
            }]);
        });

        ep.on("storage:new", (content) => {
            let list = this.state.list;
            if(list.length > 0 && list[0].content === content){
                return;
            }
            list.unshift({
                content: content,
                date: (new Date).valueOf()
            });

            this.setState({
                list: list
            });

            this.store();
        });
    }

    store(){
        let list = this.state.list;

        let LS = window.localStorage;
        let catalogue = LS.getItem('md-catalogue');
        if(catalogue){
            catalogue = JSON.parse(catalogue);
        }else{
            catalogue = [];
        }

        list.forEach(item => {
            if(!item.stored){
                catalogue.unshift('md-' + item.date);
                let data = {
                    content: item.content,
                    date: item.date
                }
                LS.setItem('md-' + item.date, JSON.stringify(data));
            }
        });     
        
        while(catalogue.length > 100){
            LS.removeItem(catalogue.pop());
        }

        LS.setItem('md-catalogue', JSON.stringify(catalogue));
    }

    restore(){

        let LS = window.localStorage;
        let catalogue = LS.getItem('md-catalogue');
        if(catalogue){
            catalogue = JSON.parse(catalogue);
        }else{
            catalogue = [];
        }
        let list = catalogue.map(id => {
            let content = JSON.parse(LS.getItem(id));
            content.stored = true;
            return content;
        });

        this.setState({list: list});

        if(list.length>0){
            ep.emit('content:update', [list[0].content]);            
        }
    }

    clear(){
        let LS = window.localStorage;
        let catalogue = LS.getItem('md-catalogue');
        if(catalogue){
            catalogue = JSON.parse(catalogue);
        }else{
            catalogue = [];
        }
        let list = catalogue.forEach(id => {
            LS.removeItem(id);
        });

        LS.setItem('md-catalogue', JSON.stringify([]));
        
        this.setState({list: []});
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
                            <Button text="清空历史记录" onClick={this.clear} />
                            <Button text="新增历史记录" onClick={()=>{ep.emit("edit:store")}} />
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