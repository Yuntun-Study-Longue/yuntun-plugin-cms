export default [
  {
    title: '名称',
    dataIndex: 'attrCode',
    nowrap: true,
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
}]