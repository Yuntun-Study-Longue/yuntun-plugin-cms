import React, { Component } from "react";
import "./index.scss";
class TbLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topH: this.props.defaultHeight
                ? this.props.defaultHeight
                : localStorage.getItem(`TbLayoutTopH${this.props.id}`)
                ? ~~localStorage.getItem(`TbLayoutTopH${this.props.id}`)
                : undefined,
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        this.props.hideBottom!== nextProps.hideBottom
        && this.toggleShow(!nextProps.hideBottom)
    }
    componentDidMount() {
        this.$containerRect = this.$container.getBoundingClientRect();
        this.defaultHeight = this.props.defaultHeight || (this.$containerRect.height-10)/2;
        // 拖拽
        if (this.props.draggable) {
            //拖拽时距离边缘的最小宽度
            this.dragMinW = 50;
            this.dragAndDrop();
        }
        if(this.props.hideBottom){
            this.toggleShow(false)
        }
    }
    dragAndDrop = () => {
        const mouseDownHandle = (e) => {
            e.preventDefault();
            //阻止点击图标冒泡到此处
            if(e.target.tagName === 'I'){
                return;
            }
            this.$containerRect = this.$container.getBoundingClientRect();
            this.startY = e.pageY;
            this.topH = this.isInitTopH?this.state.topH:this.defaultHeight;
            if(this.$split.style.cursor !== 'row-resize') return;
            document.addEventListener("mousemove", mouseMoveHandle);
            document.addEventListener("mouseup", mouseUpHandle);
        };
        const mouseMoveHandle = (e) => {
            let moveY = e.pageY - this.startY;
            //距离边缘的吸附距离
            if(e.pageY<=(this.dragMinW+this.$containerRect.top)){
                this.setState({
                    topH: this.dragMinW,
                });
            }else if(e.pageY>=(this.$containerRect.bottom-this.dragMinW)){
                this.setState({
                    topH: this.$containerRect.height-10-this.dragMinW,
                });
            }else{
                this.setState({
                    topH: this.topH + moveY,
                });
            }
        };
        const mouseUpHandle = (e) => {
            //缓存左侧面板宽度
            //只有拖拽时才记录
            if(Math.abs(e.pageY - this.startY)>3){
                localStorage.setItem(`TbLayoutTopH${this.props.id}`,this.state.topH)
            }
            document.removeEventListener("mousemove", mouseMoveHandle);
            document.removeEventListener("mouseup", mouseUpHandle);
        };
        this.$split.addEventListener("mousedown", mouseDownHandle);
    }
    toggleShow(isShow){
        if(isShow){
            this.setState({
                topH:localStorage.getItem(`TbLayoutTopH${this.props.id}`)?~~localStorage.getItem(`TbLayoutTopH${this.props.id}`):this.defaultHeight
            })
        }else{
            this.setState({
                topH:this.$containerRect.height-10
            })
        }
    }
    get isOnBottomBorder(){
        return this.state.topH === (this.$container.getBoundingClientRect().height-10)?true:false;
    }
    get isInitDom(){
        return this.$container !== undefined;
    }
    get isInitTopH(){
        return this.state.topH !== undefined;
    }
    render() {
        return (
            <div
                className="TbLayout-container"
                ref={(el) => (this.$container = el)}
                style={{...(this.props.style ? this.props.style : {})}}
            >
                {/* 上侧面板 */}
                <div
                    className="TbLayout-top"
                    style={{
                        height: this.isInitTopH
                            ?this.state.topH
                            : 'calc((100% - 10px)/2)'
                    }}
                >
                    {this.props.children.top}
                </div>
                {/* 分隔栏 */}
                <div
                    id="TbLayoutSplit"
                    className="TbLayout-split"
                    ref={(el) => (this.$split = el)}
                    style={{ cursor: this.props.draggable
                        ?this.isInitDom
                            ?this.isOnBottomBorder?'':'row-resize'
                            :this.props.hideBottom?'':'row-resize'
                        :'' 
                    }}
                >
                    {this.props.closable && 
                        <i
                            className={`${
                                this.isInitDom?this.isOnBottomBorder?'arrow-top':'arrow-bottom'
                                :this.props.hideBottom?'arrow-top':'arrow-bottom'
                            }`}
                            onMouseDown={()=>this.isOnBottomBorder?this.toggleShow(true):this.toggleShow(false)}
                        ></i>
                    }
                </div>
                {/* 下侧面板 */}
                <div
                    className="TbLayout-bottom"
                    style={{
                        height:this.isInitTopH
                            ?`calc(100% - ${this.state.topH + 10}px)`
                            :'calc((100% - 10px)/2)'
                    }}
                >
                    {this.props.children.bottom}
                </div>
            </div>
        );
    }
}
export default TbLayout;
