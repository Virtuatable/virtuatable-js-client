import axios from 'axios';
import ApiPromise from './ApiPromise';
import ApiRequest from './ApiRequest';
import RequestPayload from './RequestPayload';
import RequestVerb from './RequestVerb';

export default class Client {
  private _queue: ApiRequest[] = [];

  private _isUnqueuing: boolean = false;

  public get(path: string, parameters: RequestPayload = {}): Promise<any> {
    return this.request(RequestVerb.GET, path, parameters);
  }

  public post(path: string, parameters: RequestPayload = {}): Promise<any> {
    return this.request(RequestVerb.POST, path, parameters);
  }

  /**
   * Adds a request to the list of requests to execute and starts the emptying process.
   * @param verb an HTTP compliant verb in our allowed methods.
   * @param path the complete path from the /api part of the domain, for the route the user is trying to request.
   * @param parameters the parameters for this request as an object.
   */
  private request(verb: RequestVerb, path: string, parameters: RequestPayload): Promise<any> {
    const request: ApiRequest = { promise: new ApiPromise(), path, verb, parameters };
    this._queue.push(request);
    this.emptyQueue();
    return request.promise.callback;
  }

  /**
   * Starts the first shift if the queue is not currently being emptied. If the queue is currently emptying, it does
   * nothing and let the existing emptying process go.
   */
  private emptyQueue(): any {
    if (!this._isUnqueuing) {
      this._isUnqueuing = true;
      this.shift();
    }
  }

  private shift(): any {
    const request: ApiRequest | undefined = this._queue.shift();
    if (request === undefined) {
      this._isUnqueuing = false;
    } else {
      axios.post('/tokens/refresh', { token: this.token }).then((tokenResponse: any) => {
        this.token = tokenResponse.data.token;
        axios({ method: request.verb, url: request.path, data: request.parameters }).then((response: any) => {
          request.promise.resolve(response.data);
        });
        this.shift();
      });
    }
  }

  private get token(): string {
    return localStorage.getItem('virtuatable-auth-token') as string;
  }

  private set token(value: string) {
    localStorage.setItem('virtuatable-auth-token', value);
  }
}
