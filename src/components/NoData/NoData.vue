<template>
  <div class="no-data">
    <i v-if="icon" class="icon" :class="icon"></i>
    <div v-if="title" class="title">{{ title }}</div>
    <div class="desc">{{ desc }}</div>
  </div>
</template>

<script>
export default {
  name: 'NoData',

  components: {},

  filters: {},

  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '暂无数据',
    },
  },

  data() {
    return {}
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  destroyed() {},

  methods: {},
}
</script>

<style lang="scss" scoped>
.no-data {
  padding: 20px 0;
  text-align: center;

  .icon {
    display: block;
    width: 170px;
    height: 120px;
    margin: 0 auto;
    margin-bottom: 10px;
  }

  .title {
    margin-bottom: 10px;
    color: #333;
    font-size: 16px;
  }

  .desc {
    color: #888;
    font-size: 14px;
  }

  .icon-box {
    background-image: url(~@/assets/images/icon-box.png);
  }
}
</style>
