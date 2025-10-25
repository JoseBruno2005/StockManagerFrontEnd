import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FindItemService from "../../services/item/FindItemService";
import { Field, Form, Formik } from "formik";

export default function UpdateItem() {
    const { id } = useParams();
    const [item, setItem] = useState();
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        const findItem = async () => {
            const res = await FindItemService(id);
            console.log(res.data);
            setItem(res.data);
        }
        findItem()
    }, [id])

    return (
        <div>
            <h1>Cadastre-se</h1>

            {successMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-50/95 backdrop-blur-sm">
                    <div className="bg-white/90 border-2 border-green-200/50 rounded-2xl p-8 shadow-xl text-center">
                        <HiCheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-green-800 mb-2">Sucesso!</h3>
                        <p className="text-green-700 text-lg">{successMessage}</p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-50/95 backdrop-blur-sm border-2 border-red-200/50 rounded-2xl p-6 mb-8 shadow-lg">
                    <div className="flex items-center gap-4">
                        <HiExclamationCircle className="h-8 w-8 text-red-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-red-800">Erro!</h3>
                            <p className="text-red-700">{errorMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {item ? (
                <div>
                    <Formik
                        initialValues={{ nome: item.nome, preco: item.preco, quantidade: item.quantidade, foto: item.foto }}
                        onSubmit={async (values) => {
                            try {
                                setErrorMessage("")
                                setSuccessMessage("")

                                await UpdateItem(values);
                                setSuccessMessage("Item atualizado com sucesso!")

                                setTimeout(() => {
                                    setSuccessMessage("");
                                    return navigate("/login")
                                }, 2000)
                            } catch (error) {
                                setErrorMessage(error.message)
                            }
                        }}
                    >
                        <Form>
                            <div>
                                <label>Nome</label>
                                <div className="relative">
                                    <Field
                                        type="text"
                                        name="nome"
                                    />
                                </div>
                            </div>
                            <div>
                                <label>Email</label>
                                <div className="relative">
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Digite seu email"
                                    />
                                </div>
                            </div>
                            <div>
                                <label>Senha</label>
                                <div className="relative">
                                    <Field
                                        type="password"
                                        name="password"
                                        placeholder="Digite sua senha"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                            >
                                Cadastrar-se
                            </button>
                        </Form>
                    </Formik>
                </div>
            ) : (
                <div>Nenhum item Encontrado</div>
            )}
        </div>
    )
}