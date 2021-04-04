export default [{
    title: '',
    width:30,
    nowrap: true,
    render: (text, record, index) => {
      return <div title={index+1}>{index+1}</div>;
    }
  }, 
  {
    title: '名称',
    width:150,
    dataIndex: 'column1',
    nowrap: true,
  }, 
  {
    title: '识别码',
    width:150,
    dataIndex: 'column2',
    nowrap: true,
  },
  {
    title: '描述',
    width:150,
    dataIndex: 'column3',
    nowrap: true
  },
  {
    title: '状态',
    width:150,
    dataIndex: 'column4',
    nowrap: true,
  },
];