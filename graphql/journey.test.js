const weaviate = require('../index');

describe('an end2end test against a deployed instance', () => {
  const client = weaviate.client({
    scheme: 'https',
    host: 'demo.dataset.playground.semi.technology',
  });

  test('the typed graphql get method with minimal fields', () => {
    client.graphql
      .get()
      .withClassName('Article')
      .withFields('title url wordCount')
      .do()
      .then(function (result) {
        expect(result.data.Get.Things.Article.length).toBeGreaterThan(0);
      });
  });

  test('the typed graphql get method with optional fields', () => {
    client.graphql
      .get()
      .withClassName('Article')
      // .withKind is optional, would default to Things anyway
      .withKind(weaviate.KIND_THINGS)
      .withFields('title url wordCount')
      .withExplore({concepts: ['news'], certainty: 0.1})
      .withWhere({
        operator: 'GreaterThanEqual',
        path: ['wordCount'],
        valueInt: 50,
      })
      .withLimit(7)
      .do()
      .then(function (result) {
        expect(result.data.Get.Things.Article.length).toBe(7);
        expect(
          result.data.Get.Things.Article[0]['title'].length,
        ).toBeGreaterThan(0);
        expect(result.data.Get.Things.Article[0]['url'].length).toBeGreaterThan(
          0,
        );
        expect(
          result.data.Get.Things.Article[0]['wordCount'],
        ).toBeGreaterThanOrEqual(50);
      });
  });
});
