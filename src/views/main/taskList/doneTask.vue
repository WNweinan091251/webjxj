<template>
  <div class="">
    <tab-page ref="tabPage">
      <template slot="doneTask">
        <data-table :data-table="dataTable" ref="dataTable" @handleSelectionChange="handleSelectionChange">
          <div slot="conditions" class="top">
              <el-form :inline="true" :model="queryParams">
                <el-form-item>
                  <el-select v-model="keywordsType" size="small" class="w100">
                    <el-option
                      v-for="item in conditionSelect"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="keywordsValue" placeholder="" size="small" class="w120"></el-input>
                </el-form-item>
                <el-form-item label="审核状态">
                  <el-select v-model="queryParams.manualStatus" size="small">
                    <el-option
                      v-for="item in manualStatusData"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <span>进件时间:</span>
                	<el-date-picker
                	     v-model="queryParams.startPushTime"
                	     type="datetime"
                       value-format="yyyy-MM-dd HH:mm:ss"
                	     placeholder="选择日期时间" size="small">
                	 </el-date-picker>
                </el-form-item>
                <el-form-item label="至">
                </el-form-item>
                <el-form-item>
                	<el-date-picker
                	     v-model="queryParams.endPushTime"
                	     type="datetime"
                       value-format="yyyy-MM-dd HH:mm:ss"
                	     placeholder="选择日期时间" size="small" >
                	 </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <span>结件时间:</span>
                	<el-date-picker
                	     v-model="queryParams.startClosureTime"
                	     type="datetime"
                       value-format="yyyy-MM-dd HH:mm:ss"
                	     placeholder="选择日期时间" size="small" >
                	 </el-date-picker>
                </el-form-item>
                <el-form-item label="至">
                </el-form-item>
                <el-form-item>
                	<el-date-picker
                	     v-model="queryParams.endClosureTime"
                	     type="datetime"
                       value-format="yyyy-MM-dd HH:mm:ss"
                	     placeholder="选择日期时间" size="small">
                	 </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          <template slot="columns">
            <el-table-column prop="pageIndex" label="序号"></el-table-column>
            <el-table-column prop="loanId" label="进件ID"></el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="idCard" label="身份证号"></el-table-column>
            <el-table-column prop="manualStatus" label="审核状态"></el-table-column>
            <el-table-column prop="operatorUserName" label="审核人员"></el-table-column>
            <el-table-column prop="signTime" label="签约时间" :formatter="dealDate"></el-table-column>
            <el-table-column prop="pushTime" label="进件时间" :formatter="dealDate"></el-table-column>
            <el-table-column prop="closureTime" label="结件时间" :formatter="dealDate"></el-table-column>
            <el-table-column label="详情">
              <template slot-scope="scope">
                <el-button @click="openPage(scope.row)" type="primary" size="small">查看</el-button>
              </template>
            </el-table-column>
          </template>
        </data-table>
      </template>
      <telephone-info slot="telephoneInfo" :applicationInfo="applicationInfo" ></telephone-info>
      <detail slot="detail" :applicationInfo="applicationInfo" @openTelephoneInfo="openTelephoneInfo"></detail>
    </tab-page>
  </div>
</template>

<script>
  import TabPage from "@/components/TabPage"
  import DataTable from "@/components/DataTable"
  import telephoneInfo from "@/components/telephoneInfo"
  import Detail from "@/components/Detail"
  import dateFormat from "@/utils/dateFormat"
  import auth from '@/utils/authenticate'
  export default {
    data () {
      return {
        dataTable: {
          pageSize: 30,
          pageSizes: [10, 30, 50, 100],
          url: "/application//list",
          queryParams: {
            endPushTime: '',
            idcardNumber: '',
            loanId: '',
            manualStatus: 'TERMINAL',
            mobile: '',
            operatorUserName: '',
            startPushTime: '',
            userName:'',
            startClosureTime: '',
            endClosureTime: '',
            type: '',
          },
          emptyText: '没有记录',
          contentType:'application/x-www-form-urlencoded;',
          isFormData: true,
        },
        queryParams: {
          endPushTime: '',
          idcardNumber: '',
          loanId: '',
          manualStatus: 'TERMINAL',
          mobile: '',
          operatorUserName: '',
          startPushTime: '',
          userName: '',
          startClosureTime: '',
          endClosureTime: '',
          type: '',
        },
        keywordsType: 'userName',
        applicationInfo: {},
        keywordsValue: '',
        conditionSelect: [],
        manualStatusData: [ { name: '全部', code: 'TERMINAL' }, { name: '审核通过', code: 'APPROVE' }, { name: '审核拒绝', code: 'REJECT' } ],
      }
    },
    mounted(){
      var defaultPage = {label: "办结任务", name: "doneTask", slotName: 'doneTask', closable: false};
      if (auth.isRoleSign() === 'true') {
        this.conditionSelect = [ {label:'姓名', value:'userName'}, {label:'审核人员', value:'operatorUserName'}, {label:'身份证号', value:'idcardNumber'}, {label:'手机号', value:'mobile'}, {label:'进件ID', value:'loanId'}]
      }else{
        this.conditionSelect = [ {label:'姓名', value:'userName'}, {label:'身份证号', value:'idcardNumber'}, {label:'手机号', value:'mobile'}, {label:'进件ID', value:'loanId'}]
      }
      this.$refs.tabPage.$emit('open-tab', defaultPage);
    },
    methods: {
      dealDate(row, column) {
        return dateFormat(row[column['property']], 'yyyy-MM-dd hh:mm:ss');
      },
      handleSelectionChange(val) {
        console.log(val)
      },
      onSubmit(){
        this.queryParams.operatorUserName = ''
        this.queryParams.idcardNumber = ''
        this.queryParams.mobile = ''
        this.queryParams.loanId = ''
        this.queryParams.userName = ''
        if (!!this.keywordsType) {
          this.queryParams[this.keywordsType] = this.keywordsValue;
        }
        this.dataTable.queryParams = this.queryParams;
        this.$refs.dataTable.$emit('load-data');
      },
      openPage(row) {
        this.applicationInfo = row
        // var defaultPage = {label:"基本信息", name: "baseInfo", slotName: 'baseInfo', closable: true};
        // this.$refs.tabPage.$emit('open-tab',defaultPage);
        var defaultPage = {label:"进件详情", name: "detail", slotName: 'detail', closable: true};
        this.$refs.tabPage.$emit('open-tab',defaultPage);
      },
      openTelephoneInfo () {
        var defaultPage = {label:"手机号信息", name: "telephoneInfo", slotName: 'telephoneInfo', parentName:'detail', closable: true};
        this.$refs.tabPage.$emit('open-tab',defaultPage);
      }
    },
    components: {
      TabPage,
      DataTable,
      telephoneInfo,
      Detail
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
