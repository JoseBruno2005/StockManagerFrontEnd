import { api } from "../Api";

export default async function ListAllSupplierService() {
    try{
        const res = await api.get('/fornecedor/list', {
            
        })
        return res;
    }catch(error){
        console.log(error.response.data);
        throw error;
    }
}