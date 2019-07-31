import React,{Component} from "react";
import Button from "../Button";
const Markdown = require('react-markdown')
import {LAYOUT} from "../Md";
import ep from "../../utils/ep";
import renderer from './renderer';


class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };

        this.errorMessage = ''
    }

    componentDidCatch(error, info) {
        this.errorMessage = error.message.split('\n')[0];
        this.setState({ hasError: true });
        
    }

    componentWillReceiveProps(){
        this.setState({hasError: false });
    }


    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="content typo">
                    <h4>Markdown 格式有误！错误信息如下：</h4>
                    <pre>
                        <code>{this.errorMessage}</code>
                    </pre>
                    
                </div>)
        }else{
            return this.props.children;
        }
    }
}


class PreviewWindow extends Component{
    constructor(props){
        super();
        this.state = {
            fontSize: 14
        }

        this.hx = []

        this.addEventListener()
    }

    addEventListener(){
        ep.on('heading:discover', (item) => {
            if(this.hx.length == 0){
                document.title = item.text;
            }
            this.hx.push(item);
        });

        ep.on('heading:clear', () => {
            document.title = 'MD | markdown 编辑器';
            this.hx = []
        });
    }

    componentWillUpdate(){
        ep.emit('heading:clear');
    }

    componentDidUpdate(){
        ep.emit('toc:render', [this.hx])
    }

    toggleFullscreenPreview(){
        let {fullscreenPreview} = this.props;
        if(fullscreenPreview){
            ep.emit('md_layout:reset');
        }else{
            ep.emit('md_layout:update', [LAYOUT.fullscreenPreview]);
        }
    }

    adjustFontSize(){
        let {fontSize} = this.state;
        if(fontSize < 16){
            fontSize += 1;
        }else{
            fontSize = 12
        }
        this.setState({fontSize});
    }

    shouldComponentUpdate(nextProps){
        let {fullscreenEdit} = nextProps;
        return !fullscreenEdit;
    }

    print(){
        let style = document.querySelector('.monaco-colors');
        style && style.removeAttribute('media');
        window.print();
    }

    render(){
        let {fullscreenPreview, content, fullscreenEdit} = this.props;
        let {fontSize} = this.state;

        return (
            <section className='view-window'>
                <header className='tool-bar'>
                    <Button text={fullscreenPreview ?"退出全屏":"全屏预览" } onClick={() => this.toggleFullscreenPreview()}/>
                    <Button text="打印" onClick={() => this.print()}/>
                    <Button text={"字号 " + fontSize} onClick={() => this.adjustFontSize('+')}/> 
                </header>
                <div
                    className='preview-box'
                    id="js-preview-box"
                    style={{
                        fontSize: fontSize + 'px'
                    }}
                >
                    <ErrorBoundary>
                        <Markdown
                            source={content}
                            className="content typo"
                            renderers={renderer}
                            escapeHtml={false}
                            vScrollBarAlwaysVisible={true}
                        />
                    </ErrorBoundary>
                </div>
            </section>
        )
    }
}

PreviewWindow.defaultProps = {
    content: ""
}


export default PreviewWindow;