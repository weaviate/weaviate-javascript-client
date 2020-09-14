const weaviate = require('../index');

describe('an end2end test against a deployed instance', () => {
  const client = weaviate.client({
    scheme: 'https',
    host: 'demo.dataset.playground.semi.technology',
  });

  test('graphql get method with minimal fields', () => {
    return client.graphql
      .get()
      .withClassName('Article')
      .withFields('title url wordCount')
      .do()
      .then(function (result) {
        expect(result.data.Get.Things.Article.length).toBeGreaterThan(0);
      });
  });

  test('graphql get method with optional fields', () => {
    return (
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
          expect(
            result.data.Get.Things.Article[0]['url'].length,
          ).toBeGreaterThan(0);
          expect(
            result.data.Get.Things.Article[0]['wordCount'],
          ).toBeGreaterThanOrEqual(50);
        })
    );
  });

  test('graphql aggregate method with minimal fields', () => {
    return client.graphql
      .aggregate()
      .withClassName('Article')
      .withFields('meta { count }')
      .do()
      .then(res => {
        const count = res.data.Aggregate.Things.Article[0].meta.count;
        expect(count).toBeGreaterThan(1000);
      })
      .catch(e => fail("it should not have error'd" + e));
  });

  test('graphql aggregate method optional fields', () => {
    // Note this test is ignoring `.withGroup()` due to

    return client.graphql
      .aggregate()
      .withClassName('Article')
      .withWhere({
        path: ['title'],
        valueString: 'apple',
        operator: 'Equal',
      })
      .withLimit(10)
      .withFields('meta { count }')
      .do()
      .then(res => {
        const count = res.data.Aggregate.Things.Article[0].meta.count;
        expect(count).toEqual(3);
      })
      .catch(e => fail("it should not have error'd" + e));
  });
});
