/*
 * @version: 1.0.1
 * @Author: kk
 * @Date: 2021-10-22 14:48:44
 * @LastEditors: kk
 * @LastEditTime: 2021-11-15 10:45:41
 * @Description: 监听元素宽高变化，并执行自定义方法
 * @Update: 更新内容
 */
import ResizeObserver from 'resize-observer-polyfill';
// fix -> 将防抖包装在外部实际触发的resize方法，防止页面多个触发函数只触发最后一个  --  chart/Chart.vue -> resize()
// import { Debounce } from '@utils/util';
const func = (entries, el, binding) => {
    const {width, height} = el.beforeWH;
    const style = document.defaultView.getComputedStyle(el);
    const { width: elW, height: elH } = style;
    if (elW !== width || elH !== height) {
        binding.value();
        el.beforeWH = {
            width: elW,
            height: elH
        }
    }
    // for (const entry of entries) {
    //     const {width, height} = entry.contentRect;
    //     const style = document.defaultView.getComputedStyle(el);
    //     const { width: elW, height: elH } = style;
    //     console.log(width, height, elW, elH)
    //     if (elW !== width || elH !== height) {
    //         binding.value();
    //     }
    // }
}
// const DebounceFunc = Debounce(func, 500);
const elResize = {
    install(Vue) {
        Vue.directive("el-resize",{
            bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
                el.__vueObserver__ = new ResizeObserver((entries) => {
                    el.beforeWH = {
                        width: 0,
                        height: 0
                    }
                    func(entries, el, binding)
                });
                el.__vueObserver__.observe(el);
            },
            unbind(el) {
                if (el.__vueObserver__) {
                    el.__vueObserver__.disconnect();
                    el.__vueObserver__ = null;
                }
            }
        })
    }
}
export default elResize;