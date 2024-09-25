import { Request, Response, Router } from "express";
import { configuration } from "../constants";
import { PokemonFacade } from "../facades/pokemon.facade";
import { HttpError } from "../models/enum/http-errors.enum";
import { wsMirroringRepository } from "../repositories/ws-mirroring.repository";
import { logger } from "../services/logger";
import { endpoint, hostBaseUrl } from "../utils/http-utils";

const NodeCache = require('node-cache');

const router = Router();
const cache = new NodeCache();
const pokemonFacade = new PokemonFacade();

router.get("/pokemon", async (req: Request, res: Response) => {
    // const limit = req.query.limit as string | undefined;
    // const offset = req.query.offset as string | undefined;

    const endp = endpoint(req);
    const language = req?.headers?.["accept-language"] ?? "en";

    const cacheKey = encodeURI(endp + `+lang=${language}`);
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        logger.debug(`Data retrieved from cache with key ${cacheKey}`);
        return res.json(cachedData);
    } else {
        logger.debug(`No cache data found with key ${cacheKey}. Retrieve from original service`);
        try {
            const data = await pokemonFacade.getPokemonList(hostBaseUrl(req), endp, language);
            cache.set(cacheKey, data, configuration.CACHE_TIMEOUT * 60);
            res.json(data);
        } catch (error) {
            logger.error(error);
            res
              .status(HttpError.InternalServerError)
              .send({error: "Internal Server Error", message: "An error occured during pokemon list retrieve"});
        }
    }
});

router.get("/pokemon/:id", async (req: Request, res: Response) => {
    const endp = endpoint(req);
    const language = req?.headers?.["accept-language"] ?? "en";

    const cacheKey = encodeURI(endp + `+lang=${language}`);
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        logger.debug(`Data retrieved from cache with key ${cacheKey}`);
        return res.json(cachedData);
    } else {
        logger.debug(`No cache data found with key ${cacheKey}. Retrieve from original service`);
        try {
            const data = await pokemonFacade.getPokemonDetail(hostBaseUrl(req), endp, language);
            cache.set(cacheKey, data, configuration.CACHE_TIMEOUT * 60);
            res.json(data);
        } catch (error) {
            logger.error(error);
            res
              .status(HttpError.InternalServerError)
              .send({error: "Internal Server Error", message: "An error occured during pokemon detail retrieve"});
        }
    }
});

router.get("/pokemon-species/:id", async (req: Request, res: Response) => {
    const endp = endpoint(req);
    const language = req?.headers?.["accept-language"] ?? "en";

    const cacheKey = encodeURI(endp + `+lang=${language}`);
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        logger.debug(`Data retrieved from cache with key ${cacheKey}`);
        return res.json(cachedData);
    } else {
        try {
            const data = await pokemonFacade.getPokemonSpeciesDetail(hostBaseUrl(req), endp, language);
            cache.set(cacheKey, data, configuration.CACHE_TIMEOUT * 60);
            res.json(data);
        } catch (error) {
            logger.error(error);
            res
              .status(HttpError.InternalServerError)
              .send({error: "Internal Server Error", message: "An error occured during pokemon species detail retrieve"});
        }
    }
});

router.get("/*", async (req: Request, res: Response) => {
    // req.params contains all url path parameters
    // console.log(req.params);

    // Full api url
    // const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // console.log(fullUrl);

    const endp = endpoint(req);
    const cacheKey = encodeURI(endp);
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        logger.debug(`Data retrieved from cache with key ${cacheKey}`);
        return res.json(cachedData);
    } else {
        logger.debug(`No cache data found with key ${cacheKey}. Retrieve from original service`);
        try {
            var data = await wsMirroringRepository.getMirroredDataByEndpoint(endp);

            // Replace in response base urls with local server host url
            const dataString = JSON.stringify(data).replace(new RegExp(process.env.POKEAPI_URL!, 'g'), hostBaseUrl(req));
            data = JSON.parse(dataString);

            cache.set(cacheKey, data, configuration.CACHE_TIMEOUT * 60);
            res.json(data);
        } catch (error: any) {
            logger.error(error);
            res
              .status(error['response']['status'])
              .send(error['response']['data']);
        }
    }
});

export default router;