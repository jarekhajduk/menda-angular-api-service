# Angular API Service

This project is Work in Progress

The service can:

- handle GET/PUT/POST/DELETE requests
- handle url params interpolation
- use custom request parser before sending the request
- use custom response parser before returning the response
- use custom error response parser before returning the response

To use all the features, firstly you must configure an endpoint by creating an object, which fulfills this interface:

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

Then import the service to the module and setup it in providers (don't forget to setup API_URL)

After that you can inject the service and use one of its two methods:

```ts
run(action: ApiAction, params?: any): Observable<any>
runWith(data: any, action: ApiAction, params: any = {}): Observable<any>
```

Full usage example:

```ts
[app.module.ts]

import { API_URL } from 'menda-angular-api-service';
import { ApiService } from 'menda-angular-api-service';

@NgModule({
    declarations: [],
    imports: [],
    exports: [],
    providers: [
        { provide: API_URL, useValue: 'https://api.movies.com/' },
        ApiService,
    ],
    bootstrap: [],
})
export class AppModule {
}


```


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
    
    // creates new movie
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
