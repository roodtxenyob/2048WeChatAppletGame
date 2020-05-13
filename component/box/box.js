// component/box/box.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    startX:0,//滑动开始的坐标
    startY:0,
    endX:0,//滑动结束的坐标
    endY:0,
    pieces:[
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    insertActive:[
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    mergeActive: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // insertAnimation(x,y) {
    //   //插入的动画
    //   let ia = wx.createAnimation({
    //     duration:1000,
    //     delay: 0,
    //     timingFunction: "linear"
    //   });
    //   ia.scale(0.5,0.5);
    //   ia.step();

    //   this.setData({ 
    //     ia: ia.export() 
    //   });
    // },

    touchStart(event){
      //滑动开始
      this.setData({
        startX: event.changedTouches[0].pageX,
        startY: event.changedTouches[0].pageY
      });
    },

    touchEnd(event){
      //滑动结束
      this.setData({
        endX: event.changedTouches[0].pageX,
        endY: event.changedTouches[0].pageY
      });
      
      //这里是滑动后，处理数组并重新插入
      let direction = this.getDirection();

      this.slide(direction);
    },

    getDirection(){
      //获取滑动方向的方法
      let moveOffsetX = this.data.startX - this.data.endX; //横向移动的数值
      let moveOffsetY = this.data.startY - this.data.endY; //竖向移动的数值
      let row = "非法滑动"; //横向的滑动方向
      let column = "非法滑动"; //竖向的滑动方向
      let result = "非法滑动"; //根据距离计算出的方向

      if (Math.abs(moveOffsetX) > this.legalTouchDistance()) {
        //判断横向的移动方向
        if (moveOffsetX > 0) {
          row = "右到左";
        } else {
          row = "左到右";
        }
      }
      
      if (Math.abs(moveOffsetY) > this.legalTouchDistance()) {
        //判断竖向的移动方向
        if (moveOffsetY > 0) {
          column = "下到上";
        } else {
          column = "上到下";
        }
      }
      
      if (Math.abs(moveOffsetX) > Math.abs(moveOffsetY)) {
        //判断具体的方向
        result = row;
      } else {
        result = column;
      }

      return result;
    },

    legalTouchDistance(){
      //最小合法拖动距离
      let result = 0;
      wx.getSystemInfo({
        success: function (res) {
          result = res.windowHeight / 20;
        }
      });
      return result;
    },
    
    randomGenerateNumber(){
      //随机生成2，4任意一个数的方法
      return Math.round(Math.random())*2+2;
    },

    randomInsertPieces(num){
      //随机插入为数组内容为0的位置
      let zeroArray = [];//为0的数组下标
      this.data.pieces.forEach((itemX,indexX) => {
        itemX.forEach((itemY,indexY) => {
          if (itemY == 0) {
            zeroArray.push([indexX, indexY]);
          }
        })
      });

      if (zeroArray.length!=0){
        let randomPosition = Math.floor(Math.random() * (0 - zeroArray.length) + zeroArray.length);
        //随机的数组位置
        let x = zeroArray[randomPosition][0];
        let y = zeroArray[randomPosition][1];
        let ans = "pieces[" + x + "][" + y + "]";
        let activens = "insertActive[" + x + "][" + y + "]";//需要动画的块
        this.setData({
          insertActive: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        });  
        //要播放动画的序列
        this.setData({
          [ans]: num,
          [activens]: num
        });
      }
      
    },

    isGameOver() {
      //判断游戏是否结束
      for (let i = 0; i < 4; i++) { 
        for (let j = 0; j < 4; j++) {
          if (this.data.pieces[i][j] == this.data.pieces[i][j + 1]) {
            return false;
          }
        }
      }
      for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
          if (this.data.pieces[i][j] == this.data.pieces[i + 1][j]) {
            return false;
          }
        }
      }
      return true;
    },

    isWin(){
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.data.pieces[i][j] == 2048){
            return true;
          }
        }
      }
    },

    slide(direction) {
      let list = [[], [], [], []];
      this.setData({
        mergeActive: [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]
      });
      if (direction == "左到右") {
        for(let i = 0; i < 4; i++){
          let count = 0;
          for(let j = 0; j < 4; j++){
            if (this.data.pieces[i][j] != 0){
              list[i].push(this.data.pieces[i][j]);
              count ++;
            }
          }
          for (; count < 4; count++){
            list[i].unshift(0);
          }
        }
        // 上方为滑动块操作

        for (let i = 0; i < 4; i++) {
          for (let j = 3; j > 0; j--) {
            if (list[i][j] == list[i][j-1] && list[i][j] != 0) {
              list[i][j - 1] = 0;
              let score = list[i][j] + list[i][j];
              list[i][j] = score;
              this.triggerEvent("addScore", score);

              let mergeActivens = "mergeActive[" + i + "][" + j + "]";
              this.setData({
                [mergeActivens]:1
              });
              //添加到合并动画序列
            }
          }
        }
        //以上为合并操作
        let list2 = [[], [], [], []];
        for (let i = 0; i < 4; i++) {
          let count = 0;
          for (let j = 0; j < 4; j++) {
            if (list[i][j] != 0) {
              list2[i].push(list[i][j]);
              count++;
            }
          }
          for (; count < 4; count++) {
            list2[i].unshift(0);
          }
        }
        list = list2;
        //重新滑块
      }

      if (direction == "右到左") {
        for (let i = 0; i < 4; i++) {
          let count = 0;
          for (let j = 0; j < 4; j++) {
            if (this.data.pieces[i][j] != 0) {
              list[i].push(this.data.pieces[i][j]);
              count++;
            }
          }
          for (; count < 4; count++) {
            list[i].push(0);
          }
        }
        // 上方为滑动块操作

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 3; j++) {
            if (list[i][j] == list[i][j + 1] && list[i][j] != 0) {
              list[i][j + 1] = 0;
              let score = list[i][j] + list[i][j];
              list[i][j] = score;
              this.triggerEvent("addScore", score);

              let mergeActivens = "mergeActive[" + i + "][" + j + "]";
              this.setData({
                [mergeActivens]: 1
              });
              //添加到合并动画序列
            }
          }
        }
        // 以上为合并操作
        let list2 = [[], [], [], []];
        for (let i = 0; i < 4; i++) {
          let count = 0;
          for (let j = 0; j < 4; j++) {
            if (list[i][j] != 0) {
              list2[i].push(list[i][j]);
              count++;
            }
          }
          for (; count < 4; count++) {
            list2[i].push(0);
          }
        }
        list = list2;
        //重新滑块
      }

      if (direction == "上到下") {
        let newList = [[], [], [], []];
        //装旋转后的数组
        let newList2 = [[], [], [], []];
        //装选择后滑动并相加的数组
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            newList[j][4 - 1 - i] = this.data.pieces[i][j];
          }
        }
        // 上面的操作是吧数组向右旋转90度


        for (let i = 0; i < 4; i++) {
          let count = 0;
          for (let j = 0; j < 4; j++) {
            if (newList[i][j] != 0) {
              newList2[i].push(newList[i][j]);
              count++;
            }
          }
          for (; count < 4; count++) {
            newList2[i].push(0);
          }
        }
        // 滑动块到一侧

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 3; j++) {
            if (newList2[i][j] == newList2[i][j + 1] && newList2[i][j] != 0) {
              newList2[i][j + 1] = 0;
              let score = newList2[i][j] + newList2[i][j];
              newList2[i][j] = score;
              this.triggerEvent("addScore", score);

              let mergeActivens = "mergeActive[" + (4 - 1 - j) + "][" + i + "]";
              this.setData({
                [mergeActivens]: 1
              });
              //添加到合并动画序列
            }
          }
        }
        // 合并
        
        let list2 = [[], [], [], []];
        for (let i = 0; i < 4; i++) {
          let count = 0;
          for (let j = 0; j < 4; j++) {
            if (newList2[i][j] != 0) {
              list2[i].push(newList2[i][j]);
              count++;
            }
          }
          for (; count < 4; count++) {
            list2[i].push(0);
          }
        }
        newList2 = list2;
        //重新滑块

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            list[4 - 1 - j][i] = newList2[i][j];
          }
        }
        // 上面的操作是吧数组向左旋转90度
      }

      if (direction == "下到上") {
        
        let newList = [[], [], [], []];
        //装旋转后的数组
        let newList2 = [[], [], [], []];
        //装选择后滑动并相加的数组
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            newList[j][4 - 1 - i] = this.data.pieces[i][j];
          }
        }
        // 上面的操作是吧数组向右旋转90度

        
        for (let i = 0; i < 4; i++) {
          let count = 0;
          for (let j = 0; j < 4; j++) {
            if (newList[i][j] != 0) {
              newList2[i].push(newList[i][j]);
              count++;
            }
          }
          for (; count < 4; count++) {
            newList2[i].unshift(0);
          }
        }
        // 滑动块到一侧
        
        for (let i = 0; i < 4; i++) {
          for (let j = 3; j > 0; j--) {
            if (newList2[i][j] == newList2[i][j - 1] && newList2[i][j] != 0) {
              newList2[i][j - 1] = 0;
              let score = newList2[i][j] + newList2[i][j];
              newList2[i][j] = score;
              this.triggerEvent("addScore", score);

              let mergeActivens = "mergeActive[" + (4 - 1 - j) + "][" + i + "]";
              this.setData({
                [mergeActivens]: 1
              });
              //添加到合并动画序列
            }
          }
        }
        // 合并

        let list2 = [[], [], [], []];
        for (let i = 0; i < 4; i++) {
          let count = 0;
          for (let j = 0; j < 4; j++) {
            if (newList2[i][j] != 0) {
              list2[i].push(newList2[i][j]);
              count++;
            }
          }
          for (; count < 4; count++) {
            list2[i].unshift(0);
          }
        }
        newList2 = list2;
        //重新滑块
        
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            list[4 - 1 - j][i] = newList2[i][j];
          }
        }
        // 上面的操作是吧数组向左旋转90度

      }

      if (direction != "非法滑动") {
        this.setData({
          pieces: list
        });
        //更新视图

        this.randomInsertPieces(this.randomGenerateNumber());
        //随机插入

        if (this.isGameOver()) {
          console.log("11111111");
        }
        if (this.isWin()) {
          console.log("22222222");
        }
      }  
    }
  },

  lifetimes: {
    ready() {
      this.randomInsertPieces(this.randomGenerateNumber());
      //初始化时插入两个数
      this.randomInsertPieces(this.randomGenerateNumber());
    }
  }
})
