<!--
 * @Author: wangyr
 * @Date: 2023-09-04 14:29:16
 * @LastEditors: wangyr
 * @LastEditTime: 2025-04-09 09:12:50
 * @Description:
-->
<template>
  <unit-card cardTitle="污水百问" cardType="7">
    <div class="content-wrapper">
      <div class="section">
        <div class="section-header">安全制度</div>
        <div class="section-content">
          <div v-for="(item, index) in safeData" :key="index" @click="showDetail(item)" class="subsection">
            <h3>{{ item.title }}</h3>
          </div>
        </div>
        <div class="section-bg"></div>
      </div>

      <div class="section">
        <div class="section-header">紧急预案</div>
        <div class="section-content">
          <div v-for="(item, index) in planData" :key="index" @click="showDetail(item)" class="subsection">
            <h3>{{ item.title }}</h3>
          </div>
        </div>
        <div class="section-bg"></div>
      </div>
    </div>

    <a-modal
      :visible="visible"
      @cancel="handleClose"
      :footer="null"
      :closable="false"
      :maskClosable="true"
      :width="460"
      :destroyOnClose="true"
      class="image-preview-modal"
    >
      <div class="modal-content" @click="handleClose">
        <div class="section">
          <div class="section-header">{{ currentData.title }}</div>
          <div class="section-content">
            <div
              v-for="(item, index) in currentData?.content"
              :key="index"
              @click="showDetail(item)"
              class="subsection"
            >
              <h3 v-if="item.title != ''">{{ item.title }}</h3>
              <p>{{ item.label }}</p>
            </div>
          </div>
          <div class="section-bg"></div>
        </div>
      </div>
    </a-modal>
  </unit-card>
</template>

<script>
import { safeData, planData } from './constants';
export default {
  name: 'purificationQuestion',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      safeData: safeData,
      planData: planData,
      visible: false,
      currentData: {}
    };
  },
  mounted() {},
  methods: {
    showDetail(data) {
      this.visible = true;
      this.currentData = data;
    },
    handleClose() {
      this.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.content-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px 0 12px;
  box-sizing: border-box;
  position: relative;

  .section {
    width: 204px;
    height: 279px;
    background: url('~@/assets/img/summaryOverview/fir_water_purification.png') no-repeat;
    background-size: 100% 100%;
    position: relative;

    .section-header {
      font-family: PangMenZhengDao, sans-serif;
      font-weight: 600;
      font-size: 18px;
      letter-spacing: 1px;
      text-align: center;
      background: linear-gradient(to bottom, #f3f9ff 50%, #4794ff);
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      margin-top: 2px;
    }

    .section-content {
      height: calc(100% - 38px);
      padding: 0 6px;
      box-sizing: border-box;
      margin-top: 24px;
      overflow-y: auto;

      .subsection {
        text-align: left;
        line-height: 1.5;
        h3,
        p {
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 15px;
          color: #adc7f0;
          letter-spacing: 0;
          cursor: pointer;
        }
      }
    }
    .section-bg {
      position: absolute;
      bottom: -26px;
      left: 0;
      width: 100%;
      height: 60px;
      background: linear-gradient(to bottom, rgba(5, 39, 87, 0.3) 50%, rgba(4, 57, 99, 0.7));
    }
  }
}
.image-preview-modal {
  :deep(.ant-modal-content) {
    background: transparent;
    box-shadow: none;

    .ant-modal-close {
      color: #fff;

      &:hover {
        color: #e6e5f7;
      }
    }

    .ant-modal-body {
      padding: 0;
    }
  }
}
.modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 20px;

  .section {
    width: 504px;
    height: 479px;
    background: url('~@/assets/img/summaryOverview/fir_water_purification.png') no-repeat;
    background-size: 100% 100%;
    position: relative;

    .section-header {
      font-family: PangMenZhengDao, sans-serif;
      font-weight: 600;
      font-size: 24px;
      letter-spacing: 1px;
      text-align: center;
      background: linear-gradient(to bottom, #f3f9ff 50%, #4794ff);
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      margin-top: 8px;
    }

    .section-content {
      height: calc(100% - 38px);
      padding: 0px 20px 20px 20px;
      box-sizing: border-box;
      margin-top: 44px;
      overflow-y: auto;

      .subsection {
        text-align: left;
        line-height: 1.5;
        h3,
        p {
          font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
          font-weight: 400;
          font-size: 18px;
          color: #adc7f0;
          letter-spacing: 0;
          cursor: pointer;
        }
      }
    }
    .section-bg {
      position: absolute;
      bottom: -54px;
      left: 0;
      width: 100%;
      height: 60px;
      background: linear-gradient(to bottom, rgba(5, 39, 87, 0.3) 50%, rgba(4, 57, 99, 0.7));
    }
  }
}
</style>
