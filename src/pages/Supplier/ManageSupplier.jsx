import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ListAllSupplierService from "../../services/supplier/ListAllSupplierService"
import DeleteSupplierService from "../../services/supplier/DeleteSupplierService"

export default function ManagerSupplier() {
  const [listSupplier, setlistSupplier] = useState()
  const navigate = useNavigate()
  const [message, setMessage] = useState()
  const [showMessage, setShowMessage] = useState()

  useEffect(() => {
    async function searchSupplier() {
      try {
        const suppliers = await ListAllSupplierService()
        setlistSupplier(suppliers.data)
        console.log(suppliers)
      } catch (error) {
        console.log(error)
      }
    }
    searchSupplier()
  }, [])

  function handleUpdateSupplier(idFornecedor) {
    navigate(`/update/supplier/${idFornecedor}`)
  }

  function handleCreateSupplier() {
    navigate(`/create/supplier`)
  }

  async function handleDeleteSupplier(idFornecedor) {
    try {
      await DeleteSupplierService(idFornecedor)
      setShowMessage(true)
      setMessage("Fornecedor deletado com sucesso!")
      setTimeout(() => {
        setShowMessage(false)
      }, 2000)
    } catch (error) {
      setShowMessage(true)
      setMessage("Não foi possivel deletar esse fornecedor!")
      setTimeout(() => {
        setShowMessage(false)
      }, 2000)
      console.error("Erro ao deletar o fornecedor: ", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">Gerenciar Fornecedores</h1>
              <p className="text-slate-600">Controle seus parceiros e fornecedores</p>
            </div>
            <button
              onClick={handleCreateSupplier}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 font-semibold shadow-lg shadow-purple-500/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar Fornecedor
            </button>
          </div>
        </div>
      </header>


      {showMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`${message.includes("sucesso") ? "bg-green-500" : "bg-red-500"} text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {message.includes("sucesso") ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {listSupplier && listSupplier.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listSupplier.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300"
              >

                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4">{supplier.nome}</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <svg
                      className="w-5 h-5 text-slate-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-slate-700">{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <svg
                      className="w-5 h-5 text-slate-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-slate-700">{supplier.telefone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <svg
                      className="w-5 h-5 text-slate-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-slate-700 font-mono">{supplier.cnpj}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => handleUpdateSupplier(supplier.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum fornecedor cadastrado</h3>
            <p className="text-slate-600 mb-6">Comece adicionando seu primeiro fornecedor</p>
            <button
              onClick={handleCreateSupplier}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar Primeiro Fornecedor
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
