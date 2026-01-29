<!--
 * @Author: wangyr
 * @Date: 2023-03-13 09:00:44
 * @LastEditors: wangyr
 * @LastEditTime: 2024-08-21 14:17:19
 * @Description:
-->
<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'right_panel']">
    <digital-results
      title="企业荣誉"
      :class="[showStage ? 'one' : 'oneOut', 'water-module']"
      :waterPlantId="waterPlantId"
    />
    <social-responsibility
      title="产品布局"
      :class="[showStage ? 'two' : 'twoOut', 'medicine-module']"
      :waterPlantId="waterPlantId"
    />
    <culture-building
      title="企业文化"
      :class="[showStage ? 'three' : 'threeOut', 'culture-module']"
      :waterPlantId="waterPlantId"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DigitalResults, SocialResponsibility, CultureBuilding } from '../components';

export default {
  name: 'ThinkPanel',
  components: {
    DigitalResults,
    SocialResponsibility,
    CultureBuilding
  },
  props: {
    showStage: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      info: {
        profile: null,
        area: [],
        house: []
      }
    };
  },
  computed: {
    ...mapState('setting', ['waterPlantId'])
  }
};
</script>

<style lang="less" scoped>
.right_panel {
  height: 100%;
  width: 452px;
  display: flex;
  flex-direction: column;
  background: rgba(14, 35, 67, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 12px 0px;
  box-sizing: border-box;
  background-size: 100% 100%;
  position: relative;

  > div {
    position: relative;
    width: 452px;
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
    padding: 0 12px;
    box-sizing: border-box;
  }

  .water-module {
    height: 350px;
  }
  .medicine-module {
    height: 350px;
  }
  .culture-module {
    height: 350px;
  }

  > div:nth-last-child(1) {
    margin-bottom: 0;
  }
}
.in {
  animation: right-to-left 1s ease-in-out 1;
  animation-fill-mode: forwards;
}

.out {
  right: 0;
  animation: right-to-left-hide 1s ease-in-out 1;
  animation-fill-mode: forwards;
}

.one:extend(.in),
.oneOut:extend(.out) {
  animation-delay: 0s;
}

.two:extend(.in),
.twoOut:extend(.out) {
  animation-delay: 0.25s;
}

.three:extend(.in),
.threeOut:extend(.out) {
  animation-delay: 0.5s;
}

.four:extend(.in),
.fourOut:extend(.out) {
  animation-delay: 0.75s;
}

@keyframes right-to-left {
  from {
    right: -486px;
  }
  to {
    right: 0;
  }
}

@keyframes right-to-left-hide {
  from {
    right: 0;
  }
  to {
    right: -486px;
  }
}
</style>
