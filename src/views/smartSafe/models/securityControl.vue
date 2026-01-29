<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description:
-->
<template>
  <unit-card cardTitle='"强制式"-执行力安全管控' cardType="4">
    <div class="box">
      <div class="box__item">
        <phone-verification :waterPlantId="waterPlantId" />
      </div>
      <div class="box__item">
        <wear-gear :waterPlantId="waterPlantId" />
      </div>
      <div class="box__item">
        <pc-audit :waterPlantId="waterPlantId" />
      </div>
    </div>
  </unit-card>
</template>

<script>
import phoneVerification from './phoneVerification';
import wearGear from './wearGear';
import pcAudit from './pcAudit';
export default {
  name: 'securityControl',
  components: {
    phoneVerification,
    wearGear,
    pcAudit,
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initData();
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    initData() {}
  }
};
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  &__item {
    flex: 1;
    overflow: hidden;
    height: 100%;
    margin-right: 20px;
    &:nth-last-child(1) {
      margin-right: 0;
    }
  }
}
</style>
