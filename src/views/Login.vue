<template>
  <section>
    <div class="login-box">
      <div class="company"><img src="@/assets/hangzhouLogo.png" alt="永康钱江水务有限公司" /> 永康钱江水务有限公司</div>
      <div class="left-container">
        <div class="container-title">
          <div>
            <div class="area">{{ companyName }}</div>
            <div>让天更蓝水更清</div>
            <div>{{ companyNameEn }}</div>
          </div>
        </div>
      </div>
      <div class="right-container">
        <h3>登录</h3>
        <a-form :form="form" class="login-form">
          <div class="wrap" @keyup.enter="handleSubmit">
            <a-form-item class="form-item" label="用户名">
              <a-input size="large" v-decorator="uValid" autocomplete="off" placeholder="请输入用户名或手机号">
              </a-input>
            </a-form-item>
            <a-form-item class="form-item" label="密码">
              <a-input size="large" v-decorator="pValid" type="password" autocomplete="off" placeholder="请输入密码">
              </a-input>
            </a-form-item>
          </div>
          <div class="rememberPassword">
            <a-form-item>
              <a-checkbox class="remb-Pswd" v-decorator="['remember', { valuePropName: 'checked' }]">
                记住密码
              </a-checkbox>
            </a-form-item>
          </div>
          <a-button type="primary" class="login-form-button" @click="handleSubmit" :loading="loading"> 登录 </a-button>
        </a-form>
      </div>
      <div class="copyright">
        <p>版权所有©永康钱江水务有限公司</p>
      </div>
    </div>
  </section>
</template>
<script>
import { login, getProductDetailByCode } from '@/api/api.js';

export default {
  name: 'Login',
  data() {
    return {
      uValid: [
        'loginName',
        {
          rules: [
            { required: true, message: '用户名称不能为空!' },
            {
              pattern: '^[A-Za-z\\d_]{4,20}$',
              message: '用户名请输入4-20位的字母、数字、下划线'
            }
          ]
        }
      ],
      pValid: [
        'password',
        {
          rules: [
            { required: true, message: '密码不能为空!' },
            {
              message: '密码至少8位合法字符，且必须包含大小写字母和数字'
            }
          ]
        }
      ],
      loading: false,
      companyName: '永康城市污水处理厂',
      companyNameEn: 'bluer sky and fresher water'
    };
  },
  mounted() {
    this.getCookie();
    this.getCompanyName();
  },
  methods: {
    /**
     * 提交登录
     * @param e
     */

    handleSubmit: function () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          //用户名登录
          let loginParams = {
            username: values.loginName,
            password: values.password
          };
          let that = this;
          login(loginParams).then(({ resultData, status, errorMessage }) => {
            if (status === 'complete') {
              /* 判断记住密码是否选中如果选中在本地创建cookie，否则不出创建 */
              let userCookie = { ...values };
              if (!values.remember) {
                Reflect.deleteProperty(userCookie, 'username');
                Reflect.deleteProperty(userCookie, 'password');
              }
              userCookie = JSON.stringify(userCookie);
              document.cookie = `bpCookie=${userCookie}`;
              /* 改变 vx 仓中的用户信息 */
              this.$store.commit('account/set_token', resultData.accessToken);
              // 获取动态路由信息
              this.$store.commit('account/setLogin', JSON.stringify(resultData));
              this.$router.push({ path: '/welcome' });
            } else {
              this.loading = false;
              this.$message.error(errorMessage);
            }
          });
        }
      });
    },
    /**
     * 获取 cookie
     */
    getCookie() {
      const reg = new RegExp('(^| )bpCookie=([^;]*)(;|$)');
      if (!document.cookie || !document.cookie.match(reg) || !document.cookie.match(reg)[2]) return;
      const userCookie = JSON.parse(document.cookie.match(reg)[2]);
      this.form.setFieldsValue(userCookie);
    },
    async getCompanyName() {
      const { resultData, success } = await getProductDetailByCode('water_purification_big_screen');
      if (success) {
        this.companyName = resultData.productAlias;
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  }
};
</script>
<style lang="less" scoped>
section {
  height: 100%;
  background-image: url(../assets/bg.jpg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .company {
    position: fixed;
    top: 40px;
    left: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Aliba', sans-serif;
    font-weight: 400;
    font-size: 30px;
    color: #ffffff;
    letter-spacing: 0;
    img {
      height: 54px;
    }
  }

  .login-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .left-container {
    width: 50%;
    padding: 30px 0 30px 160px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    .container-title {
      width: 100%;
      font-family: Aliba, sans-serif;
      font-weight: 700;
      font-size: 45px;
      color: #ffffff;
      letter-spacing: 0;
      display: flex;
      position: absolute;
      top: -243%;
      .area {
        font-family: Aliba, sans-serif;
        font-weight: 700;
        font-size: 59px;
        color: #ffffff;
        letter-spacing: 0;
      }

      > div:last-child {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        > div:last-child {
          font-size: 26px;
        }
      }
    }

    .container-describe {
      height: 200px;
      > img {
        height: 200px;
      }
    }
  }
  .right-container {
    position: fixed;
    right: 0px;
    top: 0px;
    width: 520px;
    height: 100%;
    background: #5278a666;
    backdrop-filter: blur(11px);
    padding: 248px 42px 0;

    .login-box {
      position: absolute;
    }
    h3 {
      font-family: Aliba, sans-serif;
      font-weight: 400;
      font-size: 41px;
      color: #ffffff;
      letter-spacing: 0;
    }
    form {
      margin-top: 40px;
      margin-bottom: 10px;
      .login-form-button {
        width: 152px;
        height: 64px !important;
        font-size: 28px;
        color: #ffffff;
        background: #4285f4;
        margin: 20px auto;
        text-align: center;
        border: 1px solid #4285f4;
        border-radius: 5px;
        font-family: Aliba, sans-serif;
        cursor: pointer;
        &:hover {
          background: rgba(66, 133, 244, 0.8);
        }
      }
      div.wrap {
        width: 100%;
        margin: 50px auto;
        position: relative;
        text-align: left;
        .form-item {
          margin-bottom: 70px;
        }
        .identifyCode {
          position: absolute;
          top: 9px;
          right: 20px;
          font-size: 14px;
          width: auto;
          height: 34px;
          color: white;
          line-height: 34px;
          padding: 0 10px;
          background: #355687;
          border-radius: 4px;
          cursor: pointer;
        }
        /deep/ .ant-form-item-required::before {
          margin-right: 12px;
          font-size: 36px;
          position: relative;
          top: -4px;
        }
        /deep/.ant-form-item-label label {
          font-family: PingFangSC-Regular, sans-serif;
          font-weight: 400;
          font-size: 32px;
          color: #b6d7ff;
          letter-spacing: 0;
        }
        /deep/.ant-form-item-control-wrapper {
          margin-top: 21px;
        }
        /deep/ input {
          display: block;
          width: 100%;
          height: 54px;
          background: rgba(83, 103, 122, 0.3);
          border-radius: 8px;
          border: 0;
          color: #ffffff;
          font-size: 21px;
          border-bottom: 4px solid #747171;
        }

        input::placeholder {
          font-family: PingFangSC, sans-serif;
          font-weight: 400;
          font-size: 32px;
          color: #ffffff;
          letter-spacing: 0;
        }

        /deep/ .ant-input-prefix {
          color: #3b5e95;
        }
        /deep/.ant-form-explain {
          font-size: 32px;
        }
      }
      p {
        color: #ff6363;
        font-size: 16px;
        &.copyright {
          width: 100%;
          height: auto;
          font-size: 14px;
          color: #5579b4;
          margin: 32px 0 48px 0;
        }
        &.message {
          margin: 10px auto;
        }
      }
      .rememberPassword {
        clear: both;
        margin: 60px 0 40px 0;
        height: 25px;
        text-align: left;
        position: relative;
        justify-content: flex-start;
        /deep/.ant-checkbox-wrapper {
          font-size: 18px;
          line-height: 24px;
          font-size: 18px;
          span {
            font-family: PingFangSC, sans-serif;
            font-weight: 400;
            font-size: 24px;
            color: #85b4ff;
            letter-spacing: 0;
          }

          .ant-checkbox-inner {
            width: 40px;
            height: 40px;
            font-size: 20px;
            border-width: 2px;
            border-radius: 5px;
            background: #6190da;

            &::after {
              top: 14px;
              left: 6px;
              width: 16px;
              height: 28px;
            }
          }
        }
      }
    }
  }

  .copyright {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    text-align: center;
    color: #5579b4;
    font-size: 14px;
  }
}
</style>
