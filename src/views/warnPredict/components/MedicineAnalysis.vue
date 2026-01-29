<!--
 * @Author: yuan wenyu
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2024-03-22 15:12:34
 * @LastEditors:  Do not edit
 * @Description:故障分析
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="card-inner">
        <a-select :value="solutionVal" dropdownClassName="select__list" class="select__block" @change="handleDate">
          <a-icon slot="suffixIcon" style="font-size: 16px; color: #6ca6f5" type="caret-down" />
          <a-select-opt-group v-for="(item, index) in solution" :key="index">
            <span slot="label" :style="{ color: '#77a3cc' }">{{ item.name }}</span>
            <a-select-option :value="val.id" v-for="(val, index) in item.children" :key="index">
              {{ val.name }}
            </a-select-option>
          </a-select-opt-group>
        </a-select>
        <div class="gis">
          <div class="gis__side">A区</div>
          <div class="gas">
            <div class="gas-item" v-for="(item, index) in dataList" :key="index">
              <div class="value1">{{ item.value1 }}</div>
              <div class="lable">{{ item.name }}</div>
              <div class="value2">{{ item.value2 }}<span class="unit">%</span></div>
            </div>
          </div>
          <div class="gis__side">B区</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const colorList = [
  '#00EBFF',
  '#24EACD',
  '#FFD17C',
  '#9FBEF1',
  '#1BC1D7',
  '#0A8CFF',
  '#12C06E',
  '#FEC019',
  '#DF3434',
  '#BD3EEB',
  '#6a5acd'
];
import moment from 'moment';
import { getSolutionTree } from '@/api/warnPredict.js';
export default {
  name: 'FailureAnalysis',
  components: {},
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
      solution: [],
      solutionVal: '',
      curDataIndex: 1,
      cardTitle: '能耗分析',
      dateTime: moment(),
      monthFormat: 'YYYY-MM',
      colorList,
      currentPoint: 'in',
      currentDate: 'year',
      dataList: [
        { value1: '13877 m³', value2: '13877 m³', name: '缺氧回流流量' },
        { value1: '134432 m³', value2: '134432 m³', name: '好氧回流流量' },
        { value1: '2343 m³', value2: '2343 m³', name: '排泥量' },
        { value1: '3424', value2: '3424', name: '碳源投加量' },
        { value1: '3643', value2: '3643', name: 'PAC投加量' },
        { value1: '0000', value2: '0000', name: '好氧1段DO设置点' },
        { value1: '0000', value2: '0000', name: '好氧2段DO设置点' }
      ],
      pointsType: [
        {
          label: '进水',
          type: 'in'
        },
        {
          label: '出水',
          type: 'out'
        }
      ],
      datesType: [
        {
          label: '年',
          type: 'year'
        },
        {
          label: '月',
          type: 'month'
        }
      ],
      pointsArr: [
        {
          name: '未提交',
          value: 23
        },
        {
          name: '已入库',
          value: 20
        },
        {
          name: '审核未通过',
          value: 20
        },
        {
          name: '已作废',
          value: 37
        }
      ],
      option: {}
    };
  },
  computed: {},
  watch: {
    solutionVal(val) {
      this.$emit('sent-solution', val);
    }
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let data = {
        waterPlantId: this.waterPlantId,
        solutionName: '',
        solutionType: '1'
      };
      const { status, resultData } = await getSolutionTree(data);
      if (status === 'complete') {
        this.solution = resultData[0].children || [];
        this.solutionVal = this.solution[0].children[0].id;
      }
    },
    handleChange(item) {
      this.currentPoint = item.type;
    },
    handleDate(item) {
      this.solutionVal = item;
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .select__block {
  background: url('~@/assets/img/hz/ac-point.png') no-repeat;
  background-size: 100% 100%;
  margin-left: 12px;
  width: 250px;
  margin-top: 12px;
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

  .content-spin {
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
    padding: 0 12px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  /deep/ .wpg-spin-container {
    height: 100%;
  }
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .gis {
    margin-top: 12px;
    flex: 1;
    display: flex;
    align-items: center;

    .gis__side {
      display: flex;
      height: 190px;
      width: 50px;
      justify-content: center;
      align-items: center;
      background: url('~@/assets/img/warnPredict/panel1.png') no-repeat;
      background-size: 100% 100%;
      font-weight: 500;
      font-size: 18px;
      color: #d9f7ff;
      letter-spacing: 0;
      text-align: center;
      text-shadow: 0 2px 4px #00000080;
    }

    .gas {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }

    .gas-item {
      width: 100%;
      display: flex;
      align-items: center;
      background: url('~@/assets/img/warnPredict/panel2.png') no-repeat;
      background-size: 100% 100%;
      margin-bottom: 6px;

      .lable {
        width: 36%;
        font-weight: 400;
        font-size: 14px;
        color: #d9f7ff;
        letter-spacing: 0;
        text-align: center;
      }

      .value1 {
        width: 32%;

        font-weight: 400;
        font-size: 14px;
        color: #c0d9ed;
        letter-spacing: 0;
        text-align: center;
      }

      .value2 {
        width: 32%;

        font-weight: 400;
        font-size: 14px;
        color: #c0d9ed;
        letter-spacing: 0;
        text-align: center;
      }
    }
  }
}
</style>
