import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FindItemService from "../../services/item/FindItemService";
import { Field, Form, Formik } from "formik";
import UpdateItemService from "../../services/item/UpdateItemService";

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
            <h1>Atualizar Item</h1>

            {successMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-50/95 backdrop-blur-sm">
                    <div className="bg-white/90 border-2 border-green-200/50 rounded-2xl p-8 shadow-xl text-center">
                        <h3 className="text-2xl font-bold text-green-800 mb-2">Sucesso!</h3>
                        <p className="text-green-700 text-lg">{successMessage}</p>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-50/95 backdrop-blur-sm border-2 border-red-200/50 rounded-2xl p-6 mb-8 shadow-lg">
                    <div className="flex items-center gap-4">
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
                        enableReinitialize
                        initialValues={{
                            nome: item.nome,
                            preco: item.preco,
                            quantidade: item.quantidade,
                            foto: item.foto
                        }}
                        onSubmit={async (values) => {
                            try {
                                setErrorMessage("")
                                setSuccessMessage("")

                                await UpdateItemService(values, id);
                                setSuccessMessage("Item atualizado com sucesso!")

                                window.location.reload();
                            } catch (error) {
                                setErrorMessage(error.message)
                            }
                        }}
                    >
                        {({ dirty }) => (
                            <Form>
                                <div>
                                    <label>Preço</label>
                                    <Field type="number" name="preco" />
                                </div>
                                <div>
                                    <label>Quantidade</label>
                                    <Field type="number" name="quantidade" />
                                </div>
                                <div>
                                    <label>Foto</label>
                                    <Field name="foto" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!dirty}
                                    className={`px-4 py-2 rounded-md text-white ${dirty ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    Salvar
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="ml-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                                >
                                    Cancelar
                                </button>
                            </Form>
                        )}
                    </Formik>

                </div>
            ) : (
                <div>Nenhum item Encontrado</div>
            )}
        </div>
    )
}