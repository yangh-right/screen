<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-08 16:29:16
 * @Description:
-->
<template>
  <div class="card-inner">
    <div class="title">远程监管操作</div>
    <div class="card-content">
      <div class="base">
        <div class="icon"></div>
      </div>
      <div class="tip" ref="tipContainer">
        <!-- 修改后的代码，使用 slice 截取前 3 条数据 -->
        <transition-group name="slide" tag="div">
          <div class="tip__item" v-for="item in dataList.slice(0, 3)" :key="item">{{ item }}</div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pcAudit',
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
        '危险作业许可审核',
        '危险作业审批时效期',
        '作业环境安全评估',
        '检查安全措施是否落实',
        '作业人员资质是否满足要求',
        '作业人员是否经过安全培训',
        '作业人员个人防护是否到位',
        '现场操作是否满足规范要求'
      ],
      intervalId: null
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
  mounted() {
    // 启动轮播
    this.startCarousel();
  },
  beforeDestroy() {
    // 清除定时器
    this.stopCarousel();
  },
  methods: {
    initData() {},
    startCarousel() {
      this.intervalId = setInterval(() => {
        // 将最后一个元素移到数组开头
        const lastItem = this.dataList.pop();
        this.dataList.unshift(lastItem);
      }, 3000); // 每3秒轮播一次
    },
    stopCarousel() {
      clearInterval(this.intervalId);
    }
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
    padding: 0 30px 0 18px;
    .base {
      flex: 0 0 auto;
      margin-right: 31.5px;
      width: 189px;
      height: 198px;
      background: url('~@/assets/img/smartSafe/base-bg.png') no-repeat;
      background-size: 100% 100%;
      .icon {
        width: 138px;
        height: 138px;
        background: url('~@/assets/img/smartSafe/pc.png') no-repeat;
        background-size: 100% 100%;
        position: relative;
        left: 25px;
        top: 22px;
      }
    }
    .tip {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      &__item {
        width: 100%;
        height: 55px;
        font-family: AlibabaPuHuiTi-Regular, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: 0.4px;
        line-height: 22px;
        background: url('~@/assets/img/smartSafe/tip-bg.png') 0 5px no-repeat;
        background-size: 100% 50px;
        margin-bottom: 10px;
        padding: 0 21px 0;
        &:nth-last-child(1) {
          margin-bottom: 0px;
        }
      }
    }
  }
  /* 优化后的过渡动画，仅保留进入动画 */
  .slide-enter-active {
    transition: all 0.5s ease;
    transform-origin: top;
  }
  .slide-enter {
    opacity: 0;
    transform: translateY(-100%);
  }
  .slide-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }
}
</style>
