/**
 * @DATE:  2020-03-12 09:49
 * @Version: 0.0.1
 * @Author: yunchangJia
 * @Description: 自定义全局 v-resize 指令
 * @Update: 更新内容 by yunchangJia 2020-03-12 09:49
 */

import Vue from 'vue';

const resize = Vue.directive('resize', {
    /**
     * 指令的钩子函数绑定元素
     * @param el为绑定的元素
     * @param binding为绑定给指令的对象
     */
    bind(el, binding) {
        let width = '', height = '';

        function isReize() {
            const style = document.defaultView.getComputedStyle(el);
            if (width !== style.width || height !== style.height) {
                binding.value();  // 关键
            }
            width = style.width;
            height = style.height;
        }

        el.__vueSetInterval__ = setInterval(isReize, 300);
    },
    /**
     * 指令与元素解绑回调函数
     * @param el为绑定的元素
     */
    unbind(el) {
        clearInterval(el.__vueSetInterval__);
    }
});
export {resize};

