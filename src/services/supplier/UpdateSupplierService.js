import { api } from "../Api";

export default async function UpdateSupplierService(supplierDTO, idSupplier) {
    try{
        const res = await api.put(`/fornecedor/${idSupplier}`, {
            nome: supplierDTO?.nome,
            telefone: supplierDTO?.telefone,
            email: supplierDTO?.email,
            CNPJ: supplierDTO?.cnpj
        })
        
        return res;
    }catch(error){
        console.log(error.response.data);
        throw error;
    }
}