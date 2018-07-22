export interface ApiAction {
    method: string;
    url: string;
    params?: any;

    parseResponse?(response: any): any;

    parseErrorResponse?(response: any): any;

    parseRequest?(request: any): any;
}
