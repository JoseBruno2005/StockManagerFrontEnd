import { Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ListAllItemService from "../../services/item/ListAllItensService"
import CreateTransactionService from "../../services/transaction/CreateTransactionService"

export default function CreateTransaction() {
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [availableItems, setAvailableItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const findAllSupplier = async () => {
      try {
        const res = await ListAllItemService()
        console.log(res.data)
        setAvailableItems(res.data)
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
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Criar Transação</h1>
              <p className="text-slate-600">Registre entradas e saídas de produtos</p>
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
            initialValues={{ quantidade: 0, tipoTransacao: "", data: "", itemId: "" }}
            onSubmit={async (values) => {
              try {
                setErrorMessage("")
                setSuccessMessage("")
                await CreateTransactionService(values)
                setSuccessMessage("Transação cadastrada com sucesso!")
                setTimeout(() => {
                  setSuccessMessage("")
                  return navigate("/home")
                }, 2000)
              } catch (error) {
                setErrorMessage(error.message)
              }
            }}
          >
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Transação</label>
                  <Field
                    as="select"
                    name="tipoTransacao"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="compra">Compra (Entrada)</option>
                    <option value="venda">Venda (Saída)</option>
                  </Field>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Data e Hora</label>
                  <Field
                    type="datetime-local"
                    name="data"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Item</label>
                  <Field
                    as="select"
                    name="itemId"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="">Selecione o item</option>
                    {availableItems &&
                      availableItems.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.nome}
                        </option>
                      ))}
                  </Field>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Quantidade</label>
                  <Field
                    type="number"
                    name="quantidade"
                    min="1"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-green-500/30"
                >
                  Salvar Transação
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
          </Formik>
        </div>
      </div>
    </div>
  )
}
