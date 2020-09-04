const weaviate = require('./index');

describe('schema', () => {
  const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
  });

  it('creates a thing class (implicitly)', () => {
    const classObj = {
      class: 'MyThingClass',
      properties: [
        {
          dataType: ['string'],
          name: 'stringProp',
        },
      ],
    };

    return client.schema.createClass(classObj).then(res => {
      expect(res).toEqual(classObj);
    });
  });

  it('creates another thing class (explicitly)', () => {
    const classObj = {
      class: 'MyExplicitThingClass',
      properties: [
        {
          dataType: ['string'],
          name: 'stringProp',
        },
      ],
    };

    return client.schema
      .createClass(classObj, weaviate.KIND_THINGS)
      .then(res => {
        expect(res).toEqual(classObj);
      });
  });

  it('creates an action class', () => {
    const classObj = {
      class: 'MyActionClass',
      properties: [
        {
          dataType: ['string'],
          name: 'stringProp',
        },
      ],
    };

    return client.schema
      .createClass(classObj, weaviate.KIND_ACTIONS)
      .then(res => {
        expect(res).toEqual(classObj);
      });
  });

  it('errors with an invalid kind', () => {
    const classObj = {};

    return client.schema.createClass(classObj, 'invalid').catch(err => {
      expect(err).toEqual(new Error('invalid kind: invalid'));
    });
  });

  it('retrieves the schema and it matches the expectations', () => {
    return client.schema.get().then(res => {
      expect(res).toEqual({
        actions: {
          classes: [
            {
              class: 'MyActionClass',
              properties: [
                {
                  dataType: ['string'],
                  name: 'stringProp',
                },
              ],
            },
          ],
          type: 'action',
        },
        things: {
          classes: [
            {
              class: 'MyThingClass',
              properties: [
                {
                  dataType: ['string'],
                  name: 'stringProp',
                },
              ],
            },
            {
              class: 'MyExplicitThingClass',
              properties: [
                {
                  dataType: ['string'],
                  name: 'stringProp',
                },
              ],
            },
          ],
          type: 'thing',
        },
      });
    });
  });

  it('deletes an existing thing class implicitly', () => {
    const className = 'MyThingClass';

    return client.schema.deleteClass(className).then(res => {
      expect(res).toEqual(undefined);
    });
  });

  it('deletes an existing thing class explicitly', () => {
    const className = 'MyExplicitThingClass';

    return client.schema
      .deleteClass(className, weaviate.KIND_THINGS)
      .then(res => {
        expect(res).toEqual(undefined);
      });
  });

  it('deletes an existing action class', () => {
    const className = 'MyActionClass';

    return client.schema
      .deleteClass(className, weaviate.KIND_ACTIONS)
      .then(res => {
        expect(res).toEqual(undefined);
      });
  });
});
