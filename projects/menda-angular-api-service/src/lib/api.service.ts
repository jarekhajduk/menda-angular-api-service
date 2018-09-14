import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {ApiAction} from './api-action.interface';
import {API_URL} from './api.constant';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    constructor(
        @Inject(API_URL) private apiUrl: string,
        private httpClient: HttpClient
    ) {
    }

    run(action: ApiAction, params?: any): Observable<any> {
        return this.runWith({}, action, params);
    }

    runWith(data: any, action: ApiAction, params: any = {}): Observable<any> {

        if (action.params) {
            params = {
                ...action.params,
                ...params,
            };
        }

        if (params) {
            action = {
                ...action,
                url: this.interpolateUrl(action.url, params),
            };
        }

        let request: Observable<object> = null;

        if (action.parseRequest) {
            data = action.parseRequest(data);
        }

        let headers = new HttpHeaders();

        if (data instanceof FormData) {
            headers = new HttpHeaders({});
        }

        if (action.parseHeaders) {
            headers = action.parseHeaders(headers, data, params);
        }

        switch (action.method) {
            case 'POST':
                request = this.httpClient.post(this.apiUrl + action.url, data, {
                    params: this.createHttpParams(params),
                    headers: headers,
                });
                break;
            case 'PATCH':
                request = this.httpClient.patch(this.apiUrl + action.url, data,
                    {
                        params: this.createHttpParams(params),
                        headers: headers.set('Content-Type',
                            'application/json'),
                    });
                break;
            case 'GET':
                request = this.httpClient.get(this.apiUrl + action.url, {
                    params: this.createHttpParams(params),
                });
                break;
            case 'PUT':
                request = this.httpClient.put(this.apiUrl + action.url, data, {
                    params: this.createHttpParams(params),
                    headers: headers,
                });
                break;
            case 'DELETE':
                request = this.httpClient.delete(this.apiUrl + action.url, {
                    params: this.createHttpParams(params),
                });
                break;
            case 'LINK':
                request = this.httpClient.request('LINK', this.apiUrl + action.url, {
                    params: this.createHttpParams(params),
                    headers: headers,
                });
                break;
        }

        if (action.parseResponse) {
            request = request.pipe(map(action.parseResponse));
        }

        if (action.parseErrorResponse) {
            request = request.pipe(
                catchError(errorResponse =>
                    throwError(action.parseErrorResponse(errorResponse)),
                ),
            );
        }

        return request;
    }

    private interpolateUrl(url, params) {
        Object.keys(params).map(param => {
            url = url.replace(':' + param, params[param]);
        });

        return url;
    }

    private createHttpParams(params) {
        let httpParams = new HttpParams();

        if (params) {
            Object.keys(params).forEach(function(key) {
                httpParams = httpParams.append(key, params[key]);
            });
        }

        return httpParams;
    }
}
