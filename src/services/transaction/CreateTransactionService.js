import { api } from "../Api";

export default async function CreateTransactionService(transactionDTO) {
    try {
        const res = await api.post('/transacao/save', {
            quantidade: transactionDTO.quantidade,
            tipoTransacao: transactionDTO.tipoTransacao,
            data: transactionDTO.data,
            itemId: transactionDTO.itemId
        })

        return res;
    } catch (error) {
        console.log(error.response?.data || error.message);
        throw error;
    }
}