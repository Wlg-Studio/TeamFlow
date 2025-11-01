import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTables() {
  try {
    console.log('🔍 Vérification de toutes les tables dans Neon...\n')

    // Compter les enregistrements dans chaque table
    const [
      usersCount,
      accountsCount,
      sessionsCount,
      orgsCount,
      boardsCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.account.count(),
      prisma.session.count(),
      prisma.organization.count(),
      prisma.board.count(),
    ])

    console.log('📊 État de la base de données:')
    console.log(`   👤 Users: ${usersCount}`)
    console.log(`   🔐 Accounts: ${accountsCount}`)
    console.log(`   🎫 Sessions: ${sessionsCount}`)
    console.log(`   🏢 Organizations: ${orgsCount}`)
    console.log(`   📋 Boards: ${boardsCount}\n`)

    // Afficher les comptes si présents
    if (accountsCount > 0) {
      console.log('🔐 Comptes trouvés:')
      const accounts = await prisma.account.findMany({
        include: {
          user: true,
        },
      })
      accounts.forEach((account) => {
        console.log(`   Provider: ${account.provider}`)
        console.log(`   User: ${account.user.email}\n`)
      })
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTables()
