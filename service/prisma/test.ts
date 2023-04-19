import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  const session = await prisma.sessions.findFirst({
						 include: {user: true}})
  console.log(session)
  console.log(session.user)

  const sessions = await prisma.sessions.findMany({include: {user: true, _count: {select: {posts: true}}}})
  console.log(sessions)
}

main()
