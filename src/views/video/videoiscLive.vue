<template>
  <div ref="videoWrapper" class="video-wrapper">
    <div v-show="showMessage" class="massage">
      <div class="_message">
        <a-spin v-if="!downloadFlag" class="loading" size="large" />
        <a-icon v-if="downloadFlag" type="ic_cloud_download" style="color: #fff; font-size: 40px" />
        <div class="fs16">{{ message }}</div>
        <h2 v-if="downloadFlag">
          <a class="down" download="VideoWebPlugin.exe" :href="url">下载插件</a>
        </h2>
      </div>
    </div>
    <div :id="videoBoxId" :ref="videoBoxId" class="playWnd"></div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { getISCConf, getYSISCConf } from '@/api/video';
import { getWidthScale, getHeightScale } from '@/utils/tools';
import { debounce } from 'lodash';
import { videoEvent } from '@/vuex/modules/video';

// import { debounce } from "throttle-debounce";

const semver = require('semver');
import moment from 'moment';
export default {
  name: 'ISCLIVE',

  props: {
    type: {
      default: '3',
      type: String
    },
    videoBoxId: {
      default: 'playWnd',
      type: String
    },
    videoCode: {
      type: String
    },
    videoDeviceOnline: {
      type: String
    },
    showPlugin: {
      type: Boolean,
      default: true
    },
    playType: {
      type: String,
      default: '1'
    },
    showToolbar: {
      type: Number,
      default: 1
    },
    route: {
      type: String
    },
    queryTime: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      oWebControl: null,
      innerCameraCode: '',
      hadInit: false,
      videoW: 0,
      videoH: 0,
      initCount: 0,
      message: '',
      downloadFlag: false,
      showMessage: false,
      streamMode: 1,
      pubKey: '',
      iscConfig: {
        appkey: '', // API网关提供的appkey
        ip: '', // API网关IP地址
        port: 443, // 端口
        secret: 'mxG7P12FnOZa76Js0mXZ',
        transMode: 1 // 传输协议：0-UDP，1-TCP
      },
      wndNum: '', // 视频播放个数,
      // videoCode: "",
      // videoDeviceOnline: "0",
      isFullScreen: false
    };
  },

  computed: {
    ...mapState('video', ['hideVideo']),
    ...mapState('resize', ['wScale', 'hScale']),
    ...mapState('busi', ['pluginDownLoadUrl']),
    scale() {
      return this.wScale + this.hScale;
    },
    url() {
      if (this.pluginDownLoadUrl.hk_palyer_isc) {
        return this.pluginDownLoadUrl.hk_palyer_isc.dictValue;
      } else {
        return 'https://water.cloud4water.com/plugin/VideoWebPlugin-1.5.2-new.exe';
      }
    }
  },
  watch: {
    scale() {
      debounce(() => {
        setTimeout(() => {
          this.handleResize();
        }, 1000);
      }, 150)();
    },
    videoCode: {
      handler(val) {
        // 此处传入val，是为了避免videoCode刚开始为undefined，赋值后undefined后续处理为异步取到了新值处理导致重复请求
        this.refresh(val);
        videoEvent.$emit('selectWnd', { code: val, key: this.route });
      },
      immediate: true
    },
    async playType() {
      // this.refresh();
      await this.playerUninit();
      this.playerInit();
    },
    hideVideo: {
      handler() {
        if (this.$route.path.includes(this.route)) {
          this.hideOrShowVideo(this.hideVideo);
        }
      },
      immediate: true
    },
    showPlugin: {
      handler(val) {
        if (this.$route.path.includes(this.route)) {
          this.hideOrShowVideo(!val);
        }
      },
      immediate: true
    },
    queryTime: {
      handler() {
        this.showData(this.videoCode);
      },
      deep: true
    }
  },
  activated() {
    if (this.oWebControl && this.hadInit) {
      this.oWebControl.JS_ShowWnd();
    }
  },
  mounted() {
    window.addEventListener(
      'message',
      event => {
        if (event.data.cmd === 'resize') {
          this.handleResize();
        }
      },
      false
    );
  },
  deactivated() {
    if (this.oWebControl && this.hadInit) {
      this.oWebControl.JS_HideWnd();
    }
  },
  beforeDestroy() {
    this.destoryVideo();
  },
  methods: {
    ...mapMutations('video', ['setHideVideo']),
    setFullScreen(res) {
      if (res) {
        this.oWebControl.JS_RequestInterface({
          funcName: 'setFullScreen'
        });
      } else {
        this.oWebControl.JS_RequestInterface({
          funcName: 'exitFullScreen'
        });
      }
    },
    /**
     * 获取 isc 配置
     */
    async getIscConfig() {
      if (!this.videoCode) {
        return false;
      }
      try {
        let resultData;
        if (this.type == '3') {
          resultData = await getISCConf(this.videoCode);
        } else if (this.type == '23') {
          resultData = await getYSISCConf(this.videoCode);
        }
        this.iscConfig.appkey = resultData[0].isc_key;
        this.iscConfig.ip = resultData[0].isc_url;
        this.iscConfig.port = Number(resultData[0].isc_port);
        this.iscConfig.secret = resultData[0].isc_sec;
        this.iscConfig.transMode = resultData[0].transMode ? Number(resultData[0].transMode) : 1;
        if (!this.oWebControl) {
          this.initPlugin();
        } else {
          this.playerInit();
        }
      } catch (e) {
        console.error(e);
      }
    },

    // 创建播放实例
    initPlugin() {
      let that = this;
      that.videoW = that.$refs[this.videoBoxId].clientWidth * getWidthScale();
      that.videoH = that.$refs[this.videoBoxId].clientHeight * getHeightScale();

      if (!this.oWebControl) {
        // eslint-disable-next-line no-undef
        that.oWebControl = new WebControl({
          szPluginContainer: that.videoBoxId, // 指定容器id
          iServicePortStart: 15900, // 指定起止端口号，建议使用该值
          iServicePortEnd: 15900,
          szClassId: '23BF3B0A-2C56-4D97-9C03-0CB103AA8F11', // 用于IE10使用ActiveX的clsid
          cbConnectSuccess() {
            that.initCount = 0;
            // if (!this.oWebControl) {
            // 创建WebControl实例成功
            that.oWebControl
              .JS_StartService('window', {
                // WebControl实例创建成功后需要启动服务
                dllPath: './VideoPluginConnect.dll' // 值"./VideoPluginConnect.dll"写死
              })
              .then(() => {
                // 启动插件服务成功
                that.setOffset();
                that.oWebControl.JS_CreateWnd(that.videoBoxId, that.videoW, that.videoH).then(() => {
                  //     //JS_CreateWnd创建视频播放窗口，宽高可设定
                  // console.log("JS_CreateWnd");
                  that.$emit('initPlugin');

                  that.oWebControl
                    .JS_RequestInterface({
                      funcName: 'getVersion'
                    })
                    .then(res => {
                      if (
                        res.responseMsg?.code !== 0 ||
                        (res.responseMsg?.code == 0 &&
                          res.responseMsg?.data &&
                          semver.lt(res.responseMsg.data.replace('V', ''), '1.5.2'))
                      ) {
                        // 1.5.2集成方式不支持1.5.2以下版本插件，但会走这里不报错，故做此判断处理
                        that.destoryVideo();
                        return;
                      }
                      that.playerInit(); // 创建播放实例成功后初始化
                      that.hadInit = true;
                      that.showMessage = false;
                      that.downloadFlag = false;
                      that.hideOrShowVideo(this.hideVideo);
                    });
                });
                that.oWebControl.JS_SetWindowControlCallback({
                  // 设置消息回调
                  cbIntegrationCallBack: that.cbIntegrationCallBack
                });
              });
            // }
          },
          cbConnectError() {
            // 创建WebControl实例失败
            that.oWebControl = null;
            that.message = '插件未启动，正在尝试启动，请稍候...';
            that.showMessage = true;
            // eslint-disable-next-line no-undef
            WebControl.JS_WakeUp('VideoWebPlugin://'); // 程序未启动时执行error函数，采用wakeup来启动程序
            that.initCount++;
            if (that.initCount < 5) {
              setTimeout(() => {
                that.initPlugin();
              }, 3000);
            } else {
              that.message = '您现在未安装ISC控件或控件版本过低 无法浏览视频 请先确认是否已下载ISC控件或重启';
              that.downloadFlag = true;
            }
          },
          cbConnectClose(bNormalClose) {
            // 异常断开：bNormalClose = false
            // JS_Disconnect正常断开：bNormalClose = true
            if (bNormalClose) return;
            that.oWebControl = null;
            that.message = '插件未启动，正在尝试启动，请稍候...';
            that.showMessage = true;
            // eslint-disable-next-line no-undef
            WebControl.JS_WakeUp('VideoWebPlugin://'); // 程序未启动时执行error函数，采用wakeup来启动程序
            that.initCount++;
            if (that.initCount < 5) {
              setTimeout(() => {
                that.initPlugin();
              }, 3000);
            } else {
              that.message = '您现在未安装ISC控件或控件版本过低 无法浏览视频 请先确认是否已下载ISC控件或重启';
              that.downloadFlag = true;
            }
          }
        });
      }
    },
    setOffset() {
      if (window.parent !== window) {
        let left = this.$route.query.left || 200;
        let top = this.$route.query.top || 86;
        this.oWebControl.JS_SetDocOffset({ left, top });
      }
    },
    async destoryVideo() {
      if (this.oWebControl) {
        this.oWebControl.JS_HideWnd();
        await this.oWebControl.JS_RequestInterface({
          funcName: 'stopAllPreview'
        });
        await this.oWebControl.JS_DestroyWnd();
        await this.oWebControl.JS_Disconnect();
      }
    },
    // 获取公钥
    getPubKey(callback) {
      let that = this;
      this.oWebControl
        .JS_RequestInterface({
          funcName: 'getRSAPubKey',
          argument: JSON.stringify({
            keyLength: 1024
          })
        })
        .then(oData => {
          if (oData.responseMsg.data) {
            that.pubKey = oData.responseMsg.data;
            callback();
          }
        });
    },
    // RSA加密
    setEncrypt(value) {
      // eslint-disable-next-line no-undef
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.pubKey);
      return encrypt.encrypt(value);
    },
    // 初始化
    playerInit() {
      let that = this;
      this.getPubKey(() => {
        that.oWebControl
          .JS_RequestInterface({
            funcName: 'init',
            argument: JSON.stringify({
              appkey: that.iscConfig.appkey, // API网关提供的appkey
              ip: that.iscConfig.ip, // API网关IP地址
              port: that.iscConfig.port, // 端口
              secret: that.iscConfig.secret, // "setEncrypt("mxG7P12FnOZa76Js0mXZ") API网关提供的secret
              enableHTTPS: 1, // 是否启用HTTPS协议
              language: 'zh_CN',
              layout: '1x1', // 布局
              playMode: this.playType === '1' ? 0 : 1, // 播放模式（0:预览 1:回放）
              reconnectDuration: 5,
              reconnectTimes: 5,
              showSmart: 1, // 是否显示智能信息
              showToolbar: this.showToolbar, // 是否显示工具栏
              SnapDir: 'D:\\SmartPlantSnap', // 抓图存储路径
              videoDir: 'D:\\SmartPlantVideo', // 紧急录像或录像剪辑存储路径
              // encryptedFields: "secret", //加密字段
              buttonIDs: '0,256,257,258,259,260,512,513,514,515,516,768,769', // 自定义工具条按钮
              toolBarButtonIDs: '2048,2049,2050,4098'
            })
          })
          .then(() => {
            // that.oWebControl.JS_Resize(that.videoW, that.videoH); // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
            that.showData(that.videoCode);
          });
      });
    },
    async playerUninit() {
      await this.oWebControl.JS_RequestInterface({
        funcName: 'uninit'
      });
    },
    // 消息回调
    cbIntegrationCallBack(oData) {
      // console.log("cbIntegrationCallBack", oData);
      let {
        msg: { picData, result },
        type
      } = oData.responseMsg;
      if (type == 5) {
        // 进入、退出全屏消息
        if (result == 1024) {
          // console.log('进入全屏')
          this.isFullScreen = true;
          videoEvent.$emit('isFullScreen', { key: this.route, value: true });
          this.setHideVideo(true);
        } else if (result == 1025) {
          // console.log('退出全屏')
          this.isFullScreen = false;
          videoEvent.$emit('isFullScreen', { key: this.route, value: false });
          this.setHideVideo(false);
        }
      } else if (type === 3) {
        // 抓图消息
        let strDataURL;
        if (picData && result === 0) {
          strDataURL = `data:image/jpeg;base64,${picData}`;
        } else {
          strDataURL = null;
        }
        // console.log("isclive snapShotRes", strDataURL);
        window.parent.postMessage(
          {
            cmd: 'snapShotRes',
            data: strDataURL
          },
          '*'
        );
      } else if (type === 1) {
        // 窗口点击事件
        this.$emit('wndClick');
      }
    },
    /**
     * 关闭所有视频
     */
    async stopAllPreview() {
      if (this.oWebControl) {
        await this.oWebControl.JS_RequestInterface({
          funcName: this.playType === '1' ? 'stopAllPreview' : 'stopAllPlayback'
        });
        // console.log("stopAllPreview", res);
      }
    },
    async showData(cameraCode, _wndId) {
      if (!this.oWebControl) {
        this.getIscConfig();
        return false;
      }
      this.getVideoLayout();
      let cameraIndexCode = cameraCode; // 获取输入的监控点编号值，必填
      let streamMode = 1; // 主子码流标识：0-主码流，1-子码流
      // let transMode = 1; // 传输协议：0-UDP，1-TCP
      let gpuMode = 0; // 是否启用GPU硬解，0-不启用，1-启用
      let wndId = _wndId ? _wndId : -1; // 播放窗口序号（在2x2以上布局下可指定播放窗口）
      cameraIndexCode = cameraIndexCode.replace(/(^\s*)/g, '');
      cameraIndexCode = cameraIndexCode.replace(/(\s*$)/g, '');
      let params = {
        cameraIndexCode, // 监控点编号
        streamMode, // 主子码流标识
        transMode: this.iscConfig.transMode, // 传输协议
        gpuMode, // 是否开启GPU硬解
        wndId // 可指定播放窗口
      };
      if (this.playType === '2') {
        let startTimeStamp = moment(this.queryTime[0].format('YYYY-MM-DD HH:mm:ss')).valueOf(); // 回放开始时间戳，必填
        let endTimeStamp = moment(this.queryTime[1].format('YYYY-MM-DD HH:mm:ss')).valueOf(); // 回放结束时间戳，必填
        params.startTimeStamp = Math.floor(startTimeStamp / 1000); // 录像查询开始时间戳，单位：秒
        params.endTimeStamp = Math.floor(endTimeStamp / 1000); // 录像结束开始时间戳，单位：秒
        params.recordLocation = 1; // 录像存储位置：0-中心存储，1-设备存储
      }
      this.oWebControl.JS_RequestInterface({
        funcName: this.playType === '1' ? 'startPreview' : 'startPlayback',
        argument: JSON.stringify(params)
      });
      this.oWebControl.JS_Resize(this.videoW, this.videoH);
    },
    requestInterface(JsonParam) {
      this.oWebControl.JS_RequestInterface(JsonParam).then(oData => {
        // console.log(oData);
      });
    },
    // 自适应窗口大小
    handleResize() {
      if (this.oWebControl && this.hadInit) {
        setTimeout(() => {
          // console.log("this.isFullscreenForNoScroll()", this.isFullscreenForNoScroll());
          if (this.isFullscreenForNoScroll()) {
            // console.log("全屏");
            this.oWebControl.JS_SetDocOffset({ left: 0, top: 0 });
          } else {
            // console.log("非全屏");
            this.setOffset();
          }
          this.videoW = this.$refs[this.videoBoxId].clientWidth * getWidthScale();
          this.videoH = this.$refs[this.videoBoxId].clientHeight * getHeightScale();
          this.oWebControl.JS_Resize(this.videoW, this.videoH);
        }, 10);
        this.setWndCover();
      }
    },
    // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    setWndCover() {
      if (this.oWebControl && this.hadInit) {
        let iWidth = window.innerWidth;
        let iHeight = window.innerHeight;
        let oDivRect = this.$refs[this.videoBoxId].getBoundingClientRect();
        let iCoverLeft = oDivRect.left < 0 ? Math.abs(oDivRect.left) : 0;
        let iCoverTop = oDivRect.top < 0 ? Math.abs(oDivRect.top) : 0;
        let iCoverRight = oDivRect.right - iWidth > 0 ? Math.round(oDivRect.right - iWidth) : 0;
        let iCoverBottom = oDivRect.bottom - iHeight > 0 ? Math.round(oDivRect.bottom - iHeight) : 0;

        iCoverLeft = iCoverLeft > 1000 ? 1000 : iCoverLeft;
        iCoverTop = iCoverTop > 600 ? 600 : iCoverTop;
        iCoverRight = iCoverRight > 1000 ? 1000 : iCoverRight;
        iCoverBottom = iCoverBottom > 600 ? 600 : iCoverBottom;

        this.oWebControl.JS_RepairPartWindow(0, 0, 1001, 600); // 多1个像素点防止还原后边界缺失一个像素条
        if (iCoverLeft !== 0) {
          this.oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, 600);
        }
        if (iCoverTop !== 0) {
          this.oWebControl.JS_CuttingPartWindow(0, 0, 1001, iCoverTop); // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
        }
        if (iCoverRight !== 0) {
          this.oWebControl.JS_CuttingPartWindow(1000 - iCoverRight, 0, iCoverRight, 600);
        }
        if (iCoverBottom !== 0) {
          this.oWebControl.JS_CuttingPartWindow(0, 600 - iCoverBottom, 1000, iCoverBottom);
        }
      }
    },
    async getVideoLayout() {
      await this.oWebControl
        .JS_RequestInterface({
          funcName: 'getLayout'
        })
        .then(res => {
          let { responseMsg } = res;
          this.wndNum = JSON.parse(responseMsg.data).wndNum;
        });
    },
    stop() {
      // this.destoryVideo();
      this.stopAllPreview();
    },
    async refresh(videoCode) {
      const code = videoCode || this.videoCode;
      await this.stopAllPreview();
      if (!code) {
        return false;
      }
      // this.destoryVideo();
      setTimeout(() => {
        this.getIscConfig();
      }, 500);
      // if (!this.oWebControl) {
      //   this.getIscConfig();
      // } else {
      //   this.showData(videoCode);
      // }
    },
    hideOrShowVideo(hideVideo) {
      if (hideVideo && !this.isFullScreen) {
        this.oWebControl && this.oWebControl.JS_HideWnd();
      } else {
        this.oWebControl && this.oWebControl.JS_ShowWnd();
      }
    },
    // 判断页面是否全屏
    isFullscreenForNoScroll() {
      return !!(
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.webkitFullScreen ||
        document.msFullScreen
      );
    },
    // 抓图
    snapShot() {
      if (this.oWebControl) {
        this.oWebControl
          .JS_RequestInterface({
            funcName: 'snapShot',
            argument: {}
          })
          .then(res => {
            if (res.responseMsg.code !== 0) {
              this.$message.warning('抓图失败！');
            }
          });
      } else {
        this.$message.warning('视频加载中，请稍后再试！');
      }
    }
  }
};
</script>

<style lang="less" scoped>
.video-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1;
  .playWnd {
    margin: 0 auto;
    height: 100%;
    background-color: #000000;
    position: relative;
    z-index: 1;
  }
}
.massage {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  background: url('~@/assets/ap/plugindownload_bgp.png') center center;
  ._message {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .loading {
      margin-bottom: 20px;
    }
    .fs16 {
      font-size: 16px;
      margin: 20px 0;
      color: #fff;
    }
    h2 {
      margin-top: 20px;
    }
    .down {
      display: inline-block;
      border: 1px solid #fff;
      color: #fff;
      border-radius: 4px;
      font-size: 14px;
      width: 94px;
      line-height: 36px;
    }
    /deep/ .wpg-spin-dot-item {
      background-color: #fff;
    }
  }
}
</style>
