// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // base_url: "http://localhost:1999/inv/api/v1",
  // HOST: "http://localhost:1999/inv/api"

  /*
  * ----------------------------------------------------
  * ------- Descomentar cuando se utiliza Docker - local -------
  * ----------------------------------------------------
  */
  // base_url: "http://localhost:11999/inv/api/v1",
  // HOST: "http://localhost:11999/inv/api"

  /*
  * ----------------------------------------------------
  * ------- Descomentar cuando se utiliza Docker - cloud -------
  * ----------------------------------------------------
  */
  base_url: "http://35.211.62.133:1999/inv/api/v1",
  HOST: "http://35.211.62.133:1999/inv/api"

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
