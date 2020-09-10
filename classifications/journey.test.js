const weaviate = require('../index');

const targetDessertId = 'cd54852a-209d-423b-bf1c-884468215237';
const targetSavoryId = 'e5da0127-327e-4184-85b8-7b9d1af4a850';
const unclassifiedOneId = '8bde517e-01a7-47c9-8db6-d09a2e8d3db7';
const unclassifiedTwoId = '39a04208-b6b6-4df4-9aba-caed9e0df2c3';

describe('a classification journey', () => {
  describe('knn - manually polling the status', () => {
    const client = weaviate.client({
      scheme: 'http',
      host: 'localhost:8080',
    });

    it('setups the schema and data', () => setup(client));

    let id; // will be assigned by weaviate, see then block in scheduler

    it('triggers a classification without waiting', () => {
      return client.classifications
        .scheduler()
        .withType('knn')
        .withK(3)
        .withClassName('ClassificationJourneySource')
        .withClassifyProperties(['toTarget'])
        .withBasedOnProperties(['description'])
        .do()
        .then(res => {
          expect(res.id).toBeDefined();
          id = res.id;
        })
        .catch(e => fail('it should not have errord: ' + e));
    });

    it('is now running', () => {
      return client.classifications
        .getter()
        .withId(id)
        .do()
        .then(res => {
          expect(res.status).toEqual('running');
        });
    });

    it('eventually turns to completed', () => {
      const timeout = 5 * 1000;

      return new Promise((resolve, reject) => {
        setTimeout(reject, timeout);
        setInterval(() => {
          client.classifications
            .getter()
            .withId(id)
            .do()
            .then(res => {
              res.status == 'completed' && resolve();
            });
        }, 500);
      }).catch(() => fail('timed out'));
    });

    it('waits for es index updates to have refreshed', () => {
      return new Promise(resolve => setTimeout(resolve, 1200));
    });

    it('has correctly classified the items', () => {
      return Promise.all([
        client.data
          .getterById()
          .withId(unclassifiedOneId)
          .do()
          .then(res => {
            expect(res.schema.toTarget[0].beacon).toEqual(
              beaconTo(targetDessertId),
            );
          })
          .catch(e => fail('it should not have errord: ' + e)),
        client.data
          .getterById()
          .withId(unclassifiedTwoId)
          .do()
          .then(res => {
            expect(res.schema.toTarget[0].beacon).toEqual(
              beaconTo(targetSavoryId),
            );
          })
          .catch(e => fail('it should not have errord: ' + e)),
      ]);
    });

    it('tears down and cleans up', () => cleanup(client));
  });

  describe("knn - using the client's wait method", () => {
    const client = weaviate.client({
      scheme: 'http',
      host: 'localhost:8080',
    });

    it('setups the schema and data', () => setup(client));

    let id; // will be assigned by weaviate, see then block in scheduler

    it('triggers a classification without waiting', async () => {
      return client.classifications
        .scheduler()
        .withType('knn')
        .withK(3)
        .withClassName('ClassificationJourneySource')
        .withClassifyProperties(['toTarget'])
        .withBasedOnProperties(['description'])
        .withWaitForCompletion()
        .withWaitTimeout(60 * 1000)
        .do()
        .then(res => {
          expect(res.status).toEqual('completed');
          id = res.id;
        })
        .catch(e => fail('it should not have errord: ' + e));
    });

    it('waits for es index updates to have refreshed', () => {
      return new Promise(resolve => setTimeout(resolve, 1200));
    });

    it('has correctly classified the items', () => {
      return Promise.all([
        client.data
          .getterById()
          .withId(unclassifiedOneId)
          .do()
          .then(res => {
            expect(res.schema.toTarget[0].beacon).toEqual(
              beaconTo(targetDessertId),
            );
          })
          .catch(e => fail('it should not have errord: ' + e)),
        client.data
          .getterById()
          .withId(unclassifiedTwoId)
          .do()
          .then(res => {
            expect(res.schema.toTarget[0].beacon).toEqual(
              beaconTo(targetSavoryId),
            );
          })
          .catch(e => fail('it should not have errord: ' + e)),
      ]);
    });

    it('tears down and cleans up', () => cleanup(client));
  });

  describe('knn - running into a timeout', () => {
    const client = weaviate.client({
      scheme: 'http',
      host: 'localhost:8080',
    });

    it('setups the schema and data', () => setup(client));

    it('fails a classification with an impossibly small timeout', () => {
      return client.classifications
        .scheduler()
        .withType('knn')
        .withK(3)
        .withClassName('ClassificationJourneySource')
        .withClassifyProperties(['toTarget'])
        .withBasedOnProperties(['description'])
        .withWaitForCompletion()
        .withWaitTimeout(1) // that's going to be difficult ;-)
        .do()
        .then(res => {
          fail("it should have error'd");
        })
        .catch(e => {
          expect(e).toEqual(
            new Error(
              "classification didn't finish within configured timeout, " +
                'set larger timeout with .withWaitTimeout(timeout)',
            ),
          );
        });
    });

    it('tears down and cleans up', () => cleanup(client));
  });
});

const setup = async client => {
  targetClass = {
    class: 'ClassificationJourneyTarget',
    properties: [
      {
        name: 'name',
        dataType: ['string'],
      },
    ],
  };

  await client.schema.classCreator().withClass(targetClass).do();

  targetClass = {
    class: 'ClassificationJourneySource',
    properties: [
      {
        name: 'description',
        dataType: ['text'],
      },
      {
        name: 'toTarget',
        dataType: ['ClassificationJourneyTarget'],
      },
    ],
  };

  await client.schema.classCreator().withClass(targetClass).do();

  // import targets
  await Promise.all([
    client.data
      .creator()
      .withClassName('ClassificationJourneyTarget')
      .withSchema({name: 'Dessert'})
      .withId(targetDessertId)
      .do(),
    client.data
      .creator()
      .withClassName('ClassificationJourneyTarget')
      .withSchema({name: 'Savory'})
      .withId(targetSavoryId)
      .do(),
  ]);

  // import training data
  await Promise.all([
    client.data
      .creator()
      .withClassName('ClassificationJourneySource')
      .withSchema({
        description: 'Lots of Sugar, Cream and Flour. Maybe Eggs.',
        toTarget: [{beacon: beaconTo(targetDessertId)}],
      })
      .do(),
    client.data
      .creator()
      .withClassName('ClassificationJourneySource')
      .withSchema({
        description: 'French Fries and Sausage',
        toTarget: [{beacon: beaconTo(targetSavoryId)}],
      })
      .do(),
  ]);

  // import to-be-classifieds
  await Promise.all([
    client.data
      .creator()
      .withId(unclassifiedOneId)
      .withClassName('ClassificationJourneySource')
      .withSchema({
        description: 'This sweet cake contains sugar.',
      })
      .do(),
    client.data
      .creator()
      .withId(unclassifiedTwoId)
      .withClassName('ClassificationJourneySource')
      .withSchema({
        description: 'Potatoes and fried fish',
      })
      .do(),
  ]);

  // wait for elasticsearch index refresh
  // TODO: remove in 1.0.0

  await new Promise(resolve => setTimeout(resolve, 1000));
};

const cleanup = client => {
  return Promise.all([
    client.schema
      .classDeleter()
      .withClassName('ClassificationJourneySource')
      .do(),
    client.schema
      .classDeleter()
      .withClassName('ClassificationJourneyTarget')
      .do(),
  ]);
};

const beaconTo = target => `weaviate://localhost/things/${target}`;
