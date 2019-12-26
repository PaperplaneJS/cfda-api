const allApi = []
const _api = method => path => (target, name, { value }) => {
  allApi.push({ path, method, func: value })
}

export const $getApiList = () => allApi

export const GET = _api('get')
export const POST = _api('post')
export const HEAD = _api('head')
export const PUT = _api('put')
export const PATCH = _api('patch')
export const DEL = _api('del')
export const DELETE = _api('del')

export default { $getApiList, GET, POST, HEAD, PUT, PATCH, DEL, DELETE }
