import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListAllSupplierService from "../../services/supplier/ListAllSupplierService";
import DeleteSupplierService from "../../services/supplier/DeleteSupplierService";

export default function ManagerSupplier() {

    const [listSupplier, setlistSupplier] = useState();
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [showMessage, setShowMessage] = useState();

    useEffect(() => {
        async function searchSupplier() {
            try {
                const suppliers = await ListAllSupplierService();
                setlistSupplier(suppliers.data);
                console.log(suppliers)
            } catch (error) {
                console.log(error)
            }
        }
        searchSupplier()
    }, [])

    function handleUpdateSupplier(idFornecedor) {
        navigate(`/update/supplier/${idFornecedor}`);
    }

    function handleCreateSupplier() {
        navigate(`/create/supplier`);
    }

    async function handleDeleteSupplier(idFornecedor) {
        try {
            await DeleteSupplierService(idFornecedor);
            setShowMessage(true);
            setMessage("Fornecedor deletado com sucesso!");
            setTimeout(() => {
                setMessage(false)
            }, 2000)
        } catch (error) {
            setShowMessage(true);
            setMessage("Não foi possivel deletar esse fornecedor!");
            setTimeout(() => {
                setMessage(false)
            }, 2000)
            console.error("Erro ao deletar o fornecedor: ", error);
        }
    }

    return (
        <>
            {listSupplier ? (
                <div>
                    <div>
                        <button onClick={handleCreateSupplier}>Criar Fornecedor</button>
                    </div>
                    {listSupplier.map((supplier) => (
                        <div key={supplier.id}>
                            <p>{supplier.nome}</p>
                            <p>{supplier.cnpj}</p>
                            <p>{supplier.email}</p>
                            <p>{supplier.telefone}</p>
                            <div>
                                <button onClick={() => { handleDeleteSupplier(supplier.id) }} >Deletar</button>
                                <button onClick={() => { handleUpdateSupplier(supplier.id) }}>Editar</button>
                            </div>
                        </div>

                    ))}
                </div>
            ) : (
                <div>
                    <p>Você ainda não tem fornecedores cadastrados</p>
                </div>
            )}

            {showMessage && (
                <div>
                    {message}
                </div>
            )}
        </>
    )
}