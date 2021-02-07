<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder="用户名/昵称" clearable style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.groupId" placeholder="分组" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <router-link to="/permission/admin/add">
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="handleCreate">
          新增
        </el-button>
      </router-link>
    </div>
    <el-table v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="所在分组">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="用户名">
        <template slot-scope="{row}">
          <router-link :to="'/permission/admin/edit/'+row.id" class="link-type">
            <span>{{ row.username }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row['nickname'] }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row['mail'] }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row['updatedAt'] }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="205">
        <template slot-scope="scope">
          <router-link :to="'/permission/admin/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit" />
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelAdmin(scope.row.id)" />
          <el-button type="warning" size="mini" icon="el-icon-refresh" aria-placeholder="密码重置" @click="handleResetPassword(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :visible.sync="showResetWindow" title="重置密码">
      <el-form :model="reset" label-width="80px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="reset.password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="handleResetPasswordCancel">取消</el-button>
        <el-button type="primary" @click="handleResetPasswordOk">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAdminPage, delAdmin, resetPassword } from '@/api/admin'
import { getGroupAll } from '@/api/group'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'AdminIndex',
  components: { Pagination },
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
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        groupId: '',
        search: '',
        status: ''
      },
      groupOptions: [],
      statusOptions: [
        {
          id: 1,
          name: '正常'
        },
        {
          id: 0,
          name: '禁用'
        }
      ],
      showResetWindow: false,
      reset: {
        password: '',
        id: 0
      }
    }
  },
  created() {
    this.getList()
    this.getGroup()
  },
  methods: {
    getList() {
      this.listLoading = true
      const data = this.listQuery
      // if (data.groupId === '') {
      //   data.groupId = 0
      // }
      // if (data.status === '') {
      //   data.status = -1
      // }
      getAdminPage(data).then(res => {
        this.list = res.data.list
        this.listLoading = false
        console.log(res)
      })
    },
    handleDelAdmin(id) {
      this.$confirm('此操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAdmin(id).then(res => {
          if (res['code'] === 1) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.listQuery.pageNum = 1
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: res['msg']
            })
          }
        })
      })
    },
    handleResetPassword(id) {
      this.showResetWindow = true
      this.reset.id = id
      this.reset.password = ''
    },
    handleResetPasswordCancel() {
      this.showResetWindow = false
      this.reset.id = 0
      this.reset.password = ''
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    getGroup() {
      getGroupAll('').then(res => {
        this.groupOptions = res.data
      })
    },
    handleResetPasswordOk() {
      if (!this.reset.id > 0) {
        this.$message({
          type: 'warning',
          message: '请选择重置密码的管理员'
        })
        return
      }
      if (!/^(\w){6,20}$/.exec(this.reset.password)) {
        this.$message({
          type: 'warning',
          message: '密码格式错误（只能输入6-20个字母、数字、下划线 ）'
        })
        return
      }
      resetPassword(this.reset).then(res => {
        if (res['code'] === 1) {
          this.$message({
            type: 'success',
            message: '密码重置成功'
          })
          this.showResetWindow = false
        } else {
          this.$message({
            type: 'error',
            message: res['msg']
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
