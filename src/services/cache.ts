import { PersistentNodeCache } from "persistent-node-cache";
import { configuration } from "../constants";
import { logger } from "./logger";

// const NodeCache = require('node-cache');

// export const cache = new NodeCache({ stdTTL: configuration.CACHE_TIMEOUT * 60 });

export const cache = new PersistentNodeCache("pokemoncache", 0, "./", { stdTTL: configuration.CACHE_TIMEOUT * 60, checkperiod: configuration.CACHE_CLEAN_TIMEOUT * 60 });

const keys = cache.keys();
logger.debug("Cache saved keys: " + keys);
logger.debug("Cache stats: " + JSON.stringify(cache.getStats()));

// Resets ttl of existent cache keys
for (var key of keys) {
    cache.ttl(key, configuration.CACHE_TIMEOUT * 60);
}