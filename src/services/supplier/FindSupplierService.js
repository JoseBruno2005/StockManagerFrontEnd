import { api } from "../Api";

export default async function FindSupplierService(idSupplier) {
    try{
        const res = await api.get(`/fornecedor/find/${idSupplier}`, {
            
        })
        return res;
    }catch(error){
        console.log(error.response.data);
        throw error;
    }
}