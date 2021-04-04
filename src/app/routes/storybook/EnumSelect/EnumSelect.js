import React, { Component } from 'react';
import Select from 'sub-antd/lib/select';
const Option = Select.Option;

export default class EnumSelect extends Component {
    constructor(props) {
        super(props)
        this.state = { list: [{
            label: 'IDP001',
            key: 'af5259ba112348f9a7770422a81ff2ac_sw',
          }, {
            label: 'IDP002',
            key: '56128f7d61a04c2297c5de3a11697f25_sw',
          }, {
            label: 'IDP003',
            key: 'ea758e56ae8a479ea51e59b66884e2ff_sw',
          }, {
            label: 'IDP004',
            key: '166c23464e084ddb98d15cd09c6dd620_sw',
        }] }
    }
    componentDidMount() {}
    handleChange(value) {
        console.log(`selected ${value}`);
    }
    render() {
        return (<Select multiple
            filterOption={false}
            style={{ width: '100%' }}
            placeholder="多选控件，所选项显示方式：选项一, 选项二, 选项三"
            defaultValue={[{
              label: 'IDP004',
              key: '166c23464e084ddb98d15cd09c6dd620_sw',
            }]}
            onChange={this.handleChange}
            labelInValue
          >
            {
              this.state.list.map(item => {
                return <Option key={item.key}>{item.label}</Option>;
              })
            }
          </Select>);
    }
}


