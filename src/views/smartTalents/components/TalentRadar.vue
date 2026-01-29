<template>
  <div class="module-wrap1">
    <a-select
      v-model="selectValue"
      dropdownClassName="select__list"
      class="select__block"
      @change="$emit('select-change', selectValue)"
    >
      <a-select-option v-for="item in personList" :key="item.value" :value="item.value">
        {{ item.label }}
      </a-select-option>
    </a-select>
    <div class="chart">
      <radar-Chart v-if="showChart" :chartId="chartId" :option="baseOption"></radar-Chart>
    </div>
  </div>
</template>

<script>
import RadarChart from '@components/unit/chart/RadarChart';
export default {
  name: 'TalentRadar',
  components: { RadarChart },
  props: {
    selectValue: {
      type: String,
      required: true
    },
    personList: {
      type: Array,
      required: true
    },
    chartId: {
      type: String,
      required: true
    },
    baseOption: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showChart: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.showChart = true;
    });
  }
};
</script>

<style scoped>
.module-wrap1 {
  height: 100%;
  padding: 12px 24px;
}
.chart {
  height: 100%;
}
</style>
