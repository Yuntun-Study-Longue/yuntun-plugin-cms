import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SysLayout from 'components/sysLayout/sysLayout'
import ReqExtension from './tabs/reqExtension'
import DocType from './tabs/docType'
import SysTabs from 'components/sysTabs'
const TabPane = SysTabs.TabPane
function Page (){
    return (
        <SysLayout>
            <SysTabs>
                <TabPane title="需求扩展属性">
                    <ReqExtension />
                </TabPane>
                <TabPane title="文档类型">
                    <DocType />
                </TabPane>
            </SysTabs>
        </SysLayout>
    )
}
export default Page