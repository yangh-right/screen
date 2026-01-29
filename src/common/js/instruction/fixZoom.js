import Vue from 'vue';

function fun($el, binding) {
  // 参数获取
    let _viewClassName = 'page-inner-container', _viewZoom = 0;
    if (binding.value) {
        _viewClassName = binding.value.viewClass || _viewClassName;
        _viewZoom = !isNaN(parseFloat(binding.value.viewZoom)) ? parseFloat(binding.value.viewZoom) : _viewZoom;
    }
  // 根节点zoom
    const rootZoom = document.documentElement.style.zoom;
  // 当前视图窗口zoom
    const viewZoom = _viewZoom || (function () {
        let $parent = $el.parentNode;
        while ($parent && $parent !== document.body) {
            if (~$parent.className.indexOf(_viewClassName)) {
                return window.getComputedStyle($parent).zoom;
            }
            $parent = $parent.parentNode;
        }
        return 1;
    }());
  // 校准zoom
    const rawZoom = rootZoom * viewZoom, zoom = 1 / rawZoom;
    $el.style.zoom = zoom;
}

// 使用示例：
// 默认：<div v-fix-zoom></div>
// 带参：<div v-fix-zoom="{viewClass: 'abc', viewZoom: 2}"></div>
// 参数说明：viewClass为最外层视图窗口上的样式名，viewZoom为最外层视图窗口的zoom值
Vue.directive('fixZoom', {
    inserted($el, binding) {
        fun($el, binding);
    // resize监听
        $el._fun = () => fun($el, binding);
        window.addEventListener('resize', $el._fun, false);
    },
    unbind($el) {
        window.removeEventListener('resize', $el._fun, false);
    }
});
