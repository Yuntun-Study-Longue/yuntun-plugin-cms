export default [
    {
        title: "名称",
        //width: 200,
        dataIndex: "attrCode",
        nowrap: true,
        render: (text, record, index) => {
            return <span title={text}>{text}</span>;
        }
    },
    {
        title: "数据类型",
        width: '30%',
        dataIndex: "attrType",
        nowrap: true,
        render: (text, record, index) => {
            if (text == "0") {
                return <span title="文本">文本</span>;
            } else if (text == "1") {
                return <span title="长文本">长文本</span>;
            } else if (text == "2") {
                return <span title="文件">文件</span>;
            } else if (text == "3") {
                return <span title="日期">日期</span>;
            } else if (text == "4") {
                return <span title="用户">用户</span>;
            } else if (text == "5") {
                return <span title="枚举">枚举</span>;
            } else {
                return "nein";
            }
        },
    },
];
