export default [
    {
        title: "时间",
        width: 160,
        nowrap: true,
        dataIndex: "operateTime",
        key: "operateTime",
    },
    {
        title: "用户",
        width: 80,
        nowrap: true,
        dataIndex: "operatorName",
        key: "operatorName",
    },
    {
        title: "操作",
        nowrap: true,
        key: "operation",
        render: (text, record, index) => { 
            const docId = record.documentId; //文档编号
            const hisTitle = record.hisTitle; //文档操作类型
            const itemId=record.itemId; //条目编号  
            const titleName = record.titleName; //条目标题/正文
            let showValue;
            if(hisTitle.indexOf("条目") != -1){ 
                if(titleName==''||titleName==null){
                    showValue=`${hisTitle}【${itemId}】` 
                }else{
                    showValue=`${hisTitle}【${itemId}】:【${titleName}】`
                }
            }
            else{
                if(hisTitle.indexOf("修改") != -1||hisTitle.indexOf("新增") != -1){
                    showValue=`${hisTitle}【${record.comment1}】:【${titleName}】` 
                }
                // else{
                //     showValue=`${hisTitle}【${docId}】:【${titleName}】`
                // }
            }
            // const showValue = `${hisTitle}【${docId}】:【${titleName}】`;
            return <div title={showValue} >已{showValue}</div>;
        },
    },
];
