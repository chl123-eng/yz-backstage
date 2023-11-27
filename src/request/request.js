import axios from "axios"; // 引入axios
import { domainName } from "@/config/index";
import { Message } from "element-ui";
// 创建 instance实例
const instance = axios.create({
    // baseURL: process.env.VUE_APP_BASE_URL,
    baseURL: domainName,
    timeout: 500000,
});
// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem("token");
       
        if (token) {
            config.headers["token"] = token;
        }
        // config.headers['yzfrom'] = 'web-suppliers';
        return config; // 一定要返回config,不然在组件中会报错
    },
    () => {
        // return Promise.reject(err);
    }
);
// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        let data = res.data;
        if (data.code != 200) {
            Message.error(data.msg || "网络请求错误");
        }
        if (data.code == 401) {
            Message.error(data.msg || "请重新登录");
        }
        return data; // 这个返回的组件中then方法中的数据
    },
    (err) => {
        let data = err.response.data;
        if (data.code != 200) {
            Message.error(data.msg || "网络请求错误");
        }
        if (data.code == 401) {
            Message.error(data.msg || "请重新登录");
        }
        return Promise.reject(err);
    }
);
export default instance;
