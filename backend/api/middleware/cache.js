// utils/cache.js
import NodeCache from 'node-cache';

// Set stdTTL (standard time-to-live) in seconds
const cache = new NodeCache({ stdTTL: 600 }); // cache for 5 minutes

export default cache;
