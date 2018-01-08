import React,{Component} from "react";

class Button extends Component{
    render(){
        let {text, onClick, disable, className} = this.props;
        className = className || '';
        if(disable){
            className += ' btn--disable';
            onClick = null;
        }
        return <button disabled={disable} className={'btn ' + className} onClick={onClick}>{text}</button>
    }
}

export default Button;