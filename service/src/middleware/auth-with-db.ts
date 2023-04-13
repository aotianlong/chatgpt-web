import { PrismaClient } from '@prisma/client'
import { isNotEmptyString } from '../utils/is'

const prisma = new PrismaClient()
prisma.sessions
  .findFirst({ where: { token: '1' } })
  .then(session => console.log(session))

const auth = async (req, res, next) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  if (isNotEmptyString(AUTH_SECRET_KEY)) {
    try {
      const Authorization = req.header('Authorization')
      const token = Authorization && Authorization.replace('Bearer ', '').trim()
      if (token) {
        const session = await prisma.sessions
          .findFirst({ where: { token } })
        if (session)
          return next()
      }
      throw new Error('Error: 无访问权限 | No access rights')
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    next()
  }
}

export { auth }
