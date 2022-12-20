import { useEffect, useState } from "/cdn/react";

/**
 * A React hook that abstracts the mundanity and boilerplat code for getting cached assets.
 * 
 * @function useAssetCache
 * @param { function(function(*)) : (function():void | undefined | null) } effect - Gets executed with useEffect to fetch the asset to be cached.
 * @param { Array.<*> } watched - the array to be passed to the second argument of useEffect.
 * @returns { (*|undefined) }
 */
export default function useAssetCache(effect, watched){
    const [cachedAsset, updateCachedAsset] = useState()
    useEffect(()=>{
        return effect(updateCachedAsset)
    }, watched)

    return cachedAsset
}