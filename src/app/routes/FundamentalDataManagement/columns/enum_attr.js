export default [
    {
        title: "名称",
        dataIndex: "name",
        nowrap: true,
    },
    {
        title: "状态",
        width: 60,
        dataIndex: "isUsed",
        nowrap: true,
        render: (text, record, index) => {
            if (text == "0") {
                return <div title="正常">正常</div>;
            } else if (text == "1") {
                return <div title="作废">作废</div>;
            }
        },
    },
    {
        title: "描述",
        dataIndex: "describe",
        nowrap: true,
    }
];