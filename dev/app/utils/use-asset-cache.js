import useEffectDebounce from "./use-debounce-effect.js";
import { useEffect, useState } from "/cdn/react";

/**
 * The data to be cached
 * @typedef {*} cachedData
 */

/**
 * A React hook that abstracts the mundanity and boilerplat code for getting cached assets.
 * 
 * @function useAssetCache
 * @param { function(function(cachedData)) : (function():void | undefined | null) } effect - Gets executed with useEffect to fetch the asset to be cached.
 * @param { Array.<*> } watched - the array to be passed to the second argument of useEffect.
 * @param { (*|undefined) } defaultValue - default value optional
 * @returns { (*|undefined) }
 */
export function useAssetCache(effect, watched, defaultValue){
    const [cachedAsset, updateCachedAsset] = useState(defaultValue)
    useEffect(()=>{
        return effect(updateCachedAsset)
    }, watched)

    return cachedAsset
}

/**
 * A React hook that abstracts the mundanity and boilerplat code for getting cached assets with a debounce.
 * 
 * @function useAssetCache
 * @param { function(function(cachedData)) : (function():void | undefined | null) } effect - Gets executed with useEffect to fetch the asset to be cached.
 * @param { number } debounceDuration - The number of miliseconds to wait before executing the effect.
 * @param { Array.<*> } watched - the array to be passed to the second argument of useEffect.
 * @param { (*|undefined) } defaultValue - default value optional
 * @returns { (*|undefined) }
 */
export function useAssetCacheDebounced(effect, debounceDuration, watched, defaultValue){
    const [cachedAsset, updateCachedAsset] = useState(defaultValue)
    useEffectDebounce(()=>{
        return effect(updateCachedAsset)
    }, debounceDuration, watched)

    return cachedAsset
}

export default useAssetCache