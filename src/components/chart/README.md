<!--
 * @version: 1.0.1
 * @Author: kk
 * @Date: 2021-11-03 16:19:57
 * @LastEditors: kk
 * @LastEditTime: 2021-11-03 16:27:26
 * @Description: 内容描述
 * @Update: 更新内容
-->
## Props
| props       | Description |
| ----------- | ----------- |
| chartId     | 图表ID       |
| options     | 图表配置     |


## 简单使用
```
<template>
  <div class="chart-box"><chart chartId="defaultChartId" :options="options"/></div>
</<template>

<script>
  export default {
    data() {
      return {
        options: {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'line'
            }
          ]
        }
      }
    }
  }
</<script>>

```

## Tips
1. 暴露的echarts实例在 @components/chart/utils/echarts.js
2. 目前引入的图表类型LineChart, BarChart, PictorialBarChart, PieChart, RadarChart, GaugeChart，按需在上述文件中自增
3. 其余的工具模块，按需在上述文件中自增