import { useCallback, useState } from "/cdn/react"

export default function useToggle(defaultValue){
    const [value, setValue] = useState(defaultValue)
    const toggle = useCallback(()=>{
        setValue(!value)
    }, [value])

    return [value, toggle, setValue]
}