<template>
  <div class="content">
    <div class="content-title">
      <div class="title">{{ title }}</div>
    </div>
    <div class="card-inner">
      <div class="card-inner-left">
        <div class="num">{{ total }}</div>
        <img src="@/assets/img/materialManage/warse_acount.png" alt="" />
        <div class="text">仓库总数</div>
      </div>
      <div class="card-inner-right">
        <div v-for="item in warseList" :key="item.name" class="list">
          <div class="top">
            <div class="name">{{ item.name }}</div>
            <div class="value">{{ item.value }}</div>
          </div>
          <div class="percent">
            <div
              class="inner"
              :style="{ background: item.linearColor, width: item.percent + '%', height: '100%' }"
            ></div>
            <div
              class="split"
              :style="{
                width: '5px',
                height: '12px',
                position: 'absolute',
                left: item.percent + '%',
                top: '-3px',
                background: item.color
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCountAnalysis } from '@/api/materialManage.js';
export default {
  name: 'PowerAnalysis',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cardTitle: '',
      total: 0,
      warseList: [
        {
          name: '仓库报警数量',
          value: 0,
          percent: 0,
          linearColor: 'linear-gradient(to right,#3a3e4b 0,#f0ca8e 100%)',
          color: 'linear-gradient(to left,#3a3e4b 0,#eddeba 100%)'
        },
        {
          name: '仓库安全数量',
          value: 0,
          percent: 0,
          linearColor: 'linear-gradient(to right,#3a465d 0,#9ce3ff 100%)',
          color: 'linear-gradient(to left,#3a465d 0,#9ce3ff 100%)'
        }
      ]
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const { success, resultData } = await getCountAnalysis();
      if (success) {
        this.warseList[0].value = resultData.alarmCount;
        this.warseList[0].percent = (resultData.alarmCount / resultData.count) * 100;
        this.warseList[1].value = resultData.safeCount;
        this.warseList[1].percent = (resultData.safeCount / resultData.count) * 100;
        this.total = resultData.count;
      }
    }
  },
  created() {}
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;

  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 12px 15px 0;
    height: 47px;
    background: url('~@/assets/img/hz/card-title.png') no-repeat;
    background-size: 100% 100%;
    .title {
      margin: 0;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 20px 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    &-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 40%;
      .num {
        font-family: DINAlternate-Bold, sans-serif;
        color: #9ce3ff;
        font-size: 42.5px;
        letter-spacing: 0.66px;
        text-align: center;
        text-shadow: 0 0 5px #dbe7ff99;
      }
      img {
        margin-top: -32px;
        width: 137.6px;
        height: 47.74px;
      }
      .text {
        margin-top: 10px;
        font-family: DINAlternate-Bold, sans-serif;
        color: #9ce3ff;
        font-size: 17px;
        letter-spacing: 0.27px;
        text-align: center;
      }
    }
    &-right {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      width: 58%;
      .list {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .name {
            font-weight: 400;
            font-size: 16px;
            color: #9ce3ff;
            letter-spacing: 0.25px;
          }
          .value {
            font-size: 20.4px;
            color: #9ce3ff;
            letter-spacing: 0.32px;
            text-align: right;
            text-shadow: 0 0 4px #edae3233;
          }
        }
        .percent {
          position: relative;
          width: 100%;
          height: 8px;
          border: 1px solid #ecf2ff1a;
          .inner {
          }
        }
      }
      .list:first-child {
        .value {
          color: #ffc167;
        }
      }
    }
  }
}
</style>
