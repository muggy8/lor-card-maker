export function getCardList(){
    return fetch("pseudo-api/card-list/").then(res=>res.json())
}