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
          <el-button type="warning" size="mini" icon="el-icon-refresh" aria-placeholder="密码重置" @click="handleDelAdmin(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getAdminPage } from '@/api/admin'
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
      ]
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
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleCreate() {
    },
    getGroup() {
      getGroupAll('').then(res => {
        this.groupOptions = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
