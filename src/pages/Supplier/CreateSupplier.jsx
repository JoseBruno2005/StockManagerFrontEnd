import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import * as Yup from "yup"
import { Formik, Form, Field } from "formik"
import CreateSupplierService from "../../services/supplier/CreateSupplierService";

export default function CreateSupplier() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [showMessage, setShowMessage] = useState();

    return (
        <>
            <p>Crie um fornecedor</p>

            <Formik
                initialValues={{
                    nome: "",
                    telefone: "",
                    email: "",
                    cnpj: ""
                }}
                validationSchema={Yup.object({
                    nome: Yup.string()
                        .min(3, "O nome deve contér no mínimo 3 caracteres")
                        .max(50, "O nome deve conter no máximo 50 caracteres")
                        .required("Obrigatório"),
                    telefone: Yup.string()
                        .matches(
                            /^(\+55)?\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
                            "Telefone inválido"
                        )
                        .required("Obrigatório"),

                    email: Yup.string()
                        .email("Email inválido")
                        .required("Obrigatório"),

                    cnpj: Yup.string()
                        .matches(
                            /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                            "CNPJ inválido, formato: 00.000.000/0000-00"
                        )
                        .required("Obrigatório"),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const resul = await CreateSupplierService(values)
                        setShowMessage(true)
                        setTimeout(() => {
                            navigate(`/manager/supplier`)
                        }, 2000)
                        setMessage("Fornecedor Criado com Sucesso!")
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
                            <button type="submit">Cadastrar Fornecedor</button>
                        </div>
                    </Form>
                )}
            </Formik>

            {showMessage && (
                <div>
                    {message}
                </div>
            )}
        </>
    )
}