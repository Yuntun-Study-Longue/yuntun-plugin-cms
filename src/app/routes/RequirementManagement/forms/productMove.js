import React, { Component } from 'react'
import SysModal from 'components/sysModal'
import SysTree from 'components/SysTree'
class ProductMove extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectRows:[]
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    onSelect=(selectRows)=>{
        this.setState({selectRows})
    }
    submit=(cb)=>{
        const currentIds = this.props.currentIds;
        const targetId = this.state.selectRows.map(item=>item.id).join(',');
        if(!targetId){
            SysModal.error('请选择目标节点！');
            return
        }
        cb({currentIds,targetId})
    }
    render() {
        return (
            <div style={{height:400}}>
                <SysTree
                    dataUrl="/sysware/api/project/list"
                    onSelect={this.onSelect}
                    expandedLevel={3}
                />
            </div>
        )
    }
}
export default ProductMove