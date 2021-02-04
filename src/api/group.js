import request from '@/utils/request-test'

export function getGroups(data) {
  return request({
    url: '/group/page',
    method: 'get',
    params: data
  })
}

export function getGroupRoles() {
  return request({
    url: '/rule/all/list',
    method: 'get'
  })
}

export function addGroup(data) {
  return request({
    url: '/group/add',
    method: 'post',
    data
  })
}

export function updateGroup(id, data) {
  return request({
    url: `/group/edit/${id}`,
    method: 'put',
    data
  })
}

export function deleteGroup(id) {
  return request({
    url: `/group/del/${id}`,
    method: 'delete'
  })
}

export function getGroupRule(data) {
  return request({
    url: '/group_rule/rules/group',
    method: 'get',
    params: data
  })
}

export function getGroupAll(search) {
  return request({
    url: '/group/all?search=' + search,
    method: 'get'
  })
}
