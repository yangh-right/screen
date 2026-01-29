/*
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-10-22 18:09:41
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2024-11-26 11:26:59
 * @Description:
 */
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
let hour = 24 - moment().hours() + 9;

const emptyXData = Array.from({ length: hour }, (x, i) => moment().add(i, 'hours').format('MM-DD HH'));
export function getXData(list) {
  let data = [...list];
  let index = data.lastIndexOf('08:00');
  if (index > -1) {
    index = index + 1;
    data = data.slice(0, index);
  }
  let isToday = true;
  data = data.map((item, i) => {
    if (item === '00:00' && i) {
      isToday = false;
    }
    if (isToday) {
      return moment().format('MM-DD') + ' ' + item.split(':')[0];
    } else {
      return moment().add(1, 'days').format('MM-DD') + ' ' + item.split(':')[0];
    }
  });
  return { index, data };
}
export function getInYieldOption(config = {}) {
  let color = ['#0BC52F', '#5BFF72', '#D7AAFF'];
  if (config.empty) {
    config.xData = emptyXData;
    config.yAxisName = 'm³/h';
  }
  let option = {
    ...genCommonOption(config),
    color,
    series: [
      {
        name: '',
        data: [],
        type: 'line',
        showSymbol: false,
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colorRgb(color[0], 0.48) },
            { offset: 1, color: colorRgb(color[0], 0.08) }
          ])
        }
      }
    ]
  };
  return option;
}
const symbol = {
  symbol:
    'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAl1JREFUSEu9lk1IVFEUx3/nPmcmTAgN+5jpi4KKQk0JWqWbFgpBGCG0TNCFQmsLIiKo1oEtFGwZDJEEgS7aqKsgNBWjWkRaM5GSEWQ0M7574j1n5Dn5Bfl8y3fuPb97/+fc/73CJr4p1ShzVNg/7PSGmx0sUMn8aZHsRtNlvQET01ruGq6IocFaDiFLAJQFY5hRy5BjeVp9WH6slWdVwOtPur8kSgdKuyp7AAvMAb/yicqASm8zIsxaocdmeXT2iHwtBv0DGE/pCQv3US7lEwwqvHCESdUlgAhlrlIlcFGVRn8BwnMDN2oS8j4IWQHwkysvgQPAkDE8qInL4Hoyjqe10Vq6gAbgixEuBCHLAE8WJ0I3SjPCsFPCteq98nGjInrxiW961F3kMUo9Qr+bo7Mg1zJgNK13xXLTwIhEaN1s8sICfEiOPuC8Gu7VxeWWL6e/gmkttyW88wpqDE0bybLWrvJyDXiFN4uc9LrLB4x91jaEHhEGzySkKZhAVZ1sllOu4U5eZy/steftaJS3IuIGx79J6YBfeKW99qD0ineIcmn6VLmKcL02Id3BCZmMVrmGXoVzRd3xyrG0xWIyGfw/ltJOlIciPInEaZWpWd2XyZAU4bhjaKmOy3Bwwu+cPlNoXk0Wgf7SiFwOxibSWu9akqp8iMVokckZPZYzJAV2GaGlJiGjRYDvChVrAOZLI7I7GBtPaZ1Vkgo/I3Y7AKFLFHqRQ2/TbTloHqRgFcCIs9VW4QFCNzsPErRrA0NspV0XDkuoF04B4sllonSYMK7MFb4S1qVf7Dv/82z5CynFsTQu0JXhAAAAAElFTkSuQmCC',
  symbolSize: 12
};
export function getInQualityOption(config = {}) {
  let color = ['#9c6aff', '#5BFF72', '#D7AAFF'];
  if (config.empty) {
    config.xData = emptyXData;
    config.yAxisName = 'mg/L';
  }
  let option = {
    ...genCommonOption(config),
    color,
    series: [
      {
        name: '',
        type: 'line',
        smooth: true,
        ...symbol,

        data: [],
        itemStyle: {
          color: '#fff',
          borderColor: '#fff',
          borderWidth: 1,
          normal: {
            lineStyle: {
              // color: '#9c6aff',
              width: 3 // 折线宽度
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorRgb(color[0], 0.48) },
                { offset: 1, color: colorRgb(color[0], 0.08) }
              ])
            }
          }
        }
      }
    ]
  };
  return option;
}
export function getAlongWayOption(config = {}) {
  let color = ['#1B6AFF', '#5BFF72', '#D7AAFF'];
  if (config.empty) {
    config.xData = ['厌氧池', '一级缺氧池', '一级好氧池', '缺氧好氧可调段', '二级缺氧池', '二级好氧池'];
    config.yAxisName = 'mg/L';
  }
  const leftX = 8;
  const leftY = 4;
  const rightX = 4;
  const rightY = 4;
  // 绘制左侧面
  const CubeLeft = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx, shape) {
      // 会canvas的应该都能看得懂，shape是从custom传入的
      const xAxisPoint = shape.xAxisPoint;
      const c0 = [shape.x, shape.y];
      const c1 = [shape.x - leftX, shape.y - leftY];
      const c2 = [xAxisPoint[0] - leftX, xAxisPoint[1]];
      const c3 = [xAxisPoint[0], xAxisPoint[1]];
      ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath();
    }
  });
  // 绘制右侧面
  const CubeRight = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx, shape) {
      const xAxisPoint = shape.xAxisPoint;
      const c1 = [shape.x, shape.y];
      const c2 = [xAxisPoint[0], xAxisPoint[1]];
      const c3 = [xAxisPoint[0] + rightX, xAxisPoint[1]];
      const c4 = [shape.x + rightX, shape.y - rightY];
      ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
    }
  });
  // 绘制顶面
  const CubeTop = echarts.graphic.extendShape({
    shape: {
      x: 0,
      y: 0
    },
    buildPath: function (ctx, shape) {
      const c1 = [shape.x, shape.y];
      const c2 = [shape.x + rightX, shape.y - rightY];
      const c3 = [shape.x + rightX - leftX, shape.y - leftY - rightY];
      const c4 = [shape.x - leftX, shape.y - leftY];
      ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
    }
  });
  // 注册三个面图形
  echarts.graphic.registerShape('CubeLeft', CubeLeft);
  echarts.graphic.registerShape('CubeRight', CubeRight);
  echarts.graphic.registerShape('CubeTop', CubeTop);
  let option = {
    ...genCommonOption(config),
    color,
    series: [
      {
        name: '1小时后',
        type: 'custom',
        renderItem: (params, api) => {
          const location = api.coord([api.value(0), api.value(1)]);
          let color = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#1B6AFF'
            },
            {
              offset: 0.8,
              color: '#001B52'
            }
          ]);
          return {
            type: 'group',
            children: [
              {
                type: 'CubeLeft',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: color
                }
              },
              {
                type: 'CubeRight',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: color
                }
              },
              {
                type: 'CubeTop',
                shape: {
                  api,
                  xValue: api.value(0),
                  yValue: api.value(1),
                  x: location[0],
                  y: location[1],
                  xAxisPoint: api.coord([api.value(0), 0])
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#ACD5FF'
                    },
                    {
                      offset: 0.8,
                      color: '#38BDFF'
                    }
                  ])
                }
              }
            ]
          };
        },
        data: []
      }
    ]
  };
  return option;
}
export function getOutQualityOption(config = {}) {
  let color = ['#5BC8FF', '#5BFF72', '#D7AAFF'];
  if (config.empty) {
    config.xData = Array.from({ length: 24 }, (x, i) =>
      moment()
        .subtract(24 - i, 'hours')
        .format('MM-DD HH')
    );
    config.yAxisName = 'mg/L';
  }
  let option = {
    ...genCommonOption(config),
    color,
    legend: {
      show: true,
      top: 9,
      textStyle: {
        color: '#CFDCF7'
      },
      right: 3,
      itemHeight: 2,
      itemWidth: 12,
      data: [
        { icon: 'rect', name: '实际值' },
        { icon: 'rect', name: '预测值' },
        {
          icon: 'path://M234.666667 490.666667h-153.6a25.6 25.6 0 1 0 0 51.2h153.6a25.6 25.6 0 1 0 0-51.2zM473.6 490.666667h-153.6a25.6 25.6 0 1 0 0 51.2h153.6a25.6 25.6 0 1 0 0-51.2zM934.4 490.666667h-136.533333a25.6 25.6 0 1 0 0 51.2h136.533333a25.6 25.6 0 1 0 0-51.2zM712.533333 490.666667h-153.6a25.6 25.6 0 1 0 0 51.2h153.6a25.6 25.6 0 1 0 0-51.2z',
          name: '预警线'
        }
      ]
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        smooth: true,
        data: [],
        itemStyle: {
          color: '#fff',
          borderColor: '#fff',
          borderWidth: 1,
          normal: {
            lineStyle: {
              width: 3 // 折线宽度
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorRgb(color[0], 0.48) },
                { offset: 1, color: colorRgb(color[0], 0.08) }
              ])
            }
          }
        }
      },
      {
        name: '预测值',
        type: 'line',
        smooth: true,
        data: [],
        itemStyle: {
          color: '#fff',
          borderColor: '#fff',
          borderWidth: 1,
          normal: {
            lineStyle: {
              width: 3 // 折线宽度
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorRgb(color[1], 0.48) },
                { offset: 1, color: colorRgb(color[1], 0.08) }
              ])
            }
          }
        }
      },
      {
        name: '预警线',
        type: 'line',
        data: [],
        lineStyle: {
          type: 'dashed'
        }
      },
      {
        type: 'line',
        data: [],
        markLine: {
          symbol: 'none',
          lineStyle: {
            type: 'solid',
            width: 1
          },
          data: []
        },
        markPoint: {
          data: [
            {
              coord: ['12:00', 600],
              symbol: 'circle',
              symbolSize: 16,
              itemStyle: {
                color: 'rgba(203, 221, 242, 1)',
                shadowColor: 'rgba(46, 224, 85, 1)',
                shadowBlur: 10
              }
            }
          ]
        }
      }
    ]
  };
  return option;
}
