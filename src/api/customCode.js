/*
 * @Description: 数据字典....
 * @Author: huhaiou
 * @Date: 2021-11-25 16:35:11
 * @LastEditTime: 2022-08-08 10:25:04
 * @LastEditors: 史磊
 * require node path package
 * see readme for details
 */
// const merge = require('webpack-merge');

/**
 * [responseCode 后端返回状态码]
 * @type {Object}
 */
const responseCode = {
    COMPLETE: 'complete',                               // 请求成功
    JWT_TOKEN_EXPIRED: 'jwt_token_expired',             // jwt超时
    SYS_NOT_EXIST: 'sys_not_exist',                     // 请求数据不存在
    JWT_TOKEN_ILLEGAL: 'jwt_illegal_token'              // token非法
};

/* merge code to customCode  */
const customCode = responseCode; // merge(responseCode);

export default customCode;
