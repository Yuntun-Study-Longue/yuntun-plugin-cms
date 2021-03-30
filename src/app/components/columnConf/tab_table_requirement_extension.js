export default [
    {
        title: '编号',
        width:45, 
        dataIndex: 'id',
        nowrap: true,
        render: (text, record, index) => {
          return <div title={index+1}>{index+1}</div>;
        }
      }, 
      {
    title: '名称',
    width:200,
    dataIndex: 'attrCode',
    nowrap: true,
    render: (text, record, index) => {
      return <div title={text}>{text}</div>;
    }
  }, 
  
  {
    title: '数据类型',
    width:100,
    dataIndex: 'attrType',
    nowrap: true,
    render: (text, record, index) => {
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
      else{
        return 'nein';
      }
    }
}]