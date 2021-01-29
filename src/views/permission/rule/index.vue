<template>
  <div class="app-container">
    <router-link to="/permission/rule/add">
      <el-button type="success" size="small">
        新增
      </el-button>
    </router-link>
    <el-table v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%;margin-top: 30px;" :tree-props="{children: 'children'}">>
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" label="标题">
        <template slot-scope="{row}">
          <router-link :to="'/permission/rule/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="路由名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="路径">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="页面路径">
        <template slot-scope="scope">
          <span>{{ scope.row.component }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="菜单">
        <template slot-scope="scope">
          <span>{{ scope.row.hidden ? '否' : '是' }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="重定向路径">
        <template slot-scope="scope">
          <span>{{ scope.row.redirect }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="接口地址">
        <template slot-scope="scope">
          <span>{{ scope.row.api }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="排序">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="其他属性">
        <template slot-scope="scope">
          <p>是否缓存:{{ scope.row.noCache ? '不缓存' : '缓存' }}</p>
          <p>所属菜单:{{ scope.row.activeMenu ? scope.row.activeMenu : '无' }}</p>
          <p>固定：{{ scope.row.affix ? '是' : '否' }}</p>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="图标">
        <template slot-scope="scope">
          <i v-if="scope.row.icon !== '' && scope.row.icon.includes('el-icon')" :class="scope.row.icon" />
          <svg-icon v-else-if="scope.row.icon !== ''" :icon-class="scope.row.icon" class="meta-item__icon" />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <router-link :to="'/permission/rule/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit" />
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelRule(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getRules, delRule } from '@/api/rule'

export default {
  name: 'RulePermission',
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRules().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleAddRole() {
      this.$router.push({ name: 'RuleAdd' })
      // this.role = Object.assign({}, defaultRole)
      // if (this.$refs.tree) {
      //   this.$refs.tree.setCheckedNodes([])
      // }
      // this.dialogType = 'new'
      // this.dialogVisible = true
    },
    handleDelRule(id) {
      this.$confirm('此操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRule(id).then(res => {
          this.$notify({
            title: '成功',
            dangerouslyUseHTMLString: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
}
</style>
