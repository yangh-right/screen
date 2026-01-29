<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-18 09:51:21
 * @Description:
-->
<template>
  <unit-card cardTitle="出水水质预测">
    <div class="card-inner">
      <radio-button @change="pointChange" :options="tabs" v-model="tabValue" />
      <div class="chart">
        <line-chart :options="option" ref="chart1" />
      </div>
    </div>
  </unit-card>
</template>

<script>
import moment from 'moment';
import { getOutQualityOption as getOption } from './data';
import { effluentQualityControl } from '@/api/smartProduct';

const waterList = [
  {
    label: 'COD',
    superiorCode: 'COD',
    value: 'COD'
  },
  {
    label: 'NH₃-N',
    superiorCode: 'NH3N',
    value: 'NH3N'
  },
  {
    label: 'TN',
    superiorCode: 'TN',
    value: 'TN'
  },
  {
    label: 'TP',
    superiorCode: 'TP',
    value: 'TP'
  }
];

export default {
  name: 'outQuality',
  components: {
    RadioButton: () => import('@/components/RadioButton.vue'),
    LineChart: () => import('@/components/chart/Chart.vue'),
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      lines: [8, 12],
      curPoint: {},
      option: getOption({ empty: true }),
      tabs: waterList,
      tabValue: 'COD'
    };
  },

  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initData();
        }
      },
      immediate: true
    }
  },
  methods: {
    pointChange() {
      this.curPoint = this.tabValue ? this.tabs.find(item => item.value === this.tabValue) || {} : {};
      this.initData();
    },
    async initData() {
      let params = {
        startTime: moment().subtract(1, 'days').format('YYYY-MM-DD 08:00:00'),
        pointConfigCode: this.tabValue,
        queryType: 'day',
        secondPointConfigCode: this.tabValue,
        endTime: moment().add(1, 'days').format('YYYY-MM-DD 08:00:00'),
        waterPlantId: this.waterPlantId
      };
      const { resultData, status } = await effluentQualityControl(params);
      if (status === 'complete' && Array.isArray(resultData) && resultData.length > 0) {
        let color = ['#5BC8FF', '#5BFF72', '#D7AAFF'];
        let { unit, dataAndTimeList = [] } = resultData[0];
        const xAxisData = dataAndTimeList?.map(item => item.date?.slice(5, 13)) || [];
        let isEmpty = !xAxisData.length;
        if (isEmpty) {
          this.option = getOption({ empty: true });
          return;
        }
        let option = getOption({
          xData: xAxisData,
          yAxisName: unit || 'mg/L'
        });

        // 赋值
        option.series[0].data = dataAndTimeList.map(item => {
          return item.pv;
        });
        option.series[1].data = dataAndTimeList?.map(val => val.simulatePv) || [];
        option.series[2].data = dataAndTimeList?.map(item => {
          return resultData[0].cb;
        });
        let preNum = dataAndTimeList.filter(item => {
          return !item.pv && item.pv != '0';
        });
        const splitLine = option.xAxis[0].data[option.xAxis[0].data.length - preNum.length - 1];
        option.series[3].markLine = {
          symbol: 'none',
          lineStyle: {
            type: 'solid',
            width: preNum.length === 0 ? 0 : 1
          },
          data: [
            // 灰色线
            {
              xAxis: splitLine,
              label: {
                show: false
              },
              lineStyle: {
                color: '#B5B5B5'
              }
            }
          ]
        };
        option.series[2].label = {
          show: true,
          position: 'start',
          offset: [0, 10],
          formatter: params => {
            if (params.dataIndex == option.series[2].data.length - 1) {
              return '{kong|' + params.value + '}';
            } else {
              return '';
            }
          },
          color: '#FFA148',
          align: 'center',
          lineHeight: 24,
          borderRadius: 2,
          fontSize: 16,
          backgroundColor: this.hexToRgba(color[2], 0.2),
          rich: {
            kong: {
              padding: [4, 10],
              color: '#FFA148',
              fontSize: 16
            }
          }
        };

        if (splitLine != undefined) {
          this.lines.forEach(line => {
            let date = moment(splitLine).add(line, 'hours').format('YYYY-MM-DD HH:mm:ss');
            if (xAxisData.find(item => item === date)) {
              option.series.push({
                name: line + '小时',
                type: 'line',
                markLine: {
                  itemStyle: {
                    //盒须图样式。
                    normal: {
                      label: {
                        show: false,
                        formatter: line + '小时'
                      }
                    }
                  },
                  name: line + '小时',
                  symbol: 'none', //去掉箭头
                  data: [
                    // 灰色线
                    {
                      xAxis: date,
                      lineStyle: {
                        color: '#B5B5B5'
                      }
                    }
                  ],
                  emphasis: {
                    label: {
                      show: true
                    }
                  }
                }
              });
            }
          });
        }
        this.option = option;
      }
    },
    hexToRgba(hex, opacity) {
      return (
        'rgba(' +
        parseInt('0x' + hex.slice(1, 3)) +
        ',' +
        parseInt('0x' + hex.slice(3, 5)) +
        ',' +
        parseInt('0x' + hex.slice(5, 7)) +
        ',' +
        opacity +
        ')'
      );
    }
  }
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 10px 0px 0;
  display: flex;
  flex-direction: column;
  .chart {
    flex: 1;
    overflow: hidden;
  }
}
</style>
