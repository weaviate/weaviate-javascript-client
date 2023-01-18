// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'weaviate'.
const weaviate = require("../index");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'createTest... Remove this comment to see the full error message
const { createTestFoodSchemaAndData, cleanupTestFood, PIZZA_CLASS_NAME, SOUP_CLASS_NAME } = require("../utils/testData");

const DOCKER_COMPOSE_BACKUPS_DIR = "/tmp/backups";

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("create and restore backup with waiting", () => {
  const BACKEND = weaviate.backup.Backend.FILESYSTEM;
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("asserts data exist", () => assertThatAllPizzasExist(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .then((createResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.id).toBe(BACKUP_ID);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.classes).toHaveLength(1)
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.classes).toContain(PIZZA_CLASS_NAME);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.backend).toBe(BACKEND);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.status).toBe(weaviate.backup.CreateStatus.SUCCESS);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.error).toBeUndefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on create backup: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("asserts data still exist", () => assertThatAllPizzasExist(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("checks create status", () => {
    return client.backup.createStatusGetter()
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      .then((createStatusResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createStatusResponse.id).toBe(BACKUP_ID);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createStatusResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createStatusResponse.backend).toBe(BACKEND);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createStatusResponse.status).toBe(weaviate.backup.CreateStatus.SUCCESS);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createStatusResponse.error).toBeUndefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on create status: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("removes existing class", () => {
    return client.schema.classDeleter()
      .withClassName(PIZZA_CLASS_NAME)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on class delete: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("restores backup", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .then((restoreResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.id).toBe(BACKUP_ID);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.classes).toHaveLength(1)
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.classes).toContain(PIZZA_CLASS_NAME);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.backend).toBe(BACKEND);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.status).toBe(weaviate.backup.RestoreStatus.SUCCESS);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.error).toBeUndefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on restore backup: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("asserts data again exist", () => assertThatAllPizzasExist(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("checks restore status", () => {
    return client.backup.restoreStatusGetter()
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      .then((restoreStatusResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreStatusResponse.id).toBe(BACKUP_ID);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreStatusResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreStatusResponse.backend).toBe(BACKEND);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreStatusResponse.status).toBe(weaviate.backup.RestoreStatus.SUCCESS);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreStatusResponse.error).toBeUndefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on restore status: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("create and restore backup without waiting", () => {
  const BACKEND = weaviate.backup.Backend.FILESYSTEM;
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("asserts data exist", () => assertThatAllPizzasExist(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      .then((createResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.id).toBe(BACKUP_ID);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.classes).toHaveLength(1)
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.classes).toContain(PIZZA_CLASS_NAME);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.backend).toBe(BACKEND);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.status).toBe(weaviate.backup.CreateStatus.STARTED);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.error).toBeUndefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on create backup: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("waits until created", () => {
    return new Promise((resolve, reject) => {
      const statusGetter = client.backup.createStatusGetter()
        .withBackend(BACKEND)
        .withBackupId(BACKUP_ID);
      const loop = () => {
        statusGetter.do()
          .then((createStatusResponse: any) => {
            if (createStatusResponse.status == weaviate.backup.CreateStatus.SUCCESS || createStatusResponse.status == weaviate.backup.CreateStatus.FAILED) {
              resolve(createStatusResponse);
            } else {
              setTimeout(loop, 100);
            }
          })
          .catch(reject);
      };
      loop();
    })
    .then(createStatusResponse => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(createStatusResponse.id).toBe(BACKUP_ID);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(createStatusResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(createStatusResponse.backend).toBe(BACKEND);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(createStatusResponse.status).toBe(weaviate.backup.CreateStatus.SUCCESS);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(createStatusResponse.error).toBeUndefined();
    })
    // @ts-expect-error TS(2304): Cannot find name 'fail'.
    .catch(err => fail("should not fail on create status: " + err));
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("asserts data still exist", () => assertThatAllPizzasExist(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("removes existing class", () => {
    return client.schema.classDeleter()
      .withClassName(PIZZA_CLASS_NAME)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on class delete: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("restores backup", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      .then((restoreResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.id).toBe(BACKUP_ID);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.classes).toHaveLength(1)
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.classes).toContain(PIZZA_CLASS_NAME);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.backend).toBe(BACKEND);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.status).toBe(weaviate.backup.RestoreStatus.STARTED);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.error).toBeUndefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on restore backup: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("waits until restored", () => {
    return new Promise((resolve, reject) => {
      const statusGetter = client.backup.restoreStatusGetter()
        .withBackend(BACKEND)
        .withBackupId(BACKUP_ID);
      const loop = () => {
        statusGetter.do()
          .then((restoreStatusResponse: any) => {
            if (restoreStatusResponse.status == weaviate.backup.RestoreStatus.SUCCESS || restoreStatusResponse.status == weaviate.backup.RestoreStatus.FAILED) {
              resolve(restoreStatusResponse);
            } else {
              setTimeout(loop, 100);
            }
          })
          .catch(reject);
      };
      loop();
    })
    .then(restoreStatusResponse => {
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(restoreStatusResponse.id).toBe(BACKUP_ID);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(restoreStatusResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(restoreStatusResponse.backend).toBe(BACKEND);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(restoreStatusResponse.status).toBe(weaviate.backup.RestoreStatus.SUCCESS);
      // @ts-expect-error TS(2304): Cannot find name 'expect'.
      expect(restoreStatusResponse.error).toBeUndefined();
    })
    // @ts-expect-error TS(2304): Cannot find name 'fail'.
    .catch(err => fail("should not fail on restore backup: " + err));
  })

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("asserts data again exist", () => assertThatAllPizzasExist(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("create and restore 1 of 2 classes", () => {
  const BACKEND = weaviate.backup.Backend.FILESYSTEM;
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("asserts data exist", () => Promise.all([
    assertThatAllPizzasExist(client),
    assertThatAllSoupsExist(client),
  ]));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("creates backup", () => {
    return client.backup.creator()
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .then((createResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.id).toBe(BACKUP_ID);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.classes).toHaveLength(2)
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.classes).toContain(PIZZA_CLASS_NAME);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.classes).toContain(SOUP_CLASS_NAME);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.backend).toBe(BACKEND);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.status).toBe(weaviate.backup.CreateStatus.SUCCESS);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createResponse.error).toBeUndefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on create backup: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("asserts data still exist", () => Promise.all([
    assertThatAllPizzasExist(client),
    assertThatAllSoupsExist(client),
  ]));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("checks create status", () => {
    return client.backup.createStatusGetter()
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      .then((createStatusResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createStatusResponse.id).toBe(BACKUP_ID);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createStatusResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createStatusResponse.backend).toBe(BACKEND);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createStatusResponse.status).toBe(weaviate.backup.CreateStatus.SUCCESS);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(createStatusResponse.error).toBeUndefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on create status: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("removes existing class", () => {
    return client.schema.classDeleter()
      .withClassName(PIZZA_CLASS_NAME)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on class delete: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("restores backup", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .then((restoreResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.id).toBe(BACKUP_ID);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.classes).toHaveLength(1)
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.classes).toContain(PIZZA_CLASS_NAME);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.backend).toBe(BACKEND);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.status).toBe(weaviate.backup.RestoreStatus.SUCCESS);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreResponse.error).toBeUndefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on restore backup: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("asserts data again exist", () => Promise.all([
    assertThatAllPizzasExist(client),
    assertThatAllSoupsExist(client),
  ]));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("checks restore status", () => {
    return client.backup.restoreStatusGetter()
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      .then((restoreStatusResponse: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreStatusResponse.id).toBe(BACKUP_ID);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreStatusResponse.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreStatusResponse.backend).toBe(BACKEND);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreStatusResponse.status).toBe(weaviate.backup.RestoreStatus.SUCCESS);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(restoreStatusResponse.error).toBeUndefined();
      })
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on restore status: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fail creating backup on not existing backend", () => {
  const BACKEND = "not-existing-backend";
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails creating", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .then(() => fail("should fail on create backup"))
      .catch((err: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(422);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(BACKEND);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fail checking create status on not existing backend", () => {
  const BACKEND = "not-existing-backend";
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails checking create status", () => {
    return client.backup.createStatusGetter()
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .then(() => fail("should fail on create status"))
      .catch((err: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(422);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(BACKEND);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fail restoring backup on not existing backend", () => {
  const CLASS_NAME = "not-existing-class";
  const BACKEND = "not-existing-backend";
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails restoring", () => {
    return client.backup.restorer()
      .withIncludeClassNames(CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .then(() => fail("should fail on restore backup"))
      .catch((err: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(422);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(BACKEND);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fail creating backup for not existing class", () => {
  const CLASS_NAME = "not-existing-class";
  const BACKEND = weaviate.backup.Backend.FILESYSTEM;
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails creating", () => {
    return client.backup.creator()
      .withIncludeClassNames(CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .then(() => fail("should fail on create backup"))
      .catch((err: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(422);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(CLASS_NAME);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fail restoring backup for existing class", () => {
  const BACKEND = weaviate.backup.Backend.FILESYSTEM;
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on create backup: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails restoring", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .then((resp: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(resp.error).toContain("already exists");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(resp.error).toContain(PIZZA_CLASS_NAME);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(resp.status).toBe(weaviate.backup.RestoreStatus.FAILED);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fail creating existing backup", () => {
  const BACKEND = weaviate.backup.Backend.FILESYSTEM;
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on create backup: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails creating", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .then(() => fail("should fail on create backup"))
      .catch((err: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(422);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(BACKUP_ID);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fail checking create status for not existing backup", () => {
  const BACKEND = weaviate.backup.Backend.FILESYSTEM;
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails checking create status", () => {
    return client.backup.createStatusGetter()
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .then(() => fail("should fail on create status"))
      .catch((err: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(404);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(BACKUP_ID);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fail restoring not existing backup", () => {
  const BACKEND = weaviate.backup.Backend.FILESYSTEM;
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails restoring", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .then(() => fail("should fail on restore backup"))
      .catch((err: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(404);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(BACKUP_ID);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fail checking restore status for not started restore", () => {
  const BACKEND = weaviate.backup.Backend.FILESYSTEM;
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on create backup: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails checking restore status", () => {
    return client.backup.restoreStatusGetter()
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .then(() => fail("should fail on restore status"))
      .catch((err: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(404);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(BACKUP_ID);
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fail creating backup for both include and exclude classes", () => {
  const BACKEND = weaviate.backup.Backend.FILESYSTEM;
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails creating backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withExcludeClassNames(SOUP_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .then(() => fail("should fail on create"))
      .catch((err: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(422);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain("include");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain("exclude");
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client));
});

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fail restoring backup for both include and exclude classes", () => {
  const BACKEND = weaviate.backup.Backend.FILESYSTEM;
  const BACKUP_ID = randomBackupId()

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("sets up", () => createTestFoodSchemaAndData(client));

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME, SOUP_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on create backup: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("removes existing class", () => {
    return client.schema.classDeleter()
      .withClassName(PIZZA_CLASS_NAME)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .catch((err: any) => fail("should not fail on class delete: " + err));
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("fails restoring backup", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withExcludeClassNames(SOUP_CLASS_NAME)
      .withBackend(BACKEND)
      .withBackupId(BACKUP_ID)
      .do()
      // @ts-expect-error TS(2304): Cannot find name 'fail'.
      .then(() => fail("should fail on restore"))
      .catch((err: any) => {
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain(422);
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain("include");
        // @ts-expect-error TS(2304): Cannot find name 'expect'.
        expect(err).toContain("exclude");
      });
  });

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it("cleans up", () => cleanupTestFood(client).catch(() => Promise.resolve("ignore not exising Pizza")));
});

// describe("get all exising backups", () => {
//   const BACKEND = weaviate.backup.Backend.FILESYSTEM;
//   const BACKUP_ID = randomBackupId()
//   const BACKUP_ID_PIZZA = BACKUP_ID + "-pizza";
//   const BACKUP_ID_SOUP = BACKUP_ID + "-soup";

//   const client = weaviate.client({
//     scheme: "http",
//     host: "localhost:8080",
//   });

//   it("sets up", () => createTestFoodSchemaAndData(client));

//   it("creates backup pizza", () => {
//     return client.backup.creator()
//       .withIncludeClassNames(PIZZA_CLASS_NAME)
//       .withBackend(BACKEND)
//       .withBackupId(BACKUP_ID_PIZZA)
//       .withWaitForCompletion(true)
//       .do()
//       .catch(err => fail("should not fail on create backup: " + err));
//   });

//   it("creates backup soup", () => {
//     return client.backup.creator()
//       .withIncludeClassNames(SOUP_CLASS_NAME)
//       .withBackend(BACKEND)
//       .withBackupId(BACKUP_ID_SOUP)
//       .withWaitForCompletion(true)
//       .do()
//       .catch(err => fail("should not fail on create backup: " + err));
//   });

//   it("get all", () => {
//     return client.backup.getter()
//       .withBackend(BACKEND)
//       .do()
//       .then(allResponse => {
//         expect(allResponse).toHaveLength(2);
//         expect(allResponse).toEqual(expect.arrayContaining([
//           expect.objectContaining({id: BACKUP_ID_PIZZA}),
//           expect.objectContaining({id: BACKUP_ID_SOUP}),
//         ]));
//       })
//       .catch(err => fail("should not fail on getting all: " + err));
//   });

//   it("cleans up", () => cleanupTestFood(client));
// });


function assertThatAllPizzasExist(client: any) {
  return assertThatAllFoodObjectsExist(client, "Pizza", 4);
}

function assertThatAllSoupsExist(client: any) {
  return assertThatAllFoodObjectsExist(client, "Soup", 2);
}

function assertThatAllFoodObjectsExist(client: any, className: any, number: any) {
  return client.graphql.get()
    .withClassName(className)
    .withFields("name")
    .do()
    // @ts-expect-error TS(2304): Cannot find name 'expect'.
    .then((data: any) => expect(data.data.Get[className].length).toBe(number))
    // @ts-expect-error TS(2304): Cannot find name 'fail'.
    .catch((err: any) => fail(number + " objects should exist: " + err));
}

function randomBackupId() {
  return "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}
