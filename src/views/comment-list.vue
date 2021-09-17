<template>
  <div class="page">
    <div v-if="list.length">
      <van-cell
        size="large"
        :label="item.body"
        v-for="item in list"
        :key="item.id"
      >
        <template slot="title">
          <div class="list-title">
            <i class="icon icon-logo"></i>
            <span>{{ item.email }}</span>
          </div>
        </template>
      </van-cell>
    </div>
    <NoData v-else />
  </div>
</template>

<script>
import NoData from '@/components/NoData/NoData'

import { PAGINATION } from '@/constants'

export default {
  name: 'CommentList',

  components: {
    NoData,
  },

  filters: {},

  props: {},

  data() {
    return {
      id: this.$route.params.id,
      type: this.$route.query.type,

      list: [
        // {
        //   postId: 1,
        //   id: 1,
        //   name: 'id labore ex et quam laborum',
        //   email: 'Eliseo@gardner.biz',
        //   body:
        //     'laudantium enim quasi est quidem magnam voluptate ipsam eos tempora quo necessitatibus dolor quam autem quasi reiciendis et nam sapiente accusantium'
        // },
        // {
        //   postId: 1,
        //   id: 2,
        //   name: 'quo vero reiciendis velit similique earum',
        //   email: 'Jayne_Kuhic@sydney.com',
        //   body:
        //     'est natus enim nihil est dolore omnis voluptatem numquam et omnis occaecati quod ullam at voluptatem error expedita pariatur nihil sint nostrum voluptatem reiciendis et'
        // }
      ],
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this.getPostList()
  },

  destroyed() {},

  methods: {
    getPostList() {
      this.$api
        .getCommentListById({
          page: 1,
          limit: PAGINATION.limit,
          postId: this.id,
        })
        .then(response => {
          this.list = response.slice(0, 10)
        })
    },
  },
}
</script>

<style lang="less" scoped>
.list-title {
  display: flex;

  .icon-logo {
    display: inline-block;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    margin-right: 10px;
    margin-top: 5px;
    background-image: url(~@/assets/images/logo-mini.png);
    background-size: 100% 100%;
  }
}
</style>
