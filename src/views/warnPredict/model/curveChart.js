import * as echarts from 'echarts';

/**
 * @description gen echarts
 * @logic
 * @param {string} domId dom Id string to locate which dom should be rendered
 * @param {array} option option for echarts render
 * @param {boolean} isReload if need reload table
 * @return void
 */
export const genChart = (domId, option, isReload) => {
  let chartDom = document.getElementById(domId);
  let chartId = chartDom.attributes['_echarts_instance_']?.value;
  if (chartId) {
    let myChartInstance = echarts.getInstanceById(chartId);
    myChartInstance.setOption(option, isReload);
  } else {
    let myChart = echarts.init(chartDom);
    option && myChart.setOption(option);
  }
};

/**
 *  @description do load table data about
 * @logic check if search bar has value,set searchParams;
 * @param {object} data series data 对象数组，data为series里的data
 * @param {Array} xData x轴数据类型
 * @return void
 */
export const mutiLineOption = (unit = null, data = [], xData = []) => {
  let aLegendData = [];
  let series = [];
  let color= ['rgba(51, 136, 225, 1)', 'rgba(0,238,255, 1)', 'rgba(209, 55, 217, 1)', 'rgba(255,227,32, 1)','rgba(235, 151, 146, 1)', 'rgba(167, 104, 255, 1)','rgba(50, 237, 255,1)','rgba(255, 164, 51, 1)','rgba(47, 198, 47,1)','rgba(51, 136, 255, 1)'];
  let optSeries = {
    type: 'line',
    areaStyle: {
      opacity: 0,
      color: 'transparent'
    },
    showSymbol: false
  };
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    aLegendData.push(item.name);
    let itemSeriesOther = {
      areaStyle: {
        opacity: 1,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
                offset: 0,
                color: color[i].replace('1)', '0.3)') // 0% 处的颜色
              },
              {
                offset: 1,
                color: color[i].replace('1)', '0)') // 100% 处的颜色
              }
          ]
        }
      },
      smooth: true,
      data: item.data,
      name: item.name,
      itemStyle: { color: color[i], borderWidth: 2 }
    };
    let itemSeries = Object.assign({}, optSeries, itemSeriesOther);
    series.push(itemSeries);
  }
  let option = {
    textStyle: {
      color: 'rgba(108, 128, 151, 1)',
      fontSize: 12
    },
    color: color,
    tooltip: {
      trigger: 'axis',
      borderColor: 'transparent',
      backgroundColor: 'rgba(0, 16, 35, 0.7)',
      borderRadius: 4,
      textStyle: { color: '#A7BAD1', align: 'left', fontSize: 12 },
      axisPointer: {
        type: 'shadow',
        shadowStyle: { color: 'rgba(168, 191, 221, 0.2)', width: 'auto' }
      }
    },
    legend: {
      type: 'scroll',
      itemHeight: 3,
      left: 'right',
      data: aLegendData,
      textStyle: {
        color: 'rgba(217,247,255, 1)',
        fontSize: 12
      },
      pageIconColor: '#D9F7FF',
      pageIconInactiveColor: '#D9F7FF',
      pageTextStyle: {
        color: 'rgba(217,247,255, 1)',
        fontSize: 12
      }
    },
    animationEasing: 'backIn',
    animationDuration: 1000,
    // 初始动画的延迟
    animationDelay: function (idx) {
      //// 越往后的数据延迟越大
      return idx * 50;
    },
    grid: [
      {
        left: 10,
        right: 10,
        top: 50,
        bottom: '3%',
        height: '76%',
        containLabel: true
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: xData,
        axisTick: {
          alignWithLabel: true
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          showMaxLabel: true,
          showMinLabel: true,
          fontsize: 2,
          align: 'center',
          color: 'rgba(255,255,255)'
        }
      }
    ],
    yAxis: [
      {
        name: unit,
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255,255,255,0.1)'
          }
        },
        axisLine: {
          show: false
        },
        nameTextStyle: {
          align: 'right',
          color: '#D9F7FF',
          padding: [0, 8, 0, 0]
        },
        axisLabel: {
          color: '#D9F7FF',
          fontWeight: 400,
          fontSize: 14
        }
      }
    ],
    series
  };
  return option;
};
