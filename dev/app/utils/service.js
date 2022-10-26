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