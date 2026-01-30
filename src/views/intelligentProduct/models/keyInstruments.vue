<template>
  <unit-card cardTitle="全流程水质仪表" cardType="4">
    <div class="process-container">
      <div class="pool-select">
        <radio-button @change="lineChange" :options="poolList" v-model="line"></radio-button>
      </div>

      <div class="process-flow">
        <div class="process-stages">
          <!-- Process boxes -->
          <div class="stage-boxes">
            <div v-for="(stage, index) in processStages" :key="index" :class="stage.classInfo" class="stage-box">
              <div class="stage-name">{{ stage.name }}</div>
              <div v-if="stage.isUp" class="stage-indicator"></div>
              <div v-if="index !== processStages.length - 1" class="stage-arrows"></div>
              <template v-if="stage.dictValue !== 'stage3'">
                <div :class="['stage-data_' + stage.dictValue, 'stage-data-box']">
                  <div v-for="(point, k) in stage['dataList']" :key="stage.dictValue + k" class="point-field">
                    <div class="label">{{ point.pointMemo }}</div>
                    <div class="pint-val">
                      <span class="real">{{ point.pointValue }}</span>
                      <span class="unit">{{ point.pointUnit }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="measurement-data">
                  <div class="measurement-box">
                    <div class="stage-data_stage1">
                      <div v-for="(point, k) in stage['dataList']" :key="stage.dictValue + k" class="point-field">
                        <div class="label">{{ point.pointMemo }}</div>
                        <div class="pint-val">
                          <span class="real">{{ point.pointValue }}</span>
                          <span class="unit">{{ point.pointUnit }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="measurement-box">
                    <div class="stage-data_stage1">
                      <div v-for="(point, k) in stage['dataList']" :key="stage.dictValue + k" class="point-field">
                        <div class="label">{{ point.pointMemo }}</div>
                        <div class="pint-val">
                          <span class="real">{{ point.pointValue }}</span>
                          <span class="unit">{{ point.pointUnit }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </unit-card>
</template>

<script>
import { getKeyInstrument } from '@/api/smartProduct.js';
import RadioButton from '@/views/smartProduct/components/RadioButton.vue';
export default {
  name: 'keyInstruments',
  components: {
    RadioButton,
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
      poolList: [
        { value: 2, label: '南池' },
        { value: 1, label: '北池' }
      ],
      line: 1,
      processStages: [
        {
          name: '进水',
          arrowColor: '#00a0e9',
          dictValue: 'stage2',
          classInfo: 'process-stage-1',
          isUp: true,
          dataList: []
        },
        {
          name: '五期缺氧段1',
          arrowColor: '#00c853',
          dictValue: 'stage2',
          classInfo: 'process-stage-1',
          isUp: true,
          dataList: []
        },
        {
          name: '五期交替段2',
          arrowColor: '#00c853',
          dictValue: 'stage2',
          classInfo: 'process-stage-1',
          isUp: true,
          dataList: []
        },
        {
          name: '五期高效精确加药',
          arrowColor: '#00c853',
          dictValue: 'stage1',
          classInfo: 'process-stage-1',
          isUp: true,
          dataList: []
        },
        {
          name: '出水',
          arrowColor: 'transparent',
          dictValue: 'stage2',
          classInfo: 'process-stage-1',
          isUp: true,
          dataList: []
        }
      ]
    };
  },
  watch: {
    waterPlantId: {
      handler(val) {
        if (val) {
          this.initWaterStatistics();
        }
      },
      immediate: true
    }
  },
  methods: {
    async initWaterStatistics() {
      let { resultData, status } = await getKeyInstrument(this.waterPlantId, this.line);
      if (status === 'complete') {
        this.processStages.forEach(item => {
          let data = resultData.find(res => res.deviceName === item.name);
          if (data) {
            item.dataList = data.dataList;
          }
        });
      }
    },
    lineChange(value) {
      this.initWaterStatistics();
    }
  }
};
</script>

<style lang="less" scoped>
.process-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  position: relative;
  margin-top: 4px;
}

.pool-select {
  position: absolute;
  top: 20px;
  left: 6px;
  z-index: 1000;
  cursor: pointer;
}

.process-flow {
  position: relative;
  padding: 20px 0;
  height: 100%;
}

.process-stages {
  position: relative;
  margin-top: 160px;
}

.stage-boxes {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  z-index: 1;
}

.stage-box {
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: AlibabaPuHuiTi_2_85_Bold, sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #eefeff;
  letter-spacing: 0;
  text-align: center;

  &.process-stage-1 {
    width: 240px;
    height: 47px;
    background: url('~@/assets/img/smartProduct/normal.png') no-repeat;
    background-size: 100% 100%;
  }
  &.process-stage-2 {
    width: 240px;
    height: 70px;
    background: url('~@/assets/img/smartProduct/anaerobic_aerobic_alternating_segment.png') no-repeat;
    background-size: 100% 100%;
    padding: 0 12px;
    .stage-arrows {
      top: 68%;
    }
  }
  &.process-stage-3 {
    width: 240px;
    height: 122px;
    background: url('~@/assets/img/smartProduct/outlet_drainage.png') no-repeat;
    background-size: 100% 100%;
    padding: 0 4px;
  }

  .stage-indicator {
    width: 16px;
    height: 37px;
    background: url('~@/assets/img/smartProduct/stage-indicator.png') no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: -37px;
    left: 50%;
    transform: translateX(-50%);
  }
  .stage-arrows {
    width: 160px;
    height: 38px;
    position: absolute;
    top: 50%;
    right: -140px;
    transform: translateY(-240%);
    z-index: 0;
    background: url('~@/assets/img/smartProduct/stage-arrows.png') no-repeat;
    background-size: 100% 100%;
  }
}
.stage-data-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 54px;
  background-image: linear-gradient(180deg, #11357d 0%, #000c2300 100%);
  overflow-y: auto;
  padding: 12px 1px;
}
.point-field {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 8px;
  .label {
    margin-right: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #d0e0ff;
    letter-spacing: 0;
    text-align: right;
  }
  .pint-val {
    display: flex;
    align-items: center;

    .real {
      line-height: 18px;
      font-family: MiSans-Medium, sans-serif;
      font-weight: 500;
      font-size: 16px;
      color: #d3e0fd;
      letter-spacing: 0;
      text-align: center;
    }
    .unit {
      margin-left: 2px;
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 12px;
      color: #f2ffff;
      letter-spacing: 0;
    }
  }
}
.stage-data_stage0 {
  display: none;
}
.stage-data_stage1 {
  top: -98px;
  width: 240px;
  height: 54px;
}
.stage-data_stage2 {
  top: -140px;
  width: 240px;
  height: 120px;
}
.stage-data_stage3 {
  top: -130px;
  width: 240px;
  height: 90px;
}
.stage-data_stage4 {
  top: -220px;
  width: 220px;
  height: 164px;
}

.measurement-data {
  position: absolute;
  left: 50%;
  top: -210px;
  transform: translateX(-50%);
  width: 150px;
  .measurement-box {
    display: flex;
    flex-direction: column;
    margin-top: 6px;
    .param {
      font-family: AlibabaPuHuiTi_2_55_Regular, sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #d0e0ff;
      letter-spacing: 0;
      text-align: left;
    }
    .stage-data_stage1 {
      width: 100%;
      height: 54px;
      background-image: linear-gradient(180deg, #11357d 0%, #000c2300 100%);
      overflow-y: auto;
      padding: 12px 10px;
    }
  }
}
</style>
