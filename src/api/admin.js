import request from '@/utils/request-test'

/**
 * 获得管理员列表， 分页展示
 * @param data
 * @returns {AxiosPromise}
 */
export function getAdminPage(data) {
  return request({
    url: '/admin/page',
    method: 'get',
    params: data
  })
}

/**
 * 新增管理员
 * @param data
 * @returns {AxiosPromise}
 */
export function addAdmin(data) {
  return request({
    url: '/admin/add',
    method: 'post',
    data
  })
}

/**
 * 获得管理员详情
 * @param id
 * @returns {AxiosPromise}
 */
export function getAdminInfo(id) {
  return request({
    url: '/admin/info/id/' + id,
    method: 'get'
  })
}

export function updateAdmin(id, data) {
  return request({
    url: `/admin/edit/${id}`,
    method: 'put',
    data
  })
}
