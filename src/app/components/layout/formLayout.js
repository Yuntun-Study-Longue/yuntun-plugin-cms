const halfFourColLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { width: "50%" },
};
const halfFourColLayoutFn = (style) => ( !style ? halfFourColLayout : {...halfFourColLayout, style: { float: 'left', width: "50%", ...style } });

const fourColLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    style: { width: "100%" },
};
const fourColLayoutFn = (style) => ( !style ? fourColLayout : {...fourColLayout, style: { width: "100%", ...style } });

const twoColLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { width: "100%" },
};
const twoColLayoutFn = (style) => ( !style ? twoColLayout : {...twoColLayout, style: { width: "100%", ...style } });

const noLabelColLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
    style: {width: '100%'},
}
const noLabelColLayoutFn = (style) => ( !style ? noLabelColLayout : {...noLabelColLayout, style: { width: "100%", ...style } });

export {
    twoColLayout, fourColLayout, halfFourColLayout, noLabelColLayout,
    halfFourColLayoutFn, fourColLayoutFn, twoColLayoutFn, noLabelColLayoutFn,
}