<template>
  <unit-card :cardTitle="title">
    <div class="card-inner">
      <div class="content-item">
        <div class="label">本科学历达到100%</div>
      </div>
      <div class="content-item module1">
        <div class="label">硕士学历占全员33%</div>
      </div>
    </div>
  </unit-card>
</template>

<script>
export default {
  name: 'KpiAlasysis',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .content-item {
    position: relative;
    width: 200px;
    height: 267px;

    background: url('~@/assets/img/smartTalents/benke.png') no-repeat center;
    background-size: 199px 267px;
    .label {
      position: absolute;
      bottom: 14%;
      left: 16%;
      font-family: AlibabaPuHuiTiM, sans-serif;
      font-size: 16px;
      color: #bfd5ff;
      letter-spacing: 0;
      text-align: center;
    }
  }
  .module1 {
    margin-left: 12px;
    background: url('~@/assets/img/smartTalents/shuoshi.png') no-repeat center;
    background-size: 199px 267px;
  }
}
</style>
