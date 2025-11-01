import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetUser(email: string) {
  try {
    // Supprimer l'utilisateur et toutes ses données associées
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log(`❌ Aucun utilisateur trouvé avec l'email: ${email}`)
      return
    }

    console.log(`🔍 Utilisateur trouvé: ${user.name} (${user.email})`)
    console.log('🗑️  Suppression en cours...')

    await prisma.user.delete({
      where: { email },
    })

    console.log('✅ Utilisateur supprimé avec succès!')
    console.log('🎉 Vous pouvez maintenant créer un nouveau compte.')
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

const email = process.argv[2]

if (!email) {
  console.log('Usage: tsx scripts/reset-user.ts <email>')
  process.exit(1)
}

resetUser(email)
