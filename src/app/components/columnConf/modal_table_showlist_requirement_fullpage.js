import { message } from 'sub-antd';
import Input from 'sub-antd/lib/input';

export default ({ getFieldProps }) => [
    {
        title: '名称',
        dataIndex: 'attrCode',
        nowrap: true,
    }, 
    {
      title: '数据类型',
      width:80,
      dataIndex: 'attrType',
      nowrap: true,
      render: (text, record, index) => {
        if(record.attrCode==='条目内容'){
          return <div title='正文'>正文</div>;
        }
        if(text=='0'){
          return <div title='文本'>文本</div>;
        }
        else if(text=='1'){
          return <div title='长文本'>长文本</div>;
        }
        else if(text=='2'){
          return <div title='文件'>文件</div>;
        }
        else if(text=='3'){
          return <div title='日期'>日期</div>;
        }
        else if(text=='4'){
          return <div title='用户'>用户</div>;
        }
        else if(text=='5'){
          return <div title='枚举'>枚举</div>;
        }
        else if(text=='6'){
            return <div title='枚举'>枚举</div>;
        }
        else if(text=='7'){
            return <div title='功能列'>功能列</div>;
        }
        else{
          return 'nein';
        }
      }
  },{
        title: '宽度（像素）',
        dataIndex: 'width',
        nowrap: true,
        width:100,
        // render: (text, record, index) => {
        //     if (record.attrType == '7') return <div title={text}>{text}</div>;
        //     return <Input size="small" {...getFieldProps(`${record.id}`, { 
        //       initialValue: text || '', 
        //       rules: [ 
        //             { required: true,message: '请输入【570<= n <= 1000】之间的整数'}, 
        //         ],
              
        //     })}/>
        // }
        render: (text, record, index) => { 
                if (record.attrType == '7') return <div title={text}>{text}</div>;
                if(record.attrCode==='条目内容'){  
                  return <Input size="small" {...getFieldProps(`${record.id}`, { 
                    initialValue: text || '',
                    rules: [ 
                      { required: true,message: "此项必填！"},  
                      { pattern: new RegExp(/^([5-9][7-9][0-9]|[6-9][0-9][0-9]|1000)$/) , message: '请输入【570<= n <= 1000】之间的整数' }  
                  ],
                  })}/>;
                } 
                if(record.attrCode==='功能列'){  
                  return <div title={text}>{text}</div>;
                } 
                if(record.attrType=='0'){
                     return <Input size="small" {...getFieldProps(`${record.id}`, { 
                       initialValue: text || '',
                       rules: [ 
                        { required: true,message: "此项必填！"},  
                        { pattern: new RegExp(/^([6-9][0-9]|[1-9][0-9][0-9]|1000)$/) , message: '请输入【60<= n <= 1000】之间的整数' } 
                    ],
                      })}/>
                }
                else if(record.attrType=='1'){
                  return <Input  size="small" {...getFieldProps(`${record.id}`, { 
                    initialValue: text || '',
                    rules: [ 
                      { required: true,message: "此项必填！"},  
                      { pattern: new RegExp(/^([1-9][0-9][0-9]|1000)$/) , message: '请输入【100<= n <= 1000】之间的整数' }
                  ],
                   })}/>
                }
                else if(record.attrType=='2'){
                  return <Input size="small" {...getFieldProps(`${record.id}`, { 
                    initialValue:  text || '',
                    rules: [ 
                      { required: true,message: "此项必填！"},  
                      { pattern: new RegExp(/^([1-9][0-9][0-9]|1000)$/) , message: '请输入【100<= n <= 1000】之间的整数' }
                  ],
                   })}/>
                }
                else if(record.attrType=='3'){
                  return <Input size="small" {...getFieldProps(`${record.id}`, { 
                    initialValue: text || '',
                    rules: [ 
                      { required: true,message: "此项必填！"},  
                      { pattern: new RegExp(/^([1-9][0-9][0-9]|1000)$/) , message: '请输入【100<= n <= 1000】之间的整数' }
                  ],
                   })}/>;
                }
                else if(record.attrType=='4'){
                  return <Input size="small" {...getFieldProps(`${record.id}`, { 
                    initialValue: text || '',
                    rules: [ 
                      { required: true,message: "此项必填！"},  
                      { pattern: new RegExp(/^([6-9][0-9]|[1-9][0-9][0-9]|1000)$/) , message: '请输入【60<= n <= 1000】之间的整数' }
                  ],
                   })}/>
                }
                else if(record.attrType=='5'||record.attrType=='6'){
                  return <Input size="small" {...getFieldProps(`${record.id}`, { 
                    initialValue: text || '',
                    rules: [ 
                      { required: true,message: "此项必填！"},  
                      { pattern: new RegExp(/^([6-9][0-9]|[1-9][0-9][0-9]|1000)$/) , message: '请输入【60<= n <= 1000】之间的整数' }
                  ],
                   })}/>
                }  
                 
              } 

  }]