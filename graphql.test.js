const gql = require('./graphql.js');

test('a simple query without params', () => {
  const mockClient = {
    query: jest.fn(),
  };

  const expectedQuery = `{Get{Things{Person{name}}}}`;

  gql.get.things('Person', 'name').withClient(mockClient).do();

  expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
});

test('a query with a valid where filter', () => {
  const mockClient = {
    query: jest.fn(),
  };

  const expectedQuery =
    `{Get{Things{Person` +
    `(where:{operator:Equal,valueString:"John Doe",path:["name"]})` +
    `{name}}}}`;

  gql.get
    .things('Person', 'name')
    .withClient(mockClient)
    .withWhere({operator: 'Equal', valueString: 'John Doe', path: ['name']})
    .do();

  expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
});

test('a query with a valid nested where filter', () => {
  const mockClient = {
    query: jest.fn(),
  };

  const nestedWhere = {
    operator: 'And',
    operands: [
      {valueString: 'foo', operator: 'Equal', path: ['foo']},
      {valueString: 'bar', operator: 'NotEqual', path: ['bar']},
    ],
  };
  const expectedQuery =
    `{Get{Things{Person` +
    `(where:{operator:And,operands:[` +
    `{operator:Equal,valueString:"foo",path:["foo"]},` +
    `{operator:NotEqual,valueString:"bar",path:["bar"]}` +
    `]})` +
    `{name}}}}`;

  gql.get
    .things('Person', 'name')
    .withClient(mockClient)
    .withWhere(nestedWhere)
    .do();

  expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
});
