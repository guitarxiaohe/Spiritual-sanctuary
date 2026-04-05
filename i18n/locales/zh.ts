export default defineI18nLocale(async locale => {
  const common = await import('./zh/common.json')
  const hero = await import('./zh/hero.json')
  const filterBar = await import('./zh/filter-bar.json')
  const index = await import('./zh/index.json')
  const create = await import('./zh/create.json')
  const story = await import('./zh/story.json')
  const comments = await import('./zh/comments.json')
  const categories = await import('./zh/categories.json')

  return {
    common: common.default,
    page: {
      hero: hero.default,
      'filter-bar': filterBar.default,
      index: index.default,
      create: create.default,
      story: story.default,
      comments: comments.default,
      categories: categories.default,
    },
  }
})
