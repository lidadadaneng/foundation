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
          label="收藏"
          width="50">
        <template #default="{row}">
          <span style="color: #f7ba2a">
            <i class="el-icon-star-on" v-if="myfcodes.includes(row.FCODE)" @click="collect(row)"></i>
            <i class="el-icon-star-off" v-else @click="collect(row)"></i>
          </span>
        </template>
      </el-table-column>
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
import axios from "axios";

export default {
  name: 'AllFoundation',
  data() {
    return {
      founds: [],
      state: '',
      loading: false,
      fcodes: ['012769', '002708', '000362', '012323', '001092', '010364', '017811', '161628'],
      myfcodes: [],
      gz: []
    }
  },
  mounted() {
    this.syncFCodes();
    this.syncMyFCodes();
  },
  methods: {
    deleteCode({$index}) {
      this.fcodes.splice($index, 1);
      this.syncFCodes(this.fcodes);
    },
    setLocal(localKey, dataKey = 'fcodes') {
      return newFCodes => {
        let fcodes = localStorage.getItem(localKey)
        if (newFCodes) {
          localStorage.setItem(localKey, JSON.stringify(newFCodes))
        } else if (!fcodes) {
          localStorage.setItem(localKey, JSON.stringify(this[dataKey]))
        } else {
          fcodes = JSON.parse(fcodes);
          this[dataKey] = fcodes
        }
      }
    },
    //同步fcodes
    syncFCodes(newFCodes) {
      this.setLocal('fcodes')(newFCodes)
      this.getGz()
    },
    //同步fcodes
    syncMyFCodes(newFCodes) {
      this.setLocal('myfcodes', 'myfcodes')(newFCodes)
    },
    getGz() {
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
        this.fcodes.forEach(item => {
          const fcode = res.data.Data.KFS.find(_item => _item.FCODE === item);
          this.gz.push({name: fcode?.SHORTNAME ?? '--', gz: fcode?.gszzl ?? '--', ...fcode, FCODE: item})
        })
      }).catch(function (error) {
        console.log(error);
      }).finally(() => {
        this.loading = false;
      });
    },
    handleSelect(item) {
      if (!this.fcodes.includes(item.CODE)) {
        this.fcodes.push(item.CODE);
        this.syncFCodes(this.fcodes);
      }
      setTimeout(() => {
        this.state = ''
      })
    },
    collect(item) {
      if (!this.myfcodes.includes(item.FCODE)) {
        this.myfcodes.push(item.FCODE);
      } else {
        this.myfcodes = this.myfcodes.filter(code => code !== item.FCODE)
      }
      this.syncMyFCodes(this.myfcodes);
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
        cb(data.map(item => ({...item, value: `${item.NAME}(${item.CODE})`})))
        // console.log(data)
      })
      cb([]);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
