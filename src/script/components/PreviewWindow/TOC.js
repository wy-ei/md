import React,{Component} from "react";
import LazyLoad from "../../lib/lazyload";
import ep from "../../utils/ep";
import minBy from "lodash/minBy";

class TOC extends Component {
    constructor(props){
        super();
        this.hx = [];
        this.addEventListener();
    }
    
    addEventListener(){
        ep.on('toc:render', (hx) => {
            this.hx = hx;
            this.forceUpdate()
        });
    }


    render(){
        let hx = this.hx;
        

        if(hx.length == 0){
            return null
        }

        let topLevel = minBy(hx, (h) => h.level).level;

        return <div>
            <h3>目录：</h3>
            {hx.map(h => {
                return <li key={h.anchorText} className={"catalogue-level-" + (h.level - topLevel)}>
                    <a href={'#' + h.anchorText}>{h.text}</a>
                </li>
            })}
        </div>
    }
}

export default TOC;