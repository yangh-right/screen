<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="left-slider">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="label">{{ item.label }}</div>
          <div class="item-inner">
            <div class="value">{{ item.value }}<span class="unit">个</span></div>
          </div>
        </div>
      </div>
      <div class="right-slider">
        <div class="top">
          <div class="label">总监测点</div>
          <div class="value">{{ total }}<span class="unit">个</span></div>
        </div>
        <div class="bottom">
          <pie-chart ref="alarmChart" :options="option"> </pie-chart>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { basicInformationOfTheProject, deviceOnlineStatus } from '@/api/energyAnalyse';
export default {
  name: 'energyRanking',
  components: {
    PieChart: () => import('@/components/chart/PieChart.vue'),
    UnitCard: () => import('@/components/UnitCard.vue')
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
      total: 0,
      option: {},
      colorList: [
        {
          color: '#3388ff',
          borderColor: '#1550a2'
        },
        {
          color: '#15eafe',
          borderColor: '#0d5787'
        }
      ],
      list: [
        {
          label: '项目数量',
          value: 0
        },
        {
          label: '站点数量',
          value: 0
        },
        {
          label: '设备数量',
          value: 0
        }
      ]
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.init();
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.getDeviceOnlineStatus();
      this.getBasicInformation();
    },
    async getBasicInformation() {
      let res = await basicInformationOfTheProject(this.waterPlantId);
      let { status, resultData } = res;
      if (status === 'complete') {
        this.list = [
          {
            label: '项目数量',
            value: resultData.projectNum || 0
          },
          {
            label: '站点数量',
            value: resultData.stationNum || 0
          },
          {
            label: '设备数量',
            value: resultData.deviceNum || 0
          }
        ];
        this.total = res.resultData.totalPointNum;
      }
    },
    async getDeviceOnlineStatus() {
      let res = await deviceOnlineStatus(this.waterPlantId);
      let { status, resultData } = res;
      if (status === 'complete') {
        let pointsArr = [
          {
            name: '在线数量',
            value: resultData.onlineNum || 0
          },
          {
            name: '离线数量',
            value: resultData.offlineNum || 0
          }
        ];
        let option = {
          tooltip: {
            textStyle: {
              color: '#FFF'
            },
            backgroundColor: 'rgba(1,38,73,0.8)',
            trigger: 'item',
            confine: true
          },
          legend: {
            show: false
          },
          series: [
            {
              type: 'pie',
              radius: ['74%', '90%'],
              center: ['48%', '50%'],
              roseType: false,
              avoidLabelOverlap: true,
              label: {
                show: false,
                position: 'center',
                formatter: '{value|{b}}\n{name|{c}}{unit|个}',
                rich: {
                  name: { fontSize: 20, color: '#F4F8FF', fontWeight: 600 },
                  unit: { fontSize: 20, color: '#F4F8FF', fontWeight: 600 },
                  value: { fontSize: 16, color: '#B4C2DB', lineHeight: 36 }
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
              data: pointsArr.map((v, i) => {
                return {
                  value: v.value,
                  name: v.name,
                  itemStyle: {
                    normal: {
                      color: this.colorList[i].color,
                      borderWidth: 6,
                      shadowBlur: 100,
                      borderCap: 'round',
                      borderColor: this.colorList[i].borderColor,
                      shadowColor: this.colorList[i].borderColor
                    }
                  }
                  //   ...v
                };
              })
            }
          ]
        };
        this.option = option;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 11px 9px 14px 22px;
  display: flex;
  justify-content: space-between;
  .left-slider {
    flex: 0 0 120px;
    height: 100%;
    .item {
      position: relative;
      width: 100%;
      height: 63px;
      margin-bottom: 20px;
      .item-inner {
        width: 100%;
        height: 63px;
        background: url('~@/assets/img/temp_num.png') no-repeat;
        background-size: 100% 100%;
      }
      .label {
        position: absolute;
        left: 24px;
        top: -4px;
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #f4f8ff;
        letter-spacing: 0;
      }
      .value {
        position: absolute;
        top: 32px;
        left: 30px;
        font-weight: 600;
        font-size: 18px;
        color: #e0f2ff;
        letter-spacing: 0;
      }
      .unit {
        margin-left: 4px;
        font-family: AlibabaPuHuiTi_2_65_Medium, sans-serif;
        font-weight: 500;
        font-size: 14px;
        color: #a6cdf1;
        letter-spacing: 0;
      }
    }
  }
  .right-slider {
    width: calc(100% - 136px);
    height: 100%;
    .top {
      display: flex;
      justify-content: space-between;
      padding: 0 40px;
      align-items: center;
      width: 278.15px;
      height: 49px;
      background: url('~@/assets/img/temp_title_bg.png') no-repeat;
      background-size: 100% 100%;
      .label {
        margin-left: 24px;
        font-weight: 600;
        font-family: PingFangSC-SNaNpxibold, sans-serif;
        font-size: 14px;
        color: #f4f8ff;
        letter-spacing: 0;
      }
      .value {
        font-family: MiSans-DNaNpxibold, sans-serif;
        font-weight: 600;
        font-size: 16px;
        color: #d9f7ff;
        letter-spacing: 0;
        text-align: right;
      }
      .unit {
        margin-left: 6px;
        font-family: PingFangSC-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #b4c2db;
        letter-spacing: 0;
        text-align: right;
      }
    }
    .bottom {
      margin-top: 20px;
      width: 100%;
      height: calc(100% - 60px);
      background: url('~@/assets/img/temp_bg.png') no-repeat;
      background-size: 96% 100%;
    }
  }
}
</style>
