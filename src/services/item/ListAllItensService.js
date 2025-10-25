import { api } from "../Api";

export default async function ListAllItemService() {
    try{
        const res = await api.get('/item/listItens', {
            
        })
        return res;
    }catch(error){
        console.log(error.response.data);
        throw error;
    }
}