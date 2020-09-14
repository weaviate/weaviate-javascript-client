const Getter = require('./getter');
const weaviate = require('../index');

test('a simple query without params', () => {
  const mockClient = {
    query: jest.fn(),
  };

  const expectedQuery = `{Get{Things{Person{name}}}}`;

  new Getter(mockClient)
    .withKind(weaviate.KIND_THINGS)
    .withClassName('Person')
    .withFields('name')
    .do();

  expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
});

test('a simple query with a limit', () => {
  const mockClient = {
    query: jest.fn(),
  };

  const expectedQuery = `{Get{Things{Person(limit:7){name}}}}`;

  new Getter(mockClient)
    .withKind(weaviate.KIND_THINGS)
    .withClassName('Person')
    .withFields('name')
    .withLimit(7)
    .do();

  expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
});

describe('where filters', () => {
  test('a query with a valid where filter', () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Things{Person` +
      `(where:{operator:Equal,valueString:"John Doe",path:["name"]})` +
      `{name}}}}`;

    new Getter(mockClient)
      .withKind(weaviate.KIND_THINGS)
      .withClassName('Person')
      .withFields('name')
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

    new Getter(mockClient)
      .withKind(weaviate.KIND_THINGS)
      .withClassName('Person')
      .withFields('name')
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
          new Getter(mockClient)
            .withKind(weaviate.KIND_THINGS)
            .withClassName('Person')
            .withFields('name')
            .withWhere(t.where)
            .do();
        }).toThrow(t.msg);
      });
    });
  });
});

describe('explore searchers', () => {
  test('a query with a valid explore', () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Things{Person` + `(explore:{concepts:["foo","bar"]})` + `{name}}}}`;

    new Getter(mockClient)
      .withKind(weaviate.KIND_THINGS)
      .withClassName('Person')
      .withFields('name')
      .withExplore({concepts: ['foo', 'bar']})
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  test('with optional parameters', () => {
    const mockClient = {
      query: jest.fn(),
    };

    const expectedQuery =
      `{Get{Things{Person` +
      `(explore:{concepts:["foo","bar"],certainty:0.7,moveTo:{concepts:["foo"],force:0.7},moveAwayFrom:{concepts:["bar"],force:0.5}})` +
      `{name}}}}`;

    new Getter(mockClient)
      .withKind(weaviate.KIND_THINGS)
      .withClassName('Person')
      .withFields('name')
      .withExplore({
        concepts: ['foo', 'bar'],
        certainty: 0.7,
        moveTo: {concepts: ['foo'], force: 0.7},
        moveAwayFrom: {concepts: ['bar'], force: 0.5},
      })
      .do();

    expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
  });

  describe('queries with invalid explore searchers', () => {
    const mockClient = {
      query: jest.fn(),
    };

    const tests = [
      {
        title: 'an empty explore',
        explore: {},
        msg: 'explore filter: concepts cannot be empty',
      },
      {
        title: 'concepts of wrong type',
        explore: {concepts: {}},
        msg: 'explore filter: concepts must be an array',
      },
      {
        title: 'certainty of wrong type',
        explore: {concepts: ['foo'], certainty: 'foo'},
        msg: 'explore filter: certainty must be a number',
      },
      {
        title: 'moveTo without concepts',
        explore: {concepts: ['foo'], moveTo: {}},
        msg: 'explore filter: moveTo.concepts must be an array',
      },
      {
        title: 'moveTo without concepts',
        explore: {concepts: ['foo'], moveTo: {concepts: ['foo']}},
        msg: "explore filter: moveTo must have fields 'concepts' and 'force'",
      },
      {
        title: 'moveAwayFrom without concepts',
        explore: {concepts: ['foo'], moveAwayFrom: {}},
        msg: 'explore filter: moveAwayFrom.concepts must be an array',
      },
      {
        title: 'moveAwayFrom without concepts',
        explore: {concepts: ['foo'], moveAwayFrom: {concepts: ['foo']}},
        msg:
          "explore filter: moveAwayFrom must have fields 'concepts' and 'force'",
      },
    ];

    tests.forEach(t => {
      test(t.title, () => {
        expect(() => {
          new Getter(mockClient)
            .withKind(weaviate.KIND_THINGS)
            .withClassName('Person')
            .withFields('name')
            .withExplore(t.explore)
            .do();
        }).toThrow(t.msg);
      });
    });
  });
});
