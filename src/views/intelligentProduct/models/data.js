import * as echarts from 'echarts';
import moment from 'moment';
import { genCommonOption } from '@/components/chart/utils/util';

function colorRgb(str, opacity) {
  let sColor = str.toLowerCase();
  if (sColor) {
    if (sColor.length === 4) {
      let sColorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
    }
    return 'rgba(' + sColorChange.join(',') + ',' + opacity + ')';
  } else {
    return sColor;
  }
}

// 格式化数值，保留1位小数
const formatNumber = num => {
  return parseFloat(num.toFixed(1));
};

export function getWaterTreatmentOption(config = {}) {
  let color = ['#5BC8FF', '#5BFF72', '#D7AAFF'];
  const industryColor = {
    type: 'linear',
    x: 1,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: '#0535A4'
      },
      {
        offset: 0.53,
        color: '#092A6F'
      },
      {
        offset: 1,
        color: 'rgba(4,26,57,0.27)'
      }
    ]
  };
  if (config.empty) {
    config.yAxisName = 'm³';
  }
  let option = {
    ...genCommonOption(config),
    color,
    // dataZoom: [
    //   {
    //     type: 'slider',
    //     realtime: true,
    //     startValue: 0,
    //     endValue: 11,
    //     height: 4,
    //     fillerColor: '#0D3772', // 滚动条颜色
    //     borderColor: '#0D3772',
    //     handleSize: 0, // 两边手柄尺寸
    //     showDetail: false, // 拖拽时是否展示滚动条两侧的文字
    //     top: '98.5%',
    //     moveHandleStyle: {
    //       color: '#0d3772'
    //     }
    //   },
    //   {
    //     type: 'inside', // 支持内部鼠标滚动平移
    //     startValue: 0,
    //     endValue: 11,
    //     zoomOnMouseWheel: false, // 关闭滚轮缩放
    //     moveOnMouseWheel: true, // 开启滚轮平移
    //     moveOnMouseMove: true // 鼠标移动能触发数据窗口平移
    //   }
    // ],
    yAxis: [
      {
        type: 'value',
        name: 'm³',
        nameTextStyle: {
          color: '#BAC9E7',
          align: 'left'
        },
        splitLine: {
          lineStyle: {
            color: ['#3B568D'],
            type: 'dashed'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#BAC9E7'
          }
        }
      }
    ],
    series: [
      {
        name: '处理水量',
        type: 'bar',
        barWidth: 5,
        data: config.industryData,
        itemStyle: {
          //柱子左面
          normal: {
            // 重要的是color配置：线性渐变， 从上往下
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#59C7FF'
                },
                {
                  offset: 1,
                  color: 'rgba(3,26,58, 0.54)'
                }
              ]
            }
          }
        },
        tooltip: {
          show: false
        }
      },
      {
        name: '处理水量',
        tooltip: {
          show: true,
          padding: 100,
          position: [-10, '50%'],
          borderWidth: 100
        },
        type: 'bar',
        barWidth: 5,
        barCategoryGap: '60%',
        itemStyle: {
          //柱子右面
          normal: {
            // 重要的是color配置：线性渐变， 从上往下
            color: industryColor,
            borderWidth: 0.3,
            borderColor: 'rgba(9, 36, 83, 0.1)'
          }
        },
        data: config.industryData,
        // 间隔为0
        barGap: 0,
        z: 5
      },
      {
        z: 10,
        name: '处理水量',
        // 这里是柱子的顶部，type: "pictorialBar" 可以自定义图形或者使用内置选项
        type: 'pictorialBar',
        symbolPosition: 'end',
        data: config.industryData,
        symbol: 'diamond',
        symbolOffset: [0, -5],
        symbolRotate: 90,
        symbolSize: [1.7, 9.8],
        itemStyle: {
          normal: {
            borderWidth: 0,
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#0444BB'
                },
                {
                  offset: 1,
                  color: '#3B87F8'
                }
              ]
            }
          }
        },
        tooltip: {
          show: false
        }
      }
    ]
  };
  return option;
}

export function getInWaterQualityOption(config = {}) {
  let option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 5,
        radius: '55%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: config.startColor
              },
              {
                offset: 1,
                color: config.endColor
              }
            ]
          },
          shadowColor: 'rgba(0,138,255,0.45)',
          shadowBlur: 4,
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        progress: {
          show: true,
          roundCap: false,
          width: 10
        },
        pointer: {
          show: true,
          width: '2%',
          length: '90%',
          offsetCenter: [0, '5%']
        },
        axisLine: {
          roundCap: false,
          lineStyle: {
            width: 10
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        detail: {
          show: false
        },
        axisLabel: {
          distance: -50,
          color: '#B9C8E9',
          fontSize: 12
        },
        title: {
          show: false
        },

        data: [
          {
            value: config.value
          }
        ]
      }
    ]
  };
  return option;
}

export function getOutWaterQualityOption(config = {}) {
  let color = ['#5BC8FF', '#5BFF72', '#D7AAFF'];

  if (config.empty) {
    let hour = moment().hours();
    config.xData = Array.from({ length: hour }, (x, i) =>
      moment()
        .subtract(hour - i, 'hours')
        .format('HH:00')
    );
    config.yAxisName = 'mg/L';
  }

  // 构建警戒线数据
  const markLineData = [];
  let maxWarningValue = 0;

  // 收集警戒线的值用于计算 y 轴范围
  if (config.gb !== null && config.gb !== 0) {
    markLineData.push({
      name: '',
      yAxis: config.gb,
      lineStyle: {
        color: '#FE5F34',
        type: 'solid',
        width: 1
      },
      label: {
        position: 'start',
        offset: [10, 0],
        formatter: `设计 {c}`,
        align: 'left',
        color: '#FE5F34'
      }
    });
    maxWarningValue = Math.max(maxWarningValue, config.gb);
  }

  if (config.cb !== null && config.cb !== 0) {
    markLineData.push({
      name: '',
      yAxis: config.cb,
      lineStyle: {
        color: '#EFFC34',
        type: 'solid',
        width: 1
      },
      label: {
        position: 'start',
        offset: [10, 0], // 调整第二条线的标签位置，避免重叠
        formatter: `内控 {c}`,
        align: 'left',
        color: '#EFFC34'
      }
    });
    maxWarningValue = Math.max(maxWarningValue, config.cb);
  }

  // 计算数据的最大值
  const seriesData = config.data || [];
  const maxDataValue = Math.max(...seriesData.map(item => Number(item) || 0));

  // 计算 y 轴的最大值，确保警戒线和数据都能显示
  const yAxisMax = formatNumber(Math.max(maxWarningValue, maxDataValue) * 1.2); // 留出20%的空间
  const yAxisMin = 0; // 从0开始

  let option = {
    ...genCommonOption(config),
    legend: {
      show: false
    },
    color,
    yAxis: [
      {
        type: 'value',
        name: 'mg/L',
        nameTextStyle: {
          color: '#BAC9E7',
          padding: [0, 32, 0, 0]
        },
        min: yAxisMin,
        max: yAxisMax,
        splitLine: {
          lineStyle: {
            color: ['#3B568D'],
            type: 'dashed'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#BAC9E7'
          }
        }
      }
    ],
    series: [
      {
        name: '',
        data: seriesData,
        type: 'line',
        showSymbol: false,
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colorRgb(color[0], 0.48) },
            { offset: 1, color: colorRgb(color[0], 0.08) }
          ])
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            width: 1
          },
          emphasis: {
            disabled: true
          },
          label: {
            show: true,
            position: 'insideEndTop',
            distance: 10,
            color: '#bfd5ff',
            fontSize: 12,
            backgroundColor: 'rgba(0,16,47,0.8)',
            padding: [2, 4],
            formatter: '{c} mg/L'
          },
          data: markLineData
        }
      }
    ]
  };
  return option;
}

export function getOutWaterRateOption(config = {}) {
  let option = {
    color: ['#fff', 'rgba(16,46,87,.4)'],
    series: [
      {
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['68%', '82%'],
        hoverAnimation: false,
        roundCap: true,
        data: [
          {
            name: '',
            value: config.value,
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 1,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(26,120,253,0.2)'
                    },
                    {
                      offset: 1,
                      color: config.endColor
                    }
                  ],
                  globalCoord: false
                }
              }
            },
            label: {
              show: false
            }
          },
          {
            //画中间的图标
            name: '',
            value: 0,
            label: {
              position: 'inner',
              backgroundColor: {
                image:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAZBJREFUWEftl7EuRFEQhr8/HkBDp/YIBInYREeBZyD0FCqJToSe8AwoqBSWxIp9AtEqFLbRk+HI3c217jn3XrsnNxLTzj0zX/6ZM2euqNhUcX7+FoCZzQDzwAQwCgwB78Az8AA0gAtJzaLKFlLAzBaBTWCsYOAbYFfSRd73uQBmdgQs5wXy+A8lrYXOegHMbBA4A5zsvVgdWJD0mhUkBHDVh+TtnHVJtcIAPcruU+tY0kq384cCScOd9KJ54OySpNO0PwvgvkS3l+VsShr3AiT33NU+ptUkucb8sm8KmNkesB4zO7AvacMHcAtMRgZoSJryAbwk4zUmQ0vSsA/AYmbuJJU6pe/ugTdgIDaEAgBPwEhkgGAJLoHZyADBJtwGtiIDBK+he+/dJIxp/kHksprZNTAdiSA8ihOAOeA8EkD+Y5RAHHzueat9hij2HLeTmll1C0miQrUrWUqJXpbSTNnTpc3dihM1yq7l7r9gp3v7yeqpQgApNbJ+TJy7BTwCd+4GpReOvEYuBZAX7Df+f4APyhWLISIELDcAAAAASUVORK5CYII='
              },
              padding: 6,
              width: 6,
              height: 6
            }
          },
          {
            //画剩余的刻度圆环
            name: '',
            value: 100 - config.value,
            label: {
              show: false
            }
          }
        ]
      }
    ]
  };
  return option;
}

export const keyInstrumentData = {
  args: [],
  count: 0,
  errorCode: null,
  errorMessage: null,
  resultData: [
    {
      dataList: [
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'uint',
          dataTypeName: 'uint',
          deviceId: '2024082801',
          deviceName: '进水水质分析间',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: null,
          minValue: null,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'BKMQ024',
          pointId: '52719ac348a1955c60975c4faab37a88',
          pointMemo: 'ORP',
          pointMemoAlias: 'ORP',
          pointName: 'ORP',
          pointType: '监测流量',
          pointTypeName: null,
          pointUnit: null,
          pointUnitName: '',
          pointValue: 1500,
          pointValueRatio: 1500,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        },
        {
          controlStatus: null,
          dataSort: 1,
          dataType: 'uint',
          dataTypeName: 'uint',
          deviceId: '2024082801',
          deviceName: '进水水质分析间',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: 35,
          minValue: 15,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'NH3N',
          pointId: '552e20144d829216f8ed869728424ff9',
          pointMemo: 'NH₃-N',
          pointMemoAlias: 'NH3-N',
          pointName: 'NH3N',
          pointType: '水质参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 41,
          pointValueRatio: 41,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        }
      ],
      deviceName: '进水'
    },
    {
      dataList: [
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'real',
          dataTypeName: 'real',
          deviceId: '2024082809',
          deviceName: '厌氧段南',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: null,
          minValue: null,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'zlsn',
          pointId: '529445b210746071067371aa32d4a529',
          pointMemo: 'PO4-P',
          pointMemoAlias: 'PO4-P',
          pointName: 'PO4-P',
          pointType: '其他参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 0.05,
          pointValueRatio: 0.05,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        }
      ],
      deviceName: '厌氧段'
    },
    {
      dataList: [
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'uint',
          dataTypeName: 'uint',
          deviceId: '2024082818',
          deviceName: '一级缺氧段南',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: null,
          minValue: null,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'NO3N',
          pointId: 'a6f17d8f98b723e5843a381fc23fdca6',
          pointMemo: 'NO₃-N',
          pointMemoAlias: 'NO3-N',
          pointName: 'NO3N',
          pointType: '水质参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 3.26,
          pointValueRatio: 3.259,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        }
      ],
      deviceName: '一级缺氧段'
    },
    {
      dataList: [
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'real',
          dataTypeName: 'real',
          deviceId: '2024082810',
          deviceName: '一级好氧段南',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: null,
          minValue: null,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'do2',
          pointId: '5c6290e24b5f8809ba82e9f5e677cd4d',
          pointMemo: '末段DO',
          pointMemoAlias: '末段DO',
          pointName: 'finalDO',
          pointType: '其他参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 4.85,
          pointValueRatio: 4.854,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        },
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'uint',
          dataTypeName: 'uint',
          deviceId: '2024082810',
          deviceName: '一级好氧段南',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: 2.5,
          minValue: 1.5,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'do6',
          pointId: 'ad9f8072e6acba3933ec1cadeca91030',
          pointMemo: '中段DO',
          pointMemoAlias: '中段DO',
          pointName: 'middleDo',
          pointType: '水质参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 1.77,
          pointValueRatio: 1.773,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        },
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'uint',
          dataTypeName: 'uint',
          deviceId: '2024082810',
          deviceName: '一级好氧段南',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: null,
          minValue: null,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'NO3N',
          pointId: 'a6f17d8f98b723e5843a381fc23fdca6',
          pointMemo: 'NO₃-N',
          pointMemoAlias: 'NO3-N',
          pointName: 'NO3N',
          pointType: '水质参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 13.17,
          pointValueRatio: 13.168,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        }
      ],
      deviceName: '一级好氧段'
    },
    {
      dataList: [],
      deviceName: '缺氧好氧交替段'
    },
    {
      dataList: [
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'uint',
          dataTypeName: 'uint',
          deviceId: '2024082815',
          deviceName: '二级缺氧段南',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: null,
          minValue: null,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'NO3N',
          pointId: 'a6f17d8f98b723e5843a381fc23fdca6',
          pointMemo: 'NO₃-N',
          pointMemoAlias: 'NO3-N',
          pointName: 'NO3N',
          pointType: '水质参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 10.84,
          pointValueRatio: 10.843,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        }
      ],
      deviceName: '二级缺氧段'
    },
    {
      dataList: [
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'uint',
          dataTypeName: 'uint',
          deviceId: '2024082816',
          deviceName: '二级好氧段南',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: null,
          minValue: null,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'NO3N',
          pointId: 'a6f17d8f98b723e5843a381fc23fdca6',
          pointMemo: 'NO₃-N',
          pointMemoAlias: 'NO3-N',
          pointName: 'NO3N',
          pointType: '水质参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 12.32,
          pointValueRatio: 12.323,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        },
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'real',
          dataTypeName: 'real',
          deviceId: '2024082816',
          deviceName: '二级好氧段南',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: 10,
          minValue: 0,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'BKMQ026',
          pointId: '5a73504b8f5b304e543c678e4e68edd2',
          pointMemo: 'DO',
          pointMemoAlias: 'DO',
          pointName: 'DO',
          pointType: '其他参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 2.67,
          pointValueRatio: 2.667,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        },
        {
          controlStatus: null,
          dataSort: 1,
          dataType: 'uint',
          dataTypeName: 'uint',
          deviceId: '2024082816',
          deviceName: '二级好氧段南',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: 35,
          minValue: 15,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'NH3N',
          pointId: '552e20144d829216f8ed869728424ff9',
          pointMemo: 'NH₃-N',
          pointMemoAlias: 'NH3-N',
          pointName: 'NH3N',
          pointType: '水质参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 0.67,
          pointValueRatio: 0.665,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        }
      ],
      deviceName: '二级好氧段'
    },
    {
      dataList: [
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'real',
          dataTypeName: 'real',
          deviceId: '2024082821',
          deviceName: '二沉池南',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: null,
          minValue: null,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'returnFlow',
          pointId: '7787af96d90a814a2e309441443a5f32',
          pointMemo: '外回流量',
          pointMemoAlias: '外回流量',
          pointName: 'externalReturnFlow',
          pointType: '其他参数',
          pointTypeName: null,
          pointUnit: 'm³/h',
          pointUnitName: 'm³/h',
          pointValue: 2461.14,
          pointValueRatio: 2461.137,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        }
      ],
      deviceName: '二沉池'
    },
    {
      dataList: [
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'real',
          dataTypeName: 'real',
          deviceId: '2024082823',
          deviceName: '深度处理反硝化滤池',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: null,
          minValue: null,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'Nitrogen',
          pointId: 'b9c2fc7050f453bb7fc1deade31b7c35',
          pointMemo: '进水硝态氮',
          pointMemoAlias: '进水硝态氮',
          pointName: 'waterNitrateNitrogen',
          pointType: '其他参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 0,
          pointValueRatio: 0,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        },
        {
          controlStatus: null,
          dataSort: 0,
          dataType: 'real',
          dataTypeName: 'real',
          deviceId: '2024082823',
          deviceName: '深度处理反硝化滤池',
          displayType: 1,
          displayTypeName: '曲线参数',
          enumOne: null,
          enumOneName: null,
          enumZero: null,
          enumZeroName: null,
          formulae: null,
          formulaeItem: null,
          frequency: null,
          frequencyName: null,
          gatewayFlag: null,
          gatewayNum: null,
          id: null,
          iotDeviceId: null,
          isOnline: true,
          maxValue: null,
          minValue: null,
          numFormatType: null,
          pointCategory: 1,
          pointCategoryName: null,
          pointChildType: null,
          pointCode: 'AD',
          pointId: 'c37702805c47a9782aa5ff7cb727020a',
          pointMemo: '出水硝态氮',
          pointMemoAlias: '出水硝态氮',
          pointName: 'outletNitrateNitrogen',
          pointType: '其他参数',
          pointTypeName: null,
          pointUnit: 'mg/L',
          pointUnitName: 'mg/L',
          pointValue: 0,
          pointValueRatio: 0,
          ratio: 1,
          stationId: null,
          stationName: null,
          statisticPointId: null,
          statisticPointMemo: null,
          statisticPointName: null,
          timestamp: '2025-03-26 10:03:30',
          truncateNum: 2
        }
      ],
      deviceName: '深度处理'
    }
  ],
  status: 'complete',
  success: true
};
