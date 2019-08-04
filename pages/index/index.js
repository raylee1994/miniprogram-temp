Page({
  data: {
    datalist: [
      {
        bg: "red",
        text: 0,
        index: 0
      },
      {
        bg: "orange",
        text: 1,
        index: 1
      },
      {
        bg: "yellow",
        text: 2,
        index: 2
      },
      {
        bg: "green",
        text: 3,
        index: 3
      },
      {
        bg: "pink",
        text: 4,
        index: 4
      },
      {
        bg: "blue",
        text: 5,
        index: 5
      },
      {
        bg: "purple",
        text: 6,
        index: 6
      }
    ],
    selectItem: null,
    moveable: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    hiddenIndex: -1,
    moveLeft: 0,
    moveTop: 0,
    winWidth: 0,
    winHeight: 0,
    column: 3
  },
  onLoad: function() {
    wx.createSelectorQuery()
      .selectAll(".item")
      .fields(
        {
          dataset: true,
          size: true,
          rect: true,
          computedStyle: ["backgroundColor"]
        },
        function(res) {
          res.dataset; // 节点的dataset
          res.width; // 节点的宽度
          res.height; // 节点的高度
          res.left; // 节点 scroll-x 属性的当前值
          res.right; // 节点 scroll-y 属性的当前值
          res.top; // 节点 scroll-y 属性的当前值
          res.bottom; // 节点 scroll-y 属性的当前值
        }
      )
      .exec(res => {
        this.setData({
          thresholdLeft: res[0][0].left,
          thresholdTop: res[0][0].top,
          thresholdWidth: res[0][0].width,
          thresholdHeight: res[0][0].height
        });
      });
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  longpress(e) {
    var curLeft = e.currentTarget.offsetLeft
    var curTop = e.currentTarget.offsetTop
    var stepX = Math.round(
      curLeft / (this.data.thresholdWidth + this.data.thresholdLeft)
    );
    var stepY = Math.round(
      curTop / (this.data.thresholdHeight + this.data.thresholdTop)
    ) * this.data.column;
    var index = stepX + stepY
    this.setData({
      beginIndex: index,
      hiddenIndex: e.currentTarget.dataset.index,
      selectItem: this.data.datalist[index],
      moveable: true,
      startX: e.touches[0].pageX,
      startY: e.touches[0].pageY,
      startLeft: curLeft,
      startTop: curTop,
      moveLeft: curLeft,
      moveTop: curTop
    });
  },
  touchmove(e) {
    if (this.data.moveable) {
      var disX = e.touches[0].clientX - this.data.startX;
      var disY = e.touches[0].clientY - this.data.startY;
      var curLeft =
        this.data.startLeft + disX < 0
          ? 0
          : this.data.startLeft + disX > this.data.winWidth - this.data.thresholdWidth
          ? this.data.winWidth - this.data.thresholdWidth
          : this.data.startLeft + disX;
      var curTop =
        this.data.startTop + disY < 0
          ? 0
          : this.data.startTop + disY > this.data.winHeight - this.data.thresholdHeight
          ? this.data.winHeight - this.data.thresholdHeight
          : this.data.startTop + disY;
      this.setData({
        moveLeft: curLeft,
        moveTop: curTop
      });
      var stepX = Math.round(
        curLeft / (this.data.thresholdWidth + this.data.thresholdLeft)
      );
      var stepY = Math.round(
        curTop / (this.data.thresholdHeight + this.data.thresholdTop)
      ) * this.data.column;
      var beginIndex = this.data.beginIndex;
      var endIndex = stepX + stepY >= this.data.datalist.length - 1 ? this.data.datalist.length - 1 : stepX + stepY
      let datalist = this.data.datalist
      if (beginIndex < endIndex) {
        //向后移动
        let tem = datalist[beginIndex];
        for (let i = beginIndex; i < endIndex; i++) {
          datalist[i] = datalist[i + 1];
        }
        beginIndex = endIndex
        datalist[endIndex] = tem;
      }
      if (beginIndex > endIndex) {
        //向前移动
        let tem = datalist[beginIndex];
        for (let i = beginIndex; i > endIndex; i--) {
          datalist[i] = datalist[i - 1]
        }
        beginIndex = endIndex
        datalist[endIndex] = tem
      }
      this.setData({
        datalist: datalist,
        beginIndex: beginIndex
      })
    }
  },
  touchend() {
    this.setData({
      moveable: false,
      selectItem: null,
      hiddenIndex: -1
    })
  }
});
