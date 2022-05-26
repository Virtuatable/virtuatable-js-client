import Client from "../api/Client";

export default class VuePlugin {
    public install(Vue: any, config: any) {
        Vue.prototype.$api = new Client();
    }
}