// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'weaviate'.
const weaviate = require("../index");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createTest... Remove this comment to see the full error message
const { createTestFoodSchemaAndData, cleanupTestFood, PIZZA_CLASS_NAME, SOUP_CLASS_NAME } = require("../utils/testData");

const EXPECTED_WEAVIATE_VERSION = "1.17.0"
const EXPECTED_WEAVIATE_GIT_HASH = "37d3b17"

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("cluster nodes endpoint", () => {
  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("get nodes status of empty db", () => {
    return client.cluster
      .nodesStatusGetter()
      .do()
      .then((nodesStatusResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(nodesStatusResponse.nodes).toHaveLength(1);
        const node = nodesStatusResponse.nodes[0];
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.name).toMatch(/.+/);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.version).toEqual(EXPECTED_WEAVIATE_VERSION);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.gitHash).toEqual(EXPECTED_WEAVIATE_GIT_HASH);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.status).toEqual(weaviate.cluster.NodeStatus.HEALTHY);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.stats.objectCount).toEqual(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.stats.shardCount).toEqual(0);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.shards).toHaveLength(0);
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("should not fail on getting nodes: " + e));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up db", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("get nodes status of food db", () => {
    return client.cluster
      .nodesStatusGetter()
      .do()
      .then((nodesStatusResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(nodesStatusResponse.nodes).toHaveLength(1);
        const node = nodesStatusResponse.nodes[0];
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.name).toMatch(/.+/);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.version).toEqual(EXPECTED_WEAVIATE_VERSION);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.gitHash).toEqual(EXPECTED_WEAVIATE_GIT_HASH);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.status).toEqual(weaviate.cluster.NodeStatus.HEALTHY);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.stats.objectCount).toEqual(6);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.stats.shardCount).toEqual(2);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(node.shards).toHaveLength(2);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect([node.shards[0].class, node.shards[1].class]).toEqual(
          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect.arrayContaining([PIZZA_CLASS_NAME, SOUP_CLASS_NAME])
        );
        for (let i = 0; i < node.shards.length; i++) {
          const shard = node.shards[i];

          // @ts-expect-error TS(2304): Cannot find name 'expect'.
          expect(shard.name).toMatch(/.+/);
          switch (shard.class) {
            case PIZZA_CLASS_NAME:
              // @ts-expect-error TS(2304): Cannot find name 'expect'.
              expect(shard.objectCount).toEqual(4);
              break;
            case SOUP_CLASS_NAME:
              // @ts-expect-error TS(2304): Cannot find name 'expect'.
              expect(shard.objectCount).toEqual(2);
              break
          }
        }
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((e: any) => fail("should not fail on getting nodes: " + e));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up db", () => cleanupTestFood(client));
});
