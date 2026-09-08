import { db } from '../src/lib/db'

async function main() {
  const models: [string, any][] = [
    ['Member', db.member],
    ['GuestbookEntry', db.guestbookEntry],
    ['NewsArticle', db.newsArticle],
    ['GalleryPhoto', db.galleryPhoto],
    ['Game', db.game],
    ['GameMoment', db.gameMoment],
    ['GamePlayerStat', db.gamePlayerStat],
    ['GameCompatibility', db.gameCompatibility],
    ['DnDCharacter', db.dnDCharacter],
    ['DnDCampaign', db.dnDCampaign],
    ['DnDCampaignImage', db.dnDCampaignImage],
    ['PortfolioProject', db.portfolioProject],
    ['PortfolioProjectImage', db.portfolioProjectImage],
    ['Achievement', db.achievement],
    ['AchievementImage', db.achievementImage],
  ]
  for (const [name, model] of models) {
    try {
      const count = await model.count()
      console.log(`${name}: ${count} rows`)
    } catch(e) {
      console.log(`${name}: ERROR - ${(e as Error).message}`)
    }
  }
  await db.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
