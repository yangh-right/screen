/*
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2023-12-06 19:09:01
 * @LastEditors: wangyr
 * @LastEditTime: 2024-06-24 14:06:34
 * @Description:
 */
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
 * @description draw a radial ring
 * @param {objectArray} aData an array include  object item which props include :value for ring,name for legend
 * colors that index 0 represent step start,index 1 represent step end.
 * @return {objectArray} data an array of objects to render radial ring;
 */

export const drawPie = (aData = [], colors) => {
  let colorList = colors;
  // data排序
  aData = aData.sort((a, b) => {
    return a.value - b.value;
  });
  // data样式
  aData.forEach((item, index) => {
    const transparentColor = colorList[index % colorList.length].replace('rgb', 'rgba').replace(')', ', 0.5)');
    item.itemStyle = {
      color: transparentColor,
      borderColor: colorList[index % colorList.length]
    };
  });

  let option = {
    grid: {
      top: '0',
      left: '0',
      right: '0',
      bottom: '0'
    },
    legend: {
      show: false
    },
    tooltip: {
      textStyle: {
        color: '#FFF'
      },
      backgroundColor: 'rgba(1,38,73,0.8)',
      trigger: 'item'
    },
    series: [
      {
        stack: 'a',
        type: 'pie',
        radius: ['30.5%', '68%'],
        center: ['50.5%', '50%'],
        clockwise: false, // 鼠标悬浮效果
        roseType: 'area',
        zlevel: 10,
        label: {
          show: false,
          color: '#fff',
          fontSize: 15,
          lineHeight: 20,
          formatter: '{percent|{d}%}\n{name|{b}}',
          rich: {
            percent: {
              fontSize: 15,
              color: '#0be5ff'
            }
          }
        },
        itemStyle: {
          borderWidth: 3
        },
        data: aData
      }
    ]
  };
  return option;
};

/**
 *  @description do load table data about
 * @logic check if search bar has value,set searchParams;
 * @param {object} data series data 对象数组，data为series里的data
 * @param {Array} xData x轴数据类型
 * @param {Array} aColor 线条颜色数组
 * @return void
 */
export const mutiLineOption = (
  unit = 'Mpa',
  data = [{ name: '', data: [] }],
  xData = [],
  aColor = ['rgba(91,143,249,1)', 'rgba(0,242,239,1)', 'rgba(255, 119, 39, 1)', 'rgba(255, 56, 56, 1)']
) => {
  let aLegendData = [];
  let series = [];
  let optSeries = {
    type: 'line',
    areaStyle: {
      opacity: 0,
      color: 'transparent'
    },
    showSymbol: true,
    symbol: 'circle',
    symbolSize: 8
  };
  let streamer = {
    type: 'lines',
    coordinateSystem: 'cartesian2d',
    polyline: true, // 多线段
    effect: {
      show: true,
      constantSpeed: 60,
      color: '#FFF2DE',
      trailLength: 0.8, // 尾迹长度
      symbolSize: 3
    },
    lineStyle: {
      normal: {
        width: 0
      }
    }
  };
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    aLegendData.push(item.name);
    let itemSeriesOther = {
      smooth: true,
      data: item.data,
      name: item.name,
      itemStyle: {
        color: aColor[i],
        borderColor: '#F5FAFF',
        borderWidth: 3,
        normal: {
          color: aColor[i]
        }
      },
      emphasis: {
        lineStyle: {
          width: i === 0 ? 3 : 2,
          opacity: 1,
          color: i === 0 ? 'rgba(91,143,249,1)' : 'rgba(0,242,239,1)'
        }
      }
    };
    let itemSeries = Object.assign({}, optSeries, itemSeriesOther);
    series.push(itemSeries);
  }
  let option = {
    textStyle: {
      color: 'rgba(108, 128, 151, 1)',
      fontSize: 12
    },
    // color: aColor,
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
      itemHeight: 3,
      right: 0,
      data: aLegendData,
      textStyle: {
        color: 'rgba(217,247,255, 1)',
        fontSize: 12
      }
    },
    animationEasing: 'backIn',
    animationDuration: 2000,
    // 初始动画的延迟
    animationDelay: function (idx) {
      //// 越往后的数据延迟越大
      return idx * 50;
    },
    grid: [
      {
        left: 10,
        right: 10,
        bottom: '1%',
        height: '80%',
        containLabel: true
      }
    ],
    xAxis: {
      type: 'category',
      axisLabel: {
        showMaxLabel: true,
        showMinLabel: true,
      },
      axisTick: {
        show: false
      },
      lineStyle: { color: 'rgba(108, 128, 151, 1)' },
      boundaryGap: false,
      data: xData
    },
    yAxis: {
      splitNumber: 4,
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.1)'
        }
      },
      type: 'value',
      name: unit,
      nameLocation: 'end',
      nameTextStyle: {
        color: '#D9F7FF'
      },
      axisLabel: {
        color: '#D9F7FF',
        fontWeight: 400,
        fontSize: 14
      }
    },
    series
  };
  return option;
};
