<template>
  <div class="main-page">
    <div class="center-side-wrap">
      <div class="paramBox">
        <div v-for="item in cardList" :key="item.key" :class="[item.colSpan === 1 ? 'row-box' : 'row-secord']">
          <left-panel
            v-if="item.key === 'leftPanel'"
            :waterPlantId="waterPlantId"
            :sourceTypeList="sourceTypeList"
          ></left-panel>
          <center-panel v-if="item.key === 'centerPanel'" :waterPlantId="waterPlantId"></center-panel>
          <right-panel
            v-if="item.key === 'rightPanel'"
            :waterPlantId="waterPlantId"
            :sourceTypeList="sourceTypeList"
          ></right-panel>
        </div>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { sourceTypeAnalysis } from '@/api/carbonEmission.js';
import leftPanel from './model/leftPanel.vue';
import centerPanel from './model/centerPanel.vue';
import rightPanel from './model/rightPanel.vue';
import { isArray } from 'lodash-es';

export default {
  name: 'carbonEmission',
  components: {
    leftPanel,
    centerPanel,
    rightPanel
  },
  data() {
    return {
      cardList: [
        {
          key: 'leftPanel',
          cardName: 'left',
          colSpan: 1
        },
        {
          key: 'centerPanel',
          cardName: 'center',
          colSpan: 2
        },
        {
          key: 'rightPanel',
          cardName: 'right',
          colSpan: 1
        }
      ],
      sourceTypeList: []
    };
  },
  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  watch: {
    waterPlantId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initData();
        }
      }
    }
  },
  methods: {
    async initData() {
      this.sourceTypeList = [];
      let params = {
        waterPlantId: this.waterPlantId
      };
      const { status, resultData } = await sourceTypeAnalysis(params);
      if ((status === 'complete' && Array, isArray(resultData) && resultData.length > 0)) {
        this.sourceTypeList = resultData.sort((a, b) => b.typeValue - a.typeValue);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.main-page {
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/hz/screen-bg.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: 0;
  left: 0;

  .center-side-wrap {
    height: calc(100% - 98px);
    width: 100%;
    position: absolute;
    left: -10px;
    top: 90px;
    padding: 0 6px 11px 26px;
    box-sizing: border-box;
    z-index: 3;

    .paramBox {
      width: 100%;
      height: 100%;
      background: url('~@/assets/img/hz/property-bg.png') no-repeat;
      background-size: 100% 100%;
      padding: 10px 20px 10px 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;

      .row-box {
        width: calc(25% - 15px);
        height: 100%;
        background: url('~@/assets/img/hz/card-bg.png') no-repeat;
        background-size: 100% 100%;
      }
      .row-secord {
        width: calc(50% - 15px);
        height: 100%;
        background: url('~@/assets/img/hz/card-bg.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
    background-image: radial-gradient(rgba(128, 174, 255, 0) 0, rgba(1, 9, 23, 0.6) 65%, rgba(1, 9, 23, 0.57) 100%);
  }
}
</style>
