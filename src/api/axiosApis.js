/**
 * @DATE:  2019/6/20 10:40
 * @Version: 0.0.1
 * @Author: yunchangJia
 * @Description: set axios request type
 * @Update: 新增geJson by huhaiou 2020/3/23 10:10 AM
 */

/* require axios configfile */
import axiosConfig from './axiosConfig';
const axios = axiosConfig.axios;

/* api request url */
export const sellApi = process.env.baseURL;

/**
 * axios request
 * @param httpGet     get request
 * @param httpPost    post request
 * @param httpPut     put request
 * @param httpDelete  delete request
 * @param $getJson    getJson request
 */
export const httpGet = (url, params) => { return axios.get(url, params); };
export const httpPost = (url, params) => { return axios.post(url, params); };
export const httpPut = (url, params) => { return axios.put(url, params); };
export const httpDelete = (url, params) => { return axios.delete(url, params); };
export const $getJson = function (url) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: url,
            dataType: "json",
            crossDomain: true,
            cache: false
        })
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                reject(error);
            });
    });
};
