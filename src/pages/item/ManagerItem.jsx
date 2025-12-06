import { useEffect, useState } from "react"
import ListAllItemService from "../../services/item/ListAllItensService"
import { useNavigate } from "react-router-dom"
import DeleteItemService from "../../services/item/DeleteItemService"

export default function ManagerItem() {
  const [listItens, setListItens] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const findAllItens = async () => {
      try {
        const res = await ListAllItemService()
        console.log(res.data)
        setListItens(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    findAllItens()
  }, [])

  const handleDeleteItem = async (itemId) => {
    try {
      await DeleteItemService(itemId)
      setListItens((prevList) => prevList.filter((item) => item.id !== itemId))
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateItem = (itemId) => {
    navigate(`/update/item/${itemId}`)
  }

  const handleCreateItem = () => {
    navigate("/create/item")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">Gerenciar Itens</h1>
              <p className="text-slate-600">Controle completo do seu estoque</p>
            </div>
            <button
              onClick={handleCreateItem}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-semibold shadow-lg shadow-blue-500/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar Item
            </button>
          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {listItens && listItens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listItens.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >

                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img src={item.foto || "/placeholder.svg"} alt={item.nome} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {item.categoria}
                    </span>
                  </div>
                </div>


                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{item.nome}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Preço:</span>
                      <span className="text-lg font-bold text-green-600">
                        R$ {Number.parseFloat(item.preco).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Quantidade:</span>
                      <span
                        className={`text-lg font-bold ${item.quantidade > 10 ? "text-green-600" : "text-orange-600"}`}
                      >
                        {item.quantidade} un.
                      </span>
                    </div>
                  </div>


                  <div className="flex gap-2 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleUpdateItem(item.id)}
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
                      onClick={() => handleDeleteItem(item.id)}
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhum item encontrado</h3>
            <p className="text-slate-600 mb-6">Comece adicionando seu primeiro item ao estoque</p>
            <button
              onClick={handleCreateItem}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar Primeiro Item
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
