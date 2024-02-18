import db from '../db'

export default async function createServerDb(serverId: string): Promise<void> {
  await db.server.upsert({
    where: { serverId },
    create: { serverId, permissionBot: 'public' },
    update: {}
  })
}
