<template>
  <unit-card :cardTitle="title" :showTime="true">
    <div class="card-inner">
      <div class="echart-block">
        <pie-chart ref="medicineChart" :options="option"> </pie-chart>
        <div class="pie-bg">
          <div class="count-total">114.59</div>
          <div class="count-label">总计(吨)</div>
          <div class="points-list">
            <div v-for="(item, i) in pointsArr" :key="item.name" class="point-tab">
              <div class="label"><span class="ico-react" :style="{ background: colors[i] }"></span>{{ item.name }}</div>
              <div class="value">{{ item.value }}%</div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-block">
        <dv-scroll-board :config="config" style="width: 200px; height: 210px"></dv-scroll-board>
      </div>
    </div>
  </unit-card>
</template>

<script>
import UnitCard from './UnitCard';

export default {
  name: 'MedicineAlasysis',
  components: {
    PieChart: () => import('@/components/chart/PieChart.vue'),
    UnitCard
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
      colors: ['#5CCDFF', '#68FFB8', '#FFE87C', '#7590FF', '#99D8FF', '#3cb9b4', '#11bbd7'],
      pointsArr: [
        {
          name: 'PAC',
          value: 24,
          total: 291.11,
          pre: 291.11,
          unit: '吨'
        },
        {
          name: 'PAM',
          value: 17,
          total: 291.11,
          pre: 291.11,
          unit: '吨'
        },
        {
          name: '乙酸钠',
          value: 56,
          total: 291.11,
          pre: 291.11,
          unit: '吨'
        },
        {
          name: '次氯酸钠',
          value: 10,
          total: 291.11,
          pre: 291.11,
          unit: '吨'
        }
      ],
      option: {},
      config: {
        header: ['名称', '累计消耗', '计划消耗'],
        data: [
          ['PAC', '291.11吨', '291.11吨'],
          ['PAM', '291.11吨', '291.11吨'],
          ['乙酸钠', '291.11吨', '291.11吨'],
          ['次氯酸钠', '291.11吨', '291.11吨']
        ],
        columnWidth: [],
        rowNum: 4,
        headerHeight: 30,
        align: ['center', 'center', 'center']
      }
    };
  },
  computed: {},
  watch: {},
  methods: {
    initData() {
      let scaleData = [
        {
          name: '工程建设',
          value: 10
        },
        {
          name: '产权交易',
          value: 10
        },
        {
          name: '土地交易',
          value: 10
        },
        {
          name: '其他交易',
          value: 10
        }
      ];
      let rich = {
        white: {
          color: '#ddd',
          align: 'center',
          padding: [3, 0]
        }
      };
      let data = [];
      let color = ['#00ffff', '#00cfff', '#006ced', '#ffe000', '#ffa800', '#ff5b00', '#ff3000'];
      for (let i = 0; i < scaleData.length; i++) {
        data.push(
          {
            value: scaleData[i].value,
            name: scaleData[i].name,
            itemStyle: {
              normal: {
                borderWidth: 5,
                // shadowBlur: 20,
                borderColor: color[i],
                shadowColor: color[i]
              }
            }
          },
          {
            value: 2,
            name: '',
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0
              }
            }
          }
        );
      }
      data.push({
        value: 48,
        itemStyle: {
          color: 'none',
          decal: {
            symbol: 'none'
          }
        },
        label: {
          show: false
        }
      });
      let option = {
        tooltip: {
          show: false
        },
        legend: {
          show: false
        },
        grid: [
          {
            left: '3%',
            right: '4%',
            top: '3%',
            bottom: '3%',
            containLabel: true
          }
        ],
        toolbox: {
          show: false
        },
        series: [
          {
            name: '',
            type: 'pie',
            startAngle: 0,
            clockWise: false,
            radius: [85, 88],
            label: {
              show: false
            },
            hoverAnimation: false,
            data: data
          }
        ]
      };
      console.log('uuuu', option);
      this.option = option;
    }
  },
  created() {},
  mounted() {
    this.initData();
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 34px);
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .echart-block {
    width: 228px;
    height: 190px;
    text-align: center;
    position: relative;

    .pie-bg {
      width: 159px;
      position: absolute;
      top: 22px;
      left: 50%;
      margin-left: -80px;

      .count-total {
        width: 100%;
        height: 74px;
        background: url('~@/assets/img/hz/medi-bg.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;
        padding-top: 28px;
        box-sizing: border-box;
        font-family: MiSans-Medium, sans-serif;
        font-weight: 500;
        font-size: 24px;
        color: #ffffff;
      }
      .count-label {
        font-family: PingFangSC, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #b9c3d8;
        letter-spacing: 1.17px;
        text-align: center;
      }
      .points-list {
        width: 220px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 8px;
        margin-left: -30px;

        .point-tab {
          width: calc(50% - 4px);
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .label {
            font-family: MiSans-Normal, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #a3cae8;
            letter-spacing: 0;
            .ico-react {
              display: inline-block;
              width: 6px;
              height: 6px;
              border-radius: 1.76px;
              margin-right: 6px;
            }
          }
          .value {
            font-family: MiSans-Normal, sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #f4f8ff;
            letter-spacing: 0;
            text-align: center;
          }
        }
      }
    }
  }
  .table-block {
    width: 212px;
    height: 218px;
    margin-left: 18px;
    padding-top: 12px;
    padding-right: 12px;
    box-sizing: border-box;

    /deep/.dv-scroll-board .header {
      background: url('~@/assets/img/hz/table-row.png') no-repeat;
      background-size: 100% 100%;
      background-color: transparent !important;
    }
    /deep/.dv-scroll-board .header .header-item {
      padding: 0 !important;
    }
    /deep/.dv-scroll-board .rows .row-item {
      height: 30px !important;
      line-height: 30px !important;
      margin-top: 8px;
      background: url('~@/assets/img/hz/table-row.png') no-repeat;
      background-size: 100% 100%;
      background-color: transparent !important;
    }
    /deep/.dv-scroll-board .rows .ceil {
      padding: 0 !important;
    }
  }
}
</style>
