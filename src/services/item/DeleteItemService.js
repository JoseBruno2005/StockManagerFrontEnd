import { api } from "../Api";

export default async function DeleteItemService(itemId) {
    try{
        const res = await api.delete(`/item/${itemId}`, {
            
        })
        return res;
    }catch(error){
        console.log(error.response.data);
        throw error;
    }
}