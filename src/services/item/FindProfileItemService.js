import { api } from "../Api";

export default async function FindProfileItemService(itemId) {
    try{
        const res = await api.get(`/item/${itemId}/profile`, {
            
        })
        return res;
    }catch(error){
        console.log(error.response.data);
        throw error;
    }
}