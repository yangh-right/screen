<!--
 * @Author: wangyr
 * @Date: 2023-05-30 16:43:15
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-08-16 13:30:44
 * @Description:
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="chart-btns">
        <a-button
          v-for="item in pointsArr"
          :key="item.pointName"
          :class="[currentPoint === item.pointName ? 'active-btn' : '', 'point-btn']"
          size="small"
          @click="handleChange(item)"
        >
          {{ item.pointMemo }}
        </a-button>
      </div>
      <div class="echart-block">
        <div id="alarm_out"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { genChart, mutiLineOption } from '../model/chart';
export default {
  name: 'OutWaterQuality',
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
      pointsArr: [
        {
          cb: null,
          controlStandard: null,
          dataAndTimeList: [
            {
              date: '2023-05-30 00:00:00',
              pv: 187,
              simulatePv: null
            },
            {
              date: '2023-05-30 01:00:00',
              pv: 164,
              simulatePv: null
            },
            {
              date: '2023-05-30 02:00:00',
              pv: 156,
              simulatePv: null
            },
            {
              date: '2023-05-30 03:00:00',
              pv: 153,
              simulatePv: null
            },
            {
              date: '2023-05-30 04:00:00',
              pv: 190,
              simulatePv: null
            },
            {
              date: '2023-05-30 05:00:00',
              pv: 120,
              simulatePv: null
            },
            {
              date: '2023-05-30 06:00:00',
              pv: 168,
              simulatePv: null
            },
            {
              date: '2023-05-30 07:00:00',
              pv: 242,
              simulatePv: null
            },
            {
              date: '2023-05-30 08:00:00',
              pv: 280,
              simulatePv: null
            },
            {
              date: '2023-05-30 09:00:00',
              pv: 228,
              simulatePv: null
            },
            {
              date: '2023-05-30 10:00:00',
              pv: 276,
              simulatePv: null
            },
            {
              date: '2023-05-30 11:00:00',
              pv: 290,
              simulatePv: null
            },
            {
              date: '2023-05-30 12:00:00',
              pv: 312,
              simulatePv: null
            },
            {
              date: '2023-05-30 13:00:00',
              pv: 311,
              simulatePv: null
            },
            {
              date: '2023-05-30 14:00:00',
              pv: 264,
              simulatePv: null
            },
            {
              date: '2023-05-30 15:00:00',
              pv: 222,
              simulatePv: null
            },
            {
              date: '2023-05-30 16:00:00',
              pv: 226,
              simulatePv: null
            },
            {
              date: '2023-05-30 17:00:00',
              pv: 231,
              simulatePv: null
            },
            {
              date: '2023-05-30 18:00:00',
              pv: 223,
              simulatePv: null
            },
            {
              date: '2023-05-30 19:00:00',
              pv: 234,
              simulatePv: null
            },
            {
              date: '2023-05-30 20:00:00',
              pv: 238,
              simulatePv: null
            },
            {
              date: '2023-05-30 21:00:00',
              pv: 241,
              simulatePv: null
            },
            {
              date: '2023-05-30 22:00:00',
              pv: 247,
              simulatePv: null
            },
            {
              date: '2023-05-30 23:00:00',
              pv: 239,
              simulatePv: null
            },
            {
              date: '2023-05-30 24:00:00',
              pv: 251,
              simulatePv: null
            }
          ],
          deviceId: 'yuexiuhycqdsb',
          gb: null,
          pointMemo: 'COD',
          pointName: 'jsc_COD',
          unit: 'mg/L'
        },
        {
          cb: null,
          controlStandard: null,
          dataAndTimeList: [
            {
              date: '2023-05-30 00:00:00',
              pv: 189,
              simulatePv: null
            },
            {
              date: '2023-05-30 01:00:00',
              pv: 178,
              simulatePv: null
            },
            {
              date: '2023-05-30 02:00:00',
              pv: 169,
              simulatePv: null
            },
            {
              date: '2023-05-30 03:00:00',
              pv: 156,
              simulatePv: null
            },
            {
              date: '2023-05-30 04:00:00',
              pv: 154,
              simulatePv: null
            },
            {
              date: '2023-05-30 05:00:00',
              pv: 102,
              simulatePv: null
            },
            {
              date: '2023-05-30 06:00:00',
              pv: 186,
              simulatePv: null
            },
            {
              date: '2023-05-30 07:00:00',
              pv: 230,
              simulatePv: null
            },
            {
              date: '2023-05-30 08:00:00',
              pv: 280,
              simulatePv: null
            },
            {
              date: '2023-05-30 09:00:00',
              pv: 311,
              simulatePv: null
            },
            {
              date: '2023-05-30 10:00:00',
              pv: 267,
              simulatePv: null
            },
            {
              date: '2023-05-30 11:00:00',
              pv: 219,
              simulatePv: null
            },
            {
              date: '2023-05-30 12:00:00',
              pv: 186,
              simulatePv: null
            },
            {
              date: '2023-05-30 13:00:00',
              pv: 211,
              simulatePv: null
            },
            {
              date: '2023-05-30 14:00:00',
              pv: 316,
              simulatePv: null
            },
            {
              date: '2023-05-30 15:00:00',
              pv: 186,
              simulatePv: null
            },
            {
              date: '2023-05-30 16:00:00',
              pv: 226,
              simulatePv: null
            },
            {
              date: '2023-05-30 17:00:00',
              pv: 231,
              simulatePv: null
            },
            {
              date: '2023-05-30 18:00:00',
              pv: 264,
              simulatePv: null
            },
            {
              date: '2023-05-30 19:00:00',
              pv: 271,
              simulatePv: null
            },
            {
              date: '2023-05-30 20:00:00',
              pv: 286,
              simulatePv: null
            },
            {
              date: '2023-05-30 21:00:00',
              pv: 291,
              simulatePv: null
            },
            {
              date: '2023-05-30 22:00:00',
              pv: 300,
              simulatePv: null
            },
            {
              date: '2023-05-30 23:00:00',
              pv: 296,
              simulatePv: null
            },
            {
              date: '2023-05-30 24:00:00',
              pv: 311,
              simulatePv: null
            }
          ],
          deviceId: 'yuexiuhycqdsb',
          gb: null,
          pointMemo: 'NH3-N',
          pointName: 'NH3-N',
          unit: ''
        },
        {
          cb: null,
          controlStandard: null,
          dataAndTimeList: [
            {
              date: '2023-05-30 00:00:00',
              pv: 198,
              simulatePv: null
            },
            {
              date: '2023-05-30 01:00:00',
              pv: 185,
              simulatePv: null
            },
            {
              date: '2023-05-30 02:00:00',
              pv: 177,
              simulatePv: null
            },
            {
              date: '2023-05-30 03:00:00',
              pv: 167,
              simulatePv: null
            },
            {
              date: '2023-05-30 04:00:00',
              pv: 198,
              simulatePv: null
            },
            {
              date: '2023-05-30 05:00:00',
              pv: 102,
              simulatePv: null
            },
            {
              date: '2023-05-30 06:00:00',
              pv: 169,
              simulatePv: null
            },
            {
              date: '2023-05-30 07:00:00',
              pv: 207,
              simulatePv: null
            },
            {
              date: '2023-05-30 08:00:00',
              pv: 232,
              simulatePv: null
            },
            {
              date: '2023-05-30 09:00:00',
              pv: 267,
              simulatePv: null
            },
            {
              date: '2023-05-30 10:00:00',
              pv: 301,
              simulatePv: null
            },
            {
              date: '2023-05-30 11:00:00',
              pv: 302,
              simulatePv: null
            },
            {
              date: '2023-05-30 12:00:00',
              pv: 229,
              simulatePv: null
            },
            {
              date: '2023-05-30 13:00:00',
              pv: 302,
              simulatePv: null
            },
            {
              date: '2023-05-30 14:00:00',
              pv: 310,
              simulatePv: null
            },
            {
              date: '2023-05-30 15:00:00',
              pv: 284,
              simulatePv: null
            },
            {
              date: '2023-05-30 16:00:00',
              pv: 291,
              simulatePv: null
            },
            {
              date: '2023-05-30 17:00:00',
              pv: 297,
              simulatePv: null
            },
            {
              date: '2023-05-30 18:00:00',
              pv: 301,
              simulatePv: null
            },
            {
              date: '2023-05-30 19:00:00',
              pv: 312,
              simulatePv: null
            },
            {
              date: '2023-05-30 20:00:00',
              pv: 320,
              simulatePv: null
            },
            {
              date: '2023-05-30 21:00:00',
              pv: 308,
              simulatePv: null
            },
            {
              date: '2023-05-30 22:00:00',
              pv: 312,
              simulatePv: null
            },
            {
              date: '2023-05-30 23:00:00',
              pv: 327,
              simulatePv: null
            },
            {
              date: '2023-05-30 24:00:00',
              pv: 331,
              simulatePv: null
            }
          ],
          deviceId: 'yuexiuhycqdsb',
          gb: null,
          pointMemo: 'TN',
          pointName: 'jsc_TN',
          unit: 'mg/L'
        },
        {
          cb: null,
          controlStandard: null,
          dataAndTimeList: [
            {
              date: '2023-05-30 00:00:00',
              pv: 198,
              simulatePv: null
            },
            {
              date: '2023-05-30 01:00:00',
              pv: 185,
              simulatePv: null
            },
            {
              date: '2023-05-30 02:00:00',
              pv: 177,
              simulatePv: null
            },
            {
              date: '2023-05-30 03:00:00',
              pv: 167,
              simulatePv: null
            },
            {
              date: '2023-05-30 04:00:00',
              pv: 198,
              simulatePv: null
            },
            {
              date: '2023-05-30 05:00:00',
              pv: 102,
              simulatePv: null
            },
            {
              date: '2023-05-30 06:00:00',
              pv: 169,
              simulatePv: null
            },
            {
              date: '2023-05-30 07:00:00',
              pv: 207,
              simulatePv: null
            },
            {
              date: '2023-05-30 08:00:00',
              pv: 232,
              simulatePv: null
            },
            {
              date: '2023-05-30 09:00:00',
              pv: 267,
              simulatePv: null
            },
            {
              date: '2023-05-30 10:00:00',
              pv: 301,
              simulatePv: null
            },
            {
              date: '2023-05-30 11:00:00',
              pv: 302,
              simulatePv: null
            },
            {
              date: '2023-05-30 12:00:00',
              pv: 229,
              simulatePv: null
            },
            {
              date: '2023-05-30 13:00:00',
              pv: 302,
              simulatePv: null
            },
            {
              date: '2023-05-30 14:00:00',
              pv: 310,
              simulatePv: null
            },
            {
              date: '2023-05-30 15:00:00',
              pv: 284,
              simulatePv: null
            },
            {
              date: '2023-05-30 16:00:00',
              pv: 291,
              simulatePv: null
            },
            {
              date: '2023-05-30 17:00:00',
              pv: 297,
              simulatePv: null
            },
            {
              date: '2023-05-30 18:00:00',
              pv: 301,
              simulatePv: null
            },
            {
              date: '2023-05-30 19:00:00',
              pv: 312,
              simulatePv: null
            },
            {
              date: '2023-05-30 20:00:00',
              pv: 320,
              simulatePv: null
            },
            {
              date: '2023-05-30 21:00:00',
              pv: 308,
              simulatePv: null
            },
            {
              date: '2023-05-30 22:00:00',
              pv: 312,
              simulatePv: null
            },
            {
              date: '2023-05-30 23:00:00',
              pv: 327,
              simulatePv: null
            },
            {
              date: '2023-05-30 24:00:00',
              pv: 331,
              simulatePv: null
            }
          ],
          deviceId: 'sdgfgsf',
          gb: null,
          pointMemo: 'TP',
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
    handleChart(pointData) {
      let { unit, dataAndTimeList = [] } = pointData;
      let data = [
        { name: '实时', data: [] },
        { name: '预测', data: [] }
      ];
      let xData = [];
      dataAndTimeList.forEach(item => {
        xData.push(item.date.slice(11, 13));
        data[0].data.push(item.pv);
        data[1].data.push(Number(item.pv) + parseInt(Math.random(0, 1) * 20));
      });

      let opt = mutiLineOption(unit, data, xData);
      genChart('alarm_out', opt, false);
    }
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
      justify-content: space-between;
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

      #alarm_out {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
