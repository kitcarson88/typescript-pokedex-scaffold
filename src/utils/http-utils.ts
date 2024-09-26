import { Request } from "express";
import { wsUrls } from "../constants";

export function fullPokemonBeUrl(req: Request) {
  return wsUrls.POKEAPI + "/" + endpoint;
}

export function fullHostUrl(req: Request) {
  return hostBaseUrl(req) + "/" + endpoint(req)
}

export function endpoint(req: Request) {
  return req.originalUrl.endsWith('/') ? req.originalUrl.substring(0, req.originalUrl.length - 1) : req.originalUrl;
}

export function hostBaseUrl(req: Request) {
  return req.protocol + "://" + req.get("host");
}

export function prepareUrl(url: string, pathParams?: { [key: string]: string }, queryParams?: { [key: string]: string }) {
    let preparedUrl = url;
  
    if (pathParams)
      preparedUrl = applyPathParams(preparedUrl, pathParams);
    if (queryParams)
      preparedUrl = createUrlWithQueryParams(preparedUrl, queryParams);
  
    return preparedUrl;
  }
  
  export function applyPathParams(url: string, pathParams: { [key: string]: string }) {
    let urlWithParams = url;
    const keys = Object.keys(pathParams);
  
    for (const key of keys) urlWithParams = urlWithParams.replace("{{" + key + "}}", pathParams[key]);
  
    return url;
  }
  
  export function createUrlWithQueryParams(url: string, queryParams: { [key: string]: string }) {
    let urlWithParams = url;
    const keys = Object.keys(queryParams);
  
    if (keys.length) {
      urlWithParams += "?";

      for (const key of keys) urlWithParams += key + "=" + queryParams[key] + "&";

      urlWithParams = urlWithParams.substring(0, urlWithParams.length - 1);
    }
    
    return urlWithParams;
  }