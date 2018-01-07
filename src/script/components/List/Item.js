import React,{Component} from "react";

class Item extends Component{

    render(){
        let {date, text} = this.props;

        return (
            <li>
                <div>
                    <p>{text}</p>
                    <span>{date}</span>
                </div>
            </li>
        );
    }
}

export default Item;