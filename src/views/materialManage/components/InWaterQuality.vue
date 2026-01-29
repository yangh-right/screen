<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-14 14:22:20
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <a-select
      v-if="pointsArr.length > 0"
      v-model="currentPoint"
      dropdownClassName="select__list"
      class="select__block"
      @change="handleChange"
    >
      <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
      <a-select-option v-for="item in pointsArr" :key="item.materielTypeNo" :value="item.materielTypeNo">{{
        item.materielTypeName
      }}</a-select-option>
    </a-select>
    <div class="content-spin">
      <div class="echart-block">
        <div id="alarm_chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { genChart, mutiLineOption } from '../model/chart';
import { getTopMaterialType, getStockList } from '@/api/materialManage';
export default {
  name: 'InWaterQuality',
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
    return {
      cardTitle: '进水水质',
      currentPoint: '',
      pointsArr: [],
      dataAndTimeList: [
        {
          name: '乙酸钠',
          existingQuantity: 0,
          minInventory: 0
        },
        {
          name: 'PAC',
          existingQuantity: 0,
          minInventory: 0
        },
        {
          name: '次氯酸钠',
          existingQuantity: 0,
          minInventory: 0
        },
        {
          name: '除磷剂',
          existingQuantity: 0,
          minInventory: 0
        }
      ]
    };
  },
  watch: {},
  mounted() {
    this.getTopMaterial();
  },
  methods: {
    async getTopMaterial() {
      const { success, resultData } = await getTopMaterialType();
      if (success && Array.isArray(resultData) && resultData.length > 0) {
        this.pointsArr = resultData.length ? resultData : [];
        this.initData(this.pointsArr[0]);
      } else {
        this.handleChartData();
      }
    },
    async initData(item) {
      this.currentPoint = item.materielTypeNo;
      this.handleChart();
    },
    handleChange(val) {
      this.currentPoint = val;
      this.handleChart();
    },
    async handleChart() {
      this.dataAndTimeList = [];
      let params = {
        materielTypeNo: this.currentPoint,
        subTypeTree: true
      };
      const { success, resultData } = await getStockList(params);
      if (success && Array.isArray(resultData) && resultData.length > 0) {
        this.dataAndTimeList = resultData.map(item => {
          return {
            name: item.materielName,
            existingQuantity: item.existingQuantity,
            minInventory: item.minInventory
          };
        });
        this.handleChartData();
      }
    },
    handleChartData() {
      let data = [
        { name: '存量', data: [] },
        { name: '预警值', data: [] }
      ];
      let xData = [];
      this.dataAndTimeList.forEach(item => {
        xData.push(item.name);
        data[0].data.push(item.existingQuantity || 0);
        data[1].data.push(item.minInventory || 0);
      });
      const unit = '个';
      let opt = mutiLineOption(unit, data, xData);
      genChart('alarm_chart', opt, false);
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
    height: 47px;
    background: url('~@/assets/img/hz/card-title.png') no-repeat;
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
  /deep/ .select__block {
    background: url('~@/assets/img/hz/ac-point.png') no-repeat;
    background-size: 100% 100%;
    margin-left: 1%;
    width: 124px;
    height: 28px;
    margin-right: 12px;

    .ant-select-selection {
      background: transparent;
      border: none;
    }

    .ant-select-selection__rendered {
      height: 28px;
      line-height: 28px;
      text-align: center;
      .ant-select-selection-selected-value {
        float: unset;
        font-family: SourceHanSansCN-Regular, sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
  .content-spin {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;

    .chart-btns {
      padding: 8px 12px 0 22px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      overflow-x: auto;
      .point-btn {
        width: calc(25% - 6px);
        height: 34px;
        background: url('~@/assets/img/hz/ac-point.png') no-repeat;
        background-size: 100% 100%;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #9fcfff;
        text-align: center;
        margin-right: 8px;
      }
      .active-btn {
        background: url('~@/assets/img/hz/b-point.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
    .echart-block {
      width: 100%;
      height: calc(100% - 30px);
      margin-top: 6px;

      #alarm_chart {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
