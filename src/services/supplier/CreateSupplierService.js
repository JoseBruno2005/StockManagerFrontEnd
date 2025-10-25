import { api } from "../Api";

export default async function CreateSupplierService(supplierDTO) {
    try{
        const res = await api.post('/fornecedor/save', {
            nome: supplierDTO.nome,
            telefone: supplierDTO.telefone,
            email: supplierDTO.email,
            CNPJ: supplierDTO.CNPJ
        })
        
        return res;
    }catch(error){
        console.log(error.response.data);
        throw error;
    }
}