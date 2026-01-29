/** * @version: 1.0.1 * @Author: wang kai * @Date: 2020-07-15 15:26:57 * @LastEditors: wang kai * @LastEditTime:
2020-07-15 15:42:47 * @Description: 内容描述 * @Update: 更新内容 */
<template>
  <div class="gauge-container">
    <div class="col">
      <div class="content">
        <gauge :percent="ensureWaterSupplyPercent" />
        <div class="tip">供水保证率</div>
      </div>
    </div>
    <div class="col">
      <div class="content">
        <gauge :percent="waterQualityPercent" theme="pink" />
        <div class="tip pink">水质达标率</div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import gauge from './chart';
// import gauge from './dom'
export default {
  components: {
    gauge
  },
  props: {
    // 供水保证率
    ensureWaterSupplyPercent: {
      type: [Number, String],
      default: 0
    },
    // 水质达标率
    waterQualityPercent: {
      type: [Number, String],
      default: 0
    }
  }
};
</script>

<style lang="less" scoped>
.gauge-container {
  height: 100%;
  margin: 0 -1px;
  &::after {
    content: '';
    display: block;
    clear: both;
  }
  .col {
    float: left;
    padding: 0 1px;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
  }
  .content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #012458;
    padding: 18px 0 24px;
  }
  .tip {
    margin-left: 16px;
    height: 100px;
    width: 26px;
    line-height: 26px;
    letter-spacing: 3px;
    text-align: center;
    box-sizing: border-box;
    background-image: linear-gradient(180deg, #004a9278 0%, #00245978 100%);
    border-radius: 16px;
    writing-mode: vertical-lr;
    font-size: 12px;
    color: #1bfce5;
    &.pink {
      background-image: linear-gradient(180deg, #86009278 0%, #00245978 100%);
      color: #ffcbff;
    }
  }
}
</style>
