import { useAuth } from "../../hooks/UseAuth"

export default function Home(){

    const {logoutContext} = useAuth();

    return(
        <div>
            <h1>Home</h1>
            <button onClick={logoutContext}>
                Sair
            </button>
        </div>
    )
}