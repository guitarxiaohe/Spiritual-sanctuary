export default defineI18nLocale(async locale => {
  const common = await import('./th/common.json')
  const hero = await import('./th/hero.json')
  const filterBar = await import('./th/filter-bar.json')
  const index = await import('./th/index.json')
  const create = await import('./th/create.json')
  const story = await import('./th/story.json')
  const comments = await import('./th/comments.json')
  const categories = await import('./th/categories.json')

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
