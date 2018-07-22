# Angular API Service

Do you hate the spaghetti code when communicating with REST API? Here's my simple solution. It allows you to communicate with API in this way:
```ts
// get all the movies
this.api.run(GET_MOVIES_API_ACTION, { page: 1 }).subscribe(movies => {
  console.log(movies);
});

// create a new movie
this.api.runWith({title: 'Title'}, ADD_MOVIE_API_ACTION).subscribe(newMovie => {
  console.log(newMovie);
}, validation => {
  console.log(validation);
});

// remove movie
this.api.run(REMOVE_MOVIE_API_ACTION, { id: 5 }).subscribe(removedMovie => {
  console.log(removedMovie);
});
```

## To install this library:
```npm
npm install menda-angular-api-service --save
// or
yarn add menda-angular-api-service
```

## The service can:

- handle GET/PUT/POST/DELETE/PATCH requests
- handle url params interpolation
- use custom request parser before sending the request
- use custom response parser before returning the response
- use custom error response parser before returning the response

## Usage:

### 1. Configure module

- import `HttpClientModule`
- provide `API_URL`
- provide `ApiService`

```ts
[app.module.ts]

import { HttpClientModule } from '@angular/common/http';
import { API_URL, ApiService } from 'menda-angular-api-service';

@NgModule({
    declarations: [],
    imports: [HttpClientModule],
    exports: [],
    providers: [
        { provide: API_URL, useValue: 'https://api.movies.com/' },
        ApiService,
    ],
    bootstrap: [],
})
export class AppModule {}
```

### 2. Configure api endpoints, by creating objects fulfilling `ApiAction` interface:

```ts
interface ApiAction {
    method: string;
    url: string;
    
    params?: any; // default params
    parseResponse?(response: any): any;
    parseErrorResponse?(response: any): any;
    parseRequest?(request: any): any;
}

```

Examples:

```ts
[api-actions.ts]

import { ApiAction } from 'menda-angular-api-service';

export const GET_MOVIES_API_ACTION: ApiAction = {
  method: 'GET',
  url: 'movies'
};

export const ADD_MOVIE_API_ACTION: ApiAction = {
  method: 'POST',
  url: 'movies'
};

export const REMOVE_MOVIE_API_ACTION: ApiAction = {
  method: 'DELETE',
  url: 'movies/:id'
};
```

### 3. Inject the service and use one of its two methods:

```ts
// params will be added to the url after "?" and interpolated, if url contains params like ":id"
run(action: ApiAction, params?: any): Observable<any>

/*
this method has sense only with POST and PUT ApiActions.
"data" is the data, that you want to POST/PUT.

If you need to alter the request before sending it
(for instance you want to send a file) you can
use requestParser or angular interceptor
*/
runWith(data: any, action: ApiAction, params: any = {}): Observable<any>
```

Example service usages:

```ts
[component.ts]

import {
  GET_MOVIES_API_ACTION,
  ADD_MOVIE_API_ACTION,
  REMOVE_MOVIE_API_ACTION
} from './api-actions';
import { ApiService } from 'menda-angular-api-service';

@Component()
Component {

  constructor(private api: ApiService) {}
  
  fetchSomething() {
    // gets all the movies
    this.api.run(GET_MOVIES_API_ACTION, { page: 1 }).subscribe(movies => {
      console.log(movies);
    });
    
    // creates a new movie
    this.api.runWith({title: 'Title'}, ADD_MOVIE_API_ACTION).subscribe(newMovie => {
      console.log(newMovie);
    });
    
    // removes movie by interpolating 'movies/:id' => 'movies/5'
    this.api.run(REMOVE_MOVIE_API_ACTION, { id: 5 }).subscribe(removedMovie => {
      console.log(removedMovie);
    });
  }
}
```


## Parsers

If you need to change something in the request before sending it, or the response before returning it you can:

- configure parser in `ApiAction`
- use angular built-in interceptors

The first solution may look like this (sending multipart data):

```ts
import { ApiAction } from 'menda-angular-api-service';

export const COMPLETE_PROFILE_API_ACTION: ApiAction = {
  method: 'POST',
  url: 'auth/complete-profile',
  parseRequest: parseCompleteProfileRequest
}

function parseCompleteProfileRequest(data) {
    if (!data.avatar) {
        return data;
    }

    const formData = new FormData();
    formData.append('token', data.token);
    formData.append('avatar', data.avatar);
    formData.append('top', data.top);
    formData.append('left', data.left);
    formData.append('length', data.length);
    formData.append('username', data.username);
    formData.append('password', data.password);

    return formData;
}

```
