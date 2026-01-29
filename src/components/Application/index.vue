<template>
  <div class="--app" :class="{ 'is-fit': isFit, 'is-fixed': isFixed, 'is-full': isFull }">
    <div ref="appRef" class="layout">
      <div id="layout" ref="screenRef" class="--screen">
        <div class="layout-header">
          <header-cmp />
        </div>
        <div v-if="showContent" class="layout-content">
          <router-view />
        </div>
        <div class="layout-menu">
          <menu-cmp />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderCmp from '@/views/utils/topHeaderModule';
import MenuCmp from '@/views/utils/botTabModule';
import fitMixin from './fit';

export default {
  name: 'PageLayout',
  components: {
    HeaderCmp,
    MenuCmp
  },

  mixins: [fitMixin],

  props: {
    animate: Boolean,
    theme: String,
    header: {
      type: Object,
      default: () => {}
    },
    footer: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      grid: {
        w: 4,
        h: 3
      }
    };
  }
};
</script>

<style lang="less" scoped>
.--app {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .--debug {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .--h {
      display: flex;
    }

    .--w {
      border: 1px solid #f00;
    }
  }

  &.is-fixed {
    display: flex;
    align-items: center;
    justify-content: center;

    .layout {
      position: fixed;
      transform-origin: center center;
    }
  }

  &.is-fit {
    position: relative;

    .layout {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .--screen {
      transform-origin: top left;
    }
  }

  &.is-full {
    .layout {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }

  .--screen {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .layout {
    overflow: hidden;
    background-color: #011517 !important;

    &-header {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 14;
      flex: none;
      width: 100%;
    }

    &-content {
      width: 100%;
      height: 100%;
    }

    &-menu {
      position: absolute;
      right: 0;
      bottom: 32px;
      left: 0;
      z-index: 12;
      display: flex;
      justify-content: center;
      pointer-events: none;
    }
  }
}
</style>
