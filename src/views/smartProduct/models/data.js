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
export function colorRgb(str, opacity) {
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
let hour = moment().hours() + 17;
let emptyXData = Array.from({ length: hour }, (x, i) =>
  moment()
    .subtract(hour - i - 1, 'hours')
    .format('HH:00')
);
export function getDissolvedOxygenOption(config = {}) {
  let color = ['#5BC8FF', '#5BFF72', '#D7AAFF'];
  if (config.empty) {
    config.xData = emptyXData;
    config.yAxisName = 'mg/L';
  }
  let option = {
    ...genCommonOption(config),
    color,
    // legend: {
    //   show: true,
    //   top: 9,
    //   textStyle: {
    //     color: '#CFDCF7'
    //   },
    //   right: 3,
    //   icon: 'rect',
    //   itemHeight: 8,
    //   itemWidth: 8,
    //   data: ['一级好氧池末段', '二级好氧池'],
    //   selected: {
    //     '二级好氧池': false
    //   }
    // },
    series: [
      // {
      //   name: '一级好氧池中段',
      //   data: [],
      //   type: 'line',
      //   showSymbol: false,
      //   smooth: true,
      //   areaStyle: {
      //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //       { offset: 0, color: colorRgb(color[0], 0.48) },
      //       { offset: 1, color: colorRgb(color[0], 0.08) }
      //     ])
      //   }
      // },
      {
        name: '一级好氧池末段',
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
      },
      {
        name: '二级好氧池',
        data: [],
        type: 'line',
        showSymbol: false,
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colorRgb(color[1], 0.48) },
            { offset: 1, color: colorRgb(color[1], 0.08) }
          ])
        }
      }
    ]
  };
  return option;
}
export function getOutQualityOption(config = {}) {
  let color = ['#5BC8FF', '#5BFF72', '#D7AAFF'];
  if (config.empty) {
    config.xData = emptyXData;
    config.yAxisName = 'mg/L';
  }
  let markLineData = [];
  if (config.cb != undefined) {
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
        offset: [10, 0],
        formatter: `内控 {c}`,
        align: 'left'
      }
    });
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
        },
        ...(markLineData.length > 0 && {
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
        })
      }
    ]
  };
  return option;
}
export const POINTS_CONFIG = {
  SOUTH: 'south',
  NORTH: 'north',
  MCP: 'mcp',
  CONTROL_N: 'control-n',
  CONTROL_S: 'control-s',
  PRESSURE: 'pressure',
  RUN_STATE: 'run_state',
  GFJ_STATE: 'gfj_state',
  DO_STATE_N: 'do_state_n',
  DP_STATE_S: 'dp_state_s'
};
export const POINTS_LIST = [
  {
    name: '南池1#曝气',
    code: 'M4-T2-Z1',
    group: POINTS_CONFIG.SOUTH
  },
  {
    name: '南池2#曝气',
    code: 'M5-T2-Z2',
    group: POINTS_CONFIG.SOUTH
  },
  {
    name: '南池3#曝气',
    code: 'M6-T2-Z3',
    group: POINTS_CONFIG.SOUTH
  },
  {
    name: '南池4#曝气',
    code: 'M8-T2-Z4',
    group: POINTS_CONFIG.SOUTH
  },
  {
    name: '北池1#曝气',
    code: 'M1-T1-Z1',
    group: POINTS_CONFIG.NORTH
  },
  {
    name: '北池2#曝气',
    code: 'M2-T1-Z2',
    group: POINTS_CONFIG.NORTH
  },
  {
    name: '北池3#曝气',
    code: 'M3-T1-Z3',
    group: POINTS_CONFIG.NORTH
  },
  {
    name: '北池4#曝气',
    code: 'M7-T1-Z4',
    group: POINTS_CONFIG.NORTH
  }
];
export function getValue(val) {
  return val == null ? '--' : val;
}
const findPointValue = (resultData, name, defaultValue = '-', includeUnit = true) => {
  if (!resultData) return defaultValue;
  const point = resultData.find(p => p.pointName.includes(name));
  if (!point) return defaultValue;

  return includeUnit && point.pointUnit
    ? `${point.pointValue} ${point.pointUnit}`.trim()
    : point.pointValue || defaultValue;
};
const createDataProcessor = (valueKeys, options = {}) => {
  const { defaultValue = '-', includeUnit = true } = options;

  return dataList => {
    return dataList.map(item => {
      const processedData = { ...item };

      valueKeys.forEach(key => {
        processedData[key] = findPointValue(item.resultData, key, defaultValue, includeUnit);
      });

      return processedData;
    });
  };
};
export const processPointsData = createDataProcessor(['DO_act', 'DO_set', 'Air_Flow', 'Stroke_Act']);
