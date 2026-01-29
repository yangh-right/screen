<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="card-inner">
      <div class="echart-block">
        <pie-chart ref="alarmChart" :options="option"> </pie-chart>
      </div>
      <div class="points-list">
        <div class="point-tab">
          <div class="label"><span class="ico-react"></span>设备</div>
          <div class="value">数量</div>
        </div>
        <div v-for="item in pointsArr" :key="item.label" class="point-tab">
          <!-- :style="{ background: colors[i] }" -->
          <div class="label"><span class="ico-react"></span>{{ item.name }}</div>
          <div class="value">{{ item.value }} 个</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { conditionQuery } from '@/api/mainPage';
export default {
  name: 'AlarmType',
  components: {
    PieChart: () => import('@/components/chart/PieChart.vue')
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
      pointsArr: [
        {
          name: '进水水质分析间',
          value: 0
        },
        {
          name: '厌氧池A',
          value: 0
        },
        {
          name: '一级缺氧池A',
          value: 0
        },
        {
          name: '二沉池A',
          value: 0
        }
      ],
      option: {}
    };
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
      let param = {
        endTime: '',
        groupDeviceId: true,
        startTime: '',
        alarmTypeCodes: ['water_purification_huanjing'],
        stationIds: [this.waterPlantId]
      };
      let resultData = await conditionQuery(param);

      if (Array.isArray(resultData) && resultData.length > 0) {
        this.pointsArr = resultData.map(v => {
          return {
            ...v,
            value: v.num,
            name: v.groupName
          };
        });
      }
      let option = {
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(168, 191, 221, 0.2)',
              width: 'auto'
            }
          },
          borderColor: 'transparent',
          backgroundColor: 'rgba(1, 38, 73, 0.8)', // 背景色
          borderRadius: 4,
          textStyle: {
            color: '#FFF' // 字体颜色
          },
          confine: true
        },
        legend: {
          show: false
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            roseType: false,
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: 'center',
              formatter: '{name|{d}}{unit|%}\n{value|{b}}',
              rich: {
                name: { fontSize: 22, color: '#13E0FF', fontWeight: 600 },
                unit: { fontSize: 12, color: '#13E0FF' },
                value: { fontSize: 12, color: '#B2DFFF' }
              }
            },
            emphasis: {
              label: {
                show: true,
                color: '#13E0FF',
                fontSize: 22,
                fontWeight: 600
              }
            },
            labelLine: {
              show: false
            },
            data: this.pointsArr
          }
        ]
      };
      this.option = option;
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
    height: calc(100% - 40px);
    position: relative;
    padding-right: 12px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    .echart-block {
      width: 48%;
      height: 200px;
      text-align: center;
      background: url('~@/assets/img/hz/p-chart.png') no-repeat;
      background-size: 100% 100%;
      flex: 0 0 auto;
    }
    .points-list {
      width: 51%;
      height: calc(100% - 26px);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: 15px 0;

      .point-tab {
        width: 200px;
        height: 34px;
        background: url('~@/assets/img/hz/pie-point.png') no-repeat;
        background-size: 100% 100%;
        margin-bottom: 3px;
        padding: 0 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 2px;

        .label {
          width: 170px;
          font-family: Aliba, sans-serif;
          font-weight: 400;
          font-size: 14px;
          color: #d9f7ff;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          .ico-react {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 1.76px;
            margin-right: 6px;
          }
        }

        .value {
          width: 90px;
          font-size: 14px;
          font-weight: 700;
          background-image: linear-gradient(to bottom, #ffffff, #b6ecfd);
          -webkit-background-clip: text;
          color: transparent;
          text-align: right;

          .unit {
            font-family: Aliba, sans-serif;
            color: #ffffffff;
            font-size: 14px;
            line-height: 0;
            letter-spacing: 0;
          }
        }
      }
    }
  }
}
</style>
