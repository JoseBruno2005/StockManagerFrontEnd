import { Form, Formik, Field } from "formik";
import RegisterUserService from "../../services/auth/RegisterUserService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const navigate = useNavigate();



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

            <div>
                <Formik
                    initialValues={{ name: "", email: "", password: "" }}
                    onSubmit={async (values) => {
                        try {
                            setErrorMessage("")
                            setSuccessMessage("")

                            await RegisterUserService(values);
                            setSuccessMessage("Usuário cadastrado com sucesso!")

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
                                    name="name"
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
        </div>
    )
}