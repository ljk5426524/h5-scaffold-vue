<template>
  <div class="page">
    <div class="logo">
      <img alt="Vue logo" src="@/assets/images/logo.png" />
    </div>

    <div v-if="list.length">
      <van-cell
        is-link
        v-for="item in list"
        :key="item.id"
        @click="gotoDetail(item)"
      >
        <template slot="title">
          <div class="list-title">
            <span>{{ item.title }}</span>
          </div>
        </template>
      </van-cell>
    </div>
    <NoData v-else />

    <div :style="{ textAlign: 'center', padding: '20px' }">
      <van-button type="info">自定义主题按钮</van-button>
    </div>
  </div>
</template>

<script>
import { getCookie, setCookie } from '@/utils/cookie'

import NoData from '@/components/NoData/NoData'

import { wxLogin } from '@/utils/wechat'

import { PAGINATION } from '@/constants'

export default {
  name: 'Home',

  components: {
    NoData,
  },

  filters: {},

  props: {},

  data() {
    return {
      list: [
        // {
        //   userId: 1,
        //   id: 1,
        //   title:
        //     'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        //   body:
        //     'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
        // },
        // {
        //   userId: 1,
        //   id: 2,
        //   title: 'qui est esse',
        //   body:
        //     'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla'
        // }
      ],
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this.getPostList()
    // wxLogin()

    // 设置 与 读取 cookie
    // setCookie('token', '12345', { expires: 365 })
    // const token = getCookie('token')
  },

  destroyed() {},

  methods: {
    getPostList() {
      this.$api
        .getPostList({
          page: 1,
          limit: PAGINATION.limit,
        })
        .then(response => {
          this.list = response.slice(0, 5)
        })
    },

    gotoDetail(item) {
      this.$router.push({
        name: 'Post',
        params: {
          id: item.id,
        },
        query: {
          type: 1,
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
@import '~@/styles/mixins';

.logo {
  padding: 20px 0;
  text-align: center;
  .transform(scale(0.95));

  img {
    width: 100px;
  }
}
</style>
