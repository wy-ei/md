import React,{PureComponent} from "react";
import ep from "../../utils/ep";


class Heading extends PureComponent {
    constructor(props){
        super();
        this.id = Math.random()
    }
    
    getInnerText(children){
        let text = []
        React.Children.forEach(children, (child) => {
            if(React.isValidElement(child)){
                let child_children = child.props.children;
                text.push(this.getInnerText(child_children));
            }else{
                text.push(child);
            }
        })
        return text.join('');
    }

    render(){
        let {level, children} = this.props;

        let innerText = this.getInnerText(children);
        let anchorText = innerText.replace(/\s/g, '-');
        let anchor = null;

        if(level < 5){
            anchor = <a name={anchorText}></a>
            ep.emit('heading:discover', {
                level: level,
                anchorText: anchorText,
                text: innerText
            });
        }

        return React.createElement('h' + level, {
            id: anchorText
        }, <>
            {children}
        </>)
    }
}

export default Heading;