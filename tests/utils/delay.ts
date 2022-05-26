export default function delay(mock: any, verb: any, path: string, delay: number, response: any) {
    mock[verb as keyof typeof mock](path).reply(() => new Promise(function (resolve) {
        setTimeout(() => resolve([200, response]), delay);
    }));
}