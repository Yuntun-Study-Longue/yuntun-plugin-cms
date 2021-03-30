import React, { Component } from 'react';
import Form from 'sub-antd/lib/form';
import {twoColLayout, fourColLayout, halfFourColLayout, halfFourColLayoutFn, fourColLayoutFn, twoColLayoutFn, noLabelColLayout, noLabelColLayoutFn} from "components/layout/formLayout";
import TreeSelect from 'sub-antd/lib/tree-select';
import axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import Input from 'sub-antd/lib/input';
import Checkbox from 'sub-antd/lib/checkbox';
import Table from 'sub-antd/lib/table';
import columnConf from 'components/columnConf/columnConf';
import Button from 'sub-antd/lib/button';
import Upload from 'sub-antd/lib/upload';
import Col from 'sub-antd/lib/col';
import message from "sub-antd/lib/message";
import Select from 'sub-antd/lib/select';
import FilterItem from './FilterItem';
import dot from 'dot-object';
const Option = Select.Option;
import './main.scss';

const InputGroup = Input.Group;
const qs = require('querystring');

class FilterSetting extends Component {
    static defaultProps = {
        viewAttrRela: [],
        conditionGroup: [{
            "oprate":1,
            "viewId":1,
            "name":"条件组1",
            "condition":[{
                "viewAttrRelaId":1,
                "arithmeticOprate":"1",
                "firstValue":"1",
                "caluOprate":1,
            },
            {
                "viewAttrRelaId":1,
                "arithmeticOprate":1,
                "firstValue":"1",
            }]
        },
        {
            "viewId":1,
            "name":"条件组2",
            "condition":[{
                "viewAttrRelaId":1,
                "arithmeticOprate":1,
                "firstValue":"1",
            }]
        }]
    }
    constructor(props) {
        super(props)
        this.state = {
            viewAttrRela: this.props.viewAttrRela,
            conditionGroup: this.props.conditionGroup,
        }
    }
    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
        this.initCondition()
    }
    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.shouldResetFilter) {
            this.resetCondition(() => this.props.resetFilterSetting(false))
            
        }
    }
    initCondition() {
        const conditionGroup = this.state.conditionGroup.map(group => {
            if (!group.condition.length) {
                return { ...group, condition: [
                    {
                        "viewAttrRelaId":0,
                        "arithmeticOprate":0,
                        "firstValue":"",
                        "caluOprate":1,
                    }
                ]}
            }
            return group
        })
        this.setState({ conditionGroup });
    }
    resetCondition(callback) {
        const conditionGroup = this.state.conditionGroup.map(group => {
            return { ...group, condition: [
                {
                    "viewAttrRelaId":0,
                    "arithmeticOprate":0,
                    "firstValue":"",
                    "caluOprate":1,
                }
            ]}
        })
        console.log(conditionGroup, '=== conditionGroup')
        this.setState({ conditionGroup }, () => callback && callback());
    }
    insertAfterPos(index, name) {
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!', errors);
                return;
            }
            let conditionGroup = values.data;
            
            dot.object(conditionGroup)

            const currentGroup = conditionGroup.conditionGroup.find( o => o.name === name );
            
            if (!currentGroup) {
                return message.warn('数据异常')
            }

            const condition = [...currentGroup.condition];
            if (condition.length > 9) return message.warn('限十个条件')
            condition.splice(index, 0, {
                "viewAttrRelaId":0,
                "arithmeticOprate":0,
                "firstValue":"",
                "caluOprate":1,
            })
            const _conditionGroup = conditionGroup.conditionGroup.map((item) => {
                if (item.name === name) {
                    return { ...item, condition }
                }
                return { ...item }
            })
            this.setState({ conditionGroup: _conditionGroup });
        });
    }
    deleteByPos(index, name) {
        const currentGroup = this.state.conditionGroup.find(o => o.name === name);
        const condition = [...currentGroup.condition];
        if (condition.length <= 1) return message.warn('过滤条件至少保留1个！')
        condition.splice(index - 1, 1);
        const conditionGroup = this.state.conditionGroup.map(item => {
            if (item.name === name) {
                return { ...item, condition }
            }
            return item
        })
        this.setState({ conditionGroup } );
    }
    onSubmit() {
        // window.dot = dot;
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!', errors);
                return;
            }
            let conditionGroup = values.data;
            // window.conditionGroup = values;
            dot.object(conditionGroup)
        });
    }
    render() { 
        const { getFieldProps, getFieldValue } = this.props.form;
        const additionalFormItem = (currentGroup, nav) => [
            <Form.Item><Input type="hidden" {...getFieldProps(`data.conditionGroup.${nav}.viewId`, { initialValue: currentGroup.viewId})} /></Form.Item>,
            <Form.Item><Input type="hidden" {...getFieldProps(`data.conditionGroup.${nav}.name`, { initialValue: currentGroup.name})} /></Form.Item>
        ]
        console.log(this.state.conditionGroup, '=== this.state.conditionGroup')
        return (
            <Form inline {...noLabelColLayoutFn({padding: "20px 40px"})}>
                {
                    this.state.conditionGroup.map((currentGroup, nav) => {
                        if (nav === 0) return ([
                            <Form.Item key={currentGroup.name + nav} {...noLabelColLayoutFn({marginTop: '10px'})}>
                                <div className='condition-set'>
                                    {
                                        currentGroup.condition.map((item, i) => {
                                            return <FilterItem label={currentGroup.name} key={currentGroup.name + i + item.viewAttrRelaId} orderNum={i+1} viewAttrRela={this.props.viewAttrRela} 
                                            baseData={item}
                                            insertAfterPos={this.insertAfterPos.bind(this)} 
                                            deleteByPos={this.deleteByPos.bind(this)}
                                            {...getFieldProps(`data.conditionGroup.${nav}.condition.${i}`, {
                                                initialValue: item,
                                                rules: [{
                                                    required: true, message: '必填'
                                                }]
                                            })}/>
                                        })
                                    }
                                </div>
                            </Form.Item>,
                            <Form.Item {...noLabelColLayoutFn({ textAlign: 'left', width: 98, margin: '10px 0 10px 50%'})}>
                                <Select size='small' defaultValue={currentGroup.oprate} style={{ width: 98, marginLeft: '-54%' }} onChange={() => {}}
                                {...getFieldProps(`data.conditionGroup.${nav}.oprate`, {
                                    initialValue: ~~currentGroup.oprate,
                                    rules: [{
                                        required: true, message: '必填'
                                    }]
                                })}>
                                <Option value={0}>并且</Option>
                                <Option value={1}>或者</Option>
                                <Option value={2}>并非</Option>
                                </Select>
                            </Form.Item>,
                            // <Button type="primary" onClick={this.resetCondition.bind(this)}>初始化</Button>,
                            ...additionalFormItem(currentGroup, nav)
                        ])
                        else return ([
                            <Form.Item {...noLabelColLayout}>
                                <div className='condition-set'>
                                    {
                                        currentGroup.condition.map((item, i) => {
                                            return <FilterItem label={currentGroup.name} key={currentGroup.name + i} orderNum={i+1} viewAttrRela={this.props.viewAttrRela} 
                                            baseData={item}
                                            insertAfterPos={this.insertAfterPos.bind(this)} 
                                            deleteByPos={this.deleteByPos.bind(this)}
                                            {...getFieldProps(`data.conditionGroup.${nav}.condition.${i}`, {
                                                initialValue: item,
                                                rules: [{
                                                    required: true, message: '必填'
                                                }]
                                            })}/>
                                        })
                                    }
                                    
                                </div> 
                            </Form.Item>,
                            ...additionalFormItem(currentGroup, nav)
                        ])
                    })
                }
            </Form>
        )
    }
}
FilterSetting = Form.create()(FilterSetting)
export default FilterSetting