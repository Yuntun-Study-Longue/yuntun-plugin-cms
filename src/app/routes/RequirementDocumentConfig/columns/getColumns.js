export default [ 
    {
        title: '名称',
        dataIndex: 'attrCode',
        nowrap: true,
        render: (text, record, index) => {
          return <span title={text}>{text}</span>;
        }
    }, 
    {
        title: '数据类型',
        width:90,
        dataIndex: 'attrType',
        nowrap: true,
        render: (text, record, index) => {
          const attrTypes = {
            0:'文本',
            1:'长文本',
            2:'文件',
            3:'日期',
            4:'用户',
            5:'枚举',
            6:'枚举',
            7:'功能列'
          } 
          let attrText = attrTypes[text]?attrTypes[text]:'nein'
          return <div title={attrText}>{attrText}</div>;
        }
    },
    {
        title: '内置/扩展',
        width:90,
        dataIndex: 'extendType',
        nowrap: true,
        render: (text, record, index) => {
            const extendTypes = {
              0:'扩展',
              1:'内置',
            }
            return <div title={extendTypes[text]}>{extendTypes[text]}</div>;
        }
    }, 
    {
        title: '作用范围',
        width:90,
        dataIndex: 'scope',
        nowrap: true,
        render: (text, record, index) => {
            const scopes = {
              1:'文档',
              2:'条目',
              3:'条目,文档'
            }
            return <div title={scopes[text]}>{scopes[text]}</div>;
        }
    }, 
    {
        title: '触发条目变更',
        width:105,
        dataIndex: 'changeItem',
        nowrap: true,
        render: (text, record, index) => {
          const status = {
            0:'否',
            1:'是',
          }
          return <div title={status[text]}>{status[text]}</div>;
        }
    }, 
    {
        title: '生成历史记录',
        width:105,
        dataIndex: 'createHistory',
        nowrap: true,
        render: (text, record, index) => {
          const status = {
            0:'否',
            1:'是',
          }
          return <div title={status[text]}>{status[text]}</div>;
        }
    }, 
];