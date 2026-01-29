import * as echarts from 'echarts';
let notShow = { show: false };

/**
 * @description gen radar option for main page
 * @logic check if search bar has value,set searchParams;
 * @param {intArray} data score array for different dimension
 * @return void
 */
export const radarOption = (data = [{ scoreModuleName: 'a', score: 2 }]) => {
  let indicator = [];
  let aNum = [];
  for (let i = 0; i < data.length; i++) {
    indicator.push({ name: data[i].scoreModuleName, max: 10 });
    aNum.push(data[i].score);
  }
  let option = {
    radar: {
      center: ['50%', '60%'],
      axisName: { color: '#A7BAD1' },
      axisLine: {
        lineStyle: { color: 'rgba(147,164,184,0.14)' }
      },
      splitLine: notShow,
      splitArea: {
        areaStyle: {
          color: [
            'rgba(167, 186, 209, 0.5)',
            'rgba(167, 186, 209, 0.4)',
            'rgba(167, 186, 209, 0.3)',
            'rgba(167, 186, 209, 0.2)',
            'rgba(167, 186, 209, 0.1)'
          ]
        }
      },
      indicator
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: aNum
          }
        ],
        //itemStyle: { color: '#F5FAFF', shadowColor: '#ACDCFE', shadowBlur: 2, borderWidth: 0 },
        symbol: 'circle',
        symbolSize: 3,
        itemStyle: { color: '#F5FAFF' },
        lineStyle: {
          width: 2,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#EA6302' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FFC97A' // 100% 处的颜色
              }
            ]
          }
        },
        areaStyle: {
          color: 'rgba(255,201,122,0.20)'
        }
      }
    ]
  };
  return option;
};

/**
 * @description gen a random number base on start,number will locate on start ~ start+gap
 * @logic base random function return a result number,muti with gap then plus start,return that number
 * @param {int} gap the difference between max number and min number
 * @param {int} start min number in random numbers
 * @return {int} a random number
 */
export const genRandom = (gap = 10, start = 1) => {
  let iRan = Math.random() * gap + start;
  return parseInt(iRan);
};

/**
 * @description gen bar and line echarts Series
 * @return {object} echarts option
 */
export const genBarSeries = (aLegend, item, index) => {
  let type = index === 0 || index === 2 || index === 4 ? 'bar' : 'line';
  let opt = {
    showSymbol: true,
    name: aLegend[index].name,
    type,
    data: [...item.data],
    barWidth: 6,
    barGap: '-100%',
    itemStyle: {
      normal: {
        barBorderRadius: [5, 5, 0, 0],
        lineStyle: {
          width: index === 3 ? 1 : 2,
          type: index === 3 ? 'dashed' : 'solid'
        },
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: aLegend[index].color1
          },
          {
            offset: 1,
            color: aLegend[index].color2
          }
        ])
      }
    }
  };
  return opt;
};

/**
 * @description handler for bar and line echarts tooltip
 * @logic if no value than hide item;
 * @param {object} params see detail on https://echarts.apache.org/zh/option.html#tooltip.formatter 2.callback
 * @return 支持返回 HTML 字符串或者创建的 DOM 实例。
 */
export let barTooltipHandler = params => {
  let img = require('@/assets/img/l_f_icon.png');
  let oHtml = `<i style='display: inline-block;width:10px;height:10px;background:url(${img}) no-repeat 0 0/100%'></i>
  <span>${params[0].axisValue}</span><br/>`;
  let html = oHtml;
  for (let i = 0; i < params.length; i++) {
    let item = params[i];
    if (item.data) {
      let unit = item.seriesName.indexOf('供水量') >= 0 ? 'm³' : 'kWh';
      html += `<div style='display:flex;margin-left:10px;justify-content:space-between'>
                <span style='max-width:90px;text-align:left'>${item.seriesName}</span>
                <span style='width:100px;text-align:right'>${item.data}${unit}</span></div>`;
    }
  }
  if (html === oHtml) {
    html += `<span>暂无数据</span>`;
  }
  return html;
};

/**
 * @description gen bar and line echarts
 * @return {object} echarts option
 */
export const barOption = () => {
  //set bar legend style
  let barLegend = {
    type: 'scroll',
    orient: 'horizontal',
    textStyle: { color: '#A7BAD1' },
    top: 8,
    itemGap: 10,
    itemWidth: 6,
    itemHeight: 6,
    name: 'm³',
    icon: 'rect'
  };
  //set line legend style
  let lineLegend = {
    type: 'scroll',
    orient: 'horizontal',
    textStyle: { color: '#A7BAD1' },
    name: 'KWh',
    top: 8,
    itemGap: 10,
    itemWidth: 15,
    itemHeight: 3
  };
  let legend = {
    type: 'scroll',
    orient: 'horizontal',
    top: 0,
    bottom: 'auto',
    left: 'auto',
    right: '20',
    textStyle: { color: '#A7BAD1' },
    itemGap: 10,
    itemWidth: 6,
    itemHeight: 6,
    name: 'm³',
    icon: 'rect',
    pageTextStyle: {
      color: '#ABD0FF'
    }
  };
  // set y axis basic property
  let yAxisBasic = {
    type: 'value',
    splitNumber: 4,
    min: 0,
    nameLocation: 'end',
    axisLabel: {
      color: '#9AB0D9'
    }
  };
  //assemble bar y axis property
  let barY = Object.assign(
    {},
    {
      splitLine: {
        show: true,
        lineStyle: {
          color: '#28406C',
          type: 'dashed'
        }
      },
      nameTextStyle: {
        color: '#9AB0D9',
        align: 'right'
      },
      name: 'm³',
      axisLine: notShow,
      axisTick: notShow
    },
    yAxisBasic
  );
  // assemble line y axis property
  let lineY = Object.assign(
    {},
    {
      name: 'KWh',
      splitLine: notShow,
      nameTextStyle: {
        color: '#9AB0D9',
        align: 'left',
        padding: [0, 0, 0, 12]
      },
      animationEasingUpdate: 'linear'
    },
    yAxisBasic
  );
  return {
    textStyle: { fontSize: 12, color: '#A7BAD1' },
    backgroundColor: 'transparent',
    color: ['#39ACFF', '#FFC97A', '#37D502', '#37D502'],
    tooltip: {
      trigger: 'axis',
      borderColor: 'transparent',
      backgroundColor: 'rgba(0, 16, 35, 0.7)',
      borderRadius: 4,
      formatter: barTooltipHandler,
      textStyle: { color: '#A7BAD1', align: 'left', fontSize: 12 },
      axisPointer: {
        type: 'shadow',
        shadowStyle: { color: 'rgba(168, 191, 221, 0.2)', width: 'auto' }
      }
    },
    grid: [
      {
        left: '5%',
        right: '7%',
        bottom: 0,
        height: '70%',
        containLabel: true
      }
    ],
    legend,
    xAxis: [
      {
        type: 'category',
        data: [],
        axisLabel: {
          showMaxLabel: true,
          showMinLabel: true,
          textStyle: {
            color: '#9AB0D9'
          },
          formatter: function (value) {
            return value.slice(5);
          }
        },
        axisTick: notShow,
        splitLine: notShow,
        axisLine: {
          lineStyle: {
            color: '#9AB0D9'
          }
        }
      }
    ],
    animationEasing: 'bounceOut',
    animationDuration: 2000,
    // 初始动画的延迟
    animationDelay: function (idx) {
      //// 越往后的数据延迟越大
      return idx * 50;
    },
    yAxis: [barY, lineY],
    series: []
  };
};
export const processOption = (datas = []) => {
  let barWidth = 5.3 /* 进度条及进度条radius宽度 */,
    nameWidth = 60 /* 进度条名称宽度 */,
    unit = 'mg/L' /* 单位 */,
    attaData = [] /* 进度条数据 */,
    attaVal = [] /* 进度条数值 */,
    topName = [] /* 进度条名称 */,
    salvProMax = []; /* 背景条数据 */

  let attackSourcesColor = [
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: '#00A6FF' },
      { offset: 0.8, color: '#72B8FC' },
      { offset: 1, color: '#F7FBFF' }
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: '#00FBFF' },
      { offset: 0.8, color: '#72FCFC' },
      { offset: 1, color: '#F7FFFF' }
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: '#AB00FF' },
      { offset: 0.8, color: '#DD72FC' },
      { offset: 1, color: '#FCF7FF' }
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: '#FFB800' },
      { offset: 0.8, color: '#FCD372' },
      { offset: 1, color: '#FFFFFDF7' }
    ]),
    new echarts.graphic.LinearGradient(0, 1, 1, 1, [
      { offset: 0, color: '#FF00BE07' },
      { offset: 0.8, color: '#F702B80B' },
      { offset: 1, color: '#FFF7FBFF' }
    ])
  ];
  datas.forEach((it, i) => {
    let itemStyle = {
      color: i > 3 ? attackSourcesColor[3] : attackSourcesColor[i]
    };
    topName[i] = `${it.name}`;
    attaVal[i] = it.value;
    attaData[i] = {
      value: parseFloat(it.value).toFixed(2),
      itemStyle: itemStyle
    };
  });
  /* 该值无具体作用，取进度最大值 * 1.2 */
  salvProMax = Array(attaVal.length).fill(Math.max(...attaVal) * 1.2);
  let option = {
    tooltip: {
      show: false
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '5%',
      bottom: '5%',
      containLabel: true
    },
    legend: {
      show: false
    },
    xAxis: {
      show: false
    },
    yAxis: [
      {
        //名称
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
          textStyle: {
            color: '#BEC9D5'
          },
          formatter: (val, i) => {
            return `{name|${val}}`;
          },
          rich: {
            num: {
              width: 16,
              fontSize: 16,
              fontWeight: 800
            },
            name: {
              width: nameWidth,
              fontSize: 16,
              fontWeight: 600
            }
          }
        },
        data: topName
      },
      {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
          textStyle: {
            color: '#BEC9D5',
            fontSize: 20
          },
          formatter: val => {
            return `{num|${val}}{unit|${unit}}`;
          },
          rich: {
            num: {
              fontSize: 16,
              color: '#BEC9D5',
              fontWeight: 600,
              textShadow: '0 2px 6px #32c5ffa3'
            },
            unit: {
              color: '#BEC9D5',
              fontSize: 16,
              textShadow: '0 2px 6px #32c5ffa3'
            }
          }
        },
        data: attaVal
      }
    ],
    series: [
      // 进度条
      {
        zlevel: 1,
        name: '',
        type: 'pictorialBar',
        symbolPosition: 'start',
        symbolSize: [12, 8],
        symbolOffset: [-6, 0],
        symbol:
          'path://M829.56834133 755.78299733c2.29512533 14.84253867-8.11554133 26.98581333-23.134208 26.98581334H320.417792c-15.01866667 0-29.184-12.14327467-31.47912533-26.98581334l-75.395072-487.56736c-2.29512533-14.84253867 8.11554133-26.98581333 23.134208-26.98581333h486.014976c15.01866667 0 29.184 12.14327467 31.47912533 26.98581333l75.39643733 487.56736z',
        symbolRepeat: 'fixed',
        symbolClip: true,
        barWidth: barWidth,
        data: attaData,
        align: 'center',
        itemStyle: {
          normal: {}
        },
        label: {
          show: false
        }
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
  aColor = ['rgba(58, 208, 252, 1)', 'rgba(240, 108, 157, 1)', 'rgba(255, 119, 39, 1)', 'rgba(255, 56, 56, 1)']
) => {
  let aLegendData = [];
  let series = [];
  let optSeries = {
    type: 'line',
    areaStyle: {
      opacity: 0,
      color: 'transparent'
    },
    showSymbol: false
    // symbol: 'circle',
    // symbolSize: 1
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
              color: aColor[i].replace('1)', '0.3)') // 0% 处的颜色
            },
            {
              offset: 1,
              color: aColor[i].replace('1)', '0)') // 100% 处的颜色
            }
          ]
        }
      },
      smooth: true,
      data: item.data,
      name: item.name,
      itemStyle: { color: aColor[i], borderColor: '#F5FAFF', borderWidth: 3 }
    };
    let itemSeries = Object.assign({}, optSeries, itemSeriesOther);
    series.push(itemSeries);
    if (item.name === '4级报警' && data.coords) {
      let streamerLocal = Object.assign({}, streamer, { data: [{ coords: data.coords }] });
      series.push(streamerLocal);
    }
  }
  let option = {
    textStyle: {
      color: 'rgba(108, 128, 151, 1)',
      fontSize: 12
    },
    color: aColor,
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
      axisTick: {
        show: false
      },
      axisLabel: {
        showMaxLabel: true,
        showMinLabel: true,
        color: '#D9F7FF',
        formatter: function (value) {
          return value.slice(-2);
        }
      },
      lineStyle: { color: 'rgba(108, 128, 151, 1)' },
      boundaryGap: false,
      data: xData
    },
    yAxis: {
      splitNumber: 4,
      splitLine: {
        lineStyle: {
          color: 'rgba(57, 68, 81, 1)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#D9F7FF'
      },
      type: 'value',
      name: unit,
      nameLocation: 'end',
      nameTextStyle: { align: 'right', color: '#D9F7FF', padding: [0, 8, 0, 0] }
    },
    series
  };
  return option;
};

// 计算渐变中心以及渐变半径
const calc = (theta1, theta2) => {
  let r = 0.5; // 半径是0.5 其实表示0.5个直径
  let inner = 0.6; // 里面镂空部分占60% option中radius为[33%, 55%] 55 * 0.6 == 33
  let cos = Math.cos;
  let sin = Math.sin;
  let PI = Math.PI;
  let min = Math.min;
  let max = Math.max;
  let bottom = 0;
  let left = 2 * r;
  let right = 0;
  let y0 = r * (1 - cos(theta1)); // y0: θ1对应的外部点的y值
  let y1 = r * (1 - cos(theta2)); // y1: θ2对应的外部点的y值
  let _y0 = r * (1 - inner * cos(theta1)); // _y0: θ1对应的内部点的y值
  let _y1 = r * (1 - inner * cos(theta2)); // _y1: θ2对应的内部点的y值
  let x0 = r * (1 + sin(theta1)); // x0: θ1对应的外部点的x值
  let x1 = r * (1 + sin(theta2)); // x1: θ2对应的外部点的x值
  let _x0 = r * (1 + inner * sin(theta1)); // _x0: θ1对应的内部点的x值
  let _x1 = r * (1 + inner * sin(theta2)); // _x1: θ2对应的内部点的x值
  // 如果这个弧经过θ == PI的点 则bottom = 2PI
  // bottom用于之后的max计算中
  if (theta1 < PI && theta2 > PI) {
    bottom = 2 * r;
  }
  // 如果这个弧经过θ == PI / 2的点 则right = 2PI
  if (theta1 < PI / 2 && theta2 > PI / 2) {
    right = 2 * r;
  }
  // 如果这个弧经过θ == PI / 2 * 3的点 则left = 0
  if (theta1 < (PI / 2) * 3 && theta2 > (PI / 2) * 3) {
    left = 0;
  }
  // 计算这几个点的最大最小值
  let yMin = min(_y0, _y1, y0, y1);
  let yMax = max(_y0, _y1, y0, y1, bottom);
  let xMin = min(_x0, _x1, x0, x1, left);
  let xMax = max(_x0, _x1, x1, x0, right);
  return {
    // 计算圆心以及半径
    center: [(r - xMin) / (xMax - xMin), (r - yMin) / (yMax - yMin)],
    radius: r / min(xMax - xMin, yMax - yMin)
  };
};
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
        emptyCircleStyle: {
          color: '#17549D'
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
export const genChart = (domId, option, isReload) => {
  let chartDom = document.getElementById(domId);
  if (!chartDom) return;
  let chartId = chartDom.attributes['_echarts_instance_']?.value;
  if (chartId) {
    let myChartInstance = echarts.getInstanceById(chartId);
    myChartInstance.setOption(option, isReload);
  } else {
    let myChart = echarts.init(chartDom);
    console.log('option', option);

    option && myChart.setOption(option);
  }
};
export const step = (aNum, last, floatCount = 0) => {
  let start = transFloat(aNum.start, floatCount);
  let end = transFloat(aNum.end, floatCount);
  let doneFlag = false;
  let stepCount = transFloat((end - start) / (last * 60), floatCount);
  if (stepCount <= 0) {
    stepCount = end;
  }
  const stepTwo = timestamp => {
    if (start !== end) {
      // 这里使用 `Math.min()` 确保元素刚好停在 200px 的位置。
      start += stepCount;
      start = transFloat(start, floatCount);
      let count = Math.min(start, end);
      start = count;
      aNum.start = count;
      if (count === end) doneFlag = true;
    }
    if (!doneFlag) {
      requestAnimationFrame(stepTwo);
    }
  };
  requestAnimationFrame(stepTwo);
};

/**
 * @description trans any transformable data to float type and left cent number of point
 * @logic trans first than to fixed than trans again
 * @param {int}
 * @return void
 */
export const transFloat = (num, count) => {
  let fNum = parseFloat(num);
  if (isNaN(fNum)) {
    return 0;
  } else {
    return parseFloat(fNum.toFixed(count));
  }
};
