import React,{PureComponent} from "react";
import ep from "../../utils/ep";

let Chart = null;


class CodeBlock extends PureComponent {

    constructor(props) {
        super(props);
        this.chart_object = null;
    }

    componentDidMount() {
        let {language} = this.props;
        if(language == 'chart'){
            this.chart();
        }else{
            this.highlight();
        }
    }

    componentDidUpdate() {
        let {language} = this.props;

        if(language == 'chart'){
            this.chart('update');
        }else{
            this.highlight();
        }
    }


    chart(update){
        let {value} = this.props;
        if(!Chart){
            window.require(['https://cdn.bootcss.com/Chart.js/2.7.2/Chart.bundle.js'], (_Chart) => {
                Chart = _Chart;
                this.chart();
            });
        }else{
            let data = null;
            let dataParseError = false;
            try{
                data = eval('data=' + value);
            }catch(e){
                data = null;
                dataParseError = true;
            }
            if(!dataParseError){
                if(!update || !this.chartObject){
                    let cxt = this.chart_canvas.getContext('2d');
                    this.chartObject = new Chart(cxt, data);
                }else{
                    for(let key in data){
                        this.chartObject.config[key] = data[key];
                    }
                    this.chartObject.update({
                        duration: 800,
                        easing: 'easeOutBounce'
                    });
                }
                
            }
        }
    }

    highlight(){
        if(window.monaco){
            let firstChild = this.code && this.code.firstChild;
            if(firstChild && firstChild.nodeValue && firstChild.nodeValue.trim()){
                try{
                    window.monaco && monaco.editor.colorizeElement(this.code, {tableSize: 4});
                }catch(err){}
            }
        }else{
            ep.once('codeblock:highlight', ()=>{
                this.highlight();
            });
        }
    }



    render() {

        let {language, value} = this.props;

        if(language === 'chart'){
            return (
                <div className="language-chart">
                    <canvas ref={ref=>this.chart_canvas = ref}></canvas>
                </div>
            )
        }

        return (
            <pre>
                <code
                    ref={ref=>this.code = ref}
                    data-lang={this.props.language}
                    className={`language-${this.props.language}`}
                >
                {this.props.value}
                </code>
            </pre>
        )
    }
}

export default CodeBlock;