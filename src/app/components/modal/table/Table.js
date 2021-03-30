import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import message from 'sub-antd/lib/message';
import Table from 'sub-antd/lib/table';
import Button from 'sub-antd/lib/button';
import ModalInModal from '../model/Modal';
import { EnumItemAdd, EnumItemEdit } from 'components/baseInfo/infoType';
import columnConf from 'components/columnConf/columnConf';
import './table.css'

export default class ModalTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddModal: false,
            showEditModal: false,
            selectedRowKeys: [],
            selectionTableW: 450,
            orgExtends: this.props.initialValue || this.props['data-__meta'].initialValue || [],
            // isEnumChanged: false,
        }
    }
    componentWillReceiveProps(nextProps, nextState) {
        if (JSON.stringify(this.props.initialValue) !== JSON.stringify(nextProps.initialValue)) {
            this.setState({ orgExtends: nextProps.initialValue });
        }
    }
    getList() {
        if (!this.props.listOption) {
            console.log('listOption missing');
            return
        }
        let Url = this.props.listOption.uri + (this.props.listOption.queryBuilder ? this.props.listOption.queryBuilder(): '');
        axios.get(Url, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
            if (!res.data.code || !res.data.code === 200) { 
                message.success("保存成功");
                this.setState({ showAddModal: false, orgExtends: [...this.state.orgExtends, values] });
            }
            else{
                message.error(res.data.message);
            }
        })
    }
    add() {
        this.child.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!', errors);
                return;
            }

            const existItem = this.state.orgExtends.find(item => item.name === values.name)
            if (existItem) {
                message.error('已存在同名枚舉名稱')
                return
            }

            const max_id = this.state.orgExtends.map(item => item.orderNum).reduce((prev, next) => Math.max(~~prev, ~~next), 0)
            const addItem = { ...values, orderNum: max_id + 1, isUsed: 0, attrId: this.props.attrId };
            console.log(max_id, 'before this.state.orgExtends', this.state.orgExtends);
            this.setState({ showAddModal: false, orgExtends: [...this.state.orgExtends, addItem] }, () => {
                console.log(max_id, 'after this.state.orgExtends', this.state.orgExtends);
                this.props.onChange(this.state.orgExtends);
                message.success("保存成功");
            });


            // const existItem = this.state.orgExtends.find(item => item.name === values.name)
            // if (existItem) {
            //     message.errors('已存在同名枚舉名稱')
            //     return
            // }
            // const params = this.props.addOption.paramsBuilder ? this.props.addOption.paramsBuilder(values) : values;
            // // console.log(this.state.orgExtends, values);
            // axios.post(this.props.addOption.uri, params, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
            //     console.log(res, '=== log here');
            //     if (!res.data.code || !res.data.code === 200) { 
            //         message.success("保存成功");
            //         this.setState({ showAddModal: false, orgExtends: [...this.state.orgExtends, values] }, () => this.props.onChange(this.state.orgExtends));
            //     }
            //     else{
            //         message.error(res.data.message);
            //     }
            // })
        })
    }
    save() {
        this.child.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!', errors);
                return;
            }
            const selectItem = this.state.orgExtends.find(item => this.state.selectedRowKeys.includes(item.orderNum));
            // const existItem = this.state.orgExtends.find(item => item.name === values.name)
            // if (existItem) {

            //     message.error('已存在同名枚舉名稱')
            //     return
            // }
            const orgExtends = this.state.orgExtends.map(item => {
                if (item.orderNum === selectItem.orderNum) {
                    return {...item, ...values}
                }
                return item
            })
            console.log(orgExtends, '=== orgextends')

            this.setState({ showEditModal: false, orgExtends }, () => {
                this.props.onChange(this.state.orgExtends);
                // this.state.isEnumChanged ? console.log('changed') : console.log('unchange');
                message.success("保存成功");
            });
            // const params = this.props.modifyOption.paramsBuilder ? this.props.addOption.paramsBuilder({ ...selectItem, values }) : { ...selectItem, values };
            // axios.put(this.props.modifyOption.uri, params, { headers: { 'Authorization': Cookies.get('Authorization')}}).then(res => {
            //     console.log(res, '=== log here');
            //     if (!res.data.code || !res.data.code === 200) { 
            //         message.success("保存成功");
            //         this.setState({ showAddModal: false, orgExtends: [...this.state.orgExtends, values] }, () => this.props.onChange(this.state.orgExtends));
            //     }
            //     else{
            //         message.error(res.data.message);
            //     }
            // })
            
        })
    }
    del() {
        if (!this.state.selectedRowKeys.length) {
            return message.warn('请选择一条数据')
        }
        const orgExtends = this.state.orgExtends.filter(item => !this.state.selectedRowKeys.includes(item.orderNum))
        this.setState({ orgExtends }, () => {
            this.props.onChange(this.state.orgExtends);
            message.success("删除成功");
        })
    }
    move(type) {
        if (this.state.selectedRowKeys.length != 1) {
            return message.warn('请选择一条数据')
        }
        const orderNums = this.state.orgExtends.map( item => ~~item.orderNum );
        const prevNum = orderNums.filter( item => item < this.state.selectedRowKeys[0]).reduce((prev, next) => Math.max(prev, next), 0);
        const nextNum = orderNums.filter( item => item > this.state.selectedRowKeys[0]).reduce((prev, next) => Math.min(prev, next), Infinity);
        // console.log(prevNum, this.state.selectedRowKeys[0], nextNum, '=== is exist');
        if (type === 'up') {
            if (!prevNum) return message.warn('第一个无法上移')
            console.log(prevNum, this.state.selectedRowKeys[0], '== exchange ==', type, this.state.orgExtends);
            const orgExtends = this.state.orgExtends.map(item => {
                if (item.orderNum === this.state.selectedRowKeys[0]) {
                    return {...item, orderNum: prevNum }
                }
                else if (item.orderNum === prevNum) {
                    return {...item, orderNum: this.state.selectedRowKeys[0] }
                }
                
                return item
            }).sort((a, b) => a.orderNum - b.orderNum)

            console.log(orgExtends, '=== up')
            this.setState({ orgExtends }, () => {
                this.setState({ selectedRowKeys: [prevNum] }, () => this.props.onChange(this.state.orgExtends.filter(item => this.state.selectedRowKeys.includes(item.orderNum))));
                message.success("上移成功");
            })
        }
        else if (type === 'down') {
            if (!isFinite(nextNum)) return message.warn('最后一个无法下移')
            console.log(this.state.selectedRowKeys[0], nextNum, '== exchange ==', type, this.state.orgExtends);
            const orgExtends = this.state.orgExtends.map(item => {
                if (item.orderNum === this.state.selectedRowKeys[0]) {
                    return {...item, orderNum: nextNum }
                }
                else if (item.orderNum === nextNum) {
                    return {...item, orderNum: this.state.selectedRowKeys[0] }
                }

                return item
            }).sort((a, b) => a.orderNum - b.orderNum)
            console.log(orgExtends, '=== down')
            this.setState({ orgExtends }, () => {
                this.setState({ selectedRowKeys: [nextNum] }, () => this.props.onChange(this.state.orgExtends.filter(item => this.state.selectedRowKeys.includes(item.orderNum))));
                message.success("下移成功");
            })
        }

    }
    render() {
        return <div>
            <div className="opeation-icon" style={{ display: this.props.controlIcons ? 'block' : 'none'}}>
                {this.props.controlIcons && this.props.controlIcons.includes('add') ? <span title="新增" className="icon icon-add" onClick={() => this.setState({ showAddModal: true })}></span> : '' }
                {this.props.controlIcons && this.props.controlIcons.includes('edit') ? <span title="编辑" className="icon icon-edit" onClick={() => {
                    if (!this.state.selectedRowKeys.length) return message.warn('至少选一项')
                    this.setState({ showEditModal: true })
                }}></span>: '' }
                {this.props.controlIcons && this.props.controlIcons.includes('del') ?<span title="删除" className="icon icon-del" onClick={this.del.bind(this)}></span>: '' }
                {this.props.controlIcons && this.props.controlIcons.includes('moveup') ?<span title="上移" className="icon icon-move-up" onClick={this.move.bind(this, 'up')}></span>: '' }
                {this.props.controlIcons && this.props.controlIcons.includes('movedown') ?<span title="下移" className="icon icon-move-down" onClick={this.move.bind(this, 'down')}></span>: '' }
            </div>
            <Table 
                bordered
                scroll={{ x: this.state.selectionTableW, y: 150 }}
                rowSelection={this.props.controlIcons ? {
                    selectedRowKeys: this.state.selectedRowKeys,
                    onChange: (selectedRowKeys) => this.setState({ selectedRowKeys })
                        // , () => this.props.onChange(this.state.orgExtends.filter(item => this.state.selectedRowKeys.includes(item.orderNum)))),
                } : null}
                rowKey={ item => item.orderNum } columns={columnConf['Modal_Table_Requirement_Extension']} dataSource={this.state.orgExtends} size="small" pagination={false} />
            {
                this.state.showAddModal && <ModalInModal title='新增' save={this.add.bind(this)} closeModal={() => this.setState({ showAddModal: false })}>
                    <EnumItemAdd onRef={ ref => this.child = ref } baseData={{}} />
                </ModalInModal>
            }
            {
                this.state.showEditModal && <ModalInModal title='修改' save={this.save.bind(this)} closeModal={() => this.setState({ showEditModal: false })}>
                    <EnumItemEdit onRef={ ref => this.child = ref } baseData={this.state.orgExtends.find( item => this.state.selectedRowKeys.includes(item.orderNum) )} />
                </ModalInModal>
            }
        </div>
    }
}

ModalTable.propTypes = {
    value: PropTypes.array,
  }