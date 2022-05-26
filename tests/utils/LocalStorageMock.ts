export default class LocalStorageMock {

    private store: {[key: string]: string} = {}

    private keys: string[] = []
  
    clear() {
      this.store = {};
      this.keys = []
    }
  
    getItem(key: string) {
      return this.store[key] || null;
    }
  
    setItem(key: string, value: string) {
        this.keys.push(key)
        this.store[key] = String(value);
    }
  
    removeItem(key: string) {
        delete this.keys[this.keys.indexOf(key)]
        delete this.store[key];
    }

    public get length(): number {
        return this.store.keys.length;
    }

    public key(index: number): string {
        return this.keys[index]
    }
}