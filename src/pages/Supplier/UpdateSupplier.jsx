import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup"
import { Formik, Form, Field } from "formik"
import UpdateSupplierService from "../../services/supplier/UpdateSupplierService";
import FindSupplierService from "../../services/supplier/FindSupplierService";

export default function UpdateSupplier() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [showMessage, setShowMessage] = useState();
    const [supplier, setSupplier] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const findSupplier = async () => {
            const res = await FindSupplierService(id);
            setSupplier(res.data);
            console.log(res);
        }
        findSupplier()
    }, [id])


    return (
        <>
            <p>Editar um fornecedor</p>
            {supplier ? (
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        nome: supplier.nome || "",
                        telefone: supplier.telefone || "",
                        email: supplier.email || "",
                        cnpj: supplier.cnpj || "",
                    }}
                    validationSchema={Yup.object({
                        nome: Yup.string()
                            .min(3, "O nome deve contér no mínimo 3 caracteres")
                            .max(50, "O nome deve conter no máximo 50 caracteres"),
                        telefone: Yup.string()
                            .matches(
                                /^(\+55)?\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
                                "Telefone inválido"
                            ),
                        email: Yup.string()
                            .email("Email inválido"),
                        cnpj: Yup.string()
                            .matches(
                                /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                                "CNPJ inválido, formato: 00.000.000/0000-00"
                            ),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const resul = await UpdateSupplierService(values, id)
                            setShowMessage(true)
                            setTimeout(() => {
                                navigate(`/manager/supplier`)
                            }, 2000)
                            setMessage("Fornecedor Atualizado com Sucesso!")
                            console.log(resul)
                        } catch (error) {
                            setShowMessage(true)
                            setMessage(error.message)
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                >
                    {({ setFieldValue, isSubmitting }) => (
                        <Form>
                            <div>
                                <label>Nome</label>
                                <div className="relative">
                                    <Field
                                        type="text"
                                        name="nome"
                                        placeholder="Digite seu nome"
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
                                <label>Telefone</label>
                                <div className="relative">
                                    <Field
                                        type="text"
                                        name="telefone"
                                        placeholder="Digite seu telefone, ex:(00) 00000-0000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label>CNPJ</label>
                                <div className="relative">
                                    <Field
                                        type="text"
                                        name="cnpj"
                                        placeholder="Digite seu CNPJ, ex: 00.000.000/0000-00"
                                    />
                                </div>
                            </div>
                            <div className="">
                                <button type="submit">Atualizar Fornecedor</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            ) : (
                <p>Carregando fornecedor...</p>
            )}

            {showMessage && (
                <div>
                    {message}
                </div>
            )}
        </>

    )
}