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

describe('queries with invalid nested where filters', () => {
  const mockClient = {
    query: jest.fn(),
  };

  const tests = [
    {
      title: 'an empty where',
      where: {},
      msg: 'where filter: operator cannot be empty',
    },
    {
      title: 'missing value',
      where: {operator: 'Equal'},
      msg: 'where filter: value<Type> cannot be empty',
    },
    {
      title: 'missing path',
      where: {operator: 'Equal', valueString: 'foo'},
      msg: 'where filter: path cannot be empty',
    },
    {
      title: 'path is not an array',
      where: {operator: 'Equal', valueString: 'foo', path: 'mypath'},
      msg: 'where filter: path must be an array',
    },
    {
      title: 'unknown value type',
      where: {operator: 'Equal', valueWrong: 'foo'},
      msg: "where filter: unrecognized value prop 'valueWrong'",
    },
    {
      title: 'operands is not an array',
      where: {operator: 'And', operands: {}},
      msg: 'where filter: operands must be an array',
    },
  ];

  tests.forEach(t => {
    test(t.title, () => {
      expect(() => {
        gql.get
          .things('Person', 'name')
          .withClient(mockClient)
          .withWhere(t.where)
          .do();
      }).toThrow(t.msg);
    });
  });
});
