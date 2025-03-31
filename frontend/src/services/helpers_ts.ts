import {GenericResponse} from "./api";
import {showMessage} from "./helpers";
import {ApiError} from "./api/api-base";
import {showErrorMessageBasedOnError} from "./api/api-messages";
import {GeneralApiProblem} from "./api/api-problem";

export type CallbackFunction<T extends GenericResponse> = {
  (result: T): string | void;
};

export type WrapifyApiCallOptions<T extends GenericResponse> = {
  onSuccess?: CallbackFunction<T>,
  onError?: CallbackFunction<T>,
  successMessage?: string | CallbackFunction<T>,
  errorMessage?: string | CallbackFunction<T>,
  onFinally?: any
}

export type WrapifiedType<T extends GenericResponse> = Promise<T> & {
  handle: (options: WrapifyApiCallOptions<T>) => Promise<T>
}

export type WrappyfiedResponse<T extends GenericResponse> =
  { kind: "ok"; }
  | { kind: "bad-data"; errors: {} }
  | WrapifiedType<T>
  | GeneralApiProblem

export const wrapApiCall = <T extends GenericResponse>(apiCall: Promise<T>, options: WrapifyApiCallOptions<T>) => {
  return apiCall.then((result) => {
    if (result.kind === 'ok') {
      if (options.successMessage) {
        if (typeof options.successMessage === 'function') {
          showMessage(options.successMessage(result) || '', 'success')
        } else {
          showMessage(options.successMessage, 'success')
        }
      }
      if (options.onSuccess) {
        options.onSuccess(result)
      }
    } else {
      if (options.onError) {
        options.onError(result)
      }
      if (options.errorMessage) {
        if (typeof options.errorMessage === 'function') {
          throw new ApiError(result, options.errorMessage(result) || '')
        } else {
          throw new ApiError(result, options.errorMessage)
        }

      }
    }
  }).catch((error) => {
    showErrorMessageBasedOnError(error)
  }).finally(() => {
    if (options.onFinally) {
      options.onFinally()
    }
  })
}


export const wrappifyApiCall = <T extends GenericResponse>(api_promise: Promise<T>): WrapifiedType<T> => {
  if (!api_promise || api_promise.then === undefined) {
    return api_promise as WrapifiedType<T>
  }
  // @ts-ignore
  return new Proxy<WrapifiedType<T>>(api_promise, {
    get: function (target, prop) {
      // @ts-ignore
      const value = target[prop];
      if (prop === 'handle') {
        const handle = function <T extends GenericResponse>(options: WrapifyApiCallOptions<T>) {
          return wrapApiCall(this, options)
        }
        return handle.bind(target);
      }
      return value.bind(target);
    }
  });
}
