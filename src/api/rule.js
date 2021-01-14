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
