// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  rootPath: 'http://192.168.185.160:88/',
  apiUrl: 'http://192.168.185.160:88/API_onhand/index.php/',
  imgPath: 'http://192.168.185.160:3000/getimages?code=',

  // rootPath: 'http://localhost:89/',
  // apiUrl: 'http://localhost:89/API_onhand/index.php/',
  // imgPath: 'http://localhost:3001/getimages?code=',

  baseHref: '/',

  
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
