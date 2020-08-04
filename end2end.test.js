describe('an end2end test against a deployed instance', () => {
  // Connect to Weaviate
  const weaviate = require('./index.js')({
    scheme: 'https',
    host: 'demo.dataset.playground.semi.technology',
  });

  test('the typed graphql get method', () => {
    weaviate.graphql.get
      .things('Article', 'title url wordCount')
      .do()
      .then(function (result) {
        expect(result.data.Get.Things.Article.length).toBeGreaterThan(0);
      });
  });
  // Execute a request
});
