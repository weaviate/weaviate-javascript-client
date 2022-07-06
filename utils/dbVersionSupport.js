export default class DbVersionSupport {
    constructor(dbVersionPromise) {
        this.dbVersionPromise = dbVersionPromise;
    }
    
    // >= 1.14
    supportsClassNameNamespacedEndpointsPromise() {
        return this.dbVersionPromise.then(version => {
            if (typeof version === "string") {
                const versionNumbers = version.split(".");
                if (versionNumbers.length >= 2) {
                    const major = parseInt(versionNumbers[0]);
                    const minor = parseInt(versionNumbers[1]);
                    return (major == 1 && minor >= 14) || major >= 2;
                }
            }
            return false;
        })
    }
}