/* eslint-disable */
/**
 * 简化API操作的封闭
 * @url 接口名称，也可以带上query
 * @params 参数
 * @type 类型，默认是get、post可选，也可以传入其他类型的请求方式如all、request
 * 也支持node增强方式，如download、upload
 * 详情请参考https://www.jianshu.com/p/99915695267a
 * @author 李啸竹
 */
import fly from "flyio";
import qs from "qs";
import fs from "fs";

export default {
    getApiData(url, params, type) {
        let res, query, reg;
        type == "get" || type == undefined ? type = "get" : type = type;
        reg = /\?|&|_+/;

        if (reg.test(url) && typeof url !== 'object' && !params) {
            query = url.split('?');
            url = query[0];
            params = qs.parse(query[1]);
        }
        switch (type) {
            case "get":
                res = fly.get(url, params);
                return res;
            case "post":
                res = fly.post(url, params);
                return res;
            case "request":
                res = fly.request(url, params);
                return res;
            case "all":
                res = fly.all([url]).then(fly.spread((records, projects) => {
                    return records
                }))
                    .catch(error => {
                        console.log(error);
                    })
                return res;
            case "upload":
                let formData = {
                    file: fs.createReadStream('') //文件
                }
                res = fly.upload(url, formData);
                return res;
            default:
                res = fly.type(url, params);
                break;
        };
    }
};
