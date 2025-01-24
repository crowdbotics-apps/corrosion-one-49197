import {Api} from "../services/api"
import {wrappifyApiCall} from "../services/helpers_ts";

/**
 * The environment is a place where services and shared dependencies between
 * models live.  They are made available to every model via dependency injection.
 */
export class Environment {
  constructor() {
    this.api = new Proxy(new Api(), {
      get: function (target, prop) {
        // @ts-ignore
        const value = target[prop];
        if (['Function', 'AsyncFunction'].includes(value?.constructor?.name)) {
          // console.log(`Property "${prop}" is an async function.`);
          return function (...args: any[]) {
            return wrappifyApiCall(value.apply(target, args));
          }
        }
        return value;
      }
    })
  }

  setRootStore(rootStore: any) {
    this.api.setRootStore(rootStore)
  }

  async setup() {
    await this.api.setup()
  }


  /**
   * Our api.
   */
  api: Api
}
