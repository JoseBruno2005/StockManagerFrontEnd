import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"
import UpdateSupplierService from "../../services/supplier/UpdateSupplierService"
import FindSupplierService from "../../services/supplier/FindSupplierService"

export default function UpdateSupplier() {
    const navigate = useNavigate()
    const [message, setMessage] = useState()
    const [showMessage, setShowMessage] = useState()
    const [supplier, setSupplier] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        const findSupplier = async () => {
            const res = await FindSupplierService(id)
            setSupplier(res.data)
            console.log(res)
        }
        findSupplier()
    }, [id])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-slate-200">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Editar Fornecedor</h1>
                            <p className="text-slate-600">Atualize as informações do fornecedor</p>
                        </div>
                    </div>
                </div>

                {showMessage && (
                    <div className="fixed top-4 right-4 z-50 animate-slide-in">
                        <div
                            className={`${message.includes("Sucesso") ? "bg-green-500" : "bg-red-500"} text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {message.includes("Sucesso") ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                )}
                            </svg>
                            <span className="font-medium">{message}</span>
                        </div>
                    </div>
                )}

                {supplier ? (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
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
                                telefone: Yup.string().matches(
                                    /^(\+55\s?)?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
                                    "Telefone inválido"
                                ),
                                email: Yup.string().email("Email inválido"),
                                cnpj: Yup.string().matches(
                                    /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                                    "CNPJ inválido, formato: 00.000.000/0000-00",
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
                                <Form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nome</label>
                                            <Field
                                                type="text"
                                                name="nome"
                                                placeholder="Digite o nome do fornecedor"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                            />
                                            <ErrorMessage name="nome" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                            <Field
                                                type="email"
                                                name="email"
                                                placeholder="email@exemplo.com"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                            />
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone</label>
                                            <Field
                                                type="text"
                                                name="telefone"
                                                placeholder="(00) 00000-0000"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                            />
                                            <ErrorMessage name="telefone" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">CNPJ</label>
                                            <Field
                                                type="text"
                                                name="cnpj"
                                                placeholder="00.000.000/0000-00"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                                            />
                                            <ErrorMessage name="cnpj" component="div" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-purple-500/30"
                                        >
                                            {isSubmitting ? "Atualizando..." : "Atualizar Fornecedor"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="px-8 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 rounded-lg transition-colors duration-200"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4 animate-pulse">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <p className="text-slate-600 text-lg">Carregando fornecedor...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
