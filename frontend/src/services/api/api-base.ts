import * as Types from "./api.types";
import {
  DownloadFileResult,
  GenericResponse,
  ListResult,
  NoResponseGetResult,
  NoResponsePostResult,
  SimpleGetResult,
  SimplePostResult,
  SingleResult
} from "./api.types";
import {getGeneralApiProblem} from "./api-problem";
import {ApiResponse, ApisauceInstance, create} from "apisauce";
import {ApiConfig, DEFAULT_API_CONFIG} from "./api-config";
import {collect_files} from "../helpers";
import {WrapifiedType} from "../helpers_ts";


export class ApiError extends Error {
  private result: GenericResponse;
  constructor(result: GenericResponse, message?: string) {
    super(message);
    this.result = result;
  }
}

export type ApiReturnType<T extends GenericResponse> = WrapifiedType<T>

/**
 * Manages all requests to the API.
 */
export class ApiBase {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  public apisauce: ApisauceInstance | undefined;

  /**
   * Configurable options.
   */
  config: ApiConfig;

  rootStore: any;

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
  }

  setRootStore(rootStore: any) {
    this.rootStore = rootStore;
  }

  clearRootStore() {
    if (this.rootStore) {
      this.apisauce.deleteHeader('Authorization')
      this.rootStore.reset();
    }
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    const config = {
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    };
    if (document && document.cookie) {
      document.cookie.split(";").forEach((keyvalue) => {
        if (keyvalue.indexOf("csrftoken") !== -1) {
          // @ts-ignore
          config.headers["X-CSRFToken"] = keyvalue.split("=")[1];
        }
      });
    }
    // construct the apisauce instance
    this.apisauce = create(config);
  }

  // ###### generics / helpers desde aca, agregar vistas nuevas arriba de este punto
  // ###### generics / helpers desde aca, agregar vistas nuevas arriba de este punto
  // ###### generics / helpers desde aca, agregar vistas nuevas arriba de este punto
  // ###### generics / helpers desde aca, agregar vistas nuevas arriba de este punto

  async paginated_list_view<T extends ListResult>(
    path: string,
    page?: number,
    perPage?: number,
    order?: any,
    search?: string,
    extra_params?: {}
    // @ts-ignore
  ): ApiReturnType<T> {
    let params = Object.assign(
      {
        page,
        perPage,
        ordering: order,
        search,
      },
      extra_params
    );
    return this.simple_get(path, params);
  }

  async single_casted_get_view<T extends SingleResult>(
    path: string,
    extra_params: {},
    field: string
    // @ts-ignore
  ): ApiReturnType<T> {
    const respuesta = await this.simple_get(path, extra_params);
    // casteo a T
    if (respuesta.kind === "ok") {
      let ret = {kind: "ok"};
      // @ts-ignore
      ret[field] = respuesta.data;
      return ret as T;
    } else return respuesta as T;
  }

  async single_get_view<T extends SingleResult>(
    path: string,
    extra_params?: {},
    axios?: {}
    // @ts-ignore
  ): ApiReturnType<T> {
    return this.simple_get(path, extra_params, axios);
  }

  // @ts-ignore
  async single_list_view<T extends ListResult>(path: string, extra_params?: {}): ApiReturnType<T> {
    return this.simple_get(path, extra_params);
  }

  // @ts-ignore
  async noresult_get<T extends NoResponseGetResult>(path: string, extra_params?: {}): ApiReturnType<T> {
    const respuesta = await this.simple_get(path, extra_params);
    // casteo a NoResponseGetResult
    return (respuesta.kind === "ok" ? {kind: "ok"} : respuesta) as T;
  }

  async simple_get<T extends SimpleGetResult>(
    path: string,
    extra_params?: {},
    axios?: {}
    // @ts-ignore
  ): ApiReturnType<T> {
    if (!this.apisauce) {
      return {kind: "unknown", temporary: true} as T;
    }
    const response: ApiResponse<any> = await this.apisauce.get(path, extra_params, axios);

    return handleApisauceResponse<T>(this, response, true);
  }

  // @ts-ignore
  async download_file_post<T extends DownloadFileResult>(path: string, extra_params?: {}, filename_if_not_from_backend?: string): ApiReturnType<T> {
    return this.download_file_by_method(path, extra_params, filename_if_not_from_backend, this.apisauce?.post)
  }

  // @ts-ignore
  async download_file_get<T extends DownloadFileResult>(path: string, extra_params?: {}, filename_if_not_from_backend?: string): ApiReturnType<T> {
    return this.download_file_by_method(path, extra_params, filename_if_not_from_backend, this.apisauce.get)
  }

  // @ts-ignore
  async download_file_by_method<T extends DownloadFileResult>(path: string, extra_params?: {}, filename_if_not_from_backend?: string, method_funct?: any): ApiReturnType<T> {
    if (!this.apisauce) {
      return {kind: "unknown", temporary: true} as T;
    }

    method_funct ||= this.apisauce.get
    const response: ApiResponse<any> = await method_funct(path, extra_params, {responseType: 'blob'});
    // const filename = getFileName(response.headers.get('Content-Disposition'))

    if (!response.ok) {
      return handleApisauceResponse<T>(this, response, true);
    }

    // may need to add: CORS_EXPOSE_HEADERS = [ 'content-disposition', ] in django settings for this to work
    const contentDisposition = getParameterCaseInsensitive(response.headers,'Content-Disposition') as string | undefined;
    let filename_from_headers = undefined
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match) {
        filename_from_headers = match[1];
        // console.log(filename_from_headers);
      } else {
        // console.log('Filename not found in Content-Disposition header');
      }
    } else {
      // console.log('Content-Disposition header not found in response');
    }
    const filename = filename_from_headers || filename_if_not_from_backend
    const file = new File([response.data], filename)
    try {
      return {
        kind: "ok",
        data: file,
        filename: filename,
        download_file: () => {
          const a = document.createElement("a");
          document.body.appendChild(a);
          // @ts-ignore
          a.style = "display: none";
          const url = window.URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove()
        }
      } as T;
    } catch {
      return {kind: "bad-data"} as T;
    }
  }

  async simple_casted_post<T extends SimplePostResult>(
    path: string,
    extra_params: {},
    field: string
    // @ts-ignore
  ): ApiReturnType<T> {
    const respuesta = await this.simple_post(path, extra_params);
    // casteo a T
    if (respuesta.kind === "ok") {
      let ret = {kind: "ok"};
      // @ts-ignore
      ret[field] = respuesta.data;
      return ret as T;
    } else return respuesta as T;
  }

  // @ts-ignore
  async noresult_post<T extends NoResponsePostResult>(path: string, params?: {}): ApiReturnType<T> {
    const respuesta = await this.simple_post(path, params);
    // casteo a NoResponseGetResult
    return (respuesta.kind === "ok" ? {kind: "ok"} : respuesta) as T;
  }

  // @ts-ignore
  async simple_post<T extends SimplePostResult>(path: string, params?: {}, axios?: {}): ApiReturnType<T> {
    if (!this.apisauce) {
      return {kind: "unknown", temporary: true} as T;
    }

    const response: ApiResponse<any> = await this.apisauce.post(path, params, axios);

    return handleApisauceResponse<T>(this, response, true);
  }

  // @ts-ignore
  async post_collected_multipart_form_data(path: string, data_with_files: any): ApiReturnType<Types.SimplePostResult> {
    return this.method_collected_multipart_form_data(
      this.apisauce?.axiosInstance?.post,
      path,
      data_with_files,
    )
  }

  // @ts-ignore
  async patch_collected_multipart_form_data(path: string, data_with_files: any): ApiReturnType<Types.SimplePostResult> {
    return this.method_collected_multipart_form_data(
      this.apisauce?.axiosInstance?.patch,
      path,
      data_with_files,
    )
  }

  // @ts-ignore
  async method_collected_multipart_form_data(funct: any, path: string, data_with_files: any): ApiReturnType<Types.SimplePostResult> {
    if (!this.apisauce) {
      return {kind: "unknown", temporary: true}
    }
    const [data, files] = collect_files(data_with_files)
    let fdata = new FormData()
    fdata.append('data', JSON.stringify(data))
    // @ts-ignore
    files.forEach(([fpath, file]) => fdata.append(fpath, file))

    let response
    const headers = {
      "Content-Type": "multipart/form-data",
      "Authorization": this.apisauce.headers.Authorization
    }
    try {
      response = await funct(path, fdata, {headers})
    } catch (e: any) {
      if (e.message?.includes("status code 400") || e.message?.includes("status code 403")) {
        return {kind: "bad-data", errors: e.response.data}
      }
      response = {status: 500, errors: 'SERVER_ERROR', problem: 'SERVER_ERROR'}
    }
    if (response.status === 400 || response.status === 403) {
      // @ts-ignore
      return {kind: "bad-data", errors: response.data}
    } else if (response.status === 401) {
      this.clearRootStore()
    } else {
      // @ts-ignore
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return problem
      }
    }

    try {
      // @ts-ignore
      return {kind: "ok", response: response.data}
    } catch {
      return {kind: "bad-data"}
    }

  }

  async simple_id_save_or_create<T extends SimplePostResult>(
    pathBase: string,
    datos: { id?: number }
    // @ts-ignore
  ): WrapifiedType<T> {
    if (datos.id) {
      return this.simple_patch(`${pathBase}/${datos.id}/`, datos);
    } else {
      return this.simple_post(`${pathBase}/`, datos);
    }
  }

  // @ts-ignore
  async simple_put<T extends SimplePostResult>(path: string, data?: {}): ApiReturnType<T> {
    if (!this.apisauce) {
      return {kind: "unknown", temporary: true} as T;
    }

    const response: ApiResponse<any> = await this.apisauce.put(path, data);

    return handleApisauceResponse<T>(this, response, true);
  }


  // @ts-ignore
   async simple_patch<T extends SimplePostResult>(path: string, data?: {}): ApiReturnType<T> {
    if (!this.apisauce) {
      return {kind: "unknown", temporary: true} as T;
    }

    const response: ApiResponse<any> = await this.apisauce.patch(path, data);

    return handleApisauceResponse<T>(this, response, true);
  }

  // @ts-ignore
  async simple_delete(path: string, data?: {}): ApiReturnType<Types.GenericResponse> {
    if (!this.apisauce) {
      return {kind: "unknown", temporary: true};
    }

    const response: ApiResponse<any> = await this.apisauce.delete(path, data);

    return handleApisauceResponse<Types.GenericResponse>(this, response, false);
  }


}

function handleApisauceResponse<T extends GenericResponse>(api: ApiBase, response: ApiResponse<any>, include_response_data= true): ApiReturnType<T> {
  if (response.status === 401) {
    api.clearRootStore();
  }

  if (!response.ok) {
    if (response.status === 400) {
      return {kind: "bad-data", errors: response.data} as unknown as ApiReturnType<T>;
    } else {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem as unknown as ApiReturnType<T>;
    }
  }

  try {
    if (include_response_data) {
      return {kind: "ok", response: response.data, data: response.data} as unknown as ApiReturnType<T>;
    }else {
      return {kind: "ok"} as unknown as ApiReturnType<T>;
    }
  } catch {
    return {kind: "bad-data"} as unknown as ApiReturnType<T>;
  }
}

function getParameterCaseInsensitive<T extends string, K>(object: object | Map<T, K>, key: T):  K {
  const asLowercase = key.toLowerCase();
  // @ts-ignore
  return object[Object.keys(object).filter(function(k: T) {
    return k.toLowerCase() === asLowercase;
  })[0]];
}
