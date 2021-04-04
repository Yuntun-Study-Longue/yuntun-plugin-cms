// logger('数据走向', 'aaa', 'bbb')()
export const logger = (title = '数据走向', ...I) => (delimiter = '===>', O) => {
    if (!I) {
        I = [{ key: '0-1' }, '胡彦斌1', 32, true]
        O = `
            【数据走向】 {"key":"0-1"} ===> 胡彦斌1 ===> 32 ===> true ===> EOF
        `
        return O
    }

    O = I.reduce((prev, next) => prev += `${!!next && typeof next ? JSON.stringify(next) : next} ${delimiter} `, `【${title}】`)
    return console.log(O + 'EOF')
}

export const isShouldflush = (...I) => (lzlimit = 100, O) => {
    if (!I) {
        I = [0, 300, 600, ...{}]
        O = 1 | 0 | -1
        return O
    }

    O = ((start = I.shift(), end = I.pop()) => end - start > lzlimit  ? 1: start - end > lzlimit ? -1 : 0)()
    return O
}

// scrollContainer('.demand-manage-item-detail .ant-table-body ', '.scroll-7')()
export const scrollContainer = (...I) => (type = 'table' || 'tree', O) => {
    if (!I) {
        I = ['.demand-manage-item-detail .ant-table-body ', '.scroll-7'] 
        O = `
            const ParentClassName = '.demand-manage-item-detail .ant-table-body '
            const ChildClassName = '.scroll-7'
            const ParentEle = document.querySelector(ParentClassName)
            const ChildEle = document.querySelector(ParentClassName + ChildClassName)
            const startTop = ParentEle.scrollTop
            ParentEle.scrollTop = ChildEle.offsetTop
            logger(type, startTop, ChildEle.offsetTop, ParentEle.scrollTop)()
        ` || `
            const ParentClassName = '.demand-manage-item-detail .ant-table-body '
            const ChildClassName = '.scroll-7'
            const ChildEle = document.querySelector(ParentClassName + ChildClassName)
            ChildEle.scrollIntoView()
        `
        return O;
    }
    
    O = document.querySelector(I.join('')).scrollIntoView()
    return O
}

export const convertTableData2TreeData = (I) => (id = 0, joint = '0', link = 'PARENT_ID', subJoint = '', O) => {
    if (!I) {
        I = [{ id: 1, parentId: 0, orderNum, address: "西湖区湖底公园1号", age: 32, isLeaf: true, key: "1", name: "胡彦斌1", nodeIndex: "0" }, ...{}]
        O = [{ key: '0-0', id: 1, name: '胡彦斌',children: [] }, ...{}]
        return O;
    }
    
    let joint_key = 1;
    O = I.filter(item => item[link] == id).map( (item, nodeNum) => {
        let returnData = { 
            ...item, 
            key: `${joint}-${nodeNum}`, 
            nodeNum,
        }
        if (item.NODE_TYPE !== 2) {
            const sub_head = subJoint ? `${subJoint}.${joint_key++}` : joint_key++
            return {
                ...returnData,
                sub_head,
                children: convertTableData2TreeData(I)(item.ID, `${joint}-${nodeNum}`, link, sub_head)
            }
        }
        return {
            ...returnData, 
            children: convertTableData2TreeData(I)(item.ID, `${joint}-${nodeNum}`, link, subJoint) 
        }
    });
    return O
}
export const reverseFindJointKey = (TableData = []) => (I, joint = I.nodeNum, O) => {
    if (!I) {
        I = { id: 1, parentId: 0, orderNum, address: "西湖区湖底公园1号", age: 32, isLeaf: true, key: "1", name: "胡彦斌1", nodeIndex: "0" }
        O = ['0 - [nodeNum] - [nodeNum]...']
        return O
    }
    O = I.PARENT_ID == 0 ? ['0', joint].join('-') : TableData.filter(item => I.PARENT_ID == item.ID ).map( item =>  {
        return reverseFindJointKey(TableData)(item, item.nodeNum + '-' + joint)
    }).join('-')
    return O
}

export const generateExpandedKeys = (I) => (minLen = 2, O = []) => {
    if (!I) {
        I = ['0-2-0'];
        O = ['0-2', '0-2-0']
        return O
    }
    if (!I[0]) return O

    const Iarr = I[0].split('-')
    if (Iarr.length ===  minLen) return I

    Iarr.pop()
    O = [...generateExpandedKeys([Iarr.join('-')])(), ...I]
    return O
}

export const generateReferenceRows = (TableData = []) => (I, referenceIds = [], referenceRows = [], link = 'PARENT_ID', O) => {
    if (!I) {
        I = ['id', 'id', 'id', ...{}]
        O = [{key: '0-0-0', id: 1, name: '胡彦斌',children: [...{}]}, ...{}]
        return O
    }
    if (!I.length) {
        return referenceRows
    }
    const id = I.shift()
    const children = TableData.filter( item => ~~item[link] === id )
    const childIds = children.map(item => item.ID)
    
    referenceIds = [...referenceIds, id];
    referenceRows = [...referenceRows, ...children];
    O = generateReferenceRows(TableData)(childIds.concat(I), referenceIds, referenceRows)
    return O
} 

export const convertTreeData2TableData = (I, O) => {
    // 比 dataSource 的每条数据多加了一个 nodeNum 字段
    if (!I) {
        I = [{ key: '0-0', id: 1, name: '胡彦斌', children: [] }, ...{}]
        O = [{ key: '0-0', id: 1, name: '胡彦斌', nodeNum: 0, address: "西湖区湖底公园1号", age: 32, isLeaf: true, key: "1", name: "胡彦斌1", nodeIndex: "0" }]
        return O;
    }

    O = I.map( item => {
        if (item.children && item.children.length) {
            return [ { ...item, children: [] }, ...convertTreeData2TableData(item.children) ]
        }
        return item
    })
    return O.flat()
}

export const isBtnShowOrNot = (I) => (referArgs, O = false) => {
    if (!I) {
        I = 'titleName'
        O = true
        return O
    }

    const { itemCount, itemType, itemLevel, editType, editUser, items, currentUser } = referArgs;
    switch (I) {
        case '升级':
            // 1、未选择条目或多选条目，升级按钮应灰显 2.选择条目为“正文”条目 ，升级按钮灰显 3、单选条目为 “标题”或“标题+正文”的1级条目，升级按钮灰显
            if (itemCount !== 1) O = true // 1
            if ([2].includes(itemType)) O = true // 2
            if ([0, 3].includes(itemType) && itemLevel === 1) O = true // 3
            break;
        case '降级':
            if (itemCount !== 1) O = true // 1
            if ([2].includes(itemType)) O = true // 2
            if ([0, 3].includes(itemType) && itemLevel === 9) O = true // 3
            break;
        case '删除':
            // 删除按钮应灰显的情况：1、未选择条目 2、“共享编辑”模式，用户未锁定条目 3、锁定条目和未锁定条目混选
            if (itemCount === 0) O = true // 1
            if (['1'].includes(editType) && items.some(item => !item.LOCK_FLAG)) O = true
            if (['1'].includes(editType) && items.some(item => item.LOCK_NAME !== currentUser.loginName)) O = true // 2
            // if (['1', '2'].includes(editType) && items.some(item => item.LOCK_NAME !== currentUser.loginName)) O = true // 2
            break;
        case '新增下级标题':
            if (itemCount === 0) O = true
            if (['0'].includes(editType)) O = true
            console.log(itemLevel, itemType, typeof itemType, typeof editType)
            if (['1', '2'].includes(editType) && ![0, 1, 3].includes(itemType)) O = true
            break;
        case '共享编辑':
            if (['2'].includes('' + editType) && !editUser.includes(currentUser.loginName)) O = true
            break;
        case '独占编辑':
            // console.log(editType, editUser, currentUser)
            if (['1', '2'].includes('' + editType) && !editUser.includes(currentUser.loginName)) O = true
            break;
        default: break;
    }

    return O
}
