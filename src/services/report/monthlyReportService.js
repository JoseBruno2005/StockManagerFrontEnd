import { api } from "../Api";

export default async function MonthlyReportService(mes, ano) {
    try{
        const res = await api.get(`relatorios/mensal`,{
            params: {
                mes: mes,
                ano: ano
            }
        })

        return res;
    }catch(error){
        console.log(error.response?.data || error.message);
        throw error;
    }
}