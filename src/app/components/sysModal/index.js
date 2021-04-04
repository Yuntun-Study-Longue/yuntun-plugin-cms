import React, { Component } from 'react'
import ReactDom from 'react-dom'
import './index.scss'
import axios from 'axios'
import Modal from 'sub-antd/lib/modal'
import Message from 'sub-antd/lib/message'
import Button from 'sub-antd/lib/button'
import SysIcon from 'components/sysIcon'
function show(options){
    const div = document.createElement('div');
    document.body.appendChild(div);
    function close() {
        var unmountResult = ReactDom.unmountComponentAtNode(div);
        if (unmountResult) {
          div.parentNode.removeChild(div);
        }
    }
    const sysModal = (
        <Modal 
            visible={true} 
            onCancel={close}
            {...options}
        >
            {options.content&&options.content}
        </Modal>
    )
    ReactDom.render(sysModal,div);
    return {
        close
    }
}
function success(content){
    Message.success(content);
}
function MesssageContent(props){
    return (
        <div>
            <div className="fl" style={{fontSize:26}}><SysIcon name={props.icon}/></div>
            <div style={{marginLeft:40}}>
                <div style={{fontSize:14,fontWeight:'bold',color:'#666'}}>{props.title}</div>
                <p style={{color:'#333'}}>{props.content}</p>
            </div>
        </div>
    )
}
function showMessage(options){
    const message = show({
        title:'',
        width:410,
        wrapClassName:'sys-message',
        content:<MesssageContent icon={options.icon} title={options.title} content={options.content}/>,
        footer:options.footer
            ?options.footer
            :[<Button key="ok" type="primary" onClick={()=>{typeof options.onOk === 'function' && options.onOk();message.close()}}>确定</Button>,
              <Button key="cancel" onClick={()=>message.close()}>取消</Button>],
    })
    return message;
}

function error(content){
    return showMessage({
        icon:'error',
        title:'提示',
        content,
        footer:[]
    })
}
function warning(content,onOk){
    return showMessage({
        icon:'warning',
        title:'提示',
        content,
        onOk
    });
}
function info(content,onOk){
    return showMessage({
        icon:'warning',
        title:'提示',
        content,
        onOk
    });
}
function confirm(content,onOk){
    return showMessage({
        icon:'query',
        title:'提示',
        content,
        onOk
    });
}
function add({title='新增',hasNext=false,width=736,...options}={}){
    function save(hasNext){
        const form = options.form();
        const table = typeof options.table === 'function' && options.table();
        const params = typeof options.paramsBuilder === 'function'?options.paramsBuilder():{};
        if(typeof form.submit === 'function'){
            form.submit((values)=>{
                if(options.url){
                    axios.post(options.url,{...params,...values}).then((res)=>{
                        if (res.data.code === 200 || !res.data.code) {
                            if(!hasNext){
                                add.close();
                            }else{
                                form.props.form.resetFields();
                            }
                            success(`${title}成功！`);
                            if(typeof options.onOk === 'function'){
                                options.onOk(values)
                            }else{
                                table.load([res.data.data.id]);
                            }
                        }
                        else{
                            add.close();
                            error(res.data.message);
                        }
                    }).catch(error => {})
                }else{
                    typeof options.onOk === 'function' && options.onOk(values);
                    add.close();
                }
            })
        }else{
            form.props.form.validateFields((errors, values) =>{
                if(!!errors) return
                if(options.url){
                    axios.post(options.url,{...params,...values}).then((res)=>{
                        if (res.data.code === 200 || !res.data.code) {
                            if(!hasNext){
                                add.close();
                            }else{
                                form.props.form.resetFields();
                            }
                            success(`${title}成功！`);
                            if(typeof options.onOk === 'function'){
                                options.onOk()
                            }else{
                                table.load([res.data.data.id]);
                            }
                        }
                        else{
                            add.close();
                            error(res.data.message);
                        }
                    }).catch(error => {})
                }else{
                    if(!hasNext){
                        typeof options.onOk === 'function' && options.onOk(values,add);
                    }else{
                        form.props.form.resetFields();
                        typeof options.onOk === 'function' && options.onOk(values);
                    }
                }
            })
        }
    }
    function saveAndNext(){
        save(true);
    }
    const add = show({
        title:title,
        width:width,
        content:options.content,
        style:options.style,
        footer:hasNext?
            [
                <Button key="ok" type="primary" onClick={()=>save(false)}>确定</Button>,
                <Button key="okAndNext" onClick={()=>saveAndNext()}>确定并新增</Button>,
                <Button key="cancel" onClick={()=>add.close()}>取消</Button>
            ]:
            [
                <Button key="ok" type="primary" onClick={()=>save(false)}>确定</Button>,
                <Button key="cancel" onClick={()=>add.close()}>取消</Button>
            ]
    })
}
function addAndNext(options){
    add({hasNext:true,...options})
}
function edit(options){
    add({title:'编辑',...options})
}
export default {
    show,
    success,
    error,
    info,
    warning,
    confirm,
    add,
    addAndNext,
    edit
} 