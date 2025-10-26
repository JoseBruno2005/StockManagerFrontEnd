import { api } from "../Api";

export default async function ItemHistoryService(itemId, inicio, fim) {
    try{
        const res = await api.get(`/relatorios/historico/${itemId}`,{
            params: {
                inicio: inicio,
                fim: fim
            }
        })

        return res;
    }catch(error){
        console.log(error.response?.data || error.message);
        throw error;
    }
}