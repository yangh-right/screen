<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="card-inner">
      <div class="tips-header">
        <div class="filed">
          <div class="filed-info">
            <div class="value">{{ finishTicketRate || '0' }}%</div>
            <div class="label">工单办结率</div>
          </div>
        </div>
        <div class="filed">
          <div class="filed-info">
            <div class="value">{{ waitAcceptDuration || '0' }}min</div>
            <div class="label">接单平均等待时长</div>
          </div>
        </div>
        <div class="filed">
          <div class="filed-info">
            <div class="value">{{ processTimeoutRate || '0' }}%</div>
            <div class="label">工单超时率</div>
          </div>
        </div>
      </div>
      <div class="echarts-block">
        <pie-chart
          @hover="hoverChart"
          ref="pieChart"
          :total="totalNum"
          chartId="pumpChart"
          :chartView="chartView"
          :option="option"
        >
          <img :src="imgUrl" class="bg" />
        </pie-chart>
        <div class="lf-point">
          <div v-for="item in ltPointArr" :key="item.name" class="point-tab">
            <div class="label"><span class="ico-react" :style="{ background: item.color }"></span>{{ item.name }}</div>
            <div :class="['precent']" :style="{ color: item.color }">{{ item.value }}个</div>
          </div>
        </div>
        <div class="rg-point">
          <div v-for="item in rtPointArr" :key="item.name" class="point-tab">
            <div class="label"><span class="ico-react" :style="{ background: item.color }"></span>{{ item.name }}</div>
            <div :class="['precent']" :style="{ color: item.color }">{{ item.value }}个</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { buildOptions } from '../model/chart';
import { ticketAgingAnalysis, baseAnalysis, getTemplateType, getDict } from '@/api/mainPage.js';
import moment from 'moment';

export default {
  name: 'DigitalHomework',
  components: {
    PieChart: () => import('@/components/chart3d/PieChart.vue')
  },
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
      cardTitle: '污泥产量',
      color: [
        '#39A0F6',
        '#06BE75',
        '#3388FF',
        '#15EAFE',
        '#FFC30E',
        '#D137D9',
        '#EB9792',
        '#A768FF',
        '#32EDFF',
        '#2FC62F',
        '#FFA433',
        '#33BDFF'
      ],
      activePoint: {},
      totalNum: 0,
      chartView: {
        internalDiameterRatio: 0.9, // 透明的空心占比
        distance: 150, // 视角到主体的距离
        alpha: 28, // 旋转角度
        pieHeight: 6, //立体的高度
        opacity: 0.5 // 饼或者环的透明度
      },
      option: buildOptions(),
      imgUrl: require(`@/assets/img/hz/d3_bg.png`),
      pointsArr: [],
      ltPointArr: [],
      rtPointArr: [],
      finishTicketRate: 0,
      processTimeoutRate: 0,
      waitAcceptDuration: 0,
      orderTypeObj: {}
    };
  },

  computed: {
    ltPoint() {
      return this.pointsArr.slice(0, 2);
    },
    rtPoint() {
      return this.pointsArr.slice(2);
    }
  },
  watch: {
    pointsArr(newVal) {
      if (newVal.length === 0) return;
      const middleIndex = Math.ceil(newVal.length / 2);
      this.ltPointArr = newVal.slice(0, middleIndex);
      this.rtPointArr = newVal.slice(middleIndex);
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await getDict('water_purification').then(res => {
        if (res.status === 'complete') {
          res.resultData.all_small_type.forEach(item => {
            this.orderTypeObj[item.code] = item.name.slice(-2) + '工单';
          });
        }
      });
      this.pointsArr = [];
      let key = {
        dateType: 'day',
        dateRangeType: 'dayRange',
        dateUnit: 'PM',
        startTime: moment().startOf('month').format('YYYY-MM-DD'),
        endTime: moment().endOf('month').format('YYYY-MM-DD')
      };
      const { status, resultData } = await ticketAgingAnalysis(key);
      const res = await baseAnalysis(key);
      const val = await getTemplateType(key);
      if (status === 'complete') {
        this.processTimeoutRate = resultData.processTimeoutRate.nowCycle;
        this.waitAcceptDuration = resultData.waitAcceptDuration.nowCycle;
      }
      if (res.status === 'complete') {
        res.resultData.forEach(item => {
          if (item.countsType === 'finishTicketRate') {
            this.finishTicketRate = item.counts;
            return;
          }
        });
      }
      if (val.status === 'complete') {
        val.resultData.typeCount.forEach((item, i) => {
          this.pointsArr.push({
            name: this.orderTypeObj[item.code],
            value: item.completeCount,
            color: this.color[i]
          });
        });
      } else {
        this.pointsArr = [
          {
            name: '管理工单',
            value: 0,
            color: '#39A0F6'
          },
          {
            name: '采购工单',
            value: 0,
            color: '#06BE75'
          },
          {
            name: '安装工单',
            value: 0,
            color: '#3388FF'
          },
          {
            name: '保养工单',
            value: 0,
            color: '#15EAFE'
          },
          {
            name: '维修工单',
            value: 0,
            color: '#FFC30E'
          },
          {
            name: '巡检工单',
            value: 0,
            color: '#D137D9'
          },
          {
            name: '化验工单',
            value: 0,
            color: '#EB9792'
          },
          {
            name: '保养工单',
            value: 0,
            color: '#A768FF'
          },
          {
            name: '安全工单',
            value: 0,
            color: '#32EDFF'
          }
        ];
      }
      this.option.data = this.pointsArr.map((p, i) => {
        return {
          ...p,
          itemStyle: {
            color: this.color[i]
          }
        };
      });
      this.totalNum = this.pointsArr.reduce((total, next) => {
        return total + next.value;
      }, 0);
      this.activePoint = {
        name: '全部',
        value: this.totalNum
      };
      this.option.title.text = ['{per|' + this.totalNum + '}'];
      this.$refs.pieChart?.drawLine();
    },
    hoverChart(item) {
      if (item) {
        this.activePoint = item;
        const val = item.value || this.totalNum;
        this.$refs.pieChart?.refreshTitle([`{per|${val}}`]);
      } else {
        this.activePoint = {
          name: '全部',
          value: this.totalNum
        };
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
    padding: 15px 12px 15px 0;
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
  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0 12px;
    box-sizing: border-box;

    .tips-header {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      margin-top: 4px;

      .filed {
        width: calc(33.3% - 8px);
        display: flex;
        justify-content: center;
        align-items: center;
        background: url('~@/assets/img/hz/sludge-bg.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;

        .filed-info {
          .label {
            font-family: MicrosoftYaHei, sans-serif;
            font-size: 14px;
            color: #d9f7ff;
            text-align: center;
          }
          .value {
            font-family: YouSheBiaoTiHei, sans-serif;
            font-size: 18px;
            color: #ffffff;
            text-shadow: 0 2px 4px #32c5ffa8;
          }
        }
      }
    }
    .echarts-block {
      width: 250px;
      height: calc(100% - 44px);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin: 0 auto;
      img {
        width: 200px !important;
        height: 102px;
      }
      .bg {
        position: absolute;
        bottom: 110px;
        left: 122px;
        top: 20px;
        z-index: -1;
        width: 100%;
        transform: translateX(-50%);
        animation: blink 1.5s ease-in-out infinite;
      }
      .lf-point {
        width: 96px;
        height: calc(100% - 80px);
        position: absolute;
        top: 60px;
        left: 16px;
        overflow-y: auto;
      }
      .rg-point {
        width: 96px;
        height: calc(100% - 80px);
        position: absolute;
        top: 60px;
        right: 16px;
        overflow-y: auto;
      }

      .point-tab {
        width: 100%;
        margin-bottom: 8px;
        padding: 0 8px;
        display: flex;
        flex-direction: column;
        align-items: center;

        &:nth-child(2n) {
          margin-bottom: 0px;
        }

        .label {
          width: 100%;
          background-image: linear-gradient(270deg, #6ed2ff00 0%, #3ca6ff 96%);
          font-weight: 400;
          font-size: 14px;
          color: #ffffff;
          font-family: PingFangSC, sans-serif;
          display: flex;
          align-items: center;
          padding: 0 0 0 4px;

          .ico-react {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 1.76px;
            margin-right: 6px;
          }
        }
        .precent {
          font-family: YouSheBiaoTiHei, sans-serif;
          font-size: 24px;
        }
        .color1 {
          background-image: linear-gradient(to bottom, #ffeec1, #ffc73b);
          -webkit-background-clip: text;
          color: transparent;
        }
        .color2 {
          background-image: linear-gradient(to bottom, #c1efff, #3bb3ff);
          -webkit-background-clip: text;
          color: transparent;
        }
        .color3 {
          background-image: linear-gradient(to bottom, #c1ffef, #3bff8f);
          -webkit-background-clip: text;
          color: transparent;
        }
      }
    }
  }
}
</style>
