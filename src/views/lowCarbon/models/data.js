/*
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2025-10-22 18:09:41
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2025-11-26 11:26:59
 * @Description:
 */
import moment from 'moment';
import * as echarts from 'echarts';
import { genCommonOption } from '@/components/chart/utils/util';

export function getReuseWaterOption(config = {}) {
  let color = ['#1B6AFF', '#5BFF72', '#D7AAFF'];
  if (config.empty) {
    const daysDiff = 10;
    config.xData = Array.from({ length: daysDiff }, (x, i) =>
      moment()
        .subtract(daysDiff - i - 1, 'days')
        .format('MM-DD')
    );
    config.yAxisName = 'm³';
  }

  const leftX = 5;
  const leftY = 2;
  const rightX = 6;
  const rightY = 3;
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
      const c2 = [xAxisPoint[0] - leftX, xAxisPoint[1] - leftY];
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
      const c3 = [xAxisPoint[0] + rightX, xAxisPoint[1] - rightY];
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
        type: 'custom',
        renderItem: (params, api) => {
          const location = api.coord([api.value(0), api.value(1)]);
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
                  stroke: '#6AC1FF',
                  lineWidth: 1,
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#59C7FF'
                    },
                    {
                      offset: 1,
                      color: '#031A3A'
                    }
                  ])
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
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
                      color: '#041A39'
                    }
                  ])
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
                      color: '#0444BB'
                    },
                    {
                      offset: 1,
                      color: '#3B87F8'
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
export function getCarbonReductionOption(config = {}) {
  let color = ['#0dcafe', '#0872c7', '#0af5b9', '#ff495d', '#f9a809', '#cc56ef', '#f85aab'];
  let data = config.data || [];
  data.forEach((item, i) => {
    item.itemStyle = { color: 'transparent' };
  });
  let data1 = data.map((item, i) => ({
    ...item,
    itemStyle: {
      color: color[i % color.length]
    }
  }));
  let option = {
    data: [...data1.reverse()],
    tooltip: {
      show: false,
      textStyle: {
        color: '#FFF'
      },
      formatter: '{b} {c}%',
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
        radius: ['50%', '57%'],
        startAngle: 341,
        padAngle: 1,
        roseType: false,
        avoidLabelOverlap: true,
        label: {
          show: true,
          formatter: '{name|{b}}',
          rich: {
            name: { fontSize: 14, color: '#D9F7FF', fontFamily: 'AlibabaPuHuiTi' },
            value: { fontSize: 14, color: '#ffffff', fontFamily: 'AlibabaPuHuiTi' }
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
          length2: 45,
          length: 38,
          minTurnAngle: 110,
          lineStyle: {
            color: '#275A78'
          },
          show: true
        },
        data: data
      }
    ]
  };
  return option;
}

export const carbonData = [
  {
    total: 11064.28,
    name: '原辅料使用',
    detailData: [
      {
        name: 'PAC排放',
        dataList: [
          { date: '2025-06', value: '874.88' },
          { date: '2025-07', value: '790.77' },
          { date: '2025-08', value: '694.22' },
          { date: '2025-09', value: '653.77' },
          { date: '2025-10', value: '657.36' },
          { date: '2025-11', value: '597.70' },
          { date: '2025-12', value: '492.16' }
        ],
        unit: 'tCO2'
      },
      {
        name: '乙酸钠排放',
        dataList: [
          { date: '2025-06', value: '728.62' },
          { date: '2025-07', value: '842.46' },
          { date: '2025-08', value: '951.47' },
          { date: '2025-09', value: '931.94' },
          { date: '2025-10', value: '851.63' },
          { date: '2025-11', value: '757.60' },
          { date: '2025-12', value: '929.66' }
        ],
        unit: 'tCO2'
      },
      {
        name: '次氯酸钠排放',
        dataList: [
          { date: '2025-06', value: '55.55' },
          { date: '2025-07', value: '27.43' },
          { date: '2025-08', value: '54.80' },
          { date: '2025-09', value: '62.47' },
          { date: '2025-10', value: '27.34' },
          { date: '2025-11', value: '27.51' },
          { date: '2025-12', value: '54.94' }
        ],
        unit: 'tCO2'
      }
    ]
  },
  {
    total: 3954.49,
    name: '外购电力',
    detailData: [
      {
        name: '生产用电排放',
        dataList: [
          { date: '2025-06', value: '405.03' },
          { date: '2025-07', value: '460.44' },
          { date: '2025-08', value: '560.15' },
          { date: '2025-09', value: '612.19' },
          { date: '2025-10', value: '569.11' },
          { date: '2025-11', value: '735.14' },
          { date: '2025-12', value: '594.73' }
        ],
        unit: 'tCO2'
      },
      {
        name: '办公用电排放',
        dataList: [
          { date: '2025-06', value: '2.06' },
          { date: '2025-07', value: '2.03' },
          { date: '2025-08', value: '1.46' },
          { date: '2025-09', value: '2.46' },
          { date: '2025-10', value: '2.80' },
          { date: '2025-11', value: '3.06' },
          { date: '2025-12', value: '3.82' }
        ],
        unit: 'tCO2'
      }
    ]
  },
  {
    total: 1638.03,
    name: 'NOx排放',
    detailData: [
      {
        name: '折二氧化碳排放',
        dataList: [
          { date: '2025-06', value: '203.27' },
          { date: '2025-07', value: '183.37' },
          { date: '2025-08', value: '168.92' },
          { date: '2025-09', value: '226.18' },
          { date: '2025-10', value: '283.95' },
          { date: '2025-11', value: '291.58' },
          { date: '2025-12', value: '280.76' }
        ],
        unit: 'tCO2'
      }
    ]
  }
];
