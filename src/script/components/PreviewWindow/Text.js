import React,{PureComponent} from "react";
import Tex from './Tex';

class Text extends PureComponent{
    render(){
        let {text} = this.props;

        let rBlockMath = /\$\$([\s\S]*?)\$\$/gm;
        let rInlineMath = /\$([\s\S]+?)\$/mg;

        // block Tex command
        let match = rBlockMath.exec(text);
        if(match){
            let content = match[1].trim();
            return <Tex block={true} content={content}/>
        }

        // inline Tex command
        match = rInlineMath.exec(text);
        if(match){
            let lastIndex = 0;
            let content = [];
            while(match){
                content.push(text.slice(lastIndex, match.index));
                content.push(
                    <Tex key={lastIndex} block={false} content={match[1]}/>
                )
                lastIndex = rInlineMath.lastIndex;
                match = rInlineMath.exec(text);
            }
            content.push(text.slice(lastIndex));
            return <>{content}</>
        }

        return text;
    }
}


export default Text;