<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link :to="{path:'/goods'}">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/ratings'}">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link :to="{path:'/seller'}">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from "./components/header/Header";
import {urlParse} from './common/js/util.js';
// 请求状态
const ERR_NO = 0;
export default {
  name: "App",
  data() {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    };
  },
  created() {
    this.$axios
      .get("https://www.easy-mock.com/mock/5c53e2076ad2a8357e2c7215/elm/seller?id=" + this.seller.id)
      .then(res => {
        if (res.data.errno === ERR_NO) {
          this.seller = Object.assign({}, this.seller, res.data.data);
        }
      });
  },
  components: {
    "v-header": header
  }
};
</script>

<style lang="stylus">
@import './common/stylus/mixin.styl';

#app {
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-1px(rgba(7, 17, 27, 0.1));

    .tab-item {
      flex: 1;
      text-align: center;

      & > a {
        display: block;
        font-size: 14px;
        color: rgb(77, 87, 93);

        &.router-link-active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
}
</style>
