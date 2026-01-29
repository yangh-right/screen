<template>
  <div class="main-page">
    <div class="center-side-wrap">
      <div class="paramBox">
        <div class="bottom-wrap">
          <center-panel :showStage="showStage" :waterPlantId="waterPlantId" ref="top" />
        </div>
        <div class="left-side-wrap">
          <left-panel :showStage="showStage" :waterPlantId="waterPlantId" ref="left" />
        </div>
        <div class="right-side-wrap">
          <right-panel :showStage="showStage" :waterPlantId="waterPlantId" ref="right" />
        </div>
        <div class="center-slide">
          <smark-making
            :showStage="showStage"
            title="智慧决策"
            :waterPlantId="waterPlantId"
            ref="bottom"
          ></smark-making>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CenterPanel from './model/centerPanel.vue';
import LeftPanel from './model/leftPanel.vue';
import RightPanel from './model/rightPanel.vue';
import smarkMaking from './model/smarkMaking.vue';

export default {
  name: 'materialManage',
  components: {
    'center-panel': CenterPanel,
    'left-panel': LeftPanel,
    'right-panel': RightPanel,
    smarkMaking
  },
  data() {
    return {
      showStage: false,
      svgPreviewUrl: undefined,
      pointsArr: [
        {
          imgUrl: require('@/assets/img/materialManage/in_depot.png'),
          label: '入库单量',
          value: '187'
        },
        {
          imgUrl: require('@/assets/img/materialManage/out_depot.png'),
          label: '出库单量',
          value: '1356'
        },
        {
          imgUrl: require('@/assets/img/materialManage/quantity.png'),
          label: '调拨单量',
          value: '0'
        },
        {
          imgUrl: require('@/assets/img/materialManage/plan.png'),
          label: '需求计划',
          value: '9'
        },
        {
          imgUrl: require('@/assets/img/materialManage/in_depot_del.png'),
          label: '入库作废',
          value: '42'
        },
        {
          imgUrl: require('@/assets/img/materialManage/out_depot_del.png'),
          label: '出库作废',
          value: '10'
        }
      ],
      deviceList: [
        {
          name: '厌氧池',
          value: 1.48,
          top: 20,
          left: 20
        }
      ]
    };
  },
  computed: {
    ...mapState('setting', ['waterPlantId'])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.showStage = true;
    });
  },
  beforeRouteLeave(to, from, next) {
    this.showStage = false;
    setTimeout(() => {
      next();
    }, 800);
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
  }

  .paramBox {
    width: 100%;
    height: 100%;
    background: url('~@/assets/img/hz/property-bg.png') no-repeat;
    background-size: 100% 100%;
    padding: 10px 20px 10px 20px;
    box-sizing: border-box;
  }
  .bottom-wrap {
    position: absolute;
    left: 500px;
    width: calc(100% - 980px);
    z-index: 999;
  }
  .center-slide {
    position: absolute;
    top: 380px;
    left: 500px;
    width: calc(100% - 532px);
    height: 576px;
  }

  // 组态右侧
  .right-side-wrap {
    z-index: 999;
    position: absolute;
    width: 442px;
    right: 22px;

    .box {
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
  // 组态右侧
  .left-side-wrap {
    z-index: 999;
    position: fixed;
    width: 442px;
    left: 38px;

    .box {
      width: 100%;
      height: 100%;
      margin-top: 10px;
    }
  }
}
</style>
