import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListAllItemService from "../../services/item/ListAllItensService";
import CreateTransactionService from "../../services/transaction/CreateTransactionService";

export default function CreateTransaction() {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [availableItems, setAvailableItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const findAllSupplier = async () => {
            try {
                const res = await ListAllItemService();
                console.log(res.data);
                setAvailableItems(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        findAllSupplier();
    }, [])

    return (
        <div>
            <h1>Criar Transação</h1>

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

            <div>
                <Formik
                    initialValues={{ quantidade: 0, tipoTransacao: "", data: "", itemId: "" }}
                    onSubmit={async (values) => {
                        try {
                            setErrorMessage("")
                            setSuccessMessage("")
                            await CreateTransactionService(values)
                            setSuccessMessage("Transação cadastrada com sucesso!")
                            setTimeout(() => {
                                setSuccessMessage("");
                                return navigate("/home")
                            }, 2000)
                        } catch (error) {
                            setErrorMessage(error.message)
                        }
                    }}
                >
                    <Form>
                        
                        <div>
                            <label>Tipo Transação</label>
                            <div className="relative">
                                <Field as="select" name="tipoTransacao" className="border p-2 rounded">
                                    <option value="">Selecione o tipo transação</option>
                                    <option value="compra">Compra</option>
                                    <option value="venda">Venda</option>
                                </Field>
                            </div>
                        </div>
                        <div>
                            <label>Data</label>
                            <div className="relative">
                                <Field
                                    type="datetime-local"
                                    name="data"
                                    className="border p-2 rounded"
                                />
                            </div>
                        </div>

                        <div>
                            <label>Item</label>
                            <div className="relative">
                                <Field as="select" name="itemId" className="border p-2 rounded">
                                    <option value="">Selecione o item</option>
                                    {availableItems && (
                                        availableItems.map((item) => (
                                            <option value={item.id} key={item.id}>{item.nome}</option>

                                        ))
                                    )}
                                </Field>
                            </div>
                        </div>

                        <div>
                            <label>Quantidade</label>
                            <div className="relative">
                                <Field
                                    type="number"
                                    name="quantidade"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                        >
                            Salvar Transação
                        </button>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}