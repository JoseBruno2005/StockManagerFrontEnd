import { api } from "../Api";

export default async function FindItemService(itemId) {
    try{
        const res = await api.get(`/item/find/${itemId}`, {
            
        })
        return res;
    }catch(error){
        console.log(error.response.data);
        throw error;
    }
}