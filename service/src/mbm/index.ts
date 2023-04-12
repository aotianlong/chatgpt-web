const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
prisma.users.findMany().then(users => console.log(users))

export {}
