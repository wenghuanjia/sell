import Vue from 'vue'
import Router from 'vue-router'
import Goods from '../components/goods/goods'
import Ratings from '../components/ratings/Ratings'
import Seller from '@/components/seller/Seller';

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: {
        path: '/goods',
        component: Goods
      }
    },
    {
      path: '/goods',
      component: Goods
    },
    {
      path: '/ratings',
      component: Ratings
    },
    {
      path: '/seller',
      component: Seller
    }
  ]
})
