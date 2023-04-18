import { PrismaClient } from '@prisma/client'
import _ from 'lodash'

const prisma = new PrismaClient()

const getSession = (req) => {
	let token = req
	if (!_.isString(req)) {
	  const Authorization = req.header('Authorization')
	  token = Authorization && Authorization.replace('Bearer ', '').trim()
	}
	console.log(token)
	if (token) {
		const session = prisma.sessions.findFirst({ where: { token } })
		return session
	} else {
		return Promise.resolve(null)
	}
}

const auth = async (req, res, next) => {
	const session = await getSession(req)
	console.log('session', session)

	try {
		if (!session) {
			throw new Error('Error: 无访问权限 | No access rights')
		} else {
			next()
		}
	}
	catch (error) {
		res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
	}
}

export { auth, getSession }
