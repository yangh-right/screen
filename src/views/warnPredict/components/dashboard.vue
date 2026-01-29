<!--
 * @Author: wangyr
 * @Date: 2023-04-21 17:20:07
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2023-12-07 16:04:54
 * @Description:
-->
<template>
    <div class="echart-block">
        <mult-chart :options="option"></mult-chart>
    </div>
</template>

<script>
    import * as echarts from 'echarts';

    export default {
        name: 'dashboard',
        components: {
            multChart: () => import('@/components/chart/Chart.vue')
        },
        props: {
            percent: {
                type: Number,
            }
        },
        data() {
            return {
                option: {},
                data: []
            };
        },
        computed: {},
        watch: {
        },
        methods: {

            init() {
                this.option = {
                    series: [
                        {  

                            detail: {
                              show: false
                            },
                            radius: '75%',
                            type: "gauge",
                            startAngle: 233, //起始角度，同极坐标
                            endAngle: -53, //终止角度，同极坐标
                            axisLine: {
                                show: false,
                            },
                            splitLine: {
                                show: false,
                            },
                            axisTick: {
                                show: false,
                            },
                            axisLabel: {
                                show: false,
                            },
                            splitLabel: {
                                show: false,
                            },
                            pointer: {
                                // 分隔线
                                shadowColor: "auto", //默认透明
                                shadowBlur: 5,
                                length: "50%",
                                width: 3,
                            },
                            itemStyle: {
                                color: "#1598FF",
                                borderColor: "#1598FF",
                                borderWidth: 3,
                            },

                            title: {
                                show: false,
                            },
                            data: [
                                {
                                    value: this.percent,
                                },
                            ],
                        },

                    ],
                };
            }
        },
        created() {
            this.init();
        },
        mounted() { }
    };
</script>

<style lang="less" scoped>

</style>