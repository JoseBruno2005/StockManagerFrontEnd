import { api } from "../Api";

export default async function CreateItemService(factory, itemDTO) {
    try{
        const res = await api.post('/item/save',{
            nome: itemDTO.nome,
            preco: itemDTO.preco,
            quantidade: itemDTO.quantidade,
            foto: itemDTO.foto,
            fornecedorId: itemDTO.fornecedorId
        }, {
            params: {
                factory
            }
        })
        
        return res;
    }catch(error){
        console.log(error.response?.data || error.message);
        throw error;
    }
}