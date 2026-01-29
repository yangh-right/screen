/*
 * @version: 1.0.1
 * @Author: kk
 * @Date: 2021-10-22 11:29:53
 * @LastEditors: kk
 * @LastEditTime: 2021-12-09 14:03:01
 * @Description: 按需加载ECharts图表和组件，如果需要其他，请在此处按需添加资源模块
 * @Update: 更新内容
 */
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import {
    LineChart,
    BarChart,
    PictorialBarChart,
    PieChart,
    RadarChart,
    GaugeChart
} from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
    TitleComponent,
    // 工具集
    // ToolboxComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    PolarComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent,
    // 标记
    MarkPointComponent,
    MarkLineComponent,
    MarkAreaComponent,
    // 图例
    LegendComponent,
    LegendScrollComponent,
    LegendPlainComponent
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import {
    LabelLayout,
    UniversalTransition
} from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import {
    CanvasRenderer
} from 'echarts/renderers';

// 注册必须的组件
echarts.use([
    LineChart,
    BarChart,
    PictorialBarChart,
    PieChart,
    RadarChart,
    GaugeChart,
    TitleComponent,
    // ToolboxComponent,
    TooltipComponent,
    GridComponent,
    MarkPointComponent,
    MarkLineComponent,
    MarkAreaComponent,
    LegendComponent,
    LegendScrollComponent,
    LegendPlainComponent,
    DatasetComponent,
    TransformComponent,
    PolarComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);

export const color = ['#3366FF', '#5790FB', '#96CAFF', '#DDE9FC', "#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3", "#e5cf0d", "#97b552", "#95706d", "#dc69aa", "#07a2a4", "#9a7fd1", "#588dd5", "#f5994e", "#c05050", "#59678c", "#c9ab00", "#7eb00a", "#6f5553", "#c14089"]

export default echarts;
