import React, { Component } from "react";
import "./index.scss";
class LRLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftW: this.props.defaultWidth
                ? this.props.defaultWidth
                : localStorage.getItem(`LRLayoutLeftW${this.props.id}`)
                ? ~~localStorage.getItem(`LRLayoutLeftW${this.props.id}`)
                : undefined,
        };
    }
    componentDidMount() {
        // 拖拽
        if (this.props.draggable) {
            //拖拽时距离边缘的最小宽度
            this.dragMinW = 100;
            this.dragAndDrop();
        }
    }
    dragAndDrop = () => {
        const $split = document.getElementById(`LRLayoutSplit${this.props.id}`);
        const mouseDownHandle = (e) => {
            e.preventDefault();
            //阻止点击图标冒泡到此处
            if(e.target.tagName === 'I'){
                return;
            }
            this.containerRect = this.$container.getBoundingClientRect();
            this.containerWidth = this.containerRect.width;
            this.containerLeft = this.containerRect.left;
            this.startX = e.pageX;
            this.leftW = this.isInitleftW?this.state.leftW:this.containerWidth/4;
            //靠边禁止拖拽
            if(this.isOnLeftBorder) return;
            document.addEventListener("mousemove", mouseMoveHandle);
            document.addEventListener("mouseup", mouseUpHandle);
        };
        const mouseMoveHandle = (e) => {
            let moveX = e.pageX - this.startX;
            if(e.pageX <= this.containerLeft+this.dragMinW){
                this.setState({
                    leftW: this.dragMinW,
                });
            }else if(e.pageX>=(this.containerLeft+this.containerWidth-10-this.dragMinW)){
                this.setState({
                    leftW: this.containerWidth-10-this.dragMinW,
                });
            }else{
                this.setState({
                    leftW: this.leftW + moveX,
                });
            }
        };
        const mouseUpHandle = (e) => {
            //缓存左侧面板宽度
            //只有拖拽时才记录
            if(Math.abs(e.pageX - this.startX)>3){
                localStorage.setItem(`LRLayoutLeftW${this.props.id}`,this.state.leftW)
            }
            document.removeEventListener("mousemove", mouseMoveHandle);
            document.removeEventListener("mouseup", mouseUpHandle);
        };
        $split.addEventListener("mousedown", mouseDownHandle);
    };
    toggleShow(isShow){
        if(isShow){
            this.setState({
                leftW:localStorage.getItem(`LRLayoutLeftW${this.props.id}`)?~~localStorage.getItem(`LRLayoutLeftW${this.props.id}`):this.props.defaultWidth
            })
        }else{
            this.setState({
                leftW:0
            })
        }
    }
    get isOnLeftBorder(){
        return this.state.leftW === 0?true:false;
    }
    get isInitleftW(){
        return this.state.leftW !== undefined;
    }
    render() {
        return (
            <div 
                className="LRLayout-container" 
                style={{ ...this.props.style?this.props.style:{}}}
                ref={(el)=>this.$container = el}
            >
                {/* 左侧面板 */}
                <div
                    className="LRLayout-left"
                    style={{
                        width: this.isInitleftW ? this.state.leftW : "25%",
                    }}
                >
                    {this.props.children.left}
                </div>
                {/* 分隔栏 */}
                <div
                    id={`LRLayoutSplit${this.props.id}`}
                    className="LRLayout-split"
                    style={{ cursor: this.props.draggable && !this.isOnLeftBorder && "col-resize" }}
                >
                    {this.props.closable &&
                        <i 
                            className={`${
                                this.isOnLeftBorder
                                    ? "arrow-right"
                                    : "arrow-left"
                            }`}
                            onMouseDown={() => this.isOnLeftBorder?this.toggleShow(true):this.toggleShow(false)}
                        >
                        </i>
                    }
                </div>
                {/* 右侧面板 */}
                <div
                    className="LRLayout-right"
                    style={{
                        width: this.isInitleftW
                            ? `calc(100% - ${this.state.leftW+10}px)`
                            : "calc(75% - 10px)",
                    }}
                >
                    {this.props.children.right}
                </div>
            </div>
        );
    }
}
function LeftPanel(props){
    return (
        <div className="LRLayout-left-panel">
            {props.children}
        </div>
    )
}
function RightPanel(props){
    return (
        <div className="LRLayout-right-panel">
            {props.children}
        </div>
    )
}
LRLayout.LeftPanel = LeftPanel;
LRLayout.RightPanel = RightPanel;
export default LRLayout;
