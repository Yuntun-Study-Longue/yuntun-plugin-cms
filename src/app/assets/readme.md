
修改sysCoreLibs.umd.js 中的代码

// 原来的代码
$.post(globalInitConfig.eap_url+"doLogin.action",{loginName:e,loginPassword:n},function(e){e.root.datas[0].success?location.reload():alert(e.root.datas[0].msg)},"json")


// 替换代码
var form=new FormData();
form.append("grant_type","password"),
form.append("username",e),
form.append("password",n),
form.append("client_id","client_1"),
form.append("client_secret","123456"),
$.ajax({
    type:'post',
    data: form,
    contentType : false, 
    processData : false,
    url:"/sysware/oauth/token", 
    success:function(e) {
        document.cookie='Authorization='+ e.token_type + ' ' + e.access_token;
        location.reload();
    },
    error:function(e){
        if(e.responseText){ 
            alert(JSON.parse(e.responseText).error_description)
        }else{
            alert(e.statusText);
        }
        
    }
})