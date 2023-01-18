import Raw from "./raw";

// @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("a simple raw query", () => {
  const mockClient = {
    // @ts-expect-error TS(2304): Cannot find name 'jest'.
    query: jest.fn(),
  };

  const expectedQuery = `{Get{Person{name}}}`;

  // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
  new Raw(mockClient).withQuery(expectedQuery).do();

  // @ts-expect-error TS(2304): Cannot find name 'expect'.
  expect(mockClient.query).toHaveBeenCalledWith(expectedQuery);
});

// @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("reject empty raw query", () => {
    const mockClient = {
      // @ts-expect-error TS(2304): Cannot find name 'jest'.
      query: jest.fn(),
    };

    new Raw(mockClient, "").do().catch((err: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toMatchObject(new Error("invalid usage: query must be set - set with .raw().withQuery(query)"));
    });
  });
