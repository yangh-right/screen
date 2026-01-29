<!--
 * @Description: 发展历程时间线组件
 * @version:
 * @Author: fengtaotao
 * @Date: 2025-03-21 15:46:22
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-26 09:47:03
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="card-inner">
      <div class="timeline-container">
        <!-- 背景图片 -->
        <div class="timeline-bg">
          <img src="@/assets/img/smartTalents/history_bg.png" alt="发展历程背景" />
        </div>

        <!-- 时间线主体 -->
        <div class="timeline-main">
          <!-- 里程碑节点 -->
          <div
            v-for="(milestone, index) in milestones"
            :key="index"
            class="milestone-node"
            :class="`milestone-${index + 1}`"
          >
            <template v-if="index === 0 || index === 1 || index === 5">
              <div class="node-marker"></div>
              <div class="node-content">
                <div class="year">{{ milestone.year }}</div>
                <div class="description">{{ milestone.description }}</div>
              </div>
            </template>
            <template v-else>
              <div class="node-content">
                <div class="year">{{ milestone.year }}</div>
                <div class="description">{{ milestone.description }}</div>
              </div>
              <div class="node-marker"></div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
export default {
  name: 'OperatingResults',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    title: {
      type: String,
      default: '发展历程'
    },
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      milestones: [
        {
          year: '1959年',
          description: '1000吨供水能力建成运行'
        },
        {
          year: '1959年',
          description: '100吨水塔建成运行'
        },
        {
          year: '1959年',
          description: '1995年、2000年高镇水厂一期、二期各2万吨建成运行'
        },
        {
          year: '2005年',
          description: '2005年、2012年南山水厂一期、二期各30万吨建成运行'
        },
        {
          year: '2006年',
          description:
            '2006年启动城西污水处理有限公司建设,2008年、2014年、2017年、2021年污水九厂一期、二期、三期、四期各4万吨建成运行'
        },
        {
          year: '2008年',
          description: '2008年桥下水厂扩建改造3.75万吨建成运行;2022年桥下水厂扩建6万吨建成运行'
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.card-inner {
  width: 100%;
  height: calc(100% - 34px);
  position: relative;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.timeline-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.timeline-bg {
  width: 276px;
  height: 96px;
  position: absolute;
  top: 90px;
  right: 0px;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
  }
}

.timeline-main {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100%; /* 使用min-height而不是固定height */
  padding: 20px;
  box-sizing: border-box;
}

.milestone-node {
  z-index: 3;
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px; /* 添加间距避免节点重叠 */
  position: absolute;

  .node-marker {
    width: 56px;
    height: 55px;
    background: url('~@/assets/img/smartTalents/history_bar.png') no-repeat;
    background-size: 100% 100%;
  }

  .node-content {
    display: flex;
    flex-direction: column;

    .year {
      font-family: Aliba;
      font-weight: 700;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
    }

    .description {
      font-family: Aliba;
      font-weight: 400;
      font-size: 12px;
      color: #c1d3f6;
      letter-spacing: 0;
    }
  }
}

.milestone-1 {
  top: 14%;
  left: 24%;
  .node-content {
    margin-left: -14px;
  }
}

.milestone-2 {
  top: 6%;
  right: 0%;
  .node-content {
    margin-right: -14px;
  }
}

.milestone-3 {
  top: 38%;
  left: 0%;
  .node-content {
    width: 150px;
    margin-right: -14px;
    .year {
      text-align: right;
    }
  }
}

.milestone-4 {
  top: 35%;
  right: -4%;
  .node-content {
    width: 156px;
    margin-right: -14px;
    .year {
      text-align: right;
    }
  }
}

.milestone-5 {
  top: 62%;
  left: 0%;
  .node-content {
    width: 174px;
    margin-right: -14px;
    .year {
      text-align: right;
    }
  }
}

.milestone-6 {
  top: 74%;
  right: 0%;
  .node-content {
    width: 174px;
    margin-left: -14px;
  }
}
</style>
