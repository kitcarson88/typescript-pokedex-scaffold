import axios from "axios";
import { configuration } from "../constants";
import * as utils from "../utils";

const http = axios.create({
  timeout: configuration.SERVICE_TIMEOUT * 1000,
});

// http.interceptors.request.use((request: any) => {
//   request.headers["Content-type"] = "";
//   return request;
// });

// http.interceptors.request.use((request: any) => {
//   logger.debug(`WS Request ${JSON.stringify(request)}`);
//   return request;
// });
// http.interceptors.response.use((response: any) => {
//   logger.debug(`WS Response ${JSON.stringify(response.data)}`);
//   return response;
// });


export const requestor = {
  get: async (
    url: string,
    params?: {
      pathParams?: { [key: string]: string },
      queryParams?: { [key: string]: string },
      header?: { [key: string]: string }
    }
  ) => {
    const preparedUrl = params ? utils.http.prepareUrl(url, params.pathParams, params.queryParams) : url;
    const response = await http.get(preparedUrl, { headers: params?.header });
    return response.data;
  },

  post: async (
    url: string,
    params?: {
      pathParams?: { [key: string]: string },
      queryParams?: { [key: string]: string },
      header?: { [key: string]: string },
      body?: any
    }
  ) => {
    const preparedUrl = params ? utils.http.prepareUrl(url, params.pathParams, params.queryParams) : url;
    const response = await http.post(preparedUrl, params?.body, { headers: params?.header });
    return response.data;
  }
};