<template>
  <unit-card cardTitle="智慧问答" cardType="7">
    <div class="content-wrapper">
      <div class="input-wrapper">
        <div class="input-title">您好，我是智慧水宝宝</div>
        <div class="description">尊敬的用户，欢迎踏上智慧之旅，智慧水宝宝将为您指引方向。</div>
        <div class="input-box">
          <div class="input-box-title">您可以试着问我</div>
          <div class="input-box-content">
            <div class="question-item">
              <div class="question-item-title">设备故障频发</div>
              <div class="question-item-content">
                <div class="question-item-content-item">
                  在过去的一个月中，泵类设备故障发生了8次，导致污水处理流程中断平均每次2小时。
                </div>
                <div class="question-item-content-item">
                  搅拌器设备故障导致生化池内污泥混合不均匀，影响了污泥的沉降性能，发生了3次故障。
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="question-input">
          <a-input ref="input" @focus="handleFocus" class="question-in" placeholder="" />
          <div class="submit-btn" @click="visible = true"></div>
        </div>
      </div>
    </div>
    <chatbots :visible.sync="visible" />
  </unit-card>
</template>

<script>
import chatbots from './chatbots.vue';
export default {
  name: 'smartQa',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue'),
    chatbots
  },
  data() {
    return {
      activeTab: 'inflow-quality',
      indicators: [],
      visible: false,
      keyword: ''
    };
  },
  methods: {
    handleFocus() {
      this.visible = true;
      // 失去焦点
      this.$refs.input.blur();
    }
  }
};
</script>

<style lang="less" scoped>
.content-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 10px 8px 0 8px;
  box-sizing: border-box;

  .input-wrapper {
    width: 100%;
    height: 100%;
    background: url('~@/assets/img/summaryOverview/fir_smart_qa.png') no-repeat;
    background-size: 100% 100%;
    padding: 10px 16px 0 16px;
    box-sizing: border-box;
    .input-title {
      font-family: Aliba, sans-serif;
      font-weight: 600;
      font-size: 24px;
      color: #bddeff;
    }
    .description {
      font-family: Aliba, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #76b9f3;
    }
    .input-box {
      margin-top: 4px;
      padding: 10px 12px 0 12px;
      box-sizing: border-box;
      .input-box-title {
        font-family: PangMenZhengDao, sans-serif;
        font-weight: 3;
        font-size: 20px;
        color: #529fff;
      }
    }
    .question-item-title {
      width: 114px;
      height: 28px;
      background: url('~@/assets/img/summaryOverview/fir_rectangle_s.png') no-repeat;
      background-size: 100% 100%;
      font-family: PingFangSC, sans-serif;
      font-weight: 600;
      font-size: 14px;
      color: #ddeeff;
      text-align: center;
      line-height: 28px;
    }
    .question-item-content-item {
      padding-left: 14px;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 4px;
        background: #26a8d3;
        border-radius: 50%;
      }
      font-family: Aliba, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #acc6f2;
      margin-top: 8px;
    }
    .question-input {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
      .question-in {
        width: 362px;
        height: 28px;
        background: #0d2d55;
        border-radius: 14px;
        font-family: Aliba, sans-serif;
        font-size: 14px;
        color: #d9ecff;
      }
      .submit-btn {
        width: 28px;
        height: 28px;
        background: url('~@/assets/img/summaryOverview/fir_post.png') no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
  }
}
</style>
