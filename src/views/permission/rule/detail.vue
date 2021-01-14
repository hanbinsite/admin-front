<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm mar-top">
    <el-form-item label="所属父级" prop="parentId">
      <el-select v-model="ruleForm.parentId" placeholder="请选择父级,不选择则为顶级" style="width: 100%;" clearable filterable>
        <el-option
          v-for="item in parentList"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="菜单标题" prop="title">
      <el-input v-model="ruleForm.title" />
    </el-form-item>
    <el-form-item label="路由名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="路由路径" prop="path">
      <el-input v-model="ruleForm.path" />
    </el-form-item>
    <el-form-item label="组件地址" prop="component">
      <el-input v-model="ruleForm.component" />
    </el-form-item>
    <el-form-item label="重定向地址" prop="redirect">
      <el-input v-model="ruleForm.redirect" />
    </el-form-item>
    <el-form-item label="接口地址" prop="api">
      <el-input v-model="ruleForm.api" />
    </el-form-item>
    <el-form-item label="图标" prop="icon">
      <el-input v-model="ruleForm.icon" />
    </el-form-item>
    <el-form-item label="所属上级，默认不填" prop="activeMenu">
      <el-input v-model="ruleForm.activeMenu" />
    </el-form-item>
    <el-form-item label="是否隐藏" prop="hidden">
      <el-radio-group v-model="ruleForm.hidden">
        <el-radio :label="0">否</el-radio>
        <el-radio :label="1">是</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否固定" prop="affix">
      <el-radio-group v-model="ruleForm.affix">
        <el-radio :label="0">否</el-radio>
        <el-radio :label="1">是</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否缓存" prop="noCache">
      <el-radio-group v-model="ruleForm.noCache">
        <el-radio :label="0">是</el-radio>
        <el-radio :label="1">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="ruleForm.status">
        <el-radio :label="0">禁用</el-radio>
        <el-radio :label="1">启用</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input v-model.number="ruleForm.sort" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getGroupRoles } from '@/api/group'
import { addRule } from '@/api/rule'

export default {
  name: 'RuleDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const checkSort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('排序不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      ruleForm: {
        name: '',
        status: 1,
        noCache: 1,
        affix: 0,
        hidden: 0,
        sort: 0,
        title: '',
        path: '',
        component: 'Layout',
        redirect: '',
        api: '',
        icon: '',
        parentId: '',
        activeMenu: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入路由名称', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入路由标题', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入路由组件', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { validator: checkSort, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        noCache: [
          { required: true, message: '请选择是否缓存', trigger: 'change' }
        ],
        affix: [
          { required: true, message: '请选择是否固定', trigger: 'change' }
        ],
        hidden: [
          { required: true, message: '请选择是否隐藏', trigger: 'change' }
        ]
      },
      parentList: []
    }
  },
  created() {
    this.initRule()
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
          if (this.isEdit) {
            console.log('编辑')
          } else {
            addRule(this.ruleForm).then(res => {
            })
          }
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: '保存成功',
            type: 'success'
          })
          // this.$router.push({ path: '/permission/rule/index' })
          // 调用全局挂载的方法,关闭当前标签页
          this.$store.dispatch('/permission/rule/index', this.$route)
          // 返回上一步路由，返回上一个标签页
          this.$router.go(-1)
        } else {
          alert('保存失败，请稍后重试')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    initRule() {
      getGroupRoles().then(res => {
        const rule = this.loadMenu(res.data, '', 1)
        this.parentList = rule
        console.log(rule)
      })
    },
    loadMenu(menu, prefix, level) {
      let rules = []
      for (let i = 0; i < menu.length; i++) {
        let prefixNow = ''
        if (level > 1) {
          if (level > 2) {
            for (let j = 2; j < level; j++) {
              prefixNow += ' '
            }
          }
          if (menu.length === (i + 1)) {
            prefixNow = prefix + '﹂'
          } else {
            prefixNow = prefix + '|-'
          }
        } else {
          prefixNow = ''
        }
        const rule = menu[i]
        rule['title'] = prefixNow + rule['title']
        rules.push(rule)
        console.log(rule['title'] + ':' + level + ':' + prefix + ':' + menu.length + ':' + i)
        if (menu[i]['children']) {
          const childRule = this.loadMenu(menu[i]['children'], prefixNow, (level + 1))
          rules = rules.concat(childRule)
        }
      }
      return rules
    }
  }
}
</script>
<style lang="scss" scoped>
.width-50 {
  width: 30%;
}
.mar-top{
  margin-top: 30px;
}
</style>
