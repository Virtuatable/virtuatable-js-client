export default class ApiPromise {
  private _promise: Promise<any>;

  private _resolve!: (payload: any) => any;

  constructor() {
    this._promise = new Promise<any>((resolve: any) => {
      this._resolve = resolve;
    });
  }

  public get resolve(): (payload: any) => any {
    return this._resolve;
  }

  public get callback(): Promise<any> {
    return this._promise;
  }
}
