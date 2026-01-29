<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-25 10:26:38
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="chart-btns">
        <div
          v-for="item in pointsArr"
          :key="item.pointName"
          :class="[currentPoint === item.pointName ? 'active-btn' : '', 'point-btn']"
          size="small"
          @click="handleChange(item)"
        >
          {{ item.pointMemo }}
        </div>
      </div>
      <div class="table-block">
        <dv-scroll-board :config="config" style="width: 100%; height: 197px"></dv-scroll-board>
      </div>
    </div>
  </div>
</template>

<script>
import { genChart, mutiLineOption } from '../model/chart';
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
      currentPoint: 'jsc_COD',
      config: {
        header: ['名称', '规格', '材质', '单位', '类别', '所属仓库', '仓库编号', '安全库存', '货架号'],
        data: [
          ['指示灯', 'Kr35', '塑料', '套', '防汛物资', '永康三号仓', 'cbck', 3, 4],
          ['指示灯', 'Kr35', '塑料', '套', '防汛物资', '永康三号仓', 'cbck', 3, 4],
          ['指示灯', 'Kr35', '塑料', '套', '防汛物资', '永康三号仓', 'cbck', 3, 4],
          ['指示灯', 'Kr35', '塑料', '套', '防汛物资', '永康三号仓', 'cbck', 3, 4],
          ['指示灯', 'Kr35', '塑料', '套', '防汛物资', '永康三号仓', 'cbck', 3, 4],
          ['指示灯', 'Kr35', '塑料', '套', '防汛物资', '永康三号仓', 'cbck', 3, 4],
          ['指示灯', 'Kr35', '塑料', '套', '防汛物资', '永康三号仓', 'cbck', 3, 4]
        ],
        columnWidth: [70, 120, 100, 150],
        rowNum: 5,
        headerHeight: 30,
        index: true,
        indexHeader: '序号',
        align: ['center', 'center', 'center', 'left']
      },
      pointsArr: [
        {
          cb: null,
          controlStandard: null,
          dataAndTimeList: [
            {
              date: '警戒器材',
              pv: 187,
              simulatePv: null
            },
            {
              date: '生命支持',
              pv: 164,
              simulatePv: null
            },
            {
              date: '医疗药品',
              pv: 156,
              simulatePv: null
            },
            {
              date: '通讯设备',
              pv: 153,
              simulatePv: null
            }
          ],
          deviceId: 'yuexiuhycqdsb',
          gb: null,
          pointMemo: '应急物资',
          pointName: 'jsc_COD',
          unit: 'mg/L'
        },
        {
          cb: null,
          controlStandard: null,
          dataAndTimeList: [
            {
              date: '警戒器材',
              pv: 187,
              simulatePv: null
            },
            {
              date: '生命支持',
              pv: 164,
              simulatePv: null
            },
            {
              date: '医疗药品',
              pv: 156,
              simulatePv: null
            },
            {
              date: '通讯设备',
              pv: 153,
              simulatePv: null
            }
          ],
          deviceId: 'yuexiuhycqdsb',
          gb: null,
          pointMemo: '防汛物资',
          pointName: 'NH3-N',
          unit: ''
        },
        {
          cb: null,
          controlStandard: null,
          dataAndTimeList: [
            {
              date: '警戒器材',
              pv: 187,
              simulatePv: null
            },
            {
              date: '生命支持',
              pv: 164,
              simulatePv: null
            },
            {
              date: '医疗药品',
              pv: 156,
              simulatePv: null
            },
            {
              date: '通讯设备',
              pv: 153,
              simulatePv: null
            }
          ],
          deviceId: 'yuexiuhycqdsb',
          gb: null,
          pointMemo: '生产药剂',
          pointName: 'jsc_TN',
          unit: 'mg/L'
        },
        {
          cb: null,
          controlStandard: null,
          dataAndTimeList: [
            {
              date: '警戒器材',
              pv: 187,
              simulatePv: null
            },
            {
              date: '生命支持',
              pv: 164,
              simulatePv: null
            },
            {
              date: '医疗药品',
              pv: 156,
              simulatePv: null
            },
            {
              date: '通讯设备',
              pv: 153,
              simulatePv: null
            }
          ],
          deviceId: 'sdgfgsf',
          gb: null,
          pointMemo: '备品备件',
          pointName: 'jsc_TP',
          unit: 'mg/L'
        }
      ]
    };
  },
  watch: {},
  methods: {
    async initData(item) {
      this.currentPoint = item.pointName;
      this.handleChart(item);
    },
    handleChange(item) {
      this.currentPoint = item.pointName;
      this.handleChart(item);
    },
    handleChart(pointData) {}
  },
  mounted() {
    this.initData(this.pointsArr[0]);
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
  .content-spin {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;

    .chart-btns {
      padding: 8px 12px 0 22px;
      box-sizing: border-box;
      display: flex;
      position: absolute;
      top: -45px;
      right: -20px;
      justify-content: space-between;
      .point-btn {
        width: calc(25% - 6px);
        height: 34px;
        line-height: 34px;
        background: url('~@/assets/img/hz/ac-point.png') no-repeat;
        background-size: 100% 100%;
        font-family: Aliba, sans-serif;
        font-weight: 500;
        font-size: 18px;
        color: #9fcfff;
        text-align: center;
        margin-right: 8px;
        cursor: pointer;
      }
      .active-btn {
        background: url('~@/assets/img/hz/b-point.png') no-repeat;
        background-size: 100% 100%;
        color: #ffffff;
      }
    }
    .table-block {
      width: 100%;
      height: 218px;
      padding-top: 6px;
      box-sizing: border-box;

      /deep/.dv-scroll-board .header {
        height: 33px;
        background: url('~@/assets/img/hz/table-header.png') no-repeat;
        background-size: 100% 100%;
        background-color: transparent !important;
      }
      /deep/.dv-scroll-board .header .header-item {
        padding: 0 !important;
      }
      /deep/.dv-scroll-board .rows .row-item {
        height: 30px !important;
        line-height: 30px !important;
        margin-top: 4px;
        background: url('~@/assets/img/hz/table-de.png') no-repeat;
        background-size: 100% 100%;
        background-color: transparent !important;
      }
      /deep/.dv-scroll-board .rows .ceil {
        padding: 0 !important;
      }
      /deep/.dv-scroll-board .rows .index {
        display: inline-block;
        width: 27px;
        height: 27px;
        background: url('~@/assets/img/hz/first.png') no-repeat;
        background-size: 100% 100%;
        font-family: MiSans-Medium, sans-serif;
        font-weight: 500;
        font-size: 14px;
        color: #f5faff;
        text-align: center;
        background-color: transparent !important;
      }
    }
  }
}
</style>
