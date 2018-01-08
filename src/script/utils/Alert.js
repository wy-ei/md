import ReactDOM from "react-dom";
import React, {Component} from "react";
import Button from "../components/Button";
import EP from "ep.js";

const ep = new EP;

class AlertComponent extends Component{
    close(callback){
        ep.emit('alert:close');
        callback && callback();
    }

    render(){
        let {text, btns} = this.props;
        if(!btns){
            btns = [{text: '确定', close: true}];
        }
        btns.reverse();
        return(
            <div className="alert">
                <div className="alert__box">
                    <div className="alert__content">
                        <p>{text}</p>
                    </div>
                    <div className="alert__footer">
                    {
                        btns.map(btn => {
                            let callback = btn.callback;
                            if(btn.close){
                                callback = ()=>{
                                    this.close(btn.callback)
                                }
                            }
                            return  <Button className={btn.className} key={btn.text} text={btn.text} onClick={callback}/>
                        })
                    }
                    </div>
                </div>
            </div>
        )
    }
}

let inited = false;

function init(){
    let div = document.createElement('div');
    div.setAttribute('id', '__alter_container');
    document.body.appendChild(div);

    ep.on('alert:close', ()=>{
        ReactDOM.unmountComponentAtNode(div);
    });
}

function alert(text, btns){
    if(!inited){
        init();
    }
    let div = document.getElementById('__alter_container');
    ReactDOM.render(<AlertComponent text={text} btns={btns} />, div)
}

let Alert = {
    alert: alert
}

export default Alert;