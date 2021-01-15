import * as npm from '../../package.json';

export const environment = {
    version: npm.version,
    production: false,
    cloudguardUrl: "http://localhost:3000/api/v1",
    harborUrl: "",
}