import { api } from "../Api";

export default async function DeleteSupplierService(idSupplier) {
    try{
        const res = await api.delete(`/fornecedor/${idSupplier}`, {
            
        })
        return res;
    }catch(error){
        console.log(error.response.data);
        throw error;
    }
}