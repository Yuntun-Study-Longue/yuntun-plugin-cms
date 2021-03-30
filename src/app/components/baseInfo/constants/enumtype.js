export const type = text => {
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
    else{
        return '';
    }
}
export const scope = text => {
    if(text=='1'){
        return <div title='文档'>文档</div>;
    }
    else if(text=='2'){
        return <div title='条目'>条目</div>;
    }
    else if(text=='3'){
        return <div title='文档+条目'>文档 + 条目</div>;
    }
    else{
        return '';
    }
}
export const changeitem = text => {
    if(text==0){
        return <div title='否'>否</div>;
    }
    else if(text==1){
        return <div title='是'>是</div>;
    }
    else {
        return '';
    }
}

export const selectType = text => {
    if(text=='0'){
      return <div title='文档'>单选</div>;
    }
    else if(text=='1'){
      return <div title='条目'>多选</div>;
    }
}
export const extendType = text => {
    if(text=='0'){
      return <div title='扩展'>扩展</div>;
    }
    else if(text=='1'){
      return <div title='内置'>内置</div>;
    }
}


export const createhistory = changeitem;