import request from '@/utils/request-test'

export function getRules() {
  return request({
    url: '/rule/all/list',
    method: 'get'
  })
}

export function addRule(data) {
  return request({
    url: '/rule/add',
    method: 'post',
    data
  })
}

export function infoRule(id) {
  return request({
    url: '/rule/info/' + id,
    method: 'get'
  })
}

export function editRule(id, data) {
  return request({
    url: '/rule/edit/' + id,
    method: 'post',
    data
  })
}

export function delRule(id) {
  return request({
    url: `/rule/del/${id}`,
    method: 'delete'
  })
}
