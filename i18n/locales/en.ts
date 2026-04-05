export default defineI18nLocale(async locale => {
  const common = await import('./en/common.json')
  const hero = await import('./en/hero.json')
  const filterBar = await import('./en/filter-bar.json')
  const index = await import('./en/index.json')
  const create = await import('./en/create.json')
  const story = await import('./en/story.json')
  const comments = await import('./en/comments.json')
  const categories = await import('./en/categories.json')

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
