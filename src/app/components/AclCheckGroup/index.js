import React, {Component} from 'react';
import Checkbox from 'sub-antd/lib/checkbox';
import './main.scss';
const CheckboxGroup = Checkbox.Group;

class AclCheckGroup extends Component {
    static defaultProp = {
        aclType: 1,
        aclValue: 30,
        aclValues: [1<<1, 1<<2, 1<<3, 1<<4],
        aclEnums: ['无', '读取', '修改', '删除', '管理', '继承'],
        canextend: 1, // 0不能继承 1可以继承
        showValueList: [1<<1, 1<<2, 1<<3, 1<<4],
    }
    constructor(props) {
        super(props)
        this.state = {
            options: this.props.aclEnums.map((label, i) => {
                if (label === '继承') {
                    return { label, value: 1<< i, disabled: !this.props.canextend }
                }
                return { label, value: 1 << i }
            }) || [],
            checkedValues: this.props.checkedValues || []
        }
    }
    findIndex(name, enums = this.props.aclEnums || []) {
        return enums.findIndex(item => item === name)
    }
    handleAclChange(checkedValues) {
        // 如果取消勾选读取，则默认勾选无
        if (this.state.checkedValues.includes(1 << this.findIndex('读取')) && !checkedValues.includes(1 << this.findIndex('读取'))) {
            return this.setState({ checkedValues: [1 << this.findIndex('无')] }, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
        }
        // 如果取消勾选修改，则取消勾选删除、管理
        else if (this.state.checkedValues.includes(1 << this.findIndex('修改')) && !checkedValues.includes(1 << this.findIndex('修改'))) {
            return this.setState({ checkedValues: checkedValues.filter(item => item !== 1<< this.findIndex('删除') && item !== 1<< this.findIndex('管理')) }, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
        }
        // 如果勾选修改，则默认勾选读取
        else if (!this.state.checkedValues.includes(1 << this.findIndex('修改')) && checkedValues.includes(1 << this.findIndex('修改'))) {
            return this.setState({ checkedValues: [1 << this.findIndex('读取'), 1 << this.findIndex('修改')] }, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
        }
        // 如果勾选删除，则默认勾选读取、修改
        else if (!this.state.checkedValues.includes(1 << this.findIndex('删除')) && checkedValues.includes(1 << this.findIndex('删除'))) {
            return this.setState({ checkedValues: [1 << this.findIndex('读取'), 1 << this.findIndex('修改'), 1 << this.findIndex('删除')] }, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
        }
        // 如果勾选管理，则默认勾选读取、修改、删除
        else if (!this.state.checkedValues.includes(1 << this.findIndex('管理')) && checkedValues.includes(1 << this.findIndex('管理'))) {
            return this.setState({ checkedValues: [1 << this.findIndex('读取'), 1 << this.findIndex('修改'), 1 << this.findIndex('删除'), 1 << this.findIndex('管理')] }, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
        }
        // 如果只剩一个的时候，勾选判断
        else if (!checkedValues.length) {
            // 消除 无， 默认 勾选继承
            if (this.state.checkedValues.includes(1 << this.findIndex('无'))) {
                return this.setState({ checkedValues: [1 << this.findIndex('继承')]}, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
            }
            // 消除 继承， 默认 勾选父亲权值
            else if (this.state.checkedValues.includes(1 << this.findIndex('继承'))) {
                return this.setState({ checkedValues: this.props.aclValues }, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
            }
        }
        else if (this.state.checkedValues.includes(1 << this.findIndex('无'))) {
            return this.setState({ checkedValues: checkedValues.filter(item => item !== 1<< this.findIndex('无')) }, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
        }
        else if (this.state.checkedValues.includes(1 << this.findIndex('继承'))) {
            return this.setState({ checkedValues: checkedValues.filter(item => item !== 1<< this.findIndex('继承')) }, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
        }
        // 如果勾选的中有无，则只剩勾选一项
        else if (checkedValues.includes(1 << this.findIndex('无'))) {
            return this.setState({ checkedValues: [1 << this.findIndex('无')] }, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
        }
        // 如果勾选的中有继承，则只剩勾选一项
        else if (checkedValues.includes(1 << this.findIndex('继承'))) {
            return this.setState({ checkedValues: [1 << this.findIndex('继承')] }, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
        }
        this.setState({ checkedValues: checkedValues.sort((a, b) => a - b) }, () => this.props.onChange(this.state.checkedValues.reduce((prev, next) => prev += next)))
    }
    render() {
        console.log(this.state.checkedValues, '=== checkedValues', this.state.options)
        return <div>
            <CheckboxGroup options={this.state.options} value={this.state.checkedValues} onChange={this.handleAclChange.bind(this)} />
            { this.state.checkedValues.includes(1 << this.findIndex('继承')) && this.props.showValueList && this.props.canextend ? <span>({this.props.aclEnums.map((label, i) => this.props.showValueList.includes(1 << i) ? label : undefined ).filter(item => !!item).join('，')})</span> : '' }
        </div>
    }
}

export default AclCheckGroup