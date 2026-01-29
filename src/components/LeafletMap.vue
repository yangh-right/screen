/** * @version: 1.0.1 * @Author: huhaiou * @Date: 2020-04-28 17:25:27 * @LastEditors: wang kai * @LastEditTime:
2021-04-08 10:48:54 * @Description: leaflet地图组件--支持标注、弹出信息层、沙盘图层、水流图层、区域边界等 * @Update:
优化默认传参，添加自定义聚合，自定义连线，标记点点击回调事件 */
<template>
  <section class="map-container">
    <div ref="map" class="map"></div>
  </section>
</template>

<script>
/* eslint-disable */
/* global L:false */
import { ak } from '../api/api';
import axios from 'axios';
import remoteLoad from '../common/js/tool/remoteLoad';
const STATICLAYERTYPES = ['marker', 'markerGroup', 'popup', 'drawLine'];
export default {
  name: 'LeafletMap',
  data() {
    return {
      // baiduUrl: 'http://api0.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20180711&scale=1&ak=0F7691e465f5d7d161a4771f48ee38ff&styles=t%3Awater%7Ce%3Ag.f%7Cc%3A%232e9fcaff%2Ct%3Ahighway%7Ce%3Ag.f%7Cc%3A%23081427ff%2Ct%3Ahighway%7Ce%3Ag.s%7Cc%3A%23035a8bff%2Ct%3Aarterial%7Ce%3Ag.f%7Cc%3A%230c4c75ff%2Ct%3Aarterial%7Ce%3Ag.s%7Cc%3A%23000f24ff%2Ct%3Alocal%7Ce%3Ag%7Cc%3A%23073c5eff%2Ct%3Aland%7Ce%3Aall%7Cc%3A%23112447ff%2Ct%3Arailway%7Ce%3Ag.f%7Cc%3A%23000000%2Ct%3Arailway%7Ce%3Ag.s%7Cc%3A%2308304b%2Ct%3Asubway%7Ce%3Ag%7Cl%3A-70%2Ct%3Abuilding%7Ce%3Ag.f%7Cc%3A%23000000%2Ct%3Aall%7Ce%3Al.t.f%7Cc%3A%23857f7f%2Ct%3Aall%7Ce%3Al.t.s%7Cc%3A%23000000%2Ct%3Amanmade%7Ce%3Ag.f%7Cc%3A%2317506fff%2Ct%3Agreen%7Ce%3Ag%7Cc%3A%2312445eff%2Ct%3Aboundary%7Ce%3Aall%7Cc%3A%231e1c1c%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aall%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aall%7Ce%3Al.t.f%7Cc%3A%232da0c6%2Ct%3Awater%7Ce%3Ag.s%7Cc%3A%230b538dff',
      mymap: null, //地图
      boundraryLayer: L.featureGroup(), //边界图层组
      initCode: '', // 初始化最初的code
      existCode: '', // 当前加载过的code
      existCodeArr: [], // 加载过的所有code信息
      existAreaNameArr: [] // 加载过的所有省市区名称
    };
  },
  props: {
    // 地图底图链接
    baiduUrl: {
      type: String,
      // required: true,
      default: `http://api1.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20200804&scale=1&ak=${ak}&styles=t%3Abackground%7Ce%3Aall%7Cc%3A%23051e2eff%2Ct%3Aroad%7Ce%3Aall%7Cc%3A%23092d45ff%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Alabel%7Ce%3Al.t.s%7Cv%3Aon%7Cc%3A%230b539400%2Ct%3Alabel%7Ce%3Al.t.f%7Cc%3A%23006f83ff%2Ct%3Aroad%7Ce%3Al.t.f%7Cc%3A%2300726aff%2Ct%3Ahighway%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aboundary%7Ce%3Aall%7Cc%3A%2300726aff%2Ct%3Aroad%7Ce%3Ag.s%7Cc%3A%23004463ff%2Ct%3Agreen%7Ce%3Aall%7Cc%3A%2300404dff%2Ct%3Awater%7Ce%3Aall%7Cc%3A%2308273aff%2Ct%3Alabel%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aroad%7Ce%3Al.i%7Cv%3Aoff`
    },
    // 请求地址
    apiUrl: {
      type: String,
      // required: true,
      default: 'http://139.196.86.193/zheJiangJson/'
    },
    /**
     * mapOption         ---地图配置：坐标，放大倍数等
     * siteData          ---站点实时数据
     * isShowControlTool ---是否显示图层控制
     * isShowAntpath     ---是否显示蚂蚁图层
     * isShowWMSLayer    ---是否显示WMS图层（管网）
     * layerConfigData   ---地图上其它图层的设置参数：url:地址 layer:图层 params:参数 options:其它项
     * isShowMarkerInfo  ---是否显示标注的信息（默认-显示）
     * isMarkerDiff      ---是否根据分区显示标注图标颜色（默认-不分区）
     * isMarkerName      ---是否显示标注名称
     */
    mapOption: {
      //地图配置，中心点、放大倍数等
      type: Object,
      required: true
    },
    // markerType: {
    //     type: String,
    //     default: 'label' // label 携带文本(无点击事件)  point 纯标记点(有点击回调)
    // },
    // 是否支持下钻
    ifDrillDown: {
      type: Boolean,
      required: false,
      default: true
    },
    // 点聚合
    markerGroupStatus: {
      type: Boolean,
      required: false,
      default: true
    },
    // 聚合点类型
    markerGroupTypes: {
      type: Array,
      default: () => []
    },
    /**
             * 需要处理的数据源
             * {330100: {
                    adcode: 330100,
                    name: '永康市',
                    lnglat: [30.287459, 120.153576],
                    fillColor: '#000000',
                    icon: 'src/assets/red.png',
                    domHtml: `<div class="popupBox">
                            <div class="titleBox">
                                <span class="titleItem wfs12 wfc1">永康市</span>
                            </div>
                            <ul class="contentBox">
                                <li class="contentItem wfs12 wfc1">
                                    <span>漏损率</span>
                                    <span>12%</span>
                                </li>
                                <li class="contentItem wfs12 wfc1">
                                    <span>优秀</span>
                                    <span>12个</span>
                                    <span>40%</span>
                                </li>
                            </ul>
                        </div>
                    </div>`
                }}
             */
    dataSource: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    },
    // 更新数据是否清理地图已存在的渲染数据
    ifClearMarker: {
      type: Boolean,
      default: true
    },
    // 连接点 -- 折线
    lineOptions: {
      type: Object,
      default: () => {
        return {
          type: 'drawLine',
          color: '#ED4256',
          weight: 3
        };
      }
    },
    linePoint: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    // 数据（标记点，聚合点，区域）
    dataSource: {
      handler(newVal) {
        this.mymap.eachLayer(layer => {
          if (!layer._url && STATICLAYERTYPES.includes(layer.options.type)) {
            if (this.ifClearMarker) {
              this.mymap.removeLayer(layer);
            }
          } else if (layer.feature) {
            const adcode = layer.feature.properties.adcode;
            layer.setStyle({
              color: (this.dataSource[adcode] && this.dataSource[adcode].borderColor) || '#51F6F9',
              fillColor: (this.dataSource[adcode] && this.dataSource[adcode].fillColor) || 'transparent',
              fillOpacity: (this.dataSource[adcode] && this.dataSource[adcode].fillOpacity) || 0.6
            });
          }
        });
        if (newVal && Object.keys(newVal).length) {
          this.toDrawGroupMarkerPoint(null, this.ifClearMarker);
        }
      }
    },
    // 连线
    linePoint(v) {
      if (v && v.length) {
        this.toAddLine(v);
      }
    }
  },
  created() {
    // 聚合插件
    if (this.markerGroupStatus && !L.markerClusterGroup) {
      remoteLoad('https://cdn.bootcdn.net/ajax/libs/leaflet.markercluster/1.4.1/leaflet.markercluster-src.js', 'js');
      remoteLoad('https://cdn.bootcdn.net/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.Default.css', 'css');
    }
  },
  methods: {
    /**
     * 初始化地图
     */
    getTileLayer() {
      let { baiduUrl } = this;
      return new L.TileLayer(baiduUrl, {
        maxZoom: 18,
        minZoom: 0,
        subdomains: [0, 1, 2],
        tms: true
      });
    },
    async toInitMap() {
      let crs = new L.Proj.CRS(
        'EPSG:900913',
        '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs',
        {
          resolutions: (function () {
            let level = 19;
            var res = [];
            res[0] = Math.pow(2, 18);
            for (var i = 1; i < level; i++) {
              res[i] = Math.pow(2, 18 - i);
            }
            return res;
          })(),
          origin: [0, 0],
          bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
        }
      );
      let { center, zoom, minZoom, maxZoom } = this.mapOption;
      let baiduMaplayer = (this.mapTileLayer = this.getTileLayer());
      /*eslint-disable new-cap*/
      this.mymap = new L.map(this.$refs.map, {
        attributionControl: false,
        doubleClickZoom: false,
        crs,
        // crs: L.CRS.EPSG4326,
        closePopupOnClick: false,
        center,
        zoom,
        minZoom,
        maxZoom,
        zoomControl: false,
        layers: [baiduMaplayer]
        // layers: []
      });
      // let baselayer = {
      //     "百度地图": baiduMaplayer
      // };
      // this.controlLayer = L.control.layers(baselayer, {});
      // if (this.isShowControlTool) this.toAddControlTool();
      this.$emit('loadedMap', this.mymap);
    },
    /**
     * 添加控制图层控件
     * @param siteData
     */
    toAddControlTool() {
      this.controlLayer.addTo(this.mymap);
    },
    /**
     * @description: 画行政区域外轮廓
     * @param {features 行政区域边界特征物数据}
     * @param {adcode 行政adcode}
     * @return: void
     */
    async toAddRegion(boundraryUrl) {
      if (boundraryUrl) {
        if (!this.existCode) {
          this.initCode = boundraryUrl.split('_')[0];
          this.existCode = boundraryUrl.split('_')[0];
          this.existCodeArr.push(boundraryUrl.split('_')[0]);
        }
        //获取JSON数据
        // 请求省市区GEO_json数据
        axios({
          method: 'get',
          url: boundraryUrl,
          baseURL: this.apiUrl || 'http://139.196.86.193/zheJiangJson/'
        }).then(res => {
          this.mymap.removeLayer(this.boundraryLayer);
          // this.mymap.eachLayer((layer) => {
          //     if (!layer._url) {
          //         this.mymap.removeLayer(layer);
          //     }
          // });
          this.boundraryLayer = L.geoJSON(res.data, {
            style: feature => {
              return {
                color: '#51F6F9',
                weight: 2
              };
            },
            onEachFeature: (feature, layer) => {
              layer.setStyle({
                // 每个模块默认样式
                color:
                  (this.dataSource[feature.properties.adcode] &&
                    this.dataSource[feature.properties.adcode].borderColor) ||
                  '#51F6F9',
                fillColor:
                  (this.dataSource[feature.properties.adcode] &&
                    this.dataSource[feature.properties.adcode].fillColor) ||
                  'transparent',
                fillOpacity:
                  (this.dataSource[feature.properties.adcode] &&
                    this.dataSource[feature.properties.adcode].fillOpacity) ||
                  0.6
              });
              layer.on('mouseover', ev => {
                // 每个模块鼠标移入默认样式
                layer.setStyle({
                  color:
                    (this.dataSource[feature.properties.adcode] &&
                      this.dataSource[feature.properties.adcode].borderColor) ||
                    '#51F6F9',
                  weight: 3,
                  fillColor:
                    (this.dataSource[feature.properties.adcode] &&
                      this.dataSource[feature.properties.adcode].fillColor) ||
                    'transparent',
                  fillOpacity: 0.1
                });
              });
              layer.on('mouseout', ev => {
                // 每个模块移出默认样式
                layer.setStyle({
                  color:
                    (this.dataSource[feature.properties.adcode] &&
                      this.dataSource[feature.properties.adcode].borderColor) ||
                    '#51F6F9',
                  weight: 2,
                  fillColor:
                    (this.dataSource[feature.properties.adcode] &&
                      this.dataSource[feature.properties.adcode].fillColor) ||
                    'transparent',
                  fillOpacity:
                    (this.dataSource[feature.properties.adcode] &&
                      this.dataSource[feature.properties.adcode].fillOpacity) ||
                    0.6
                });
              });
              // 单击下钻
              layer.on('click', ev => {
                let feature = ev.target.feature;
                this.$emit('mapClick', feature, () => {
                  if (this.ifDrillDown) {
                    if (this.existCode !== feature.properties.adcode) {
                      let center = L.latLng([feature.properties.center[1], feature.properties.center[0]]);
                      this.mymap.setView(center).fitBounds(ev.target.getBounds());
                      this.toAddRegion(
                        feature.properties.adcode + (feature.properties.childrenNum > 0 ? '_full.json' : '.json')
                      );
                    }
                    this.existCode = feature.properties.adcode;
                    if (!this.existCodeArr.length) this.existCodeArr.push(this.initCode); // 如果当前数组为空，主动添加第一项默认为起始code
                    if (this.existCodeArr.indexOf(feature.properties.parent.adcode) < 0) {
                      this.existCodeArr.push(feature.properties.parent.adcode);
                    }
                    this.existAreaNameArr.forEach(item => {
                      this.mymap.removeLayer(item);
                    });
                    this.existAreaNameArr = [];
                  } else {
                    return '未开启地图下钻';
                  }
                }); // 触发事件
              });
              // 右键返回上一级
              layer.on('contextmenu', ev => {
                // let feature = ev.target.feature;
                // const backCode = feature.properties.acroutes.length <= 2 ? '' : feature.properties.acroutes[feature.properties.acroutes.length - 1]
                const backCode = this.existCodeArr[this.existCodeArr.length - 1];
                this.$emit('mapBackClick', backCode, () => {
                  // let center = L.latLng([feature.properties.center[1], feature.properties.center[0]])
                  // this.mymap.setView(center).fitBounds(ev.target.getBounds());
                  if (!backCode || backCode === this.existCode) return false;
                  if (this.ifDrillDown) {
                    this.existCode = this.existCodeArr.pop(); // 去除最后一级
                    if (!this.existCodeArr.length) return;
                    this.toAddRegion(this.existCode + '_full.json');
                    this.existAreaNameArr.forEach(item => {
                      this.mymap.removeLayer(item);
                    });
                    this.existAreaNameArr = [];
                  } else {
                    return '未开启地图下钻';
                  }
                }); // 触发事件
              });
            }
          }).addTo(this.mymap);
          // 获取所有区域对象 -- 标记区域名称
          const allAreaArr = Object.values(this.boundraryLayer._layers);
          this.$emit('getMapArea', allAreaArr);
          for (let item of allAreaArr) {
            const {
              feature: {
                type,
                properties: { name, centroid, center }
              }
            } = item;
            if (type === 'Feature') {
              const areaName = L.divIcon({
                html: name,
                className: 'area-name-div-icon',
                iconSize: 100
              });
              // 获取中心点渲染标记
              const marker = L.marker([centroid ? centroid[1] : center[1], centroid ? centroid[0] : center[0]], {
                icon: areaName
              });
              this.existAreaNameArr.push(marker);
              marker.addTo(this.mymap);
            }
          }

          // .bindPopup(function (layer) {
          //     return layer.feature.properties.name;
          // })
          // 视图重置---判断名称是否显示
          // this.mymap.on('zoomend', (ev) => {
          //     this.$nextTick(() => {
          //         const plantsNameItems = document.querySelectorAll(`.all-layer-in-map`);
          //         for (let i of plantsNameItems) {
          //             this.mapOption.isMarkerName ? i.style.display = 'block' : i.style.display = 'none'
          //         }
          //     })
          // });
          this.mymap.fitBounds(this.boundraryLayer.getBounds());
          // 渲染点/聚合
          // this.toDrawGroupMarkerPoint();
        });
      }
    },
    /**
     * 渲染点/聚合
     */
    async toDrawGroupMarkerPoint(points = null, ifClear = true) {
      if (ifClear) {
        this.mymap.eachLayer(layer => {
          // console.log(layer)
          if (!layer._url && STATICLAYERTYPES.includes(layer.options.type)) {
            this.mymap.removeLayer(layer);
          }
        });
      }
      // 默认使用手动传入的数据
      const handleData = points || this.dataSource;
      if (this.markerGroupStatus) {
        if (!L.markerClusterGroup) {
          await remoteLoad(
            'https://cdn.bootcdn.net/ajax/libs/leaflet.markercluster/1.4.1/leaflet.markercluster-src.js',
            'js'
          );
          await remoteLoad(
            'https://cdn.bootcdn.net/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.Default.css',
            'css'
          );
        }
        const groupObj = {};
        for (let item of this.markerGroupTypes) {
          groupObj[item.type] = L.markerClusterGroup({
            type: 'markerGroup',
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            iconCreateFunction: cluster => {
              return L.divIcon({
                html: `<div style="backgroud:red;" class="groupIconBox ${
                  item.className
                }">${cluster.getChildCount()}</div>`
              });
            }
          });
        }
        for (let i in handleData) {
          // 默认展示的数据源
          const item = handleData[i];
          if (item && item.lnglat) {
            if (item.groupType !== undefined && item.groupType !== null) {
              groupObj[item.groupType].addLayer(
                item.markerType === 'label' ? this.toAddMarkerPopup(item) : this.toAddMarkerIcon(item)
              );
            } else {
              this.mymap.addLayer(
                item.markerType === 'label' ? this.toAddMarkerPopup(item) : this.toAddMarkerIcon(item)
              );
            }
          }
        }
        for (let i of this.markerGroupTypes) {
          this.mymap.addLayer(groupObj[i.type]);
        }
      } else {
        for (let i in handleData) {
          // 默认展示的数据源
          const item = handleData[i];
          if (item && item.status !== '' && item.lnglat) {
            this.mymap.addLayer(item.markerType === 'label' ? this.toAddMarkerPopup(item) : this.toAddMarkerIcon(item));
          }
        }
      }
    },
    // 创建弹窗
    toAddMarkerPopup(site) {
      const domContent = `<div id="${site.name}-${site.adcode}-layer-box" class="all-layer-in-map-box" title="${site.name}">
                        <img class="mapIconItem ${site.status}-icon-in-map" src="${site.icon}"/>
                        <span id="${site.name}-${site.adcode}-layer" class="all-layer-in-map ${site.status}-layer-in-map">${site.name}</span>
                    </div>`;
      const markerPopup = L.popup({
        id: site.name + 'layerPopup',
        type: 'popup',
        closeButton: false,
        autoPan: false,
        offset: L.point(0, 6),
        minWidth: 158,
        maxWidth: 260
      })
        .setLatLng(site.lnglat)
        .setContent(domContent);
      return markerPopup;
    },
    // 创建自定义弹窗
    toAddCustomPopup(data, defaultCreate = false) {
      const { show, content, options } = data;
      const markerPopup = L.popup({
        // id: options.id + 'layerPopup',
        className: options.id + 'layerPopup',
        type: 'popup',
        closeButton: true,
        autoPan: true,
        minWidth: 200,
        maxWidth: 560,
        ...options,
        offset: L.point(...(options.offset || [-158, 6]))
      })
        .setLatLng(options.lnglat)
        .setContent(content);
      if (show) markerPopup.openOn(this.mymap);
      if (defaultCreate) {
        this.mymap.addLayer(markerPopup);
      }
      return markerPopup;
    },
    // 创建icon
    toAddMarkerIcon(site) {
      if (site.icon) {
        const icon = L.icon({
          //图标地址
          iconUrl: site.icon,
          //图标大小
          iconSize: site.iconSize || [32, 32]
        });
        //标记
        const Marker = L.marker(site.lnglat, {
          //添加图标
          icon: icon,
          //是否允许鼠标拖动
          draggable: false,
          // 标注
          title: site.name || site.adcode,
          type: 'marker'
        }).on('click', e => {
          // 标记点点击事件
          this.$emit('markerClick', e, site);
        });
        if (site.popup) Marker.bindPopup(this.toAddCustomPopup(site.popup));
        return Marker;
        // .addTo(this.mymap)
        // .bindPopup(this.toAddMarkerPopup(site))
        // Marker.on('click', (ev) => {
        //     const currentMarkerLayer = document.getElementById(`${site.adcode}-layer`);
        //     currentMarkerLayer.style.display === 'block' ? currentMarkerLayer.style.display = 'none' : currentMarkerLayer.style.display = 'block'
        // })
      }
    },
    // 创建连线
    toAddLine(points = []) {
      for (let item of points) {
        L.polyline([...points], { ...this.lineOptions, type: 'drawLine' }).addTo(this.mymap);
      }
    }
  },
  activated() {
    // 主动触发resize事件，避免地图部分加载展示不完全
    if (document.createEvent) {
      var event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, true);
      window.dispatchEvent(event);
    } else if (document.createEventObject) {
      window.fireEvent('onresize');
    }
  },
  mounted() {
    this.toInitMap();
  }
};
</script>

<style lang="less" scoped>
.map-container {
  width: 100%;
  height: 100%;
  .map {
    width: 100%;
    height: 100%;
    /deep/.leaflet-popup {
      margin: 0;
      .leaflet-popup-content-wrapper {
        background-color: transparent;
        padding: 0;
        box-shadow: none;
        .leaflet-popup-content {
          margin: 0;
          text-align: center;
          color: #ffffff;
          .plantsNameInMap {
            font-size: 12px;
          }
        }
      }
      .leaflet-popup-tip-container {
        display: none;
      }
    }
    /deep/.area-name-div-icon {
      min-width: 100px;
      width: auto !important;
      height: auto !important;
      font-size: 12px;
      color: #51f6f9;
      margin-left: -10px !important;
      margin-top: 0 !important;
      pointer-events: none;
    }
    /deep/.all-layer-in-map-box {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
      .mapIconItem {
        width: 32px;
        display: block;
      }
      .all-layer-in-map {
        width: auto;
        max-width: 140px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        background-image: url(../assets/RG/pic_map_coordinate.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: 0 0;
        padding: 0 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
    }
    /deep/.leaflet-marker-icon {
      width: auto;
      height: auto;
      // margin-left: -24px!important;
      // margin-top: -24px!important;
      border: none;
      background-color: transparent;
      .groupIconBox {
        position: relative;
        width: 40px;
        height: 40px;
        font-size: 12px;
        color: #ffffff;
        font-weight: bold;
        line-height: 16px;
        text-align: center;
        // border-radius: 50%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: 0 0;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
