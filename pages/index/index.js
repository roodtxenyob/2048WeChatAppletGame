// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    snum:0
  },

  addScore(event) {
    let sum = event.detail + this.data.snum
    this.setData({
      snum: sum
    })
  }
  
})