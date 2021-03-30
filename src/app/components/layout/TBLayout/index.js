import React, { Component } from "react";
import "./main.scss";
class TbLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.$containerRect = this.$container.getBoundingClientRect();
        this.defaultHeight = this.props.defaultHeight || (this.$containerRect.height-8)/2;
        if(this.props.hideBottom){
            this.state = {
                topH:this.$containerRect.height-8
            }
        }else{
            this.state = {
                topH:this.defaultHeight
            }
        }
        // 拖拽
        if (this.props.draggable) {
            //拖拽时距离边缘的最小宽度
            this.dragMinW = 50;
            this.dragAndDrop();
        }
    }
    dragAndDrop = () => {
        const mouseDownHandle = (e) => {
            e.preventDefault();
            //阻止点击图标冒泡到此处
            if(e.target.matches('i')){
                return;
            }
            this.startY = e.pageY;
            this.topH = this.state.topH;
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
                    topH: this.$containerRect.height-8-this.dragMinW,
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
    showBottomPanel(){
        this.setState({
            topH:localStorage.getItem(`TbLayoutTopH${this.props.id}`)?~~localStorage.getItem(`TbLayoutTopH${this.props.id}`):this.defaultHeight
        })
    }
    hideBottomPanel(){
        this.setState({
            topH:this.$containerRect.height-8
        })
    }
    toggleShow(direction){
        if(direction === 'top'){
            if(this.isOnTopBorder){
                this.setState({
                    topH:localStorage.getItem(`TbLayoutTopH${this.props.id}`)?~~localStorage.getItem(`TbLayoutTopH${this.props.id}`):this.defaultHeight
                })
            }else{
                this.setState({
                    topH:0
                })
            }
        }else{
            if(this.isOnBottomBorder){
                this.showBottomPanel();
                // this.setState({
                //     topH:localStorage.getItem(`TbLayoutTopH${this.props.id}`)?~~localStorage.getItem(`TbLayoutTopH${this.props.id}`):this.defaultHeight
                // })
            }else{
                this.hideBottomPanel();
                // this.setState({
                //     topH:this.$containerRect.height-8
                // })
            }
        }
    }
    get isOnTopBorder(){
        return this.state.topH === 0?true:false;
    }
    get isOnBottomBorder(){
        return this.state.topH === (this.$containerRect.height-8)?true:false;
    }
    get isInitTopH(){
        return this.state.topH !== undefined;
    }
    get firstIcon(){
        return this.isInitTopH
            ?this.isOnBottomBorder?'arrow-top':'arrow-bottom'
            :this.props.hideBottom?'arrow-top':'arrow-bottom'
    }
    get firstIconDisplay(){
        return this.props.bothDirection
            ? this.isInitTopH
                ?this.isOnTopBorder?'none':'block'
                :this.props.hideBottom?'block':'none'
            :'block';
    }
    get secondIcon(){
        return this.isInitTopH
            ?this.isOnTopBorder?'arrow-bottom':'arrow-top'
            :this.props.hideBottom?'arrow-top':'arrow-bottom'
    }
    get secondIconDisplay(){
        return this.isInitTopH
            ?this.isOnBottomBorder?'none':'block'
            :this.props.hideBottom?'none':'block'
    }
    render() {
        return (
            <div
                className="TbLayout-container"
                ref={(el) => (this.$container = el)}
                style={{...this.props.style?this.props.style:{}}}
            >
                {/* 上侧面板 */}
                <div
                    className="TbLayout-top"
                    style={{
                        height: this.isInitTopH
                            ?this.state.topH
                            :this.props.hideBottom
                            ? 'calc(100% - 8px)'
                            : 'calc((100% - 8px)/2)'
                    }}
                >
                    {this.props.children.top}
                </div>
                {/* 分隔栏 */}
                <div
                    id="TbLayoutSplit"
                    className="TbLayout-split"
                    ref={(el) => (this.$split = el)}
                    style={{ cursor: this.props.draggable && "row-resize" }}
                >
                    <div
                        className="TbLayout-icon-area"
                        style={{ width: this.props.bothDirection ? 130 : 65 }}
                    >
                        <i
                            className={`TbLayout-icon ${this.firstIcon}`}
                            style={{display:this.firstIconDisplay}}
                            onMouseDown={()=>this.toggleShow('bottom')}
                        ></i>
                        {
                        this.props.bothDirection &&
                        <i
                            className={`TbLayout-icon ${this.secondIcon}`}
                            style={{display:this.secondIconDisplay}}
                            onMouseDown={()=>this.toggleShow('top')}
                        ></i>
                        }
                    </div>
                </div>
                {/* 下侧面板 */}
                <div
                    className="TbLayout-bottom"
                    style={{
                        height:this.isInitTopH
                            ?`calc(100% - ${this.state.topH + 8}px)`
                            : this.props.hideBottom
                            ? 0
                            :'calc((100% - 8px)/2)'
                    }}
                >
                    {this.props.children.bottom}
                </div>
            </div>
        );
    }
}
export default TbLayout;
