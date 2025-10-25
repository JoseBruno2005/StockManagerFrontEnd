import { useEffect, useState } from "react"
import ListAllItemService from "../../services/item/ListAllItensService";
import { useNavigate } from "react-router-dom";
import DeleteItemService from "../../services/item/DeleteItemService";

export default function ManagerItem(){

    const [listItens, setListItens] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const findAllItens = async () => {
            try{
                const res = await ListAllItemService();
                console.log(res.data);
                setListItens(res.data);
            }catch(error){
                console.log(error);
            }
        }
        findAllItens()
    }, [])

    const handleDeleteItem = async (itemId) => {
        try{
            await DeleteItemService(itemId);
            setListItens(prevList => prevList.filter(item => item.id !== itemId));
        }catch(error){
            console.log(error)
        }
    }

    const handleUpdateItem = (itemId) => {
        navigate(`/update/item/${itemId}`)
    }

    return(
        <div>
            <h1>Gerenciar Item</h1>
            {listItens ? (
                <div>
                    {listItens.map( (item) => (
                        <div key={item.id}>
                            <p>{item.foto}</p>
                            <p>{item.nome}</p>
                            <p>{item.preco}</p>
                            <p>{item.quantidade}</p>
                            <p>{item.fornecedorId}</p>
                            <div>
                                <button onClick={() => {handleDeleteItem(item.id)}}>Deletar Item</button>
                                <button onClick={() => {handleUpdateItem(item.id)}}>Atualizar Item</button>
                            </div>
                        </div>
                    ))}
                </div>
            ): (
                <div>
                    Nenhum item encontrado
                </div>
            )}
        </div>
    )
}