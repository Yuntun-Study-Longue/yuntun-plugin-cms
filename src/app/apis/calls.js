require("console-polyfill");
import axios from "axios";
import SysModal from 'components/sysModal';
import message from "sub-antd/lib/message";

// 状态码错误信息
const codeMessage = {
    200: "服务器成功返回请求的数据。",
    201: "新建或修改数据成功。",
    202: "一个请求已经进入后台排队（异步任务）。",
    204: "删除数据成功。",
    400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
    401: "用户没有权限（令牌、用户名、密码错误）。",
    403: "用户得到授权，但是访问是被禁止的。",
    404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
    406: "请求的格式不可得。",
    410: "请求的资源被永久删除，且不会再得到的。",
    422: "当创建一个对象时，发生一个验证错误。",
    500: "服务器发生错误，请检查服务器。",
    502: "网关错误。",
    503: "服务不可用，服务器暂时过载或维护。",
    504: "网关超时。",
};

function getCookie(name) {
    //可以搜索RegExp和match进行学习
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

// 发起请求前
let loadingInstance = null;

axios.interceptors.request.use(
    function (config) {
        //每个请求增加时间戳，防止IE8缓冲
        const t = new Date().getTime();
        config.url =
            config.url.indexOf("?") == "-1"
                ? config.url + "?_=" + t
                : config.url + "&_=" + t;
        // 在发送请求之前做些什么
        // if (config.method === "post") {
        //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        //     config.data = qs.stringify(config.data)
        // }

        // 默认开启loading
        if (!config.LOADINGHIDE && !loadingInstance) {
            loadingInstance = message.loading("正在执行中...", 0);
        }
        const authorization = getCookie("Authorization");
        config.headers.Authorization = authorization;
        if (document.getElementById("Auth-PubKey")) {
            config.headers["Accept-Acl-Enable"] = true;
            config.headers["Auth-Data"] = Encrypt(
                document.getElementById("Auth-Params").value
            );
        } else {
            config.headers["Accept-Acl-Enable"] = false;
        }
        return config;
    },
    function (error) {
        SysModal.error("加载超时");
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function (response) {
        // loading close...
        loadingInstance && loadingInstance();
        if (
            response.status === 200 &&
            response.data &&
            (!response.data.code ||
                response.data.code === 200 ||
                response.data.code === 105)
        ) {
            //成功处理
            return response;
        } else {
            //错误处理
            if (response.data) {
                if (response.data.code === 100 && /^视图\S*重复！$/.test(response.data.message)) {
                    return SysModal.warning(response.data.message);
                }
                if (response.data.code === 100 && /^文档模板不存在\S*上传文档模板$/.test(response.data.message)) {
                    return SysModal.info(response.data.message);
                }
                else {
                    SysModal.error(response.data.message);
                }
            } else {
                SysModal.error("请求错误，请重试！");
            }
            console.error("axios请求错误：", response);
        }
    },
    function (error) {
        // loading close...
        loadingInstance && loadingInstance();
        if (error) {
            // 请求配置发生的错误
            const { config, data, status } = error.response; //获取错误信息 获取状态码
            const errortext =
                codeMessage[status] ||
                error.message ||
                error.response.statusText;
            // //登录时避免弹出框提示
            // if(config.url.indexOf('/sysware/oauth/token')!==-1){
            //     return Promise.reject(error);
            // }
            // if (data) {
            //     SysModal.error(data.error_description);
            // } else {
            //     SysModal.error(errortext, 5);
            // }
            console.error("axios请求错误：", error, error.response);

            // 错误状态处理
            if (status === 401 && location.href.indexOf("login.html") < 0) {
                //typeof sysLoginDialog === "function" && sysLoginDialog();
                //记录登录超时的页面
                localStorage.setItem("reloginToPath", location.pathname);
                //跳转至重新登录页面
                location.pathname = "/p_401.html";
            } else if (status === 403) {
                // router.push("/login");
            } else if (status >= 404 && status < 422) {
                // router.push("/404");
            }
        }

        return Promise.reject(error);
    }
);
