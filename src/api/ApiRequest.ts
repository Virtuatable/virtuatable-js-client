import ApiPromise from './ApiPromise';
import RequestPayload from './RequestPayload';
import RequestVerb from './RequestVerb';

export default interface ApiRequest {
  promise: ApiPromise;
  path: string;
  parameters: RequestPayload;
  verb: RequestVerb;
}
