<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
    <el-form-item label="菜单标题" prop="name">
      <el-input v-model="ruleForm.title" />
    </el-form-item>
    <el-form-item label="路由名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="路由路径" prop="name">
      <el-input v-model="ruleForm.path" />
    </el-form-item>
    <el-form-item label="组件地址" prop="name">
      <el-input v-model="ruleForm.component" />
    </el-form-item>
    <el-form-item label="重定向地址" prop="name">
      <el-input v-model="ruleForm.redirect" />
    </el-form-item>
    <el-form-item label="接口地址" prop="name">
      <el-input v-model="ruleForm.api" />
    </el-form-item>
    <el-form-item label="图标" prop="name">
      <el-input v-model="ruleForm.icon" />
    </el-form-item>
    <el-form-item label="是否隐藏" prop="name">
      <el-radio-group v-model="ruleForm.hidden">
        <el-radio :label="0">否</el-radio>
        <el-radio :label="1">是</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否固定" prop="name">
      <el-radio-group v-model="ruleForm.affix">
        <el-radio :label="0">否</el-radio>
        <el-radio :label="1">是</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否缓存" prop="name">
      <el-radio-group v-model="ruleForm.noCache">
        <el-radio :label="0">是</el-radio>
        <el-radio :label="1">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="所属父级" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="状态" prop="name">
      <el-radio-group v-model="ruleForm.status">
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="1">启用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="排序" prop="name">
      <el-input v-model="ruleForm.sort" type="number" />
    </el-form-item>
    <el-form-item label="活动区域" prop="region">
      <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai" />
        <el-option label="区域二" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="活动时间" required>
      <el-col :span="11">
        <el-form-item prop="date1">
          <el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
      </el-col>
      <el-col class="line" :span="2">-</el-col>
      <el-col :span="11">
        <el-form-item prop="date2">
          <el-time-picker v-model="ruleForm.date2" placeholder="选择时间" style="width: 100%;" />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="即时配送" prop="delivery">
      <el-switch v-model="ruleForm.delivery" />
    </el-form-item>
    <el-form-item label="活动性质" prop="type">
      <el-checkbox-group v-model="ruleForm.type">
        <el-checkbox label="美食/餐厅线上活动" name="type" />
        <el-checkbox label="地推活动" name="type" />
        <el-checkbox label="线下主题活动" name="type" />
        <el-checkbox label="单纯品牌曝光" name="type" />
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="特殊资源" prop="resource">
      <el-radio-group v-model="ruleForm.resource">
        <el-radio label="线上品牌商赞助" />
        <el-radio label="线下场地免费" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="活动形式" prop="desc">
      <el-input v-model="ruleForm.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'RuleDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        status: 1,
        noCache: 1,
        affix: 0,
        hidden: 0,
        sort: 0,
        title: '',
        path: '',
        component: '',
        redirect: '',
        api: '',
        icon: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      // const id = this.$route.params && this.$route.params.id
      // this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    // this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
