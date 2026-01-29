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

const colorMap = {
  color: ['#3388FF', '#15EAFE', '#FFC30E', '#D137D9', '#EB9792', '#A768FF', '#32EDFF', '#2FC62F', '#FFA433', '#33BDFF'],
  areaColor: [
    {
      color: '#3388FF',
      startColor: 'rgba(51, 136, 255, 0.8)',
      endColor: 'rgba(51, 136, 255, 0.2)'
    },
    {
      color: '#15EAFE',
      startColor: 'rgba(0,238,255,0.80)',
      endColor: 'rgba(0,238,255,0.20)'
    },
    {
      color: '#D137D9',
      startColor: 'rgba(209, 55, 217, 0.8)',
      endColor: 'rgba(209, 55, 217, 0.2)'
    },
    {
      color: '#FFC30E',
      startColor: 'rgba(255, 227, 32, 0.8)',
      endColor: 'rgba(255, 227, 32, 0.2)'
    },
    {
      color: '#EB9792',
      startColor: 'rgba(235, 151, 146, 0.8)',
      endColor: 'rgba(235, 151, 146, 0.2)'
    },
    {
      color: '#1888EC',
      startColor: '#c5e7ff66',
      endColor: '#4d9edc00'
    },
    {
      color: '#4CFF58',
      startColor: '#3af6fc4d',
      endColor: '#6cfbfe00'
    },
    {
      color: '#A768FF',
      startColor: 'rgba(167, 104, 255, 0.8)',
      endColor: 'rgba(167, 104, 255, 0.2)'
    },
    {
      color: '#32EDFF',
      startColor: 'rgba(50, 237, 255, 0.4)',
      endColor: 'rgba(50, 237, 255, 0)'
    },
    {
      color: '#FFA433',
      startColor: 'rgba(255, 164, 51, 0.4)',
      endColor: 'rgba(255, 164, 51, 0)'
    },
    {
      color: '#2FC62F',
      startColor: 'rgba(47, 198, 47, 0.4)',
      endColor: 'rgba(47, 198, 47, 0)'
    },
    {
      color: '#33BDFF',
      startColor: 'rgba(51, 136, 255, 0.4)',
      endColor: 'rgba(51, 136, 255, 0)'
    }
  ]
};

/**
 *  @description do load table data about
 * @logic check if search bar has value,set searchParams;
 * @param {object} data series data 对象数组，data为series里的data
 * @param {Array} xData x轴数据类型
 * @return void
 */
export const mutiLineOption = (unit = 'Mpa', data = [], xData = []) => {
  let aLegendData = [];
  let series = [];
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
              color: colorMap.areaColor[i].startColor // 0% 处的颜色
            },
            {
              offset: 1,
              color: colorMap.areaColor[i].endColor // 100% 处的颜色
            }
          ]
        }
      },
      smooth: true,
      data: item.data,
      name: item.name,
      itemStyle: { color: colorMap.areaColor[i].color, borderWidth: 2 }
    };
    let itemSeries = Object.assign({}, optSeries, itemSeriesOther);
    series.push(itemSeries);
  }
  let option = {
    textStyle: {
      color: 'rgba(108, 128, 151, 1)',
      fontSize: 12
    },
    color: colorMap.color,
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
