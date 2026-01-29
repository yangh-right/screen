/**
 * @DATE:  2020-01-19 11:44
 * @Version: 0.0.1
 * @Author: yunchangJia
 * @Description: 数据字典
 * @Update: 更新内容 by yunchangJia 2020-01-19 11:44
 */

/**
 * require node path package
 * see readme for details
 */
const merge = require('webpack-merge');

const menuData = {
  MENUQUERYCODE: 'module_portal'
};

/**
 *  热线客服模块请求
 * HOTLINELEFT          //左侧模块code
 * HOTLINERIGHT         //右侧模块code
 */
const customerService = {
  HOTLINELEFT: 'hotline_service_left',
  HOTLINERIGHT: 'hotline_service_right'
};

/**
 * 泵站、水厂树
 * SOUECEWATER   【源水】
 * WATERWORKS    【水厂】
 * SEWAGE        【污水厂】
 */
const treeQueryCode = {
  SOUECEWATER: 'sourcewater',
  WATERWORKS: 'waterworks',
  SEWAGE: 'sewage'
};

/**
 * 原水泵站-all
 * WATERPLANT               【总出库水量统计】
 * WATERPLANTPROPORTION     【总出库水量占比】
 * POWERPLANT               【总电耗统计】
 * POWERPLANTPROPORTION     【总用电量占比】
 * CHLORINEPLANT            【总氯耗统计】
 * CHLORINEPLANTPROPORTION  【总次氯酸钠用量占比】
 *
 */
const rawWaterPumpAll = {
  ALLMULTIKPI: '_block_multi',
  WATERPLANT: '_line_outflow',
  WATERPLANTPROPORTION: '_pie_outflow',
  POWERPLANT: '_line_kwh',
  POWERPLANTPROPORTION: '_pie_kwh',
  CHLORINEPLANT: '_line_chlorine',
  CHLORINEPLANTPROPORTION: '_pie_sodium'
};

/**
 * 原水泵站-single
 * BLOCKBUSINESS            【运营管理】
 * BLOCKPRODUCE             【生产指标】
 * LINEBUSINESS             【运营情况对比分析】
 * LINEINSTANTFLOW          【出口瞬时流量曲线】
 * LINEOUTLETPRESSURE       【出口压力曲线】
 * LINEWATERLEVEL           【液位/扬程曲线】
 * PIEOUTFLOW               【出口水量统计分析】
 * PIEKWH                   【电耗/用电量统计分析】
 * PIECHOEINE               【氯耗统计分析】
 */
const rawWaterPumpSingle = {
  BLOCKBUSINESS: '_block_business',
  BLOCKPRODUCE: '_block_produce',
  LINEBUSINESS: '_line_business',
  LINEINSTANTFLOW: '_line_instantflow',
  LINEOUTLETPRESSURE: '_line_outletpressure',
  LINEWATERLEVEL: '_line_waterlevel',
  PIEOUTFLOW: '_pie_outflow',
  PIEKWH: '_pie_kwh',
  PIECHOEINE: '_pie_chlorine'
};

/**
 * 水厂管理-all
 * BLOCKMULTI       【综合分析】
 * LINEOUTFLOW      【总出厂水量/自用水量统计2】
 * LINEKWH          【总电耗统计2】
 * LINECHLORINE     【总氯耗统计2】
 * PIEOUTFLOW       【总出厂水量占比3】
 * PIEKWH           【总用电量占比3】
 * PIESODIUM        【总次氯酸钠用量占比3】
 *
 *
 */
const waterWorksManageAll = {
  BLOCKMULTI: '_block_multi',
  LINEOUTFLOW: '_line_outflow',
  LINEKWH: '_line_kwh',
  LINECHLORINE: '_line_chlorine',
  PIEOUTFLOW: '_pie_outflow',
  PIEKWH: '_pie_kwh',
  PIESODIUM: '_pie_sodium'
};

/**
 * 水厂管理-single
 * SINBLOCKBUSINESS       【运营管理】
 * SINBLOCKPRODUCE        【生产指标】
 * SINLINBUSINESS         【运营情况对比分析】
 * SINLINEINSTANFLOW      【出口瞬时流量曲线】
 * SINLINEOUTLETPRESSURE  【出口压力曲线】
 * SINLINEWATERLEVEL      【液位/扬程曲线】
 * SINPIEOUTFLOW          【出口水量统计分析】
 * SINPIEKWH              【电耗/用电量统计分析】
 * SINPIECHLORINE         【氯耗统计分析】
 */
const waterWorksManageSingle = {
  SINBLOCKBUSINESS: '_block_business',
  SINBLOCKPRODUCE: '_block_produce',
  SINLINBUSINESS: '_line_business',
  SINLINEINSTANFLOW: '_line_instantflow',
  SINLINEOUTLETPRESSURE: '_line_outletpressure',
  SINLINEWATERLEVEL: '_line_waterlevel',
  SINPIEOUTFLOW: '_pie_outflow',
  SINPIEKWH: '_pie_kwh',
  SINPIECHLORINE: '_pie_chlorine'
};

/**
 * 污水厂管理-all
 * SALLBLOCKMULTI       【综合分析】
 * SALLLINEOUTFLOW      【总出厂水量/自用水量统计2】
 * SALLLINEKWH          【总电耗统计2】
 * SALLLINMUD           【污泥外运处置量】
 * SALLPIEOUTFLOW       【总出厂水量占比3】
 * SALLPIEKWH           【总用电量占比3】
 * SALLPIEMUD           【污泥外运处置量占比】
 */
const sewagePlantAll = {
  SALLBLOCKMULTI: '_block_multi',
  SALLLINEOUTFLOW: '_line_outflow',
  SALLLINEKWH: '_line_kwh',
  SALLLINMUD: '_line_mud',
  SALLPIEOUTFLOW: '_pie_outflow',
  SALLPIEKWH: '_pie_kwh',
  SALLPIEMUD: '_pie_mud'
};

/**
 * 污水厂管理-single
 * SSINBLOCKBUSINESS       【运营管理】
 * SSINBLOCKPRODUCE        【生产指标】
 * SSINLINBUSINESS         【运营情况对比分析】
 * SSINLINEINSTANFLOW      【出口瞬时流量曲线】
 * SSINLINEOUTLETPRESSURE  【出口压力曲线】
 * SSINLINEWATERLEVEL      【液位/扬程曲线】
 * SSINPIEOUTFLOW          【出口水量统计分析】
 * SSINPIEKWH              【电耗/用电量统计分析】
 * SSINPIEMUD              【污泥外运统计分析】
 */
const sewagePlantSingle = {
  SSINBLOCKBUSINESS: '_block_business',
  SSINBLOCKPRODUCE: '_block_produce',
  SSINLINBUSINESS: '_line_business',
  SSINLINEINSTANFLOW: '_line_instantflow',
  SSINLINEOUTLETPRESSURE: '_line_outletpressure',
  SSINLINEWATERLEVEL: '_line_waterlevel',
  SSINPIEOUTFLOW: '_pie_outflow',
  SSINPIEKWH: '_pie_kwh',
  SSINPIEMUD: '_pie_mud'
};

/**
 * 地图导航
 * MAPPIPE              【官网运营图层】
 * MAPPRODUCE           【生产运营图层】
 * PROANDOPERWATER      【水厂】
 * PROANDOPERPUM        【源水泵站】
 * WATCHMANAGEMENT      【表务管理】
 * REVENUEMETERREADING  【营收抄表】
 * HOTLINESERVICE       【热线客服】
 * WATERPOWERPLANT      【生产运营】
 * WATERPOWERPUMP       【生产运营折线图】
 */
const mapNav = {
  MAPPIPE: 'map_pipe',
  MAPPRODUCE: 'map_produce',
  PROANDOPERWATER: 'pro_and_oper_water',
  PROANDOPERPUM: 'pro_and_oper_pum',
  WATCHMANAGEMENT: 'watch_management',
  REVENUEMETERREADING: 'revenue_meter_reading',
  HOTLINESERVICE: 'hotline_service',
  WATERPOWERPLANT: 'water_power_plant',
  WATERPOWERPUMP: 'water_power_pump'
};

/* merge code to customCode  */
const dictionary = merge(
  menuData,
  customerService,
  rawWaterPumpAll,
  treeQueryCode,
  rawWaterPumpSingle,
  waterWorksManageAll,
  waterWorksManageSingle,
  sewagePlantAll,
  sewagePlantSingle,
  mapNav
);

export default dictionary;
