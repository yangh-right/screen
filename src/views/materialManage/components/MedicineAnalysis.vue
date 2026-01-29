<!--
 * @Author: yuan wenyu
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2024-09-11 14:30:47
 * @LastEditors: wangyr
 * @Description:故障分析
-->
<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="content-spin">
      <div class="card-inner">
        <div class="echart-block">
          <pie-chart ref="alarmChart" :options="option"> </pie-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCountInoutMain } from '@/api/materialManage';
const colorList = [
  '#9FBEF1',
  '#24EACD',
  '#12C06E',
  '#0A8CFF',
  '#FFD17C',
  '#01b4fe',
  '#1BC1D7',
  '#FEC019',
  '#DF3434',
  '#BD3EEB',
  '#6a5acd'
];
export default {
  name: 'FailureAnalysis',
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
    },
    depotInData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      colorList,
      pointsArr: [],
      option: {}
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const { success, resultData } = await getCountInoutMain();
      if (
        success &&
        Array.isArray(resultData?.depotInMainCountDataList) &&
        resultData?.depotInMainCountDataList.length > 0
      ) {
        this.pointsArr = resultData?.depotInMainCountDataList.map(item => {
          return {
            name: item.statusName,
            value: item.count
          };
        });
      } else {
        this.pointsArr = [
          {
            name: '未提交',
            value: 0
          },
          {
            name: '审核中',
            value: 0
          },
          {
            name: '已入库',
            value: 0
          }
        ];
      }
      this.pointsArr.forEach((item, i) => {
        item.itemStyle = {
          color: this.colorList[i]
        };
      });
      let option = {
        color: this.colorList,
        tooltip: {
          textStyle: {
            color: '#FFF'
          },
          backgroundColor: 'rgba(1,38,73,0.8)',
          trigger: 'item'
        },
        legend: {
          show: false
        },
        series: [
          {
            type: 'pie',
            radius: ['44%', '56%'],
            roseType: false,
            avoidLabelOverlap: true,

            label: {
              color: 'rgba(255,255,255,.45)',
              fontSize: 14,
              formatter: '{name|{b}}\n{icon|{d}%}',
              rich: {
                name: {
                  color: '#B0C1E6',
                  fontSize: 16,
                  lineHeight: 22
                },
                icon: {
                  color: 'inherit',
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 22
                }
              }
            },
            itemStyle: {
              borderRadius: 0,
              borderColor: 'rgba(17, 62, 124, 1)',
              borderWidth: 4
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     color: '#13E0FF',
            //     fontSize: 22,
            //     fontWeight: 600
            //   }
            // },
            labelLine: {
              show: true
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
  justify-content: center;
  align-items: center;
  .echart-block {
    width: 100%;
    height: 291px;
    text-align: center;
    background: url('~@/assets/img/materialManage/pie_bg.png') no-repeat center;
    background-size: 291px 100%;

    .label-wrap {
      position: absolute;
    }
  }

  .points-list {
    width: 50%;
    height: 100%;
    padding-left: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .point-tab {
      width: 100%;
      height: 22px;
      background-image: linear-gradient(90deg, #0072ce33 0%, #006dce0d 48%, #0065ce36 100%);
      margin-top: 8px;
      padding: 0 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 2px;

      .label {
        width: 70px;
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #d9f7ff;
        text-align: left;

        .ico-react {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 1.76px;
          margin-right: 6px;
        }
      }

      .value {
        width: 53px;
        font-size: 14px;
        font-weight: 700;
        background-image: linear-gradient(to bottom, #ffffff, #b6ecfd);
        -webkit-background-clip: text;
        color: transparent;

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
</style>
