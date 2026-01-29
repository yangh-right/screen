/**
 * @DATE:  2019/6/26 14:31
 * @Version: 0.0.1
 * @Author: yunchangJia
 * @Description: 项目配置项
 */
/**
 * 项目配置
 * systemName   【项目名称】
 * copyright    【底部版权信息】
 * layout       【页面布局方式 菜单左侧 side || 菜单顶部 head 】
 * menuCollapsed【菜单是否折叠】
 * theme        【主题】
 * isShowTheme  【是否展示切换主题功能】
 * isMobile     【是否是移动端 默认 false】
 */

const projectConfig = {
    systemName: '模版',
    copyright: '上海威派格智慧水务股份有限公司',
    layout: 'head',
    theme: 'deepBlue',
    darkTheme: ['deepBlue'],
    simpleThemeMap:'http://api0.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20180711&scale=1&ak=0F7691e465f5d7d161a4771f48ee38ff&styles=t%3Awater%7Ce%3Ag.f%7Cc%3A%231382d7ff%2Ct%3Ahighway%7Ce%3Ag.f%7Cc%3A%23112447ff%2Ct%3Ahighway%7Ce%3Ag.s%7Cc%3A%23112447ff%2Ct%3Aarterial%7Ce%3Ag.f%7Cc%3A%23112447ff%2Ct%3Aarterial%7Ce%3Ag.s%7Cc%3A%23112447ff%2Ct%3Alocal%7Ce%3Ag%7Cc%3A%23112447ff%2Ct%3Aland%7Ce%3Aall%7Cc%3A%23112447ff%2Ct%3Arailway%7Ce%3Ag.f%7Cc%3A%23000000%2Ct%3Arailway%7Ce%3Ag.s%7Cc%3A%2308304b%2Ct%3Asubway%7Ce%3Ag%7Cl%3A-70%2Ct%3Abuilding%7Ce%3Ag.f%7Cc%3A%23000000%2Ct%3Aall%7Ce%3Al.t.f%7Cc%3A%23857f7f%2Ct%3Aall%7Ce%3Al.t.s%7Cc%3A%23000000%2Ct%3Abuilding%7Ce%3Ag%7Cc%3A%23112447ff%2Ct%3Agreen%7Ce%3Ag%7Cc%3A%23062032%2Ct%3Aboundary%7Ce%3Aall%7Cc%3A%231e1c1c%2Ct%3Amanmade%7Ce%3Ag%7Cc%3A%23112447ff%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aall%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aall%7Ce%3Al.t.f%7Cv%3Aoff%7Cc%3A%232da0c6%2Ct%3Awater%7Ce%3Ag.s%7Cc%3A%230b538dff',
    darkThemeMap:'http://api0.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20180711&scale=1&ak=0F7691e465f5d7d161a4771f48ee38ff&styles=t%3Awater%7Ce%3Ag.f%7Cc%3A%232e9fcaff%2Ct%3Ahighway%7Ce%3Ag.f%7Cc%3A%23081427ff%2Ct%3Ahighway%7Ce%3Ag.s%7Cc%3A%23035a8bff%2Ct%3Aarterial%7Ce%3Ag.f%7Cc%3A%230c4c75ff%2Ct%3Aarterial%7Ce%3Ag.s%7Cc%3A%23000f24ff%2Ct%3Alocal%7Ce%3Ag%7Cc%3A%23073c5eff%2Ct%3Aland%7Ce%3Aall%7Cc%3A%23112447ff%2Ct%3Arailway%7Ce%3Ag.f%7Cc%3A%23000000%2Ct%3Arailway%7Ce%3Ag.s%7Cc%3A%2308304b%2Ct%3Asubway%7Ce%3Ag%7Cl%3A-70%2Ct%3Abuilding%7Ce%3Ag.f%7Cc%3A%23000000%2Ct%3Aall%7Ce%3Al.t.f%7Cc%3A%23857f7f%2Ct%3Aall%7Ce%3Al.t.s%7Cc%3A%23000000%2Ct%3Amanmade%7Ce%3Ag.f%7Cc%3A%2317506fff%2Ct%3Agreen%7Ce%3Ag%7Cc%3A%2312445eff%2Ct%3Aboundary%7Ce%3Aall%7Cc%3A%231e1c1c%2Ct%3Apoi%7Ce%3Aall%7Cv%3Aoff%2Ct%3Aall%7Ce%3Al.i%7Cv%3Aoff%2Ct%3Aall%7Ce%3Al.t.f%7Cc%3A%232da0c6%2Ct%3Awater%7Ce%3Ag.s%7Cc%3A%230b538dff'
};

const config = { ...projectConfig };

export default config;
