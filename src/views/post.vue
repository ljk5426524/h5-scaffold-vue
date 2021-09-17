<template>
  <div class="page">
    <div class="card" v-if="post.id">
      <div class="card-header">
        <div class="card-title">{{ post.title }}</div>
        <div class="card-meta">id: {{ id }} / type: {{ type }}</div>
      </div>
      <div class="card-body">{{ post.body }}</div>
      <div class="card-footer">
        <a @click="gotoCommentList">view comments</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Post',

  components: {},

  filters: {},

  props: {},

  data() {
    return {
      id: this.$route.params.id,
      type: this.$route.query.type,

      post: {
        // userId: 1,
        // id: 1,
        // title:
        //   'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        // body:
        //   'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
      },
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this.getPostById()
  },

  destroyed() {},

  methods: {
    getPostById() {
      this.$api
        .getPostById({
          id: this.id,
        })
        .then(response => {
          this.post = response[0]
        })
    },

    gotoCommentList() {
      this.$router.push({
        name: 'CommentList',
        query: {
          type: 1,
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.card {
  padding: 10px;

  .card-header {
    margin-bottom: 10px;

    .card-title {
      font-size: 20px;
    }

    .card-meta {
      margin-top: 8px;
      color: #aaa;
      font-size: 14px;
    }
  }

  .card-body {
    line-height: 1.6;
  }

  .card-footer {
    margin-top: 10px;

    a {
      color: #1989fa;
      font-size: 14px;
    }
  }
}
</style>
