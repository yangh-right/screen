<!--
 * @Description: 企业文化建设模块
 * @version:
 * @Author: fengtaotao
 * @Date: 2025-03-21 15:46:22
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-26 09:47:03
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="culture-container">
      <div class="culture-content">
        <div v-for="(item, index) in cultureItems" :key="index" class="culture-item">
          <div :class="[`item-title-${index + 1}`]" class="item-title">{{ item.title }}</div>
          <div class="item-description">{{ item.description }}</div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
export default {
  name: 'CultureBuilding',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    title: {
      type: String,
      default: '企业文化建设'
    },
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cultureItems: [
        {
          title: '企业愿景',
          description: '打造省内乃至国内行业一流标杆'
        },
        {
          title: '企业使命',
          description: '碧水白鹭映丽州'
        },
        {
          title: '服务宗旨',
          description: '供水服务连万家 真情服务你我他'
        },
        {
          title: '核心价值观',
          description: '悟水之道 善水之德'
        },
        {
          title: '企业精神',
          description: '团结 诚信 务实 奋进'
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.culture-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url('~@/assets/img/smartTalents/culture_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  padding: 16px 20px;
  box-sizing: border-box;
}

.culture-content {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
}

.culture-item {
  display: flex;
  align-items: center;
  position: relative;
  line-height: 42px;
  margin-top: 6px;
}

.item-title {
  font-family: Aliba;
  font-weight: 700;
  font-size: 16px;
  color: #e8f3ff;
  letter-spacing: 0;
  margin-left: 50px;
}
.item-title-1 {
  /* margin-left: 20px; */
}
.item-title-2 {
  margin-left: 74px;
}
.item-title-3 {
  margin-left: 116px;
}
.item-title-4 {
  margin-left: 74px;
}
.item-title-5 {
  /* margin-left: 20px; */
}

.item-description {
  font-family: Aliba;
  font-weight: 400;
  font-size: 14px;
  color: #b8cef3;
  letter-spacing: 0;
  margin-left: 12px;
}
</style>
