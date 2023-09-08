<template>
  <div class="home">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="自选基金" name="first">
        <All ref="all"></All>
      </el-tab-pane>
      <el-tab-pane label="我的基金" name="second">
        <My ref="my"></My>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import All from './All'
import My from './My.vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "index",
  components: {All, My},
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick({paneName}) {
      if(paneName==='second'){
        this.$refs.my.syncFCodes()
      }else {
        this.$refs.all.syncMyFCodes()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0;
  width:100%;

  :deep .el-tabs {
    height: 90%;
    overflow: hidden;
    .el-tabs__content{
      height: calc(100% - 51px);
      overflow: auto;
      .el-tab-pane{
        height: 100%;
      }
    }
  }
}
</style>
