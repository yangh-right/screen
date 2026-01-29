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
