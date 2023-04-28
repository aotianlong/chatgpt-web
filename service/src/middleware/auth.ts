import { isNotEmptyString } from '../utils/is'
import { getAccessKey } from '../mbm/yingjin'

const auth = async (req, res, next) => {
   const accessKey = getAccessKey(req)
   try {
   if (!accessKey) {
        throw new Error('Error: 无访问权限 | No access rights')
   } else {
      next()
    }
   }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
}

export { auth }
