/*
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-06-15 09:05:37
 * @LastEditors: wangyr
 * @LastEditTime: 2024-10-19 11:29:15
 * @Description:
 */
import { genCommonOption } from '@/components/chart/utils/util';

export function handlePointName(str) {
  return str?.replace(/NH3N/g, 'NH₃-N') || str;
}

export const inWaterOption = {
  ...genCommonOption(),

  color: ['#2F7FFF', '#2BDEAB'],
  series: [
    {
      data: [],
      type: 'line',
      smooth: true
    }
  ]
};
export const pointOption = {
  ...genCommonOption(),

  color: ['#2F7FFF', '#2BDEAB'],
  series: [
    {
      data: [],
      type: 'line',
      smooth: true
    }
  ]
};
export const warnDiagnosisOption = {
  ...genCommonOption(),

  color: ['#2F7FFF', '#2BDEAB'],
  series: [
    {
      data: [],
      type: 'line',
      smooth: true
    }
  ]
};
export function genPointOption(config = {}) {
  return {
    ...genCommonOption(config),
    legend: {
      show: true,
      top: 6,
      right: 0,
      icon: 'rect',
      itemHeight: 2,
      itemWidth: 12
    },
    color: ['#2F7FFF', '#2BDEAB'],
    series: [
      {
        name: '',
        data: [],
        type: 'line',
        smooth: true
      }
    ]
  };
}
export function genInWaterOption(config = {}) {
  return {
    ...genCommonOption(config),
    color: ['#2F7FFF', '#2BDEAB'],
    series: [
      {
        name: config.seriesName,
        data: config.yData || [],
        type: 'line',
        smooth: true
      }
    ]
  };
}
export const adoptionStatisticsOption = {
  ...genCommonOption(),
  color: ['#2F7FFF', '#2BDEAB'],
  series: [
    {
      data: [],
      type: 'line',
      smooth: true
    }
  ]
};
