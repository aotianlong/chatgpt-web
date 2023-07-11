/*
 * 写一个从querystring获取名为model的参数，设置默认模型
 */

const modelNameKey = 'MBM_GPT_MODEL'

export function useModelByQuery(callback: any = null) {
  const params = new URLSearchParams(window.location.search)
  const model = params.get('model') || params.get('version')
  if (model) {
    localStorage.setItem(modelNameKey, model)
    return model
  }
  else {
    return localStorage.getItem(modelNameKey)
  }
}
