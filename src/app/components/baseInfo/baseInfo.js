import React, { Component } from 'react';
import { EnumInfo, EnumInfoEdit, LongTextInfo, LongTextInfoEdit, OtherInfo, OtherInfoEdit,
    RightVerticalInfo,RightVerticalInfoEdit,
    SelectTreeInfo,SelectTreeInfoEdit,
    DocConfigInfo,DocConfigInfoEdit
} from './infoType';
import './baseInfo.scss';

export default class BaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'plain'
        }
    }
    UNSAFE_componentWillReceiveProps(nextProp, nextState) {
       JSON.stringify(this.props.baseData)  !== JSON.stringify(nextProp.baseData) && this.setState({ mode: 'plain', baseData: nextProp.baseData})
    }
    render() {
        return (
          <div className="demand-management-base-info">
              <div className="opeation-icon" onClickCapture={() => {
                  if (this.state.mode === 'modify') {
                    this.child.save((data) => {
                        this.props.refresh(data);
                        this.setState({mode: 'plain'})
                    });
                  }
                  else {
                    this.setState({mode: 'modify'})}
                  }
                }>
        { this.state.mode === 'plain' && <span title="修改" className="icon icon-edit"></span> }
        { this.state.mode ==='modify' && <span title="保存" className="icon icon-save"></span> }
            </div>
            <div style={{height:'calc(100% - 26px)',overflowY:'auto'}}>
                {
                    this.props.tableType === 'requirementManagement_selectTree_info'?
                    this.state.mode === 'plain' ? <SelectTreeInfo baseData={this.props.baseData} />: <SelectTreeInfoEdit onRef={(ref) => this.child = ref} baseData={this.props.baseData} /> :
                    this.props.tableType === 'requirementManagement_rightVertical_info'?
                    this.state.mode === 'plain' ? <RightVerticalInfo baseData={this.props.baseData} />: <RightVerticalInfoEdit onRef={(ref) => this.child = ref} baseData={this.props.baseData} /> :
                    this.props.tableType === 'requirement_doc_config_info'?
                    this.state.mode === 'plain' ? <DocConfigInfo baseData={this.props.baseData} />: <DocConfigInfoEdit onRef={(ref) => this.child = ref} baseData={this.props.baseData} /> :
                    this.props.baseData.attrType === 5 ? 
                    this.state.mode === 'plain' ? <EnumInfo baseData={this.state.baseData || this.props.baseData}/> : <EnumInfoEdit onRef={(ref) => this.child = ref} baseData={this.props.baseData} /> :
                    this.props.baseData.attrType === 1 ? 
                    this.state.mode === 'plain' ? <LongTextInfo baseData={this.props.baseData} />: <LongTextInfoEdit onRef={(ref) => this.child = ref} baseData={this.props.baseData} /> :
                    this.state.mode === 'plain' ? <OtherInfo baseData={this.props.baseData} /> : <OtherInfoEdit onRef={(ref) => this.child = ref} baseData={this.props.baseData} />
                }
            </div>
          </div>
        )
    }
}