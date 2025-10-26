import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListAllSupplierService from "../../services/supplier/ListAllSupplierService";
import CreateItemService from "../../services/Item/CreateItemService";

export default function CreateItem() {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [availableSuppliers, setAvailableSuppliers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const findAllSupplier = async () => {
            try {
                const res = await ListAllSupplierService();
                console.log(res.data);
                setAvailableSuppliers(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        findAllSupplier();
    }, [])

    return (
        <div>
            <h1>Cadastre-se</h1>

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
                    initialValues={{ nome: "", factory: "", preco: 0, quantidade: 0, foto: "", fornecedorId: "" }}
                    onSubmit={async (values) => {
                        try {
                            setErrorMessage("")
                            setSuccessMessage("")
                            await CreateItemService(values)
                            setSuccessMessage("Item cadastrado com sucesso!")
                            setTimeout(() => {
                                setSuccessMessage("");
                                return navigate("/manager/item")
                            }, 2000)
                        } catch (error) {
                            setErrorMessage(error.message)
                        }
                    }}
                >
                    {(formik) => (<Form>
                        <div>
                            <label>Nome</label>
                            <div className="relative">
                                <Field
                                    type="text"
                                    name="nome"
                                    placeholder="Digite o nome do produto"
                                />
                            </div>
                        </div>
                        <div>
                            <label>Categoria</label>
                            <div className="relative">
                                <Field as="select" name="factory" className="border p-2 rounded">
                                    <option value="">Selecione uma categoria</option>
                                    <option value="alimento">Alimento</option>
                                    <option value="bebida">Bebida</option>
                                    <option value="eletronico">Eletrônico</option>
                                </Field>
                            </div>
                        </div>
                        <div>
                            <label>Preço</label>
                            <div className="relative">
                                <Field
                                    type="number"
                                    name="preco"
                                />
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
                        <div>
                            <label>Foto do Produto</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                formik.setFieldValue("foto", reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label>Fornecedor</label>
                            <div className="relative">
                                <Field as="select" name="fornecedorId" className="border p-2 rounded">
                                    <option value="">Selecione um fornecedor</option>
                                    {availableSuppliers && (
                                        availableSuppliers.map((fornecedor) => (
                                            <option value={fornecedor.id} key={fornecedor.id}>{fornecedor.nome}</option>
                                        ))
                                    )}
                                </Field>
                            </div>
                        </div>

                        <button
                            type="submit"
                        >
                            Cadastrar-se
                        </button>
                    </Form> 
                )}
                </Formik>
            </div>
        </div>
    )
}