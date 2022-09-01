const { Storage, CreateStatus, RestoreStatus, default: backup } = require(".");
const weaviate = require("../index");
const { createTestFoodSchemaAndData, cleanupTestFood, PIZZA_CLASS_NAME, SOUP_CLASS_NAME } = require("../utils/testData");

const DOCKER_COMPOSE_BACKUPS_DIR = "/tmp/backups";

describe("create and restore backup with waiting", () => {
  const STORAGE_NAME = Storage.FILESYSTEM;
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("asserts data exist", () => assertThatAllPizzasExist(client));

  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .then(metaCreate => {
        expect(metaCreate.id).toBe(BACKUP_ID);
        expect(metaCreate.classes).toHaveLenght(1)
        expect(metaCreate.classes).toContain(PIZZA_CLASS_NAME);
        expect(metaCreate.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        expect(metaCreate.storageName).toBe(STORAGE_NAME);
        expect(metaCreate.status).toBe(CreateStatus.SUCCESS);
        expect(metaCreate.error).toBeUndefined();
      })
      .catch(err => fail("should not fail on create backup: " + err));
  });

  it("asserts data still exist", () => assertThatAllPizzasExist(client));

  it("checks create status", () => {
    return client.backup.createStatusGetter()
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(metaCreateStatus => {
        expect(metaCreateStatus.id).toBe(BACKUP_ID);
        expect(metaCreateStatus.classes).toHaveLenght(1)
        expect(metaCreateStatus.classes).toContain(PIZZA_CLASS_NAME);
        expect(metaCreateStatus.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        expect(metaCreateStatus.storageName).toBe(STORAGE_NAME);
        expect(metaCreateStatus.status).toBe(CreateStatus.SUCCESS);
        expect(metaCreateStatus.error).toBeUndefined();
      })
      .catch(err => fail("should not fail on create status: " + err));
  });

  it("removes existing class", () => {
    return client.schema.classDeleter()
      .withClassName(PIZZA_CLASS_NAME)
      .do()
      .catch(err => fail("should not fail on class delete: " + err));
  });

  it("restores backup", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .then(metaRestore => {
        expect(metaRestore.id).toBe(BACKUP_ID);
        expect(metaRestore.classes).toHaveLenght(1)
        expect(metaRestore.classes).toContain(PIZZA_CLASS_NAME);
        expect(metaRestore.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        expect(metaRestore.storageName).toBe(STORAGE_NAME);
        expect(metaRestore.status).toBe(RestoreStatus.SUCCESS);
        expect(metaRestore.error).toBeUndefined();
      })
      .catch(err => fail("should not fail on restore backup: " + err));
  });

  it("asserts data again exist", () => assertThatAllPizzasExist(client));

  it("checks restore status", () => {
    return client.backup.restoreStatusGetter()
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(metaRestoreStatus => {
        expect(metaRestoreStatus.id).toBe(BACKUP_ID);
        expect(metaRestoreStatus.classes).toHaveLenght(1)
        expect(metaRestoreStatus.classes).toContain(PIZZA_CLASS_NAME);
        expect(metaRestoreStatus.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        expect(metaRestoreStatus.storageName).toBe(STORAGE_NAME);
        expect(metaRestoreStatus.status).toBe(RestoreStatus.SUCCESS);
        expect(metaRestoreStatus.error).toBeUndefined();
      })
      .catch(err => fail("should not fail on restore status: " + err));
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("create and restore backup without waiting", () => {
  const STORAGE_NAME = Storage.FILESYSTEM;
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("asserts data exist", () => assertThatAllPizzasExist(client));

  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(metaCreate => {
        expect(metaCreate.id).toBe(BACKUP_ID);
        expect(metaCreate.classes).toHaveLenght(1)
        expect(metaCreate.classes).toContain(PIZZA_CLASS_NAME);
        expect(metaCreate.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        expect(metaCreate.storageName).toBe(STORAGE_NAME);
        expect(metaCreate.status).toBe(CreateStatus.STARTED);
        expect(metaCreate.error).toBeUndefined();
      })
      .catch(err => fail("should not fail on create backup: " + err));
  });

  it("waits until created", () => {
    return new Promise((resolve, reject) => {
      const statusGetter = client.backup.createStatusGetter()
        .withStorageName(STORAGE_NAME)
        .withBackupId(BACKUP_ID);
      const loop = () => {
        statusGetter.do()
          .then(metaCreateStatus => {
            if (metaCreateStatus.status == CreateStatus.SUCCESS || metaCreateStatus.status == CreateStatus.FAILED) {
              resolve(metaCreateStatus);
            } else {
              setTimeout(loop, 100);
            }
          })
          .catch(reject);
      };
      loop();
    })
    .then(metaCreateStatus => {
      expect(metaCreateStatus.id).toBe(BACKUP_ID);
      expect(metaCreateStatus.classes).toHaveLenght(1)
      expect(metaCreateStatus.classes).toContain(PIZZA_CLASS_NAME);
      expect(metaCreateStatus.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
      expect(metaCreateStatus.storageName).toBe(STORAGE_NAME);
      expect(metaCreateStatus.status).toBe(CreateStatus.SUCCESS);
      expect(metaCreateStatus.error).toBeUndefined();
    })
    .catch(err => fail("should not fail on create status: " + err))
  })

  it("asserts data still exist", () => assertThatAllPizzasExist(client));

  it("removes existing class", () => {
    return client.schema.classDeleter()
      .withClassName(PIZZA_CLASS_NAME)
      .do()
      .catch(err => fail("should not fail on class delete: " + err));
  });

  it("restores backup", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(metaRestore => {
        expect(metaRestore.id).toBe(BACKUP_ID);
        expect(metaRestore.classes).toHaveLenght(1)
        expect(metaRestore.classes).toContain(PIZZA_CLASS_NAME);
        expect(metaRestore.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        expect(metaRestore.storageName).toBe(STORAGE_NAME);
        expect(metaRestore.status).toBe(RestoreStatus.STARTED);
        expect(metaRestore.error).toBeUndefined();
      })
      .catch(err => fail("should not fail on restore backup: " + err));
  });

  it("waits until restored", () => {
    return new Promise((resolve, reject) => {
      const statusGetter = client.backup.restoreStatusGetter()
        .withStorageName(STORAGE_NAME)
        .withBackupId(BACKUP_ID);
      const loop = () => {
        statusGetter.do()
          .then(metaRestoreStatus => {
            if (metaRestoreStatus.status == RestoreStatus.SUCCESS || metaRestoreStatus.status == RestoreStatus.FAILED) {
              resolve(metaRestoreStatus);
            } else {
              setTimeout(loop, 100);
            }
          })
          .catch(reject);
      };
      loop();
    })
    .then(metaRestoreStatus => {
      expect(metaRestoreStatus.id).toBe(BACKUP_ID);
      expect(metaRestoreStatus.classes).toHaveLenght(1)
      expect(metaRestoreStatus.classes).toContain(PIZZA_CLASS_NAME);
      expect(metaRestoreStatus.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
      expect(metaRestoreStatus.storageName).toBe(STORAGE_NAME);
      expect(metaRestoreStatus.status).toBe(RestoreStatus.SUCCESS);
      expect(metaRestoreStatus.error).toBeUndefined();
    })
    .catch(err => fail("should not fail on restore backup: " + err));
  })

  it("asserts data again exist", () => assertThatAllPizzasExist(client));

  it("cleans up", () => cleanupTestFood(client));
});

describe("create and restore 1 of 2 classes", () => {
  const STORAGE_NAME = Storage.FILESYSTEM;
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("asserts data exist", () => Promise.all([
    assertThatAllPizzasExist(client),
    assertThatAllSoupsExist(client),
  ]));

  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME, SOUP_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .then(metaCreate => {
        expect(metaCreate.id).toBe(BACKUP_ID);
        expect(metaCreate.classes).toHaveLenght(2)
        expect(metaCreate.classes).toContain(PIZZA_CLASS_NAME);
        expect(metaCreate.classes).toContain(SOUP_CLASS_NAME);
        expect(metaCreate.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        expect(metaCreate.storageName).toBe(STORAGE_NAME);
        expect(metaCreate.status).toBe(CreateStatus.SUCCESS);
        expect(metaCreate.error).toBeUndefined();
      })
      .catch(err => fail("should not fail on create backup: " + err));
  });

  it("asserts data still exist", () => Promise.all([
    assertThatAllPizzasExist(client),
    assertThatAllSoupsExist(client),
  ]));

  it("checks create status", () => {
    return client.backup.createStatusGetter()
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(metaCreateStatus => {
        expect(metaCreateStatus.id).toBe(BACKUP_ID);
        expect(metaCreateStatus.classes).toHaveLenght(2)
        expect(metaCreateStatus.classes).toContain(PIZZA_CLASS_NAME);
        expect(metaCreateStatus.classes).toContain(SOUP_CLASS_NAME);
        expect(metaCreateStatus.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        expect(metaCreateStatus.storageName).toBe(STORAGE_NAME);
        expect(metaCreateStatus.status).toBe(CreateStatus.SUCCESS);
        expect(metaCreateStatus.error).toBeUndefined();
      })
      .catch(err => fail("should not fail on create status: " + err));
  });

  it("removes existing class", () => {
    return client.schema.classDeleter()
      .withClassName(PIZZA_CLASS_NAME)
      .do()
      .catch(err => fail("should not fail on class delete: " + err));
  });

  it("restores backup", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .then(metaRestore => {
        expect(metaRestore.id).toBe(BACKUP_ID);
        expect(metaRestore.classes).toHaveLenght(1)
        expect(metaRestore.classes).toContain(PIZZA_CLASS_NAME);
        expect(metaRestore.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        expect(metaRestore.storageName).toBe(STORAGE_NAME);
        expect(metaRestore.status).toBe(RestoreStatus.SUCCESS);
        expect(metaRestore.error).toBeUndefined();
      })
      .catch(err => fail("should not fail on restore backup: " + err));
  });

  it("asserts data again exist", () => Promise.all([
    assertThatAllPizzasExist(client),
    assertThatAllSoupsExist(client),
  ]));

  it("checks restore status", () => {
    return client.backup.restoreStatusGetter()
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(metaRestoreStatus => {
        expect(metaRestoreStatus.id).toBe(BACKUP_ID);
        expect(metaRestoreStatus.classes).toHaveLenght(1)
        expect(metaRestoreStatus.classes).toContain(PIZZA_CLASS_NAME);
        expect(metaRestoreStatus.path).toBe(`${DOCKER_COMPOSE_BACKUPS_DIR}/${BACKUP_ID}`);
        expect(metaRestoreStatus.storageName).toBe(STORAGE_NAME);
        expect(metaRestoreStatus.status).toBe(RestoreStatus.SUCCESS);
        expect(metaRestoreStatus.error).toBeUndefined();
      })
      .catch(err => fail("should not fail on restore status: " + err));
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("fail creating backup on not existing storage", () => {
  const STORAGE_NAME = "not-existing-storage";
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("fails creating", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(() => fail("should fail on create backup"))
      .catch(err => {
        expect(err).toContain(422);
        expect(err).toContain(STORAGE_NAME);
      });
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("fail checking create status on not existing storage", () => {
  const STORAGE_NAME = "not-existing-storage";
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("fails checking create status", () => {
    return client.backup.createStatusGetter()
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(() => fail("should fail on create status"))
      .catch(err => {
        expect(err).toContain(422);
        expect(err).toContain(STORAGE_NAME);
      });
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("fail restoring backup on not existing storage", () => {
  const CLASS_NAME = "not-existing-class";
  const STORAGE_NAME = "not-existing-storage";
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("fails restoring", () => {
    return client.backup.restorer()
      .withIncludeClassNames(CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(() => fail("should fail on restore backup"))
      .catch(err => {
        expect(err).toContain(422);
        expect(err).toContain(STORAGE_NAME);
      });
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("fail creating backup for not existing class", () => {
  const CLASS_NAME = "not-existing-class";
  const STORAGE_NAME = Storage.FILESYSTEM;
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("fails creating", () => {
    return client.backup.creator()
      .withIncludeClassNames(CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(() => fail("should fail on create backup"))
      .catch(err => {
        expect(err).toContain(422);
        expect(err).toContain(CLASS_NAME);
      });
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("fail restoring backup for existing class", () => {
  const STORAGE_NAME = Storage.FILESYSTEM;
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .catch(err => fail("should not fail on create backup: " + err));
  });

  it("fails restoring", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(() => fail("should fail on restore backup"))
      .catch(err => {
        expect(err).toContain(422);
        expect(err).toContain(PIZZA_CLASS_NAME);
      });
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("fail creating existing backup", () => {
  const STORAGE_NAME = Storage.FILESYSTEM;
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .catch(err => fail("should not fail on create backup: " + err));
  });

  it("fails creating", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(() => fail("should fail on create backup"))
      .catch(err => {
        expect(err).toContain(422);
        expect(err).toContain(BACKUP_ID);
      });
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("fail checking create status for not existing backup", () => {
  const STORAGE_NAME = Storage.FILESYSTEM;
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("fails checking create status", () => {
    return client.backup.createStatusGetter()
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(() => fail("should fail on create status"))
      .catch(err => {
        expect(err).toContain(404);
        expect(err).toContain(BACKUP_ID);
      });
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("fail restoring not existing backup", () => {
  const STORAGE_NAME = Storage.FILESYSTEM;
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("fails restoring", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(() => fail("should fail on restore backup"))
      .catch(err => {
        expect(err).toContain(404);
        expect(err).toContain(BACKUP_ID);
      });
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("fail checking restore status for not started restore", () => {
  const STORAGE_NAME = Storage.FILESYSTEM;
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .catch(err => fail("should not fail on create backup: " + err));
  });

  it("fails checking restore status", () => {
    return client.backup.restoreStatusGetter()
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(() => fail("should fail on restore status"))
      .catch(err => {
        expect(err).toContain(422);
        // TODO adjust to error message
        expect(err).toContain(STORAGE_NAME);
        expect(err).toContain(BACKUP_ID);
      });
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("fail creating backup for both include and exclude classes", () => {
  const STORAGE_NAME = "not-existing-storage";
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("fails creating backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withExcludeClassNames(SOUP_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .then(() => fail("should fail on create"))
      .catch(err => {
        expect(err).toContain(422);
        // TODO adjust to error message
        expect(err).toContain(PIZZA_CLASS_NAME);
        expect(err).toContain(SOUP_CLASS_NAME);
      });
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("fail restoring backup for both include and exclude classes", () => {
  const STORAGE_NAME = Storage.FILESYSTEM;
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("creates backup", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME, SOUP_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .withWaitForCompletion(true)
      .do()
      .catch(err => fail("should not fail on create backup: " + err));
  });

  it("removes existing class", () => {
    return client.schema.classDeleter()
      .withClassName(PIZZA_CLASS_NAME)
      .do()
      .catch(err => fail("should not fail on class delete: " + err));
  });

  it("fails restoring backup", () => {
    return client.backup.restorer()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withExcludeClassNames(SOUP_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID)
      .do()
      .then(() => fail("should fail on restore"))
      .catch(err => {
        expect(err).toContain(422);
        // TODO adjust to error message
        expect(err).toContain(PIZZA_CLASS_NAME);
        expect(err).toContain(SOUP_CLASS_NAME);
      });
  });

  it("cleans up", () => cleanupTestFood(client));
});

describe("get all exising backups", () => {
  const STORAGE_NAME = Storage.FILESYSTEM;
  const BACKUP_ID = "backup-id-" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  const client = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
  });

  it("sets up", () => createTestFoodSchemaAndData(client));

  it("creates backup pizza", () => {
    return client.backup.creator()
      .withIncludeClassNames(PIZZA_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID + "Pizza")
      .withWaitForCompletion(true)
      .do()
      .catch(err => fail("should not fail on create backup: " + err));
  });

  it("creates backup soup", () => {
    return client.backup.creator()
      .withIncludeClassNames(SOUP_CLASS_NAME)
      .withStorageName(STORAGE_NAME)
      .withBackupId(BACKUP_ID + "Soup")
      .withWaitForCompletion(true)
      .do()
      .catch(err => fail("should not fail on create backup: " + err));
  });

  it("get all", () => {
    return client.backup.getter()
      .withStorageName(STORAGE_NAME)
      .do()
      .then(metas => {
        expect(metas).toHaveLenght(2);
        expect(metas).toEqual(expect.arrayContaining([
          expect.objectContaining({id: BACKUP_ID + "Pizza"}),
          expect.objectContaining({id: BACKUP_ID + "Soup"}),
        ]));
      })
      .catch(err => fail("should not fail on getting all: " + err));
  });

  it("cleans up", () => cleanupTestFood(client));
});


function assertThatAllPizzasExist(client) {
  return assertThatAllFoodObjectsExist(client, "Pizza", 4);
}

function assertThatAllSoupsExist(client) {
  return assertThatAllFoodObjectsExist(client, "Soup", 2);
}

function assertThatAllFoodObjectsExist(client, className, number) {
  return client.graphql.get()
      .withClassName(className)
      .withFields("name")
      .do()
      .then(data => expect(data.data.Get[className].length).toBe(number))
      .catch(err => fail(number + " objects should exist: " + err));
}
