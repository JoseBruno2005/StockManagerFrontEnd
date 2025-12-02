import { Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ListAllSupplierService from "../../services/supplier/ListAllSupplierService"
import CreateItemService from "../../services/Item/CreateItemService"

export default function CreateItem() {
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [availableSuppliers, setAvailableSuppliers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const findAllSupplier = async () => {
      try {
        const res = await ListAllSupplierService()
        console.log(res.data)
        setAvailableSuppliers(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    findAllSupplier()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-slate-200">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Criar Item</h1>
              <p className="text-slate-600">Adicione um novo produto ao estoque</p>
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

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <Formik
            initialValues={{ nome: "", factory: "", preco: 0, foto: "", fornecedorId: "" }}
            onSubmit={async (values) => {
              try {
                setErrorMessage("")
                setSuccessMessage("")
                await CreateItemService(values)
                setSuccessMessage("Item cadastrado com sucesso!")
                setTimeout(() => {
                  setSuccessMessage("")
                  return navigate("/manager/item")
                }, 2000)
              } catch (error) {
                setErrorMessage(error.message)
              }
            }}
          >
            {(formik) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nome do Produto</label>
                    <Field
                      type="text"
                      name="nome"
                      placeholder="Digite o nome do produto"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Categoria</label>
                    <Field
                      as="select"
                      name="factory"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="alimento">Alimento</option>
                      <option value="bebida">Bebida</option>
                      <option value="eletronico">Eletrônico</option>
                    </Field>
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
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Fornecedor</label>
                  <Field
                    as="select"
                    name="fornecedorId"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="">Selecione um fornecedor</option>
                    {availableSuppliers &&
                      availableSuppliers.map((fornecedor) => (
                        <option value={fornecedor.id} key={fornecedor.id}>
                          {fornecedor.nome}
                        </option>
                      ))}
                  </Field>
                </div>

                <div>
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
                            formik.setFieldValue("foto", reader.result)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {formik.values.foto && (
                    <div className="mt-4">
                      <img
                        src={formik.values.foto || "/placeholder.svg"}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-slate-200"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-500/30"
                  >
                    Criar Item
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
      </div>
    </div>
  )
}
