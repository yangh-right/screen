<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-06 14:59:10
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="echart-block">
        <div id="outer_tn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOutflowModelData } from '@/api/warnPredict';
import { genChart, lineOuterOption } from '../model/chart';
import moment from 'moment';
export default {
  name: 'interTnPredict',
  props: {
    title: {
      type: String,
      default: ''
    },
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
        }
      }
    }
  },
  methods: {
    async initData() {
      let params = {
        waterPlantId: this.waterPlantId,
        type: 1,
        controlId: 1,
        startTime: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'),
        timeEnum: 'Hours'
      };
      const { resultData, status } = await getOutflowModelData(params);
      if (status === 'complete') {
        let xData = [];
        let data = [{ name: 'TN', data: [] }];
        let unit = 'mg/L';

        xData = resultData?.map(item => item.dateTime.slice(11, 13)) || [];
        data[0].data = resultData?.map(item => item.pv) || [];

        let opt = lineOuterOption(unit, data, xData);
        genChart('outer_tn', opt, false);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px;
    height: 24px;
    background: url('~@/assets/img/hz/predict-stitle.png') no-repeat;
    background-size: 100% 100%;
    .title {
      margin: 0;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .content-spin {
    width: 100%;
    height: calc(100% - 30px);
    position: relative;
    .echart-block {
      width: 100%;
      height: 100%;

      #outer_tn {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
