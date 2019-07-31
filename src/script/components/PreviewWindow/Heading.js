import React,{PureComponent} from "react";
import ep from "../../utils/ep";

const seen_slug = {}

class Heading extends PureComponent {
    constructor(props){
        super();
        this.id = Math.random()
    }
    

    slug(value) {
        let slug = value
            .toLowerCase()
            .trim()
            .split(' ').join('-')
            .split(/[\|\$&`~=\\\/@+*!?\(\{\[\]\}\)<>=.,;:'"^。？！，、；：“”【】（）〔〕［］﹃﹄“”‘’﹁﹂—…－～《》〈〉「」]/g).join('')
            .replace(/\t/, '--');
      
        if (seen_slug.hasOwnProperty(slug)) {
          var original_slug = slug;
          do {
            seen_slug[original_slug]++;
            slug = original_slug + '-' + seen_slug[original_slug];
          } while (seen_slug.hasOwnProperty(slug));
        }
        seen_slug[slug] = 0;
      
        return slug;
    };

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
        // let anchor = null;

        if(level < 5){
            // anchor = <a name={anchorText}></a>
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