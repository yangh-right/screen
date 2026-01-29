<template>
  <div class="mainDeviceModal">
    <div class="title">
      <span class="text">视频回放列表</span>
      <a-icon type="close" style="font-size: 16px; color: #fff" @click="closeModal" />
      <div class="time-box">
        查询时间：
        <a-date-picker
          dropdownClassName="video-picker"
          v-model="recordDate"
          size="small"
          @change="onChange"
          :showToday="false"
          :disabled-date="disabledDate"
        />
      </div>
    </div>
    <div class="main-device-box">
      <div class="table-block">
        <div class="table-head">
          <div class="img-info">文件名</div>
          <div class="remark">备注</div>
          <div class="opertion">操作</div>
        </div>
        <div class="table-body">
          <div v-for="(item, i) in tableData" :key="i" class="table-tr">
            <div class="img-info">{{ item.videoName }}</div>
            <div class="remark">{{ item.content }}</div>
            <div class="opertion">
              <div @click="viewVideoBack(item)" class="person-line">查看</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <video-back v-if="videoVisible" :videoInfo="videoInfo" @closeVideo="closeVideo"></video-back>
  </div>
</template>

<script>
import moment from 'moment';
import videoBack from './videoBack.vue';
import { getVideoList } from '@/api/realTimePositioning.js';

export default {
  name: 'personnelVideoList',
  components: { videoBack },
  props: {
    tokenLogin: {
      type: String,
      default: ''
    },
    personInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tableData: [],
      videoVisible: false,
      videoInfo: {},
      recordDate: moment().startOf('day')
    };
  },
  computed: {},
  watch: {
    personInfo: {
      immediate: true,
      handler(newVal, oldVal) {
        if (Object.keys(newVal).length) {
          this.initData();
        }
      }
    }
  },
  methods: {
    async initData() {
      let params = {
        aminId: '11295',
        uid: this.personInfo.userId,
        year: moment(this.recordDate).format('YYYY'),
        month: moment(this.recordDate).format('M'),
        day: moment(this.recordDate).format('D'),
        token: this.tokenLogin
      };
      const { success, resultData } = await getVideoList(params);
      if (success) {
        this.tableData = resultData.map(item => {
          let videoArr = item.url.split('/');
          let videoName = videoArr[videoArr.length - 1];
          let time = moment.unix(item.ctime).format('YYYY-MM-DD HH:mm:ss');
          return {
            name: videoName,
            videoName: `视频${item.id}: ${videoName} ${time}`,
            ...item
          };
        });
      }
    },
    disabledDate(current) {
      return current && current > moment().endOf('day');
    },
    onChange(date, dateString) {
      this.initData();
    },
    viewVideoBack(data) {
      this.videoVisible = true;
      this.videoInfo = data;
    },
    closeModal() {
      this.$emit('closeModal');
    },
    closeVideo() {
      this.videoVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.mainDeviceModal {
  position: fixed;
  top: 15%;
  transform: translateX(-50%);
  left: 50%;
  width: 800px;
  height: 600px;
  z-index: 1000;
  border-radius: 4px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.5);
  background: #03172738;
  background-image: linear-gradient(90deg, rgba(8, 20, 45, 0.7) 0%, rgba(1, 11, 33, 0.82) 100%);
  .title {
    align-items: center;
    padding: 0 6px 0 12px;
    height: 40px !important;
    display: flex;
    background: url('~@/assets/img/position/sub_title_bg.png') no-repeat;
    background-size: 100% 100%;
    justify-content: space-between;
    position: relative;
    .text {
      line-height: normal;
      font-weight: 700;
      font-family: JiangChengXieHei, sans-serif;
      font-size: 20px;
      text-indent: 20px;
      background-image: linear-gradient(to bottom, #58c0ff, #ffffff, #ffffff);
      -webkit-background-clip: text;
      color: transparent;
    }
    .time-box {
      display: flex;
      align-items: center;
      position: absolute;
      right: 50px;
      top: 2px;
      color: #ffffff;
    }
  }
  /deep/ .ant-input {
    height: 30px !important;
    color: #b2dfff;
  }
  /deep/ .anticon-calendar {
    color: #b2dfff;
  }

  .main-device-box {
    padding: 0 10px;
    width: 100%;
    height: calc(100% - 40px);

    .table-block {
      width: 100%;
      height: 880px;
      padding-top: 6px;
      box-sizing: border-box;
      div {
        font-family: PingFangSC, sans-serif;
        font-weight: 400;
        font-size: 14px;
        color: #b2dfff;
        letter-spacing: 0;
      }

      .table-head {
        height: 34px;
        display: flex;
        align-items: center;
        background: url('~@/assets/img/warnPredict/alarm_header.png') no-repeat;
        background-size: 100% 100%;
        background-color: transparent !important;
        font-size: 14px;

        div {
          background: url('~@/assets/img/warnPredict/arrow-bottom.png') no-repeat;
          background-size: 9px 6px;
          background-position: bottom center;
          padding: 0 !important;
          text-align: center;
          height: 100%;
          line-height: 34px;
        }
        .img-info {
          flex: 2;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .remark {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .opertion {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .table-body {
        width: 100%;
        height: calc(100% - 364px);
        overflow: auto;

        .file-item {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .table-tr {
          height: 36px;
          display: flex;
          align-items: center;
          background: url('~@/assets/img/hz/table-de.png') no-repeat;
          background-size: 100% 100%;
          margin-top: 4px;
          .img-info {
            flex: 2;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: center;
          }
          .remark {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: center;
          }
          .opertion {
            flex: 1;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .person-line {
              flex: 1;
              text-align: center;
              color: #2efffe;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.ant-calendar-disabled-cell .ant-calendar-date {
  background: transparent !important;
}
</style>
