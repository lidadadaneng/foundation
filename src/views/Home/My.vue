<template>
  <div class="home-all">
    <strong>搜索添加基金</strong>
    <el-autocomplete
        v-model="state"
        style="width: 100%;margin:10px 0 20px"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
    ></el-autocomplete>
    <el-table
        :data="gz"
        height="100px"
        stripe v-loading="loading"
        :cell-style="{textAlign:'center'}"
        :header-cell-style="{textAlign:'center'}"
        style="width: 100%">
      <el-table-column
          prop="name" show-overflow-tooltip
          min-width="180"
          label="基金名称">
      </el-table-column>
      <el-table-column
          prop="gz"
          label="实时估值">
        <template #default="scope">
          <span style="color: red" v-if="Number(scope.row.gz)>0">+{{ scope.row.gz }}%</span>
          <span style="color: green" v-else-if="Number(scope.row.gz)<0">{{ scope.row.gz }}%</span>
          <span v-else>{{ scope.row.gz || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="FCODE"
          label="基金代码">
      </el-table-column>
      <el-table-column
          label="操作"
          fixed="right"
          width="50">
        <template #default="scope">
          <el-button @click="deleteCode(scope)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import All from "./All";

export default {
  name: "MyFoundation",
  extends: All,
  data() {
    return {
      fcodes: []
    }
  },
  methods: {
    //同步fcodes
    syncFCodes(newFCodes) {
      this.setLocal('myfcodes')(newFCodes)
      this.getGz()
    },
  }
}
</script>

<style scoped lang="scss">
.home-all {
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 90vw;
  display: flex;
  flex-direction: column;

  :deep .el-table {
    height: calc(100% - 60px);
  }
}
</style>
