<!--
 * @Author: yuan wenyu
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2024-09-05 16:42:10
 * @LastEditors: wangyr
 * @Description:故障分析
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="echart-wrap">
        <div class="echart-block">
          <pie-chart ref="alarmChart" :options="option"> </pie-chart>
        </div>
        <div class="points-list">
          <div v-for="(item, i) in pointsArr" :key="item.name" class="point-tab">
            <div class="label">
              <span class="ico-react" :style="{ background: colorList[i] }"></span>{{ item.name }}
            </div>
            <div class="value">{{ item.percent }}%</div>
          </div>
        </div>
      </div>
      <div class="des">
        永康污水厂现有正式党员<span class="num">3名</span>，入党积极分子<span class="num">1名</span>，共青团员<span
          class="num"
          >15名</span
        >。大部分员工都提交了入党申请书。
      </div>
    </div>
  </unit-card>
</template>

<script>
const colorList = ['#09f4b7', '#b783ff', '#00caff', '#3a60f7'];
export default {
  name: 'DeviceManageType',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue'),
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
      colorList,
      pointsArr: [],
      option: {}
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.pointsArr = [
      {
        name: '正式党员',
        value: 15,
        percent: 15,
        itemStyle: {
          color: '#09f4b7'
        }
      },
      {
        name: '积极分子',
        value: 25,
        percent: 25,
        itemStyle: {
          color: '#b783ff'
        }
      },
      {
        name: '共青团员',
        value: 55,
        percent: 55,
        itemStyle: {
          color: '#00caff'
        }
      },
      {
        name: '群众',
        value: 5,
        percent: 5,
        itemStyle: {
          color: '#3a60f7'
        }
      }
    ];
    let option = {
      title: {
        text: '20',
        left: 'center',
        top: '36%',
        textStyle: {
          color: '#FFF',
          fontSize: '20px'
        },
        subtext: '总数(个)',
        subtextStyle: {
          color: '#9ad6fc',
          fontSize: '18px'
        }
      },
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
          radius: ['54%', '70%'],
          roseType: false,
          avoidLabelOverlap: true,
          label: {
            show: false
          },
          itemStyle: {
            borderRadius: 0,
            borderColor: 'rgba(17, 62, 124, 1)',
            borderWidth: 4
          },
          labelLine: {
            show: false
          },
          data: this.pointsArr
        }
      ]
    };
    this.option = option;
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 18px);
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .echart-wrap {
    width: 100%;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .echart-block {
    width: 232px;
    height: 200px;
    text-align: center;

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
      height: 32px;
      background-image: linear-gradient(90deg, #0072ce33 0%, #006dce0d 48%, #0065ce36 100%);
      margin-top: 8px;
      padding: 0 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 2px;

      .label {
        width: 140px;
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #d9f7ff;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        .ico-react {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 1.76px;
          margin-right: 10px;
        }
      }

      .value {
        width: 53px;
        font-size: 16px;
        font-weight: 700;
        background-image: linear-gradient(to bottom, #ffffff, #b6ecfd);
        -webkit-background-clip: text;
        color: transparent;

        .unit {
          font-family: Aliba, sans-serif;
          color: #ffffffff;
          font-size: 16px;
          line-height: 0;
          letter-spacing: 0;
        }
      }
    }
  }
  .des {
    padding: 22px 17px;
    width: 412px;
    height: 97px;
    box-shadow: inset 0 0 20px 0 #007dff4d;
    border-radius: 4px;
    background: url('~@/assets/img/smartTalents/party_bg.png') no-repeat center;
    background-size: 100% 100%;
    color: #bfd5ff;
    font-size: 16px;
    font-weight: 400;
    line-height: 26px;
    letter-spacing: 1px;
    text-align: left;
  }
  .num {
    color: #fff;
    font-size: 16px;
    line-height: 26px;
    letter-spacing: 1px;
    text-align: left;
  }
}
</style>
