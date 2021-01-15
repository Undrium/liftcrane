// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { environment as base } from "./environment.base";

export const environment = {
  ... base,
  production: false,
  cloudguardUrl: "http://localhost:3000/api/v1",
  harborUrl: "",
};
