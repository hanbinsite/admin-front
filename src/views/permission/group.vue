<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分支名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getRoles" />

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="role.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入说明"
          />
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { addGroup, deleteGroup, getGroupRoles, getGroups, updateGroup, getGroupRule } from '@/api/group'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: [],
  rules: []
}

export default {
  components: { Pagination },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    routesData() {
      console.log(this.routes)
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      const res = await getGroupRoles()
      // const routes = []
      const rules = this.loadMenu(res.data)
      this.serviceRoutes = rules
      this.routes = rules
      // this.routes = this.generateRoutes(rules)
    },
    async getRoles() {
      const res = await getGroups(this.listQuery)
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
      this.rolesList = res.data.list
      this.total = res.data.totalSize
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        if (route.children) {
          const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

          if (route.children && onlyOneShowingChild && !route.alwaysShow) {
            route = onlyOneShowingChild
          }
        }
        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
          id: route.id

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        // const routes = this.generateRoutes(this.role.routes)
        getGroupRule({ groupId: scope.row.id }).then(res => {
          const routes = res.data
          // let routesLoad = this.loadMenu(routes)
          // routesLoad = this.generateRoutes(routesLoad)
          this.$refs.tree.setCheckedNodes(this.generateArr(this.loadMenu(routes)))
          // set checked state of a node not affects its father and child nodes
          this.checkStrictly = false
        })
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定删除分组?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteGroup(row.id)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.listQuery.pageNum = 1
          await this.getRoles()
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      console.log(checkedKeys)

      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      this.role.rules = checkedKeys
      console.log(this.role.routes)

      if (isEdit) {
        await updateGroup(this.role.id, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          // if (this.rolesList[index].key === this.role.key) {
          //   this.rolesList.splice(index, 1, Object.assign({}, this.role))
          //   break
          // }
        }
      } else {
        // const { data } = await addGroup(this.role)
        await addGroup(this.role)
        // this.role.key = data.key
        // this.rolesList.push(this.role)
      }

      // const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        message: '保存成功',
        type: 'success'
      })
      this.listQuery.pageNum = 1
      await this.getRoles()
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },
    loadMenu(menu) {
      const rules = []
      for (let i = 0; i < menu.length; i++) {
        const rule = menu[i]
        rule['meta'] = {
          'affix': menu[i]['affix'] === 1,
          'noCache': menu[i]['noCache'] === 1,
          'icon': menu[i]['icon'] !== '' ? menu[i]['icon'] : '',
          'title': menu[i]['title'] !== '' ? menu[i]['title'] : '',
          'activeMenu': menu[i]['activeMenu'] !== '' ? menu[i]['activeMenu'] : ''
        }
        if (menu[i]['children']) {
          rule['children'] = this.loadMenu(menu[i]['children'])
        }
        rules.push(rule)
      }
      return rules
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
