<template>
  <div id="heatmap" class="heatmap"></div>
</template>
<script>

import Heatmap from 'heatmap.js';
export default {
  name: 'HelloWorld',
  props: {
    userDefined: {
      type: Boolean,
      default: false
    },
    heatmapData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  mounted() {
    // 创建一个heatmap实例对象
    // 这里直接指定热点图渲染的div了.heatmap支持自定义的样式方案,网页外包接活具体可看官网api
    var heatmapInstance = Heatmap.create({
      container: document.getElementById('heatmap'),
      gradient: this.userDefined
        ? {
            0: '#FA1201',
            0.25: '#F96E12',

            0.5: '#FBAA28',

            0.75: '#ABFE41',

            1.0: '#00D097'
          }
        : null
    });
    // 构建一些随机数据点,网页切图价格这里替换成你的业务数据
    var points = [];
    var max = 0;
    var width = 600;
    var height = 400;
    var len = 50;
    // while (len--) {
    //   var val = Math.floor(Math.random() * 100);
    //   max = Math.max(max, val);
    //   var point = {
    //     x: Math.floor(Math.random() * width),
    //     y: Math.floor(Math.random() * height),
    //     value: val
    //   };
    //   points.push(point);
    // }
    // console.log(points);
    var data = {
      max: 100,
      data: this.heatmapData
    };
    // 因为data是一组数据,web切图报价所以直接setData
    heatmapInstance.setData(data);
  }
};
</script>
<style lang="less" scoped>
.heatmap {
  width: 100%;
  height: 100%;
}
</style>
