import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuth"

export default function Home(){

    const {logoutContext} = useAuth();
    const navigate = useNavigate();

    const handleManagerItem = () => {
        navigate('/manager/item')
    }

    const handleManagerSupplier = () => {
        navigate('/manager/supplier')
    }

    const handleCreateTransaction = () => {
        navigate('/create/transaction')
    }

    const handleManagerReport = () => {
        navigate('/manager/report')
    }

    return(
        <div>
            <h1>Home</h1>
            <button onClick={handleManagerItem}>Gerenciar Itens</button>
            <button onClick={handleManagerSupplier}>Gerenciar Fornecedor</button>
            <button onClick={handleCreateTransaction}>Cadastrar Trnsações</button>
            <button onClick={handleManagerReport}>Gerenciar Relatórios</button>
            <button onClick={logoutContext}>
                Sair
            </button>
        </div>
    )
}