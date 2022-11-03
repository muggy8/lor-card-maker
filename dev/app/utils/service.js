export function getCardList(){
    return fetch("pseudo-api/card-list/").then(res=>res.json())
}

export function getCard(id){
    return fetch("pseudo-api/card/" + id).then(res=>res.json())
}

export function saveCard(id, data){
    return fetch("pseudo-api/card/" + id, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

export function deleteCard(id){
    return fetch("pseudo-api/card/" + id, {
        method: "DEL",
    })
}


export function getSettings(){
    return fetch("pseudo-api/settings/").then(res=>res.json())
}

export function saveSettings(data){
    return fetch("pseudo-api/settings/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}