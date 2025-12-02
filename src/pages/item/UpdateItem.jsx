import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import FindItemService from "../../services/item/FindItemService"
import { Field, Form, Formik } from "formik"
import UpdateItemService from "../../services/item/UpdateItemService"

export default function UpdateItem() {
    const { id } = useParams()
    const [item, setItem] = useState()
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const findItem = async () => {
            const res = await FindItemService(id)
            console.log(res.data)
            setItem(res.data)
        }
        findItem()
    }, [id])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-slate-200">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
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
                            <h1 className="text-3xl font-bold text-slate-800">Atualizar Item</h1>
                            <p className="text-slate-600">Edite as informações do produto</p>
                        </div>
                    </div>
                </div>

                {successMessage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4 border-2 border-green-500">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-green-800 mb-2">Sucesso!</h3>
                            <p className="text-green-700 text-lg">{successMessage}</p>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <svg
                                className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="text-sm font-semibold text-red-800">Erro!</h3>
                                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {item ? (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                        <Formik
                            enableReinitialize
                            initialValues={{
                                nome: item.nome,
                                preco: item.preco,
                                foto: item.foto,
                            }}
                            onSubmit={async (values) => {
                                try {
                                    setErrorMessage("")
                                    setSuccessMessage("")

                                    await UpdateItemService(values, id)
                                    setSuccessMessage("Item atualizado com sucesso!")

                                    window.location.reload()
                                } catch (error) {
                                    setErrorMessage(error.message)
                                }
                            }}
                        >
                            {({ dirty, values, setFieldValue }) => (

                                <Form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do Produto</label>
                                            <Field
                                                type="text"
                                                name="nome"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Preço (R$)</label>
                                            <Field
                                                type="number"
                                                name="preco"
                                                step="0.01"
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Foto do Produto</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(event) => {
                                                        const file = event.currentTarget.files[0]
                                                        if (file) {
                                                            const reader = new FileReader()
                                                            reader.onloadend = () => {
                                                                setFieldValue("foto", reader.result) 
                                                            }
                                                            reader.readAsDataURL(file)
                                                        }
                                                    }}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            </div>

                                            {values.foto && ( 
                                                <div className="mt-4">
                                                    <img
                                                        src={values.foto || "/placeholder.svg"}
                                                        alt={values.nome}
                                                        className="w-32 h-32 object-cover rounded-lg border-2 border-slate-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={!dirty}
                                            className={`flex-1 font-semibold py-3 rounded-lg transition-all duration-200 ${dirty
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                }`}
                                        >
                                            Salvar Alterações
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
                        <p className="text-slate-600 text-lg">Carregando item...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
