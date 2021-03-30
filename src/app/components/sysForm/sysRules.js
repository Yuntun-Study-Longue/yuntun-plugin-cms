const required = { required: true, message: '此项必须填写'};
const max = function(len){ 
    return { max: len, message: `最大长度不能超过${len}`}
}
const dmax = function(len){ 
    return { max: len, message: ' '}
}
export {
    required,
    max,
    dmax
}