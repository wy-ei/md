import ReactDOM from "react-dom";
import React, {Component} from "react";
import Button from "../components/Button";
import EP from "ep.js";

const ep = new EP;

class Message extends Component{
    constructor(props){
        super();
        this.state = {
            messages: []
        }
    }

    componentDidMount(){
        ep.on('message:show', (text, duration, onClose, type) => {
            let messages = this.state.messages;
            let id = (new Date).valueOf();
            messages.push({
                text: text,
                duration: duration,
                onClose: onClose,
                type: type,
                id: id
            });
            setTimeout(()=>{
                ep.emit('message:destory', [id]);
            }, duration);
            this.setState({messages: messages});
        });

        ep.on('message:destory', (id) => {
            let messages = this.state.messages;
            let index = -1;
            messages.forEach((message,i) => {
                if(message.id === id){
                    index = i;
                }
            });

            let message = messages[index];
            if(message){
                message.onClose && message.onClose();
                messages.splice(index,1);

                this.setState({messages: messages});
            }

        });
    }

    render(){
        let {messages} = this.state;

        return(
            <div>
                {
                    messages.map(message => {
                        return (
                            <div key={message.id} className={"message__box " + "message__box--" + message.type}>
                                {message.text}
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

let inited = false;

function showMessage(text, duration, onClose, type){
    if(!inited){
        let div = document.createElement('div');
        div.setAttribute('id', '__message_container');
        document.body.appendChild(div);

        ReactDOM.render(<Message />, div);
        inited = true;
    }
    ep.emit('message:show', [text, duration, onClose, type])
}



let message = {};

['success', 'warning', 'info', 'error'].forEach(type => {
    message[type] = function(text, duration, onClose){
        if(typeof duration === 'function'){
            onClose = duration;
            duration = 2000;
        }else if(!duration){
            duration = 2000;
        }
        showMessage(text, duration, onClose, type);
    }
});

export default message;