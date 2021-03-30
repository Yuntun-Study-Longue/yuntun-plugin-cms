import React from 'react'
import { createFromIconfontCN } from '@ant-design/icons';
const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js', // icon-javascript, icon-java, icon-shoppingcart (overrided)
    '//at.alicdn.com/t/font_2242499_cem2nzuu4yl.js', // all icons of idp
    '//at.alicdn.com/t/font_2266493_ubutliz296k.js' // alichs icons
  ],
});

function SysIcon(props) {
    return (
        <IconFont type={`icon-${props.name}`} />
    )
}
export default SysIcon
