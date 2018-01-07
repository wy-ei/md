import React,{Component} from "react";

class Button extends Component{
    render(){
        let {text, onClick, disable} = this.props;
        let className = 'btn'
        if(disable){
            className += ' btn--disable';
            onClick = null;
        }
        return <button disabled={disable} className={className} onClick={onClick}>{text}</button>
    }
}

export default Button;