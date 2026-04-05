export default defineI18nLocale(async locale => {
  const common = await import('./ja/common.json')
  const hero = await import('./ja/hero.json')
  const filterBar = await import('./ja/filter-bar.json')
  const index = await import('./ja/index.json')
  const create = await import('./ja/create.json')
  const story = await import('./ja/story.json')
  const comments = await import('./ja/comments.json')
  const categories = await import('./ja/categories.json')

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
