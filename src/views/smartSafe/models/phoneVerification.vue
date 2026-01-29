<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-06 15:24:46
 * @Description:
-->
<template>
  <div class="card-inner">
    <div class="title">手机验证“有限空间作业”</div>
    <div class="card-content">
      <div class="base">
        <div class="icon"></div>
      </div>
      <div class="tip">
        <div class="tip__item" v-for="(item, index) in dataList" :key="index">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'phoneVerification',
  components: {},
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataList: [
        '危险作业申请，上传资格证书，须进行人脸认证，人证合一。',
        '阅读作业安全须知：“强制性”操作流程，提高安全意识，提前了解安全操作流程。'
      ]
    };
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
.card-inner {
  width: 100%;
  height: 100%;
  padding: 12px;
  background-image: linear-gradient(180deg, #003874b3 0%, #00244a33 53%, #00244ab3 100%);
  box-shadow: inset 0 0 20px 0 #007dff4d;
  border-radius: 4px;
  .title {
    width: 60%;
    height: 40px;
    font-family: AlibabaPuHuiTiM, sans-serif;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0.46px;
    padding: 0 14px;
    line-height: 40px;
    background-image: linear-gradient(270deg, #1e539000 7%, #134479ba 77%);
    margin-bottom: 12px;
  }
  .card-content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 30px 0 18px;
    .base {
      margin-right: 31.5px;
      width: 189px;
      height: 198px;
      background: url('~@/assets/img/smartSafe/base-bg.png') no-repeat;
      background-size: 100% 100%;
      .icon {
        width: 150px;
        height: 150px;
        background: url('~@/assets/img/smartSafe/phone.png') no-repeat;
        background-size: 100% 100%;
        position: relative;
        left: 19px;
        top: 3px;
      }
    }
    .tip {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      &__item {
        width: 100%;
        height: 66px;
        font-family: AlibabaPuHuiTi-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0.4px;
        line-height: 22px;
        padding: 0 20px 0;
        background: url('~@/assets/img/smartSafe/tip-bg.png') 0 16px no-repeat;
        background-size: 100% 50px;
        &:last-child {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>
