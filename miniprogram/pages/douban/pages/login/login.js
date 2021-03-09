import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../../store/index';
import { login } from '../../../../apis/douban.js';
import storage from '../../../../utils/storage';

Page({
  behaviors: [storeBindingsBehavior],

  data: {
    username: '',
    password: ''
  },

  storeBindings: {
    store,
    actions: {
      updateDouban: 'douban/update'
    }
  },

  handleInput (e) {
    const { name } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [name]: value
    });
  },

  async submit (e) {
    /**
     * @type {{
     *  value: {
     *    username: string;
     *    password: string;
     *  }
     * }}
     */
    const { value } = e.detail;
    const res = await login({
      name: value.username,
      password: value.password
    });
    const { access_token, refresh_token } = res.payload;
    this.updateDouban({
      accessToken: access_token,
      refreshToken: refresh_token,
    });
    storage.set('douban.token', access_token);
    storage.set('douban.refresh_token', refresh_token);
    wx.showToast({
      icon: 'none',
      title: '登录成功'
    });
    wx.navigateBack();
  }
});