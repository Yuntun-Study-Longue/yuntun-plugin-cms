import React, { Component } from 'react'
import LRLayout from 'components/sysLayout/LRLayout'
import SysTable from 'components/sysTable'
import SysToolBar from 'components/sysToolBar'
import SysButton from 'components/sysButton'
import { halfFourColLayout, fourColLayout } from "components/layout/formLayout";
import qs from 'querystring';
import columns from '../columns/docList'
import Form from 'sub-antd/lib/form';
import Input from 'sub-antd/lib/input';
import Modal from 'sub-antd/lib/modal';
const FormItem = Form.Item;
import Select from 'sub-antd/lib/select';
const Option = Select.Option;
import SysTabs from 'components/sysTabs'
const TabPane = SysTabs.TabPane
import SysDetailPanel from 'components/sysDetailPanel'
import Cookies from 'js-cookie';
import axios from 'axios';
// import  Page   from 'react-pdf'; 
import ReactPDF from 'react-pdf/build/entry.webpack';
import sysModal from '../../../../components/sysModal'
// import ReactPDF from 'react-pdf/build/entry.noworker';
// var PDF = require('react-pdf');

class GetDocListInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            desc: "",
            selectedIds: [],
            selectedRows: [],
            btnDisabledFn() { },
            editModal: false,
            htmlString: '',
            pdfData: '',
            numPages: null,
            // pageNumber: 1,
            // total:0,
            // pageIndex:0,

            pageIndex: null,
            pageNumber: null,
            total: null,
        }
    }
    // componentDidMount() {
    //     var browser = window.navigator.userAgent
    //     console.log(browser)
    //     // window.addEventListener('resize', this.handleResize.bind(this)) 

    //   }
    // 判断浏览器版本
    // TODO： 需要兼容支持IE11及以上、safri、Chrom60及以上版本的瀏覽器 不符合時彈窗提醒
    getBrowser = () => {
        const { userAgent } = navigator;
        const invalidIE = userAgent.indexOf("MSIE") > -1;
        let invalidChrome;
        if (userAgent.indexOf("Chrome") > -1) {
            const version = userAgent.match(/chrome\/[\d.]+/gi)[0].match(/[\d]+/)[0];
            if (+version < 60) {
                invalidChrome = true;
            }
        }
        // 若是不兼容的瀏覽器，且用戶沒有點擊過忽略
        if ((invalidIE || invalidChrome)) {
            // do sth
            alert('xxxx')
        }
    };
    componentDidMount() {
        this.getBrowser();
    }
    export = () => {
        { this.setState({ showModal: true }) }
    }
    delete() {
        this.$table.delete('/sysware/api/documentTemplate/delete'
        )
    }
    move(opea) {
        this.$table.move('/sysware/api/documentTemplate/move', opea, (item) => {
            return { id: item.id, sortStr: opea }
        })
    }
    handleOk = () => {
        console.log('点击了确定');
        this.setState({
            showModal: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            showModal: false,
        });
    }
    handleChange = (value) => {
        console.log(`selected ${value}`);
    }
    selectChange = (keys, rows) => {
        console.log(rows, '[]]]]]]]]]]]]]]]]]]]')
        this.setState({ selectedIds: keys, selectedRows: rows }, () => {
            this.pdf()
        })
    }
    pdf = () => {
        axios.get(`/sysware/pageoffice/pdfUrl?fileId=${this.state.selectedRows[0].id}_${this.state.selectedRows[0].documentId}&access_token=${Cookies.get('access_token')}`).then(res => {
            //   console.log(res)
            console.log(res.data.data)
            if (res.status == 200) {
                this.setState({
                    pdfData: res.data.data
                })

            }
            console.log(this.state.pdfData)
        }, rej => {
            console.log(rej)
        }).catch(error => {
            console.log(error);
        })
    }
    btnDisabled = (btnDisabledFn) => {
        this.setState({ btnDisabledFn })
    }
    onSave = (data) => {
        this.$table.load()
    }
    createPageOfficeLink = (
        uri = 'http://localhost:8080/sysware/pageoffice/word',
        option = { width: 1100, height: 600 }
    ) => {
        const visitLink = `javascript:POBrowser.openWindowModeless('${uri}', "${option ? 'width=' + option.width + 'px;' + 'height=' + option.height + 'px;' : 'width=1200px;height=800px;'}");`
        return visitLink
    }
    edit = (e) => {
        { this.setState({ editModal: true }) }
    }

    editModalOk = () => {
        console.log('点击了确定');
        this.setState({
            editModal: false,
        });
    }
    editModalCancel = (e) => {
        this.setState({
            editModal: false,
        });
    }
    downLoadFile() {  //文件下载
        window.open(`/sysware/api/filesSys/downloadFile?file_id=${this.state.selectedRows[0].fileId}`)
    }
    onDocumentLoad = ({ total }) => {
        this.setState({ total });
    }
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }
    onPageLoad = ({ pageIndex, pageNumber }) => {
        console.log(pageIndex, pageNumber, 'object')
        this.setState({ pageIndex, pageNumber });
    }
    changePage(by) {
        this.setState(prevState => ({
            pageIndex: prevState.pageIndex + by,
        }));
    }
    render() {
        const { getFieldProps } = this.props.form;
        const descProps = getFieldProps("desc", {
            rules: [{ max: 500, message: "请控制内容长度不超过500个字" }],
            onChange: (e) => {
                this.setState({
                    desc: e.target.value,
                });
            },
        });
        return (
            <LRLayout draggable >
                {{
                    left: (
                        <LRLayout.LeftPanel>
                            <SysToolBar>
                                <SysButton title="导出文档" icon="export" onClick={this.export} />
                                <SysButton title="删除" icon="delete" onClick={() => this.delete()} disabled={this.state.btnDisabledFn('multiple')} />
                                <SysButton title="下载" icon="download" onClick={() => this.downLoadFile()} />
                                <SysButton title="上移" icon="moveup" onClick={() => this.move('up')} disabled={this.state.btnDisabledFn('up')} />
                                <SysButton title="下移" icon="movedown" onClick={() => this.move('down')} disabled={this.state.btnDisabledFn('down')} />
                            </SysToolBar>
                            <SysTable
                                ref={(el) => (this.$table = el)}
                                dataUrl={`/sysware/api/documentTemplate/listHis?documentId=${qs.parse(location.search.replace('?', '')).id}`}
                                number pagination minWidth={660}
                                columns={columns}
                                selectChange={this.selectChange}
                                btnDisabled={this.btnDisabled}
                            />
                            <Modal
                                title='导出文档'
                                visible={this.state.showModal}
                                width={736}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            >
                                <Form inline>
                                    <FormItem label='文档名称' {...fourColLayout}>
                                        <Input type="text" />
                                    </FormItem>
                                    <FormItem label='文档说明' {...fourColLayout}>
                                        <Input type="textarea" maxLength='200'  {...descProps} />
                                        <p className="form-description-tip">还可输入
                                                   {500 - this.state.desc.length > 0
                                                ? 500 - this.state.desc.length
                                                : "0"}
                                            字</p>
                                    </FormItem>
                                    <FormItem label='文档密级' {...fourColLayout}>
                                        <Select
                                            defaultValue="非M"
                                            allowClear
                                            style={{ width: 120 }}
                                            onChange={this.handleChange}
                                        >
                                            <Option value="jack">非M</Option>
                                            <Option value="lucy">JM</Option>
                                            <Option value="yiminghe">MM</Option>
                                        </Select>
                                    </FormItem>

                                </Form>
                            </Modal>
                        </LRLayout.LeftPanel>
                    ),
                    right: this.state.selectedRows.length === 1 && (
                        <LRLayout.RightPanel>

                            <SysTabs>
                                <TabPane title="文档内容"     >
                                    <SysToolBar>
                                        <a href={this.createPageOfficeLink(
                                            `http://${this.props.pageOfficeHost}/sysware/pageoffice/documentWord?fileId=${this.state.selectedRows[0].id}_${this.state.selectedRows[0].documentId}&access_token=${Cookies.get('access_token')}`

                                        )}>
                                            <SysButton title="编辑" icon="edit" > </SysButton>
                                        </a>
                                    </SysToolBar>
                                    {/* <div dangerouslySetInnerHTML={{__html:this.state.htmlString }} /> */}
                                    {/* <ReactPDF
                                            file={this.state.pdfData} 
                                           /> */}
                                    <div > 
                                        <ReactPDF
                                            file={this.state.pdfData}
                                            onDocumentLoad={this.onDocumentLoad}
                                            onPageLoad={this.onPageLoad}
                                            pageIndex={this.state.pageIndex}
                                            width={450}
                                        />
                                        <div className="pdfPageNum">
                                            <SysButton
                                                disabled={this.state.pageNumber <= 1}
                                                onClick={() => this.changePage(-1)}
                                            > 上一页  </SysButton>
                                            <span>{this.state.pageNumber || '--'} / {this.state.total || '--'}</span>
                                            <SysButton
                                                disabled={this.state.pageNumber >= this.state.total}
                                                onClick={() => this.changePage(1)}
                                            >  下一页  </SysButton>
                                        </div> 
                                    </div>
                                </TabPane>
                                <TabPane title="基本信息" >
                                    <SysDetailPanel
                                        detailUrl={`/sysware/api/documentTemplate/queryDetail?id=${this.state.selectedRows[0].id}`}
                                        plain="docList/forms/docListInfo"
                                        modify="docList/forms/docListEdit"
                                        onSave={this.onSave}
                                    />
                                </TabPane>
                            </SysTabs>
                        </LRLayout.RightPanel>
                    )
                }}
            </LRLayout>
        )
    }
}

GetDocListInfo = Form.create()(GetDocListInfo);

export default GetDocListInfo
