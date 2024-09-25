import { configuration } from "../constants";

const NodeCache = require('node-cache');

export const cache = new NodeCache({ stdTTL: configuration.CACHE_TIMEOUT * 60 });
