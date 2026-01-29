<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="echart-block">
        <pie-chart ref="alarmChart" :options="option"> </pie-chart>
      </div>
      <div class="points-list">
        <div v-for="(item, i) in pointsArr" :key="item.gasType" class="point-tab">
          <div class="label">
            <div class="outer">
              <div class="ico-react" :style="{ background: colorList[i] }"></div>
            </div>
            <div>{{ item.gasTypeName }}</div>
          </div>
          <div class="value">
            {{ item.gasValue }} <span class="unit">{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
export default {
  name: 'carbonProportion',
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
    },
    sourceTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      option: {},
      colorList: [
        'rgb(254, 117, 140)',
        'rgb(68, 170, 255)',
        'rgb(102, 255, 237)',
        'rgb(38, 224, 115)',
        'rgb(136, 114, 253)'
      ],
      pointsArr: []
    };
  },
  watch: {
    sourceTypeList: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length > 0) {
          this.pointsArr = [];
          let sourceTypeItem = val.filter(v => v.sourceTypeName.indexOf('污水处理') > -1);
          if (sourceTypeItem.length > 0) {
            this.pointsArr = sourceTypeItem[0].carbonEmissionSourceGasAnalysisList;
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
                  radius: ['56%', '64%'],
                  roseType: false,
                  avoidLabelOverlap: true,
                  label: {
                    show: false,
                    position: 'center',
                    formatter: '{name|{d}}{unit|%}\n{value|{b}}',
                    rich: {
                      name: { fontSize: 22, color: '#D9F7FF', fontWeight: 600 },
                      unit: { fontSize: 22, color: '#D9F7FF' },
                      value: { fontSize: 14, color: '#D9F7FF' }
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
                  data: this.pointsArr.map(v => {
                    return {
                      value: v.gasValue,
                      name: v.gasTypeName,
                      ...v
                    };
                  })
                }
              ]
            };
            this.option = option;
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 22px 0 18px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .echart-block {
    width: 156px;
    height: 156px;
    text-align: center;
    background: url('~@/assets/img/carbonEmission/pie_roportion1.png') no-repeat center;
    background-size: 100% 100%;

    .label-wrap {
      position: absolute;
    }
  }
  .points-list {
    width: 162px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .point-tab {
      position: relative;
      width: 100%;
      height: 34px;
      margin-top: 20px;
      padding: 0 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 2px;

      .label {
        display: flex;
        align-items: center;
        font-family: Aliba, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #d9f7ff;
        text-align: left;
        .outer {
          position: relative;
          margin-right: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #3d5793;
          width: 16px;
          height: 16px;
        }
        .outer::after {
          position: absolute;
          bottom: -8px;
          left: 7px;
          width: 2px;
          height: 8px;
          background: #3d5793;
          content: '';
        }
        .ico-react {
          width: 8px;
          height: 8px;
        }
      }

      .value {
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
    .point-tab::after {
      position: absolute;
      bottom: 0px;
      left: 16px;
      width: 150px;
      height: 2px;
      background: #3d5793;
      content: '';
    }
  }
}
</style>
