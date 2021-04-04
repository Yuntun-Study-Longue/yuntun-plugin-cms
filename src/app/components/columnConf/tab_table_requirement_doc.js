
export default [
    {
      title: '',
      width:25, 
      nowrap: true,
      render: (text, record, index) => {
        return <div title={index+1}>{index+1}</div>;
      }
    }, 
    {
      title: '文档名称',
      //width:150, 
      dataIndex: 'documentName',
      nowrap: true,
      render: (text, record, index) => {
        return <a href={`requirement_fullpage.html?id=${record.id}`}  title={text}>{text}</a>;
      }
    }, 
    {
      title: '文档编号',
      //width:150,
      dataIndex: 'code',
      nowrap: true,
      render: (text, record, index) => {
        return <div title={text}>{text}</div>;
      }
    }, 
    {
      title: '文档类型',
      width:150,
      dataIndex: 'docuTypeName',
      nowrap: true,
      render: (text, record, index) => {
        return <div title={text}>{text}</div>;
      }
    }
]