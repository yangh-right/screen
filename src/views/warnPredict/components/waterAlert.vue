<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2023-12-08 12:17:22
 * @Description:
-->
<template>
  <div class="block">
    <div class="block__title">{{ title }}</div>
    <div class="block__content">
      <div class="title">二沉池TN：</div>
      <div class="rule">11.5mgL＞11.0mg/L (厂内控值)</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'alarmSituation',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pointsArr: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    initData() {}
  },
  created() {},
  mounted() {
    this.initData();
  }
};
</script>

<style lang="less" scoped>
.block {
  z-index: 23;
  background: url('~@/assets/img/warnPredict/water_warn.png') no-repeat;
  background-size: 100% 100%;
  &__title {
    margin: 0;
    font-weight: 700;
    font-family: JiangChengXieHei, sans-serif;
    font-size: 20px;
    text-indent: 20px;
    background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
    -webkit-background-clip: text;
    color: transparent;
  }

  &__content {
    padding: 12px 9px;

    .title {
      font-weight: 500;
      padding: 9px;
      font-size: 20px;
      color: #ff7272;
      letter-spacing: 0;
    }

    .rule {
      font-weight: 500;
      font-size: 14px;
      color: #ff7272;
      letter-spacing: 0;
    }
  }
}
</style>
