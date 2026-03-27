import { prisma } from '../lib/prisma'

const SEED_IDS = {
  users: {
    alice123: 'b63caf09-430a-4f14-b3a7-6fc9326140c1',
    bob456: 'c19787dc-a885-4ab4-86e7-09aacdbd77ee',
  },
  boards: {
    ecommerceBoard: 'efd5d03e-f6d2-404f-943a-cf33b5fe13dc',
  },
  columns: {
    backlog: 'f7a30c11-4af5-45cb-9075-86db757dbc90',
    todo: '87a7bbf8-1929-4c95-adf4-4809ef7f32e7',
    done: 'de54207f-e673-44d1-b099-92c891086e60',
  },
  tasks: {
    addListProductsFeature: 'e36b2cca-e8bd-434b-bdbb-ebdf6d9ca64a',
  },
  comments: {
    comment1: 'a521d763-4571-4069-952a-0d87e2e3cd24',
    comment2: '39c0d627-6d8b-40c3-8477-74fb2ccfd189',
  },
} as const

async function main() {
  // Create a new user with a board
  const alice123WithBoard = await prisma.user.upsert({
    where: { id: 'b63caf09-430a-4f14-b3a7-6fc9326140c1' },
    update: {},
    create: {
      id: SEED_IDS.users.alice123,
      username: 'alice123',
      passwordHash:
        '$2b$10$.hvXMG25HlSoV2fj30N.quM/V//d3W2CRst9A3izN3QhQQ2LkMHPu', // Hash for 'password123'
      bio: 'Hello, I am Alice!',
      accountType: 'DEMO',
      boards: {
        create: {
          id: SEED_IDS.boards.ecommerceBoard,
          title: 'E-commerce Board',
          description:
            'This board contains tasks related to our e-commerce project.',
        },
      },
      boardMembers: {
        create: {
          boardId: SEED_IDS.boards.ecommerceBoard,
          role: 'OWNER',
        },
      },
      refreshTokens: {
        create: {
          tokenHash:
            '215c69d2d0c4e873d1d19e6537411fa171c8f33402bc1109b4321e4c78ac9715', // Hash for a sample refresh token
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
        },
      },
    },
    include: {
      boards: true,
      boardMembers: true,
      refreshTokens: true,
    },
  })
  console.log('Created user with board:', alice123WithBoard)

  // Create a new user with a board membership
  const bob456 = await prisma.user.upsert({
    where: { id: SEED_IDS.users.bob456 },
    update: {},
    create: {
      id: SEED_IDS.users.bob456,
      username: 'bob456',
      passwordHash:
        '$2b$10$0JxkcNk6vffc9KqfSGxX6u1Tg/OTMD/UJVehRlLtGDG2c9CY4U/EO', // Hash for 'password456'
      bio: 'Hello, I am Bob!',
      accountType: 'DEMO',
      boardMembers: {
        create: {
          boardId: SEED_IDS.boards.ecommerceBoard,
          role: 'MEMBER',
        },
      },
      refreshTokens: {
        create: {
          tokenHash:
            'f4ad2dc8e109c1b60214d773ea4458952cfc9028597268715b72b0351f270eaf', // Hash for a sample refresh token
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
        },
      },
    },
    include: {
      boardMembers: true,
      refreshTokens: true,
    },
  })
  console.log('Created user with a board membership:', bob456)

  // Add some columns to the board
  const backlog = await prisma.column.upsert({
    where: { id: SEED_IDS.columns.backlog },
    update: {},
    create: {
      id: SEED_IDS.columns.backlog,
      title: 'Backlog',
      description: 'Tasks that are planned but not yet started.',
      boardId: SEED_IDS.boards.ecommerceBoard,
      order: 0,
    },
  })
  console.log('Created column:', backlog)

  const todo = await prisma.column.upsert({
    where: { id: SEED_IDS.columns.todo },
    update: {},
    create: {
      id: SEED_IDS.columns.todo,
      title: 'To Do',
      description: 'Tasks that are currently being worked on.',
      boardId: SEED_IDS.boards.ecommerceBoard,
      order: 1,
    },
  })
  console.log('Created column:', todo)

  const done = await prisma.column.upsert({
    where: { id: SEED_IDS.columns.done },
    update: {},
    create: {
      id: SEED_IDS.columns.done,
      title: 'Done',
      description: 'Tasks that have been completed.',
      boardId: SEED_IDS.boards.ecommerceBoard,
      order: 2,
    },
  })
  console.log('Created column:', done)

  // Add a task to the board
  const task1 = await prisma.task.upsert({
    where: { id: SEED_IDS.tasks.addListProductsFeature },
    update: {},
    create: {
      id: SEED_IDS.tasks.addListProductsFeature,
      title: 'Add list products feature',
      description:
        'Implement the feature to list products on the e-commerce site.',
      dueDate: new Date('2026-07-01'),
      columnId: SEED_IDS.columns.backlog,
      ownerId: SEED_IDS.users.alice123,
      order: 0,
    },
  })
  console.log('Created task:', task1)

  // Add a comment to the task
  const comment1 = await prisma.comment.upsert({
    where: { id: SEED_IDS.comments.comment1 },
    update: {},
    create: {
      id: SEED_IDS.comments.comment1,
      content: 'Can I work on this task?',
      taskId: SEED_IDS.tasks.addListProductsFeature,
      userId: SEED_IDS.users.bob456,
    },
  })
  console.log('Created comment:', comment1)

  // Add a comment to the task
  const comment2 = await prisma.comment.upsert({
    where: { id: SEED_IDS.comments.comment2 },
    update: {},
    create: {
      id: SEED_IDS.comments.comment2,
      content:
        'Yes, that would be great! Let me know if you have any questions.',
      taskId: SEED_IDS.tasks.addListProductsFeature,
      userId: SEED_IDS.users.alice123,
    },
  })
  console.log('Created comment:', comment2)

  // Assign the task to Bob
  const assignment1 = await prisma.taskAssignment.upsert({
    where: {
      taskId_userId: { userId: bob456.id, taskId: task1.id },
    },
    update: {},
    create: {
      taskId: SEED_IDS.tasks.addListProductsFeature,
      userId: SEED_IDS.users.bob456,
    },
  })
  console.log('Created task assignment:', assignment1)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
