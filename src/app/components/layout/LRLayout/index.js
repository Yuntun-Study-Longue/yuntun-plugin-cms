import React, { Component } from "react";
import "./main.scss";
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
        this.clientWidth = this.$container.clientWidth;
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
            if(e.target.matches('i')){
                return;
            }
            this.startX = e.pageX;
            this.leftW = this.isInitleftW?this.state.leftW:this.clientWidth/4;
            document.addEventListener("mousemove", mouseMoveHandle);
            document.addEventListener("mouseup", mouseUpHandle);
        };
        const mouseMoveHandle = (e) => {
            let moveX = e.pageX - this.startX;
            
            if(e.pageX<=this.dragMinW){
                this.setState({
                    leftW: this.dragMinW,
                });
            }else if(e.pageX>=(this.clientWidth-8-this.dragMinW)){
                this.setState({
                    leftW: this.clientWidth-8-this.dragMinW,
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
    toggleShow(direction){
        if(direction === 'left'){
            if(this.isOnLeftBorder){
                this.setState({
                    leftW:localStorage.getItem(`LRLayoutLeftW${this.props.id}`)?~~localStorage.getItem(`LRLayoutLeftW${this.props.id}`):this.props.defaultWidth
                })
            }else{
                this.setState({
                    leftW:0
                })
            }
        }else{
            if(this.isOnRightBorder){
                this.setState({
                    leftW:localStorage.getItem(`LRLayoutLeftW${this.props.id}`)?~~localStorage.getItem(`LRLayoutLeftW${this.props.id}`):this.props.defaultWidth
                })
            }else{
                this.setState({
                    leftW:this.clientWidth-8
                })
            }
        }
    }
    get isOnLeftBorder(){
        return this.state.leftW === 0?true:false;
    }
    get isOnRightBorder(){
        return this.state.leftW === (this.clientWidth-8)?true:false;
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
                    style={{ cursor: this.props.draggable && "col-resize" }}
                >
                    <div className="icon-area">
                        <i
                            className={`LRLayout-icon ${
                                this.isOnLeftBorder
                                    ? "arrow-right"
                                    : "arrow-left"
                            }`}
                            style={{
                                display: this.props.bothDirection
                                    ? this.isOnRightBorder
                                        ? "none"
                                        : "block"
                                    : "block",
                            }}
                            onMouseDown={() => this.toggleShow("left")}
                        ></i>
                        {this.props.bothDirection && (
                            <i
                                className={`LRLayout-icon ${
                                    this.isOnRightBorder
                                        ? "arrow-left"
                                        : "arrow-right"
                                }`}
                                style={{
                                    display: this.isOnLeftBorder
                                        ? "none"
                                        : "block",
                                }}
                                onMouseDown={() => this.toggleShow("right")}
                            ></i>
                        )}
                    </div>
                </div>
                {/* 右侧面板 */}
                <div
                    className="LRLayout-right"
                    style={{
                        width: this.isInitleftW
                            ? `calc(100% - ${this.state.leftW+8}px)`
                            : "calc(75% - 8px)",
                    }}
                >
                    {this.props.children.right}
                </div>
            </div>
        );
    }
}
export default LRLayout;
