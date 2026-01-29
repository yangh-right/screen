<template>
  <div class="liquidfill">
    <div ref="liquidfill" class="chart"/>
    <div class="content">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: '合格'
        }
    },
    data() {
        return {
        }
    },
    computed: {
        option() {
            return {
                series: [{
                    type: 'liquidFill',
                    radius: 60,
                    outline: {
                        borderDistance: 8,
                        itemStyle: {
                            borderWidth: 2,
                            borderColor: this.label === '合格' ? '#178D87' : '#AD9123'
                        }
                    },
                    data: [{
                        value: 0.5,
                        itemStyle: {
                            color: this.label === '合格' ? '#A6FF6A' : '#F9FF0B'
                        }
                    }],
                    label: {
            // position: 'bottom',
                        position: ['50%', '80%'],
                        formatter: () => this.label,
                        color: '#011817',
                        insideColor: '#011817',
                        fontSize: 8
                    },
                    backgroundStyle: {
                        color: {
                            type: 'radial',
                            x: 0.5,
                            y: 0.5,
                            r: 0.5,
                            colorStops: this.label === '合格' ? [{
                                offset: 0, color: 'transparent'
                            }, {
                                offset: 0.77, color: 'rgba(29,225,206,0.30)'
                            }, {
                                offset: 1, color: 'rgba(29,224,205,0.49)'
                            }] : [{
                                offset: 0, color: 'transparent'
                            }, {
                                offset: 1, color: 'rgba(224,144,29,0.49)'
                            }]
                        }
                    }
                }]
            }
        }
    },
    mounted() {
        this.echartsInstance = this.$echarts.init(this.$refs.liquidfill)
        this.echartsInstance.setOption(this.option)
    }
}
</script>

<style lang="less" scoped>
.liquidfill{
    .chart{
        float: left;
        width: 68px;
        height:68px;
        margin-right:32px;
        // border:1px solid;
        box-sizing: border-box;
    }
    .content{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        height: 68px;
    }
}
</style>
