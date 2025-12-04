import { Formik, Form, Field } from "formik"
import { useEffect, useState } from "react"
import ListAllItemService from "../../services/item/ListAllItensService"
import ItemHistoryService from "../../services/report/itemHistoryService"
import MonthlyReportService from "../../services/report/monthlyReportService"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function ManagerReport() {
  const [availableItems, setAvailableItems] = useState([])
  const [itemHistory, setItemHistory] = useState([])
  const [monthlyReport, setMonthlyReport] = useState([])

  useEffect(() => {
    const findAllItems = async () => {
      try {
        const res = await ListAllItemService()
        setAvailableItems(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    findAllItems()
  }, [])

  const generateItemHistoryPDF = () => {
    if (itemHistory.length === 0) {
      alert("Não há dados para gerar PDF");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Histórico de Itens", 14, 20);

    const columns = ["ID", "Data", "Tipo", "Quantidade", "Valor"];
    const rows = itemHistory.map((t) => [
      t.id,
      new Date(t.data).toLocaleString("pt-BR"),
      t.tipoTransacao,
      t.quantidade,
      t.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [100, 100, 100] },
    });

    const totalCompras = itemHistory
      .filter((t) => t.tipoTransacao === "compra")
      .reduce((acc, t) => acc + t.valor, 0);

    const totalVendas = itemHistory
      .filter((t) => t.tipoTransacao === "venda")
      .reduce((acc, t) => acc + t.valor, 0);

    const totalTransacoes = itemHistory.reduce((acc, t) => acc + t.valor, 0);

    let finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`Total de Compras: ${itemHistory.filter(t => t.tipoTransacao === "compra").length}`, 14, finalY);
    doc.text(`Valor total: ${totalCompras.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`, 80, finalY);

    finalY += 7;
    doc.text(`Total de Vendas: ${itemHistory.filter(t => t.tipoTransacao === "venda").length}`, 14, finalY);
    doc.text(`Valor total: ${totalVendas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`, 80, finalY);

    finalY += 7;
    doc.text(`Total de Transações: ${itemHistory.length}`, 14, finalY);
    doc.text(`Valor total: ${totalTransacoes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`, 80, finalY);

    doc.save("historico_itens.pdf");
  };

  const generateMonthlyReportPDF = () => {
    if (monthlyReport.length === 0) {
      alert("Não há dados para gerar PDF");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório Mensal de Itens", 14, 20);

    const columns = ["ID", "Item", "Entradas", "Saídas", "Qtd. Atual"];
    const rows = monthlyReport.map((r) => [
      r.itemId,
      r.nomeItem,
      r.totalEntradas,
      r.totalSaidas,
      r.quantidadeAtual,
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [100, 100, 100] },
    });

    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total de Itens no Relatório: ${monthlyReport.length}`, 14, finalY);

    doc.save("relatorio_mensal.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Gerenciar Relatórios</h1>
              <p className="text-slate-200 mt-1">Visualize históricos e relatórios mensais</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-12">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-600 to-slate-500 px-6 py-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-white">Histórico de Itens</h2>
              </div>
            </div>

            <div className="p-6">
              <Formik
                initialValues={{ itemId: "", inicio: "", fim: "" }}
                onSubmit={async (values) => {
                  try {
                    if (!values.itemId || !values.inicio || !values.fim) {
                      alert("Preencha todos os campos!")
                      return
                    }
                    const res = await ItemHistoryService(values.itemId, values.inicio, values.fim)
                    setItemHistory(res.data)
                  } catch (error) {
                    console.log(error)
                  }
                }}
              >
                <Form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione o item</label>
                    <Field
                      as="select"
                      name="itemId"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">Selecione o item</option>
                      {availableItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nome}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data de início</label>
                      <Field
                        type="date"
                        name="inicio"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Data de fim</label>
                      <Field
                        type="date"
                        name="fim"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-slate-600 to-slate-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-slate-700 hover:to-slate-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Gerar Histórico
                  </button>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={generateItemHistoryPDF}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Exportar Histórico PDF
                    </button>
                  </div>
                </Form>
              </Formik>

              {itemHistory && itemHistory.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Relatório de Histórico de Itens
                  </h3>

                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Data
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Quantidade
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Valor
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {itemHistory.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">#{t.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {new Date(t.data).toLocaleString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${t.tipoTransacao === "compra"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                                  }`}
                              >
                                {t.tipoTransacao}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {t.quantidade}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {t.valor.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>


                        <div className="flex flex-row">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            <p className="text-gray-700 font-medium">
                              Total de Compras:{" "}
                              <span className="font-bold text-slate-700">
                                {itemHistory.filter(t => t.tipoTransacao === "compra").length}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 ml-176">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-gray-700 font-medium">
                              Valor total:{" "}
                              <span className="font-bold text-slate-700">
                                {itemHistory
                                  .filter(t => t.tipoTransacao === "compra")
                                  .reduce((acc, t) => acc + t.valor, 0)
                                  .toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                              </span>
                            </p>
                          </div>
                        </div>



                        <div className="flex flex-row">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            <p className="text-gray-700 font-medium">
                              Total de Vendas:{" "}
                              <span className="font-bold text-slate-700">
                                {itemHistory.filter(t => t.tipoTransacao === "venda").length}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-180">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-gray-700 font-medium">
                              Valor total:{" "}
                              <span className="font-bold text-slate-700">
                                {itemHistory
                                  .filter(t => t.tipoTransacao === "venda")
                                  .reduce((acc, t) => acc + t.valor, 0)
                                  .toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                              </span>
                            </p>
                          </div>
                        </div>



                        <div className="flex flex-row">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            <p className="text-gray-700 font-medium">
                              Total de Transações: <span className="font-bold text-slate-700">{itemHistory.length}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 ml-172">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-gray-700 font-medium">
                              Valor total:{" "}
                              <span className="font-bold text-slate-700">
                                {itemHistory
                                  .reduce((acc, t) => acc + t.valor, 0)
                                  .toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                              </span>
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-600 to-gray-500 px-6 py-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-white">Relatório Mensal</h2>
              </div>
            </div>

            <div className="p-6">
              <Formik
                initialValues={{ mes: "", ano: "" }}
                onSubmit={async (values) => {
                  try {
                    if (!values.mes || !values.ano) {
                      alert("Preencha mês e ano!")
                      return
                    }
                    const res = await MonthlyReportService(values.mes, values.ano)
                    setMonthlyReport(res.data)
                  } catch (error) {
                    console.log(error)
                  }
                }}
              >
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mês</label>
                      <Field
                        as="select"
                        name="mes"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 bg-white"
                      >
                        <option value="">Selecione</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {String(i + 1).padStart(2, "0")}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ano</label>
                      <Field
                        type="number"
                        name="ano"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                        placeholder="2025"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-700 hover:to-gray-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Gerar Relatório
                  </button>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={generateMonthlyReportPDF}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
                    >
                      Exportar Relatório Mensal PDF
                    </button>
                  </div>
                </Form>
              </Formik>

              {monthlyReport && monthlyReport.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Relatório Mensal
                  </h3>

                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Entradas
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Saídas
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Qtd. Atual
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {monthlyReport.map((r) => (
                          <tr key={r.itemId} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              #{r.itemId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {r.nomeItem}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                +{r.totalEntradas}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                                -{r.totalSaidas}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                {r.quantidadeAtual}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      <p className="text-gray-700 font-medium">
                        Total de Itens no Relatório:{" "}
                        <span className="font-bold text-gray-700">{monthlyReport.length}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
