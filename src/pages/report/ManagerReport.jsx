import { Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";
import ListAllItemService from "../../services/item/ListAllItensService";
import ItemHistoryService from "../../services/report/itemHistoryService";
import MonthlyReportService from "../../services/report/monthlyReportService";

export default function ManagerReport() {
    const [availableItems, setAvailableItems] = useState([]);
    const [itemHistory, setItemHistory] = useState([]);
    const [monthlyReport, setMonthlyReport] = useState([]);

    useEffect(() => {
        const findAllItems = async () => {
            try {
                const res = await ListAllItemService();
                setAvailableItems(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        findAllItems();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Gerenciar Relatórios</h1>

            <div className="space-y-12">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Histórico de Itens</h2>
                    <Formik
                        initialValues={{ itemId: "", inicio: "", fim: "" }}
                        onSubmit={async (values) => {
                            try {
                                if (!values.itemId || !values.inicio || !values.fim) {
                                    alert("Preencha todos os campos!");
                                    return;
                                }
                                const res = await ItemHistoryService(
                                    values.itemId,
                                    values.inicio,
                                    values.fim
                                );
                                setItemHistory(res.data);
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        <Form className="space-y-4 border p-4 rounded shadow-md">
                            <div>
                                <label className="block mb-1 font-medium">
                                    Selecione o item:
                                </label>
                                <Field
                                    as="select"
                                    name="itemId"
                                    className="border p-2 rounded w-full"
                                >
                                    <option value="">Selecione o item</option>
                                    {availableItems.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nome}
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 font-medium">Data de início:</label>
                                    <Field
                                        type="date"
                                        name="inicio"
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Data de fim:</label>
                                    <Field
                                        type="date"
                                        name="fim"
                                        className="border p-2 rounded w-full"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Gerar Histórico
                            </button>
                        </Form>
                    </Formik>

                    {itemHistory && itemHistory.length > 0 && (
                        <div className="mt-8 bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                Relatório de Histórico de Itens
                            </h3>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                                        <th className="border p-3 text-left">ID</th>
                                        <th className="border p-3 text-left">Data</th>
                                        <th className="border p-3 text-left">Tipo</th>
                                        <th className="border p-3 text-left">Quantidade</th>
                                        <th className="border p-3 text-left">Valor (R$)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemHistory.map((t, index) => (
                                        <tr
                                            key={t.id}
                                            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                } hover:bg-gray-100 transition`}
                                        >
                                            <td className="border p-3">{t.id}</td>
                                            <td className="border p-3">
                                                {new Date(t.data).toLocaleString("pt-BR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="border p-3 font-semibold">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-white ${t.tipoTransacao === "compra"
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                        }`}
                                                >
                                                    {t.tipoTransacao}
                                                </span>
                                            </td>
                                            <td className="border p-3">{t.quantidade}</td>
                                            <td className="border p-3">
                                                {t.valor.toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-6 border-t pt-4 flex justify-between text-gray-700 font-medium">
                                <p>
                                    Total de transações:{" "}
                                    <span className="font-bold">{itemHistory.length}</span>
                                </p>
                                <p>
                                    Valor total:{" "}
                                    <span className="font-bold text-blue-700">
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
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Relatório Mensal</h2>
                    <Formik
                        initialValues={{ mes: "", ano: "" }}
                        onSubmit={async (values) => {
                            try {
                                if (!values.mes || !values.ano) {
                                    alert("Preencha mês e ano!");
                                    return;
                                }
                                const res = await MonthlyReportService(values.mes, values.ano);
                                setMonthlyReport(res.data);
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        <Form className="space-y-4 border p-4 rounded shadow-md">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 font-medium">Mês:</label>
                                    <Field
                                        as="select"
                                        name="mes"
                                        className="border p-2 rounded w-full"
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
                                    <label className="block mb-1 font-medium">Ano:</label>
                                    <Field
                                        type="number"
                                        name="ano"
                                        className="border p-2 rounded w-full"
                                        placeholder="2025"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Gerar Relatório
                            </button>
                        </Form>
                    </Formik>

                    {monthlyReport && monthlyReport.length > 0 && (
                        <div className="mt-8 bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                Relatório Mensal
                            </h3>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                                        <th className="border p-3 text-left">ID</th>
                                        <th className="border p-3 text-left">Item</th>
                                        <th className="border p-3 text-left">Entradas</th>
                                        <th className="border p-3 text-left">Saídas</th>
                                        <th className="border p-3 text-left">Quantidade Atual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyReport.map((r, index) => (
                                        <tr
                                            key={r.itemId}
                                            className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                } hover:bg-gray-100 transition`}
                                        >
                                            <td className="border p-3">{r.itemId}</td>
                                            <td className="border p-3 font-semibold text-gray-800">
                                                {r.nomeItem}
                                            </td>
                                            <td className="border p-3 text-green-700 font-medium">
                                                +{r.totalEntradas}
                                            </td>
                                            <td className="border p-3 text-red-700 font-medium">
                                                -{r.totalSaidas}
                                            </td>
                                            <td className="border p-3 text-blue-700 font-semibold">
                                                {r.quantidadeAtual}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-6 border-t pt-4 text-gray-700 font-medium text-center">
                                <p>
                                    Total de Itens no Relatório:{" "}
                                    <span className="font-bold">{monthlyReport.length}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
