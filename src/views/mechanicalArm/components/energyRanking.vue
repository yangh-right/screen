<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="top"></div>
      <div class="bottom">
        机械臂是一种可编程的机械装置，具有与人类手臂相似的功能，能够完成各种复杂的操作任务。‌它们通常通过关节连接，实现旋转或平移运动，末端执行器类似于人的手，可以用于抓取、操作物体等。机械臂根据结构形式的不同，可以分为多种类型，包括球坐标式、关节式、直角坐标式和圆柱坐标式等。‌
      </div>
    </div>
  </unit-card>
</template>

<script>
export default {
  name: 'energyRanking',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: 100%;
  padding: 11px 9px 14px 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top {
    width: 419.54px;
    height: 124px;
    background: url('~@/assets/img/arm_des.png') no-repeat;
    background-size: 100% 100%;
  }
  .bottom {
    color: #d9f7ff;
    font-size: 14px;
    font-family: PingFangSC, sans-serif;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0;
    text-align: left;
  }
}
</style>
