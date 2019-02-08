<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{ totalCount }}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{ totalPrice }}</div>
          <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls" :key="ball.id">
          <!-- <transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter"> -->
          <transition name="drop" >
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-container" ref="listContainer">
          <ul>
            <li class="food" v-for="(food, index) in selectFoods" :key="index">
              <span class="name">{{ food.name }}</span>
              <div class="price">
                <span>￥{{ food.price * food.count }}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click.stop.prevent="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/Cartcontrol';
export default {
  data() {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
      ],
      dropBalls: [],
      show: false,
      fold: true
    };
  },
  created() {
    this.$root.$on('add_cart', this.drop);
  },
  props: {
    // 保存选择的商品对应的条数和价格信息
    selectFoods: {
      type: Array,
      default() {
        return [];
      }
    },
    // 配送费用
    deliveryPrice: {
      type: Number,
      default: 0
    },
    // 最小起送费用
    minPrice: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // 计算出添加商品后的商品总价
    totalPrice(){
      let total = 0;
      this.selectFoods.forEach((food) => {
        // 总价
        total += food.price * food.count;
      });
      return total;
    },
    // 计算出添加商品后的商品个数
    totalCount() {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count;
      })
      return count;
    },
    // 计算购物车的三种状态变化
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        // 计算出对应的差价
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
      } else {
        // 满足条件，去结算
        return '去结算';
      }
    },
    // 计算出是否满足计算条件后对应的样式
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      } else {
        return 'enough';
      }
    },
    // 购物车列表
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContainer, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }          
        });
      }
      return show;
    }
  },
  methods: {
    /* drop() {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = this.$store.state.ballEle;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeEnter(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (ball.show) {
          console.log(ball);
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 22;
          let y = -(window.innerHeight - rect.top - 48)
          el.style.display = "";
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter(el) {
      //触发浏览器重绘
      let rf = el.offsetHeight;

      this.$nextTick(() => {
        el.style.webkitTransform = `translate3d(0,0,0)`;
        el.style.transform = `translate3d(0,0,0)`;
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.webkitTransform = `translate3d(0,0,0)`;
        inner.style.transform = `translate3d(0,0,0)`;
      });
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = 'none'
      }
    }, */
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    // 情况购物车列表
    empty() {
      this.selectFoods.forEach(food => {
        food.count = 0;
      })
    },
    // 点击隐藏购物车列表
    hideList() {
      this.fold = true;
    },
    // 支付
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      window.alert(`支付${this.totalPrice}元`)
    },
  },
  components: {
    cartcontrol
  }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/mixin"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    background: #000
    .content
      display: flex
      background: #141d27
      font-size: 0
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%;
            height: 100%;
            border-radius: 50%;
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          color: rgba(255, 255, 255, 0.4)
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
          color: rgba(255, 255, 255, 0.4)
      .content-right
        flex: 0 0 105
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          color: rgba(255, 255, 255, 0.4)
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        bottom: 22px
        left: 32px
        z-index: 150
        transition: all 0.4s cubic-bezier(.34,-0.56,.73,.62)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0,160,220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      transition: all 0.5s
      transform: translate3d(0,-100%,0)
      &.fold-enter,&.fold-leave-active
        transform: translate3d(0,0,0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        border-bottom: 1px solid rgba(7,17,27,0.1)
        background: #f3f5f7
        .title
          float: left
          font-size: 14px
          color: rgb(7,17,27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0,160,220)
      .list-container
        touch-action: none
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height: 24px
            font-size: 12px
            color: rgb(7,17,27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240,20,20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active,
    &.fade-leave-active
      transition: all 0.5s
      opacity: 1
    &.fade-enter,
    &.fade-leave-to
      transition: all 0.5s
      opacity: 0
</style>
