export default defineI18nLocale(async locale => {
  const common = await import('./ko/common.json')
  const hero = await import('./ko/hero.json')
  const filterBar = await import('./ko/filter-bar.json')
  const index = await import('./ko/index.json')
  const create = await import('./ko/create.json')
  const story = await import('./ko/story.json')
  const comments = await import('./ko/comments.json')
  const categories = await import('./ko/categories.json')

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
