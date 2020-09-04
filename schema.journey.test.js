describe('schema', () => {
  const client = require('./index.js').client({
    scheme: 'http',
    host: 'localhost:8080',
  });

  it('can create a thing class', () => {
    const classObj = {
      class: 'MyThingClass',
      properties: [
        {
          dataType: ['string'],
          name: 'stringProp',
        },
      ],
    };

    return client.schema.createClass(classObj);
  });
});
