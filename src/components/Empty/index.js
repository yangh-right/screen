/*
 * @Author: your name
 * @Date: 2021-12-22 08:46:41
 * @LastEditTime: 2022-08-04 14:19:44
 * @LastEditors: 史磊
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \ergongscreen\src\components\Empty\index.js
 */
import './index.less';

const empty = require('@/assets/img/pic_defect.png');

const Empty = {
  name: 'VcEmpty',
  props: {
    description: {
      type: String,
      default: '未找到相关结果'
    }
  },
  render () {
    const description = this.description;
    return (
      <div class="vc-empty">
        <div class="vc-empty-image">
          <img src={empty} class="vc-empty-defect" />
          {description && <p class="vc-empty-description">{description}</p>}
        </div>
      </div>
    );
  }
};

Empty.install = function (Vue) {
  Vue.component(Empty.name, Empty);
};

export default Empty;
