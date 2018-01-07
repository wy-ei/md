import React,{Component} from "react";
import Item from "./Item";
import Button from "../Button";
import date from "../../utils/date";
import ep from "../../utils/ep";

class List extends Component{
    constructor(props){
        super();
    }

    restore(index){
        ep.emit("storage:restore", [index]);
    }


    render(){
        let {list, className} = this.props;
        let content = list.map((item,index,list) => {
            
            let newlineIndex = item.content.indexOf('\n');
            if(newlineIndex === -1){
                newlineIndex = Math.min(20, item.content.length);
            }
            let excerpt = item.content.slice(0, newlineIndex);
            
            return (
            <li key={item.date} className="storage__list-item">
                <Button text="恢复" onClick={() => this.restore(index)}  />
                <div>
                    <p className="text">{excerpt}</p>
                    <span className="date">{date(item.date, "%Y-%m-%d %I:%M:%s %p")}</span>
                </div>
            </li>
            );
        })
        return (
            <div className="storage__list">
                <ul className="storage__list-inner">{content}</ul>
            </div>
        )
    }
}

List.defaultProps = {
    list: []
};


export default List;