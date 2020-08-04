describe('an end2end test against a deployed instance', () => {
  // Connect to Weaviate
  const weaviate = require('./index.js')({
    scheme: 'https',
    host: 'demo.dataset.playground.semi.technology',
  });

  test('the typed graphql get method with minimal fields', () => {
    weaviate.graphql.get
      .things('Article', 'title url wordCount')
      .do()
      .then(function (result) {
        expect(result.data.Get.Things.Article.length).toBeGreaterThan(0);
      });
  });

  test('the typed graphql get method with optional fields', () => {
    weaviate.graphql.get
      .things('Article', 'title url wordCount')
      .withExplore({concepts: ['news'], certainty: 0.1})
      .withWhere({
        operator: 'GreaterThanEqual',
        path: ['wordCount'],
        valueInt: 50,
      })
      .do()
      .then(function (result) {
        expect(result.data.Get.Things.Article.length).toBeGreaterThan(0);
      });
  });
  // Execute a request
});
