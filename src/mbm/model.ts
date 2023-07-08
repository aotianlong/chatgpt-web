/*
 * 写一个从querystring获取名为model的参数，设置默认模型
 */

const modelNameKey = 'MBM_GPT_MODEL'

function defaultCallback(model) {
	localStorage.set(modelNameKey, model);
	return Promise.resolve(model);
}

export function useModelByQuery(callback){
  const model = new URLSearchParams(window.location.search).get('model')
  if (model) {
   return defaultCallback(model).then((model) => {
      if (callback)
	      callback(model)
      }
  })
}
