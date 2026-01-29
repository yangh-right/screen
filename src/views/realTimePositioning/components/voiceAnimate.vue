<!--
 * @Author: wangyr
 * @Date: 2024-10-25 14:51:02
 * @LastEditors: wangyr
 * @LastEditTime: 2024-10-27 14:28:20
 * @Description:
-->
<template>
  <div class="container">
    <div v-for="item in colSpan" :key="item" :class="[isAnimate ? 'run-bar' : '', 'bar-list']">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'voiceAnimate',
  components: {},
  props: {
    isAnimate: {
      type: Boolean,
      default: true
    },
    colSpan: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  align-items: center;
  position: relative;
  height: 26px;
  .bar-list {
    display: flex;
    align-items: center;
    height: 22px;
    margin: 2px 2.6px 0 0;
    span {
      width: 3px;
      border-radius: 2px;
      margin-right: 2.2px;
      background: #a1c0eb;

      &:nth-child(1) {
        height: 25%;
      }

      &:nth-child(2) {
        height: 60%;
      }

      &:nth-child(3) {
        height: 85%;
      }
      &:nth-child(4) {
        height: 60%;
      }
      &:nth-child(5) {
        height: 25%;
      }
    }
  }
  .run-bar {
    span:nth-child(1) {
      animation: bar1 2s 0.2s infinite linear;
    }

    span:nth-child(2) {
      animation: bar2 1.5s 0.4s infinite linear;
    }

    span:nth-child(3) {
      animation: bar3 1s 0.6s infinite linear;
    }

    span:nth-child(4) {
      animation: bar4 1.5s 0.8s infinite linear;
    }

    span:nth-child(5) {
      animation: bar5 2s 1s infinite linear;
    }
  }
  @keyframes bar1 {
    0% {
      margin-top: 25%;
      height: 10%;
    }

    50% {
      height: 70%;
      margin-top: 0%;
    }

    100% {
      height: 10%;
      margin-top: 25%;
    }
  }

  @keyframes bar2 {
    0% {
      margin-top: 25%;
      height: 10%;
    }

    50% {
      height: 90%;
      margin-top: 0%;
    }

    100% {
      height: 10%;
      margin-top: 25%;
    }
  }

  @keyframes bar3 {
    0% {
      margin-top: 25%;
      height: 10%;
    }

    50% {
      height: 100%;
      margin-top: 0%;
    }

    100% {
      height: 10%;
      margin-top: 25%;
    }
  }

  @keyframes bar4 {
    0% {
      margin-top: 25%;
      height: 10%;
    }

    50% {
      height: 90%;
      margin-top: 0%;
    }

    100% {
      height: 10%;
      margin-top: 25%;
    }
  }

  @keyframes bar5 {
    0% {
      margin-top: 25%;
      height: 10%;
    }

    50% {
      height: 70%;
      margin-top: 0%;
    }

    100% {
      height: 10%;
      margin-top: 25%;
    }
  }
}
</style>
