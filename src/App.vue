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
          <span v-else>{{ scope.row.gz||'--' }}</span>
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
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      founds: [],
      state: '',
      loading:false,
      fcodes: ['012769','002708','000362','012323','001092','010364','017811','161628'],
      gz: []
    }
  },
  mounted() {
    this.syncFCodes();
  },
  methods: {
    deleteCode({$index}){
      this.fcodes.splice($index,1);
      this.syncFCodes(this.fcodes);
    },
    //同步fcodes
    syncFCodes(newFCodes){
      let fcodes = localStorage.getItem('fcodes')
      if(newFCodes){
        localStorage.setItem('fcodes',JSON.stringify(newFCodes))
      }else if(!fcodes){
        localStorage.setItem('fcodes',JSON.stringify(this.fcodes))
      }else {
        fcodes= JSON.parse(fcodes);
        console.log(fcodes)
        this.fcodes = fcodes
      }
      this.getGz()
    },
    getGz(){
      const data = {
        fcodes: this.fcodes.toString()
      }
      this.loading = true;
      axios({
        url: '/found/favor/GetFundsInfo?',
        method: "post",
        data
      }).then((res) => {
        this.gz = [];
        this.fcodes.forEach(item=>{
          const fcode = res.data.Data.KFS.find(_item=>_item.FCODE===item);
          this.gz.push({name: fcode?.SHORTNAME??'--', gz: fcode?.gszzl??'--',...fcode,FCODE:item})
        })
      }).catch(function (error) {
        console.log(error);
      }).finally(()=>{
        this.loading = false;
      });
    },
    handleSelect(item) {
      if(!this.fcodes.includes(item.CODE)){
        this.fcodes.push(item.CODE);
        this.syncFCodes(this.fcodes);
      }
      setTimeout(()=>{
        this.state = ''
      })
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
  padding: 10vh calc(10vw - 50px) 10vh calc(10vw - 30px);
}
</style>
