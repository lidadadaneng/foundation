<template>
  <div id="app">
    <!--    <img alt="Vue logo" src="./assets/logo.png">-->
    <!--    <p v-for="(item,index) in gz" :key="index">{{ item.name }}:{{ item.gz }}%</p>-->
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
        stripe
        :cell-style="{textAlign:'center'}"
        :header-cell-style="{textAlign:'center'}"
        style="width: 100%">
      <el-table-column
          prop="name"
          label="基金名称">
      </el-table-column>
      <el-table-column
          prop="FCODE"
          label="基金代码">
      </el-table-column>
      <el-table-column
          prop="gz"
          label="实时估值">
        <template #default="scope">
          <span style="color: red" v-if="Number(scope.row.gz)>0">+{{ scope.row.gz }}%</span>
          <span style="color: green" v-else-if="Number(scope.row.gz)<0">{{ scope.row.gz }}%</span>
          <span v-else>{{ scope.row.gz }}%</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      founds: [],
      state: '',
      fcodes: ['012769','002708','000362','012323'],
      gz: []
    }
  },
  mounted() {
    this.getGz();
  },
  methods: {
    getGz(){
      const data = {
        fcodes: this.fcodes.toString()
      }
      axios({
        url: '/found/favor/GetFundsInfo?',
        method: "post",
        data
      }).then((res) => {
        this.gz = res.data.Data.KFS.map(item => ({name: item.SHORTNAME, gz: item.gszzl,...item}));
      }).catch(function (error) {
        console.log(error);
      });
    },
    handleSelect(item) {
      if(!this.fcodes.includes(item.CODE)){
        this.fcodes.push(item.CODE);
        this.getGz();
      }
    },
    querySearchAsync(queryString, cb) {
      const params = {
        callback: 'data',
        m: 1,
        key: queryString,
        _: 1690874850895
      }
      axios({
        url: '/fundsuggest/FundSearch/api/FundSearchAPI.ashx?',
        method: "get",
        params
      }).then(result => {
        const str = result?.data;
        const res = JSON.parse(str.slice(5, str.length - 1));
        const data = res?.Datas ?? [];
        cb(data.map(item=>({...item,value:`${item.NAME}(${item.CODE})`})))
        // console.log(data)
      })
      cb([]);
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 10vh 10vw;
}
</style>
