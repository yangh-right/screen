/**
 * @DATE:  2019/6/26 14:22
 * @Version: 0.0.1
 * @Author: yunchangJia
 * @Description: 动态添加 js || css
 */

/**
 * 动态添加 js || css 文件
 * @param url          【文件路径】
 * @param _type        【文件类型默认 js】
 * @param hasCallback  【回调函数】
 * @returns {*}
 */
export default function remoteLoad (url, _type, hasCallback) {
    /**
     * 移除script标签
     * @param scriptElement script dom
     */
    function _removeScript (scriptElement) {
        document.body.removeChild(scriptElement);
    }

    /**
     * 创建script
     * @param url
     * @returns {Promise}
     */
    function _createScript (url) {
        const scriptElement = document.createElement('script');
        document.body.appendChild(scriptElement);
        const promise = new Promise((resolve, reject) => {
            scriptElement.addEventListener('load', e => {
                // _removeScript(scriptElement);
                if (!hasCallback) {
                    resolve(e);
                }
            }, false);

            scriptElement.addEventListener('error', e => {
                _removeScript(scriptElement);
                reject(e);
            }, false);

            if (hasCallback) {
                window.____callback____ = function () {
                    resolve();
                    window.____callback____ = null;
                };
            }
        });
        if (hasCallback) {
            url += '&callback=____callback____';
        }
        scriptElement.src = url;
        return promise;
    }

    /**
     * 添加css
     * @param url
     */
    function _loadCss(url) {
        const css = document.createElement('link');
        css.href = url;
        css.rel = 'stylesheet';
        css.type = 'text/css';
        document.head.appendChild(css);
    }

    /* 根据 type 动态添加 js || css */
    const type = _type || 'js';
    if (type === 'js') return _createScript(url);
    if (type === 'css') return _loadCss(url);
    return false;
}





