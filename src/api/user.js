import request from '@/utils/request'
import requestTest from '@/utils/request-test'

export function login(data) {
  return requestTest({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return requestTest({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
