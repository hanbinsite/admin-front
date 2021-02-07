<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm mar-top">
    <el-form-item label="所属分组" prop="groupId">
      <el-select v-model="ruleForm.groupId" placeholder="请选择所属管理员分组" style="width: 100%;" clearable filterable>
        <el-option
          v-for="item in groupList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input v-model="ruleForm.username" />
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="ruleForm.mobile" />
    </el-form-item>
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="ruleForm.nickname" />
    </el-form-item>
    <el-form-item label="邮箱" prop="mail">
      <el-input v-model="ruleForm.mail" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="ruleForm.password" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="ruleForm.status">
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="1">启用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getGroupAll } from '@/api/group'
import { addAdmin } from '@/api/admin'

export default {
  name: 'AdminAdd',
  data() {
    const checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1\d{10}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    const checkPassword = (rule, value, callback) => {
      const passwordReg = /^(\w){6,20}$/
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      if (passwordReg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的密码'))
      }
    }
    return {
      ruleForm: {
        status: 1,
        username: '',
        nickname: '',
        groupId: '',
        mobile: '',
        mail: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入管理员昵称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        groupId: [
          { required: true, message: '请选择管理员分组', trigger: 'change' }
        ]
      },
      groupList: []
    }
  },
  created() {
    this.getGroup()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm['password'] = '1'
          addAdmin(this.ruleForm).then(res => {
            if (res['code'] === 1) {
              this.$notify({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: '保存成功',
                type: 'success'
              })
              // this.$router.push({ path: '/permission/rule/index' })
              // 调用全局挂载的方法,关闭当前标签页
              this.$store.dispatch('/permission/admin/index', this.$route)
              // 返回上一步路由，返回上一个标签页
              this.$router.go(-1)
            } else {
              this.$notify({
                title: '失败',
                dangerouslyUseHTMLString: true,
                message: res['msg'],
                type: 'error'
              })
            }
          })
        } else {
          alert('保存失败，请稍后重试')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getGroup() {
      getGroupAll('').then(res => {
        this.groupList = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
