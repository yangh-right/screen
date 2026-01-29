<template>
  <div class="tabs">
    <div
      class="tab"
      v-for="item in tabs"
      :key="item.pointMemo"
      :class="{ 'tab-active': tabValue === item.pointMemo }"
      @click="tabChange(item)"
    >
      {{ item.pointMemo }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'pointTab',
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    tabValue: {
      type: String,
      default: ''
    }
  },
  methods: {
    tabChange(data) {
      this.$emit('tabChange', data);
    }
  }
};
</script>
<style lang="less" scoped>
.tabs {
  width: 100%;
  height: 30px;
  margin-top: 12px;
  display: flex;
  justify-content: flex-start;
  .tab {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px;
    height: 28px;

    background: url('~@/assets/img/smartProduct/btn-unselect.png') no-repeat;
    background-size: 100% 100%;
    font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
    font-weight: 700;
    font-size: 14px;
    color: #d9ecff;
    letter-spacing: 0;
    text-align: center;
    cursor: pointer;
  }
  .tab-active {
    background: url('~@/assets/img/smartProduct/btn-select.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
