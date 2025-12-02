import { api } from "../Api";

export default async function UpdateItemService(itemDTO, itemId) {
    try{
        const res = await api.put(`/item/${itemId}`, {
            nome: itemDTO?.nome,
            preco: itemDTO?.preco,
            foto: itemDTO?.foto,
            fornecedorId: itemDTO?.fornecedorId
        })
        
        return res;
    }catch(error){
        console.log(error.response.data);
        throw error;
    }
}