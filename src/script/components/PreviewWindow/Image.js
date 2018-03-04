import React,{Component} from "react";


class Image extends React.PureComponent {
    render(){
        let {alt, src} = this.props;
        let style = {};
        let description = null
    
        if(alt){
            let paramList = alt.split('&');
            
            paramList.forEach(function(param){
                var pair = param.split("=");
                var key = pair.shift();
                var value = pair.join('=');
        
                if(key === 'text'){
                    description = <span className="img-description">{value}</span>
                }else if(key==='center'){
                    style.display = 'block';
                    style.margin = '0 auto';
                }else{
                    if(value){
                        key = key.replace(/-(\w)/g, (a,$0) => {
                            return $0.toUpperCase();
                        });
                        style[key] = value;
                    }

                }
            });
        }
        
        return <>
            <img src={src} style={style}/>
            {description}
            
        </>
    }
}

export default Image;