import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('🔍 Vérification des utilisateurs dans la base Neon...\n')

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    if (users.length === 0) {
      console.log('✅ Aucun utilisateur dans la base de données')
    } else {
      console.log(`📊 ${users.length} utilisateur(s) trouvé(s):\n`)
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'Sans nom'}`)
        console.log(`   📧 Email: ${user.email}`)
        console.log(`   🆔 ID: ${user.id}`)
        console.log(`   ✅ Vérifié: ${user.emailVerified ? 'Oui' : 'Non'}`)
        console.log(`   📅 Créé: ${user.createdAt.toLocaleDateString('fr-FR')}\n`)
      })
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
