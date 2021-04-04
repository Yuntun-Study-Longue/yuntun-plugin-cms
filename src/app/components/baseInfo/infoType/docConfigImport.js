import React, { Component } from 'react';
import SyswareTable from 'components/table/Table';
import columnConf from 'components/columnConf/columnConf';
//columnConf['Tab_Table_Requirement_Doc_Config'].splice(3,1);

export default class DocConfigImport extends Component {
    constructor(props){
        super(props);
        this.setState({
            docId:1,
            orgAttrIds:[]
        })
    }
    componentDidMount(){
        this.props.onRef(this);
    }
    // showSelection() {
    //     console.log(this.table, '====table')
    // }
    render() {
        return (
            <SyswareTable onRef={ ref => this.table = ref }
                listOption={{ uri: '/sysware/api/org-udef/list' }}
                columns={columnConf['Tab_Table_Requirement_Doc_Config']} 
                selectTreeId={1}
                tableH={380} 
            />
        )
    }
}
