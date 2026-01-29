<!--
 * @Description:
 * @version:
 * @Author: fengtaotao
 * @Date: 2025-03-21 15:46:22
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-03-26 09:47:03
-->
<template>
  <unit-card :cardTitle="title" :showTime="false">
    <div class="org-chart">
      <!-- 主公司 -->
      <div class="main-company">
        <span class="company-name">{{ mainCompany }}</span>
      </div>

      <!-- 部门和子公司 - 竖向展示 -->
      <div class="departments-container">
        <div
          v-for="(dept, index) in departments"
          :key="index"
          class="department-item"
          @click="selectDepartment(dept)"
          :class="{ active: selectedDepartment === dept.name }"
        >
          <span class="dept-name">{{ dept.name }}</span>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
export default {
  name: 'BusinessCoverage',
  components: {
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    title: {
      type: String,
      default: '企业构成'
    },
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mainCompany: '永康市钱江水务有限公司',
      selectedDepartment: '',
      departments: [
        { name: '党群办', type: 'department' },
        { name: '总经办', type: 'department' },
        { name: '财务部', type: 'department' },
        { name: '企管部', type: 'department' },
        { name: '人力资源部', type: 'department' },
        { name: '技术保障部', type: 'department' },
        { name: '调度中心', type: 'department' },
        { name: '工程安全部', type: 'department' },
        { name: '水质部', type: 'department' },
        { name: '投资发展部', type: 'department' },
        { name: '技术中心', type: 'department' },
        { name: '制水分公司', type: 'subsidiary' },
        { name: '污水分公司', type: 'subsidiary' },
        { name: '营业分公司', type: 'subsidiary' },
        { name: '安装公司', type: 'subsidiary' },
        { name: '芝水公司', type: 'subsidiary' }
      ]
    };
  },
  methods: {
    selectDepartment(dept) {
      this.selectedDepartment = dept.name;
      // 可以在这里添加点击部门后的逻辑
      console.log('选中部门:', dept);
    }
  }
};
</script>

<style lang="less" scoped>
.org-chart {
  width: 100%;
  height: calc(100% - 10px);
  position: relative;
  background-image: url('~@/assets/img/smartTalents/company_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.main-company {
  position: absolute;
  top: calc(12% - 1px);
  left: 48%;
  transform: translateX(-50%);
  z-index: 10;
}

.company-name {
  white-space: nowrap;
  font-family: Aliba;
  font-weight: 700;
  font-size: 18px;
  color: #ebf2ff;
  letter-spacing: 0;
  text-align: center;
  text-shadow: 0 3px 6px #00000080;
}

// 修改部门容器样式，实现竖向展示
.departments-container {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  z-index: 10;
}

.department-item {
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  padding: 82px 10px 4px 10px;
  width: 6.25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.department-item:hover {
  transform: translateY(-5px);
}

.department-item.active {
  transform: translateY(-8px);
}

.dept-name {
  display: block;
  text-align: center;
  font-family: Aliba;
  font-weight: 500;
  font-size: 14px;
  color: #b8cef3;
  letter-spacing: 0;
}
</style>
