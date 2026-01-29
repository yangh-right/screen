import { color } from 'echarts';

/*
 * @Author: wangyr
 * @Date: 2023-05-15 14:31:39
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-05-15 14:34:41
 * @Description:
 */
export const Debounce = (fn, wait) => {
  var timer = null;
  return function () {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, wait);
  };
};

export const deepObjectMerge = (FirstOBJ, SecondOBJ) => {
  for (var key in SecondOBJ) {
    FirstOBJ[key] =
      FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]'
        ? deepObjectMerge(FirstOBJ[key], SecondOBJ[key])
        : (FirstOBJ[key] = SecondOBJ[key]);
  }
  return FirstOBJ;
};
export function genCommonOption(config = {}) {
  return {
    grid: {
      left: config.empty ? '22px' : '12px',
      right: '12px',
      top: '42px',
      bottom: '16px',
      containLabel: true
    },
    legend: {
      show: true,
      data: [],
      icon: 'rect',
      itemWidth: 10,
      itemHeight: 10,
      top: 9,
      right: 3,
      textStyle: {
        color: '#D9F7FF',
        fontWeight: 400,
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis',
      borderColor: 'transparent',
      backgroundColor: 'rgba(4, 17, 60, 0.77)',
      borderRadius: 4,
      textStyle: { color: '#EFF5FF', align: 'left', fontSize: 12 },
      axisPointer: {
        type: 'shadow',
        shadowStyle: { color: 'rgba(168, 191, 221, 0.2)', width: 'auto' }
      }
    },
    xAxis: [
      {
        axisLabel: {
          showMaxLabel: true,
          showMinLabel: true,
          rotate: 40,
          textStyle: {
            color: '#BAC9E7'
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: ['#3B568D']
          }
        },
        data: config.xData || []
      }
    ],
    yAxis: [
      {
        type: 'value',
        max: config.empty ? 1 : (config.yMax || undefined),
        name: config.yAxisName || '',

        nameTextStyle: {
          color: '#BAC9E7',
          padding: [0,20,0,0],
          align: config.empty ? 'left' : 'center'
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#BAC9E7'
          }
        },
      }
    ]
  };
}
