import React,{PureComponent} from "react";

let ChartJS = null;


class Chart extends PureComponent {

    constructor(props) {
        super(props);
        this.chart = null;
    }

    componentDidMount() {        
        this.draw();
        document.addEventListener('copy', () => {
            let image = document.createElement('img');
            image.src = this.canvas.toDataURL();
            this.canvas.parentElement.insertBefore(image, this.canvas);
            this.canvas.style.display = 'none';
            setTimeout(()=>{
                image.remove();
                this.canvas.style.display = 'initial';
            }, 100);
        });
    }

    componentDidUpdate() {
        this.redraw();
    }

    parseData(data){
        try{
            data = eval('data=' + data);
        }catch(e){
            data = null;
        }
        return data;
    }

    draw(){
        let {data} = this.props;
        if(!ChartJS){
            window.require(['https://cdn.bootcss.com/Chart.js/2.7.2/Chart.bundle.js'], (_) => {
                ChartJS = _;
                this.draw();
            });
        }else{
            data = this.parseData(data);
            if(data){
                let cxt = this.canvas.getContext('2d');
                try{
                    this.chart = new ChartJS(cxt, data);                    
                }catch(e){}
            }
        }
    }

    redraw(){
        let {data} = this.props;
        data = this.parseData(data);
        if (!data){
            return;
        }
        for(let key in data){
            this.chart.config[key] = data[key];
        }
        this.chart.update({
            duration: 800,
            easing: 'easeOutBounce'
        });
    }

    render() {        
        return (
            <div className="language-chart">
                <canvas ref={ref=>this.canvas = ref}></canvas>
            </div>
        )
    }
}

export default Chart;