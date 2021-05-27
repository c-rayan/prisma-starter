import { Post, PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that you can use async/await
async function main() {
  // ... you will write your Prisma Client queries here
  await prisma.user.create({
    data: {
      email: 'rayancastro@mail.com',
      name: 'Ryan Castro',
    }
  })

  await prisma.user.create({
    data: {
      email: 'natashacastro@mail.com',
      name: 'Natasha Castro'
    }
  })
  
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)

  for (let user of allUsers) {
    await prisma.post.create({
      data: {
        title: `This is any post created from: ${user.name}`,
        author: {
          connect: { email: user.email }
        }
      }
    })
  }

  const allUsersAndPosts = await prisma.user.findMany({
    include: { posts: true }
  })
  console.dir(allUsersAndPosts, { depth: null })

  for (let user of allUsersAndPosts) {
    await prisma.user.delete({ where: { id: user.id } })
    
    for (let post of user.posts) {
      await prisma.post.delete({ where: { id: post.id } })
    }
  }
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
