import Client from "../src/api/Client"
import axios from "axios"
import MockAdapter from "axios-mock-adapter";
import LocalStorageMock from "./utils/LocalStorageMock";
import delay from "./utils/delay";
  
global.localStorage = new LocalStorageMock;

const mock = new MockAdapter(axios);

test.each([
    [
        [
            {path: '/campaigns', id: 1, delay: 500},
            {path: '/campaigns/12', id: 2, delay: 100}
        ],
        "B R2 R1"
    ],
    [
        [
            {path: '/campaigns', id: 1, delay: 600},
            {path: '/campaigns/12', id: 2, delay: 300},
            {path: '/profile', id: 3, delay: 100},
            {path: '/campaigns/12/play', id: 4, delay: 100}
        ],
        "B R2 R3 R1 R4"
    ]
])('Gives the correct results when composing requests', async (requests: any[], result: string) => {
    const client = new Client()
    let results = "B";
    delay(mock, 'onPost', '/tokens/refresh', 200, {token: 'test token'})

    requests.forEach((request: any) => {
        delay(mock, "onGet", request.path, request.delay, [])
    });

    const promises: Promise<any>[] = requests.map((request: any) => {
        return client.get(request.path).then(() => results += " R" + request.id)
    });

    await Promise.all(promises);
    expect(results).toEqual(result);
});