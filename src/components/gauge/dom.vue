<!--
 * @Author: 史磊
 * @Date: 2022-07-25 15:24:56
 * @LastEditTime: 2022-08-19 16:31:21
 * @LastEditors: 史磊
 * @Description: 
 * @FilePath: \ergongscreen\src\components\gauge\dom.vue
-->
<template>
  <div :class="{ gauge: true, [theme]: true }">
    <div :style="{ transform: `rotate(${degree}deg)` }" class="index" />
    <div class="detail">{{ percent }}<span class="symbol">%</span></div>
  </div>
</template>

<script>
export const BLUE = 'blue';
export const PINK = 'pink';
export default {
  props: {
    theme: {
      type: String,
      default: BLUE
    },
    percent: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    degree() {
      const min = -130;
      const max = 262;
      const degree = min + ((this.percent - 10) / 90) * max;
      return Math.min(Math.max(min, degree), max);
    }
  }
};
</script>

<style lang="less" scoped>
.gauge {
  position: relative;
  width: 100px;
  height: 100px;
  // background-position: (100 - 54)/2px ((100 - 54)/2 - 1px);
  // background-size: 54px;
  background-repeat: no-repeat;
  background-size: contain;
  .index {
    position: absolute;
    width: 10px;
    height: 62px;
    left: 50%;
    margin-left: -5px;
    // margin-top:5px;
    top: 6px;
    background-size: cover;
    // transform:rotate(-135deg);
    transform: rotate(-135deg);
    transform-origin: 5px 44px;
    transition: transform 3000ms linear;
  }
  .detail {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 17px;
    line-height: 23px;
    font-weight: bold;
  }
  .symbol {
    margin-left: 3px;
  }
  &.blue {
    background-image: url('~@/assets/bigscreen/gauge1.png');
    .index {
      background-image: url('~@/assets/bigscreen/index1.png');
    }
    .detail {
      color: #1bfce5;
    }
  }
  &.pink {
    background-image: url('~@/assets/bigscreen/gauge2.png');
    .index {
      background-image: url('~@/assets/bigscreen/index2.png');
    }
    .detail {
      color: #ff71fe;
    }
  }
}
</style>
