"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { downloadHistoryPdf } from "@/app/utils/downloadHistoryPdf";
import { exportHistoryExcel } from "@/app/utils/exportHistoryExcel";
import Loader from "@/components/ui/Loader";
import { useLanguage } from "@/app/context/LanguageContext";
import { getUsers } from "@/services/users";

import {
  getAdminUsers,
  getAdminHistory,
  deleteAdminHistory,
} from "@/services/admin";

export default function AdminHistoryPage() {
  const { dictionary } = useLanguage();

  const searchParams = useSearchParams();

  // =========================================================
  // URL TYPE
  // =========================================================
  const urlType = searchParams.get("type") || "all";

  // =========================================================
  // STATE
  // =========================================================
  const [history, setHistory] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");

  const [type, setType] = useState(urlType);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const selectedType = selectedItem?.type || type;

  // =========================================================
  // KEEP TYPE IN SYNC WITH URL
  // =========================================================
  useEffect(() => {
    setType(urlType);
    setPage(1);
  }, [urlType]);

  // =========================================================
  // LOAD USERS
  // =========================================================
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAdminUsers();

        setUsers(data || []);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    }

    loadUsers();
  }, []);

  // =========================================================
  // LOAD ADMIN HISTORY
  // =========================================================
  async function loadHistory() {
    try {
      setLoading(true);

      const data = await getAdminHistory({
        type: type === "all" ? undefined : type,
        userId: userId || undefined,
        search: search.trim() || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page,
        limit,
      });

      setHistory(data?.data || []);
      setTotal(data?.total || 0);
      setTotalPages(data?.totalPages || 0);
    } catch (error) {
      console.error("Failed to load admin history:", error);

      setHistory([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // LOAD WHEN FILTER / PAGE CHANGES
  // =========================================================
  useEffect(() => {
    loadHistory();
  }, [type, userId, fromDate, toDate, page]);

  // =========================================================
  // SEARCH BUTTON
  // =========================================================
  function handleSearch() {
    setPage(1);
    loadHistory();
  }

  // =========================================================
  // RESET FILTERS
  // =========================================================
  function handleReset() {
    setSearch("");
    setUserId("");
    setType("all");
    setFromDate("");
    setToDate("");
    setPage(1);
  }

  // =========================================================
  // DELETE HISTORY
  // =========================================================
  const handleDelete = async (item: any) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this history?",
    );

    if (!confirmed) return;

    try {
      await deleteAdminHistory(type, item._id);

      setShowModal(false);
      setSelectedItem(null);

      // Reload history
      loadHistory();
    } catch (error) {
      console.error("Failed to delete history:", error);

      alert("Failed to delete history.");
    }
  };

  // =========================================================
  // TYPE LABEL
  // =========================================================
  function getTypeLabel(itemType: string) {
    if (itemType === "checklist") return "Checklist";

    if (itemType === "appointment") return "Appointment";

    if (itemType === "expense") return "Daily Expense";

    return "History";
  }

  // =========================================================
  // TYPE STYLE
  // =========================================================
  function getTypeClass(itemType: string) {
    if (itemType === "checklist") {
      return "bg-blue-100 text-blue-700";
    }

    if (itemType === "appointment") {
      return "bg-emerald-100 text-emerald-700";
    }

    return "bg-orange-100 text-orange-700";
  }

  // =========================================================
  // GET DATE
  // =========================================================
  function getItemDate(item: any) {
    return item?.date || item?.createdAt || item?.checklistDate;
  }

  // =========================================================
  // GET CONTENT
  // =========================================================
  function getItemContent(item: any) {
    if (!item) return "";

    const content = item.content || item;

    if (item.type === "checklist") {
      return `${content.answers?.length || 0} checklist items`;
    }

    if (item.type === "appointment") {
      return content.appointment || "No appointment";
    }

    if (item.type === "expense") {
      return content.DailyExpanse || "No expense";
    }

    return "";
  }

  // =========================================================
  // GET FULL CONTENT FOR MODAL
  // =========================================================
  function getItemData(item: any) {
    return item?.content || item;
  }

  // =========================================================
  // CURRENT FILTERED LABEL
  // =========================================================
  const currentTypeLabel = useMemo(() => {
    if (type === "checklist") return "Checklist History";

    if (type === "appointment") return "Appointment History";

    if (type === "expense") return "Daily Expense History";

    return "All History";
  }, [type]);

  // =========================================================
  // PDF EXPORT
  // =========================================================
  const handleDownloadPdf = (item: any) => {
    let downloadType = type;

    if (type === "all") {
      if (item.answers) {
        downloadType = "checklist";
      } else if (item.appointment) {
        downloadType = "appointment";
      } else if (item.DailyExpanse) {
        downloadType = "expense";
      }
    }

    downloadHistoryPdf(item, downloadType);
  };
  // =========================================================
  // EXCEL EXPORT
  // =========================================================
  const handleExportExcel = (item: any) => {
    let exportType = type;

    if (type === "all") {
      if (item.answers) {
        exportType = "checklist";
      } else if (item.appointment) {
        exportType = "appointment";
      } else if (item.DailyExpanse) {
        exportType = "expense";
      }
    }

    exportHistoryExcel(item, exportType);
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading && history.length === 0) {
    return <Loader />;
  }

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-8">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            {currentTypeLabel}
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            View and manage all users&apos; checklist, appointment and daily
            expense history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-fit rounded-xl bg-[#ACC822]/10 px-4 py-2 text-sm font-semibold text-[#ACC822]">
            Total: {total}
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* SEARCH */}
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Search User
            </label>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search name or email..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#ACC822] focus:ring-4 focus:ring-[#ACC822]/10"
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              Type
            </label>

            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ACC822]"
            >
              <option value="all">All</option>

              <option value="checklist">Checklist</option>

              <option value="appointment">Appointment</option>

              <option value="expense">Daily Expense</option>
            </select>
          </div>

          {/* USER */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              User
            </label>

            <select
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ACC822]"
            >
              <option value="">All Users</option>

              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </div>

          {/* FROM DATE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ACC822]"
            />
          </div>

          {/* TO DATE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-600">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ACC822]"
            />
          </div>
        </div>

        {/* FILTER BUTTONS */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleSearch}
            className="rounded-xl bg-[#ACC822] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#96B51D]"
          >
            Search
          </button>

          <button
            onClick={handleReset}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="px-4 py-4 text-sm font-semibold text-slate-600">
                User
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-slate-600">
                Type
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-slate-600">
                Date
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-slate-600">
                Details
              </th>

              <th className="px-4 py-4 text-right text-sm font-semibold text-slate-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-sm text-slate-500"
                >
                  No history found.
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr
                  key={`${item.type}-${item._id}`}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  {/* USER */}
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-800">
                      {item.user?.name || "Unknown User"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {item.user?.email || "No email"}
                    </p>
                  </td>

                  {/* TYPE */}
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getTypeClass(
                        item.type,
                      )}`}
                    >
                      {getTypeLabel(item.type)}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {getItemDate(item)
                      ? new Date(getItemDate(item)).toLocaleDateString()
                      : "Unknown"}
                  </td>

                  {/* DETAILS */}
                  <td className="max-w-[350px] px-4 py-4">
                    <p className="line-clamp-2 text-sm text-slate-600">
                      {getItemContent(item)}
                    </p>
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowModal(true);
                      }}
                      className="rounded-xl bg-[#ACC822] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#96B51D]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row">
        <p className="text-sm text-slate-500">
          Showing {history.length} of {total} records
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="rounded-xl bg-[#ACC822] px-4 py-2 text-sm font-semibold text-white">
            {page} / {totalPages || 1}
          </span>

          <button
            disabled={totalPages === 0 || page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}
      {showModal && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 p-4 sm:p-6">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                  {selectedType === "checklist"
                    ? "Checklist Details"
                    : selectedType === "appointment"
                      ? "Appointment Details"
                      : "Daily Expense Details"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  User submission details
                </p>
              </div>

              {/* Actions */}
              <div className="ml-4 flex flex-wrap items-center justify-end gap-2">
                {/* PDF */}
                <button
                  onClick={() => downloadHistoryPdf(selectedItem, selectedType)}
                  className="rounded-xl border border-[#ACC822] px-3 py-2 text-sm font-semibold text-[#ACC822] transition hover:bg-[#ACC822] hover:text-white"
                >
                  📄 PDF
                </button>

                {/* Excel */}
                <button
                  onClick={() => exportHistoryExcel(selectedItem, selectedType)}
                  className="rounded-xl border border-green-600 px-3 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-600 hover:text-white"
                >
                  📊 Excel
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(selectedItem)}
                  className="rounded-xl border border-red-500 px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                >
                  🗑 Delete
                </button>

                {/* Close */}
                <button
                  onClick={() => setShowModal(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-slate-100"
                >
                  <span className="text-2xl text-slate-500">×</span>
                </button>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* USER INFORMATION */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">User</p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedItem.user?.name || "Unknown User"}
                  </p>

                  <p className="text-sm text-slate-500">
                    {selectedItem.user?.email || "No email"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Type</p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {getTypeLabel(selectedItem.type)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Date</p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {getItemDate(selectedItem)
                      ? new Date(getItemDate(selectedItem)).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>

              {/* =================================================
                  CHECKLIST
              ================================================= */}
              {selectedItem.type === "checklist" && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-slate-800">
                    Checklist Items
                  </h3>

                  <div className="space-y-3">
                    {getItemData(selectedItem).answers?.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                        No checklist items found.
                      </p>
                    ) : (
                      getItemData(selectedItem).answers?.map(
                        (answer: any, index: number) => (
                          <div
                            key={index}
                            className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-[#ACC822]/40 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <p className="break-words font-medium text-slate-800">
                              {answer.question}
                            </p>

                            <span
                              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                                answer.answer === "Yes"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {answer.answer}
                            </span>
                          </div>
                        ),
                      )
                    )}
                  </div>
                </div>
              )}

              {/* =================================================
                  APPOINTMENT
              ================================================= */}
              {selectedItem.type === "appointment" && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-slate-800">
                    Appointment
                  </h3>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {getItemData(selectedItem).appointment ||
                        "No appointment details available."}
                    </p>
                  </div>
                </div>
              )}

              {/* =================================================
                  EXPENSE
              ================================================= */}
              {selectedItem.type === "expense" && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-slate-800">
                    Daily Expense
                  </h3>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {getItemData(selectedItem).DailyExpanse ||
                        "No expense details available."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
