/**
 * @LastEditors : 史磊
 * @description: 语音播放报警
 * @logic :
 * @param {String} alarmAudioStr
 * @return {*}
 */
import storage from '@/common/js/tool/storage';

export const playNextVoice = aAlarmAudioStr => {
  if (!window.SpeechSynthesisUtterance) return;
  for (let i = 0; i < aAlarmAudioStr.length; i++) {
    let alarmAudioStr = aAlarmAudioStr[i].str;
    let audio = new SpeechSynthesisUtterance(alarmAudioStr);
    // 添加一条语音播放
    window.speechSynthesis.speak(audio);
  }
};

export const getWsUrl = () => {
  let url;
  let user = JSON.parse(storage.get('user_info'));
  let token = user.accessToken.replace('Bearer ', '');
  let userId = user.resultData?.userId;
  if (process.env.NODE_ENV === 'production') {
    let rNew = /(http){1}(s){0,1}(:){1}(.){2}/;
    url = `ws://${window.location.origin.replace(rNew, '')}/main/msgCenterWs/ws/asset/${token}/${userId}`;
  } else {
    //set a default value of mapURl
    url = `ws://10.10.15.219/main/msgCenterWs/ws/asset/${token}/${userId}`;
  }
  return url;
};
