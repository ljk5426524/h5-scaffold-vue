<template>
  <div v-if="isShow" class="api-select-box">
    <div v-show="dialogVisible" class="mask" @click="dialogVisible = false" />
    <div v-show="dialogVisible" class="api-list">
      <div class="current-api" @click="beforeChangeCurrentUrl">
        当前接口(点击可修改)：{{ currentUrl }}
      </div>
      <div
        v-for="(item, index) in apiList"
        v-show="item.url"
        :key="index"
        class="api-item"
        :class="currentUrl === item.url ? 'select' : ''"
        @click="handleTableRow(item, 'select')"
      >
        <div class="title">{{ item.name }}</div>
        <div class="title-s">{{ item.url || '未配置接口地址' }}</div>
      </div>
    </div>
    <div class="api-select" @click="dialogVisible = true">
      <i class="icon-xigua" />
    </div>
  </div>
</template>
<script>
/* eslint-disable no-undef */
import axios from 'axios'
import { apiUrlList } from '@/config'

function setStorage(name, value) {
  return localStorage.setItem(name, value)
}

function getStorage(name) {
  return localStorage.getItem(name)
}

export default {
  data() {
    return {
      isShow: false,
      dialogVisible: false,
      isLocal: env.name === 'local',
      isEdit: false,
      fromDialogVisible: {
        show: false,
        type: 'add',
      },
      form: {},
      apiList: [],
      ip: '',
      currentUrl: '',
      currentUrlEdit: '',
    }
  },
  watch: {
    'fromDialogVisible.show': function(val) {
      if (!val) {
        this.form = { ...this.$options.data()['form'] }
        this.ip = ''
      }
    },
    'form.name': function(val) {
      if (!val) return
      val += ''
      this.form.name = val.replace(/[^\w_]/g, '')
    },
  },
  mounted() {
    this.isShow = env.showApiSelect || false
    const currentUrl = getStorage('apiUrl') || env.api
    this.currentUrl = currentUrl
    this.currentUrlEdit = this.currentUrl
    const newArr = []
    Object.keys(apiUrlList).forEach(key => {
      const _url = apiUrlList[key]
      const _name = key
      // if (currentUrl === _url) {
      //   _name += '(正在使用)'
      // }
      newArr.push({
        name: _name,
        url: _url,
      })
    })
    this.apiList = [...newArr]
  },
  methods: {
    handleTableRow(row, type) {
      if (type === 'select') {
        this.apiUrlChange(row.url)
      } else if (type === 'edit') {
        this.form = { ...row }
        this.fromDialogVisible.type = 'edit'
        this.fromDialogVisible.show = true
      }
    },
    canEdit(data) {
      return true
      // const blankList = ['local', 'dev', 'test', 'production']
      // let flag = true
      // blankList.forEach(item => {
      //   if (data.name.indexOf(item) > -1) {
      //     return (flag = false)
      //   }
      // })
      // return flag
    },
    apiUrlChange(url, cb) {
      console.log(url)
      if (!url) {
        alert('接口地址错误，无法切换')
      }
      if (confirm('确定切换Api接口地址吗?')) {
        setStorage('apiUrl', url)
        this.$router.go()
        typeof cb === 'function' && cb()
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.currentUrl === row.url) {
        return 'success-row'
      }
    },
    // 改变修改状态时
    beforeChangeCurrentUrl() {
      // this.currentUrlEdit = this.currentUrl
      this.isEdit = true
      const currentUrlEdit = prompt('自定义api地址', this.currentUrl)
      if (currentUrlEdit) {
        this.apiUrlChange(currentUrlEdit)
      }
    },
    // 改变当前缓存中的api
    changeCurrentUrl() {
      this.apiUrlChange(this.currentUrlEdit, () => {
        this.isEdit = false
      })
    },
    // 提交API
    submitAddDataForm() {
      const apiUrl =
        this.fromDialogVisible.type === 'add' ? '/api/addApi' : '/api/editApi'
      axios.post(apiUrl, this.form || {}).then(res => {
        const {
          data: { code, msg },
        } = res
        if (code === 0) {
          this.$message.success('操作成功')
          this.fromDialogVisible.show = false
        } else {
          this.$message.warning(msg || '操作失败')
        }
      })
    },
    getClientIp() {
      axios.get('/api/getClientIp').then(res => {
        const {
          data: {
            code,
            msg,
            data: { ip },
          },
        } = res
        if (code === 0) {
          this.ip = ip || ''
        } else {
          this.$message.warning(msg || '获取失败')
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.api-select-box {
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    z-index: 9998;
  }

  .api-select {
    cursor: pointer;
    position: fixed;
    right: 0;
    bottom: 10%;
    z-index: 9999;
    background-color: #fff;
    border-radius: 99px 0 0 99px;
    padding: 4px 6px;
    border: 1px solid #dadada;
    border-right: 0;
    -moz-box-shadow: 0 2px 12px #6b6b6b;
    -webkit-box-shadow: 0 2px 12px #6b6b6b;
    box-shadow: 0 2px 12px #6b6b6b;
  }

  .current-api {
    color: #666;
    cursor: pointer;
  }

  .api-list {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 9999;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.9);
    width: 90%;
    height: 60%;
    max-width: 400px;
    max-height: 700px;
    border-radius: 10px;
    padding: 15px;
    overflow: auto;
    color: #333;

    .api-item {
      cursor: pointer;

      .title {
        font-size: 20px;
      }

      .title-s {
        margin-top: 5px;
        font-size: 14px;
        color: #666;
      }

      &.select * {
        color: #409eff;
      }

      &:not(:last-child) {
        border-bottom: 1px dashed;
      }

      padding: 10px 0;
    }
  }

  .icon-xigua {
    display: inline-block;
    width: 25px;
    height: 25px;
    background-size: contain;
    background-image: url('data:image/png;base64,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');
  }
}
</style>
