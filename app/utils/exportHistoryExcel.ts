import * as XLSX from "xlsx";

export function exportHistoryExcel(item: any, type: string) {
  let data: any[] = [];

  const userName = item.user?.name || "Unknown User";
  const email = item.user?.email || "No email";

  const date = new Date(item.date).toLocaleDateString();

  // ==========================================
  // CHECKLIST
  // ==========================================
  if (type === "checklist") {
    data =
      item.content?.answers?.map((answer: any, index: number) => ({
        User: userName,
        Email: email,
        Date: date,
        "Item No": index + 1,
        Question: answer.question,
        Answer: answer.answer,
      })) || [];
  }

  // ==========================================
  // APPOINTMENT
  // ==========================================
  if (type === "appointment") {
    data = [
      {
        User: userName,
        Email: email,
        Date: date,
        Appointment: item.content?.appointment || "-",
      },
    ];
  }

  // ==========================================
  // EXPENSE
  // ==========================================
  if (type === "expense") {
    data = [
      {
        User: userName,
        Email: email,
        Date: date,
        "Daily Expense": item.content?.DailyExpanse || "-",
      },
    ];
  }

  // ==========================================
  // CREATE EXCEL
  // ==========================================
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "History");

  // ==========================================
  // FILE NAME
  // ==========================================
  const fileName =
    type === "checklist"
      ? `${userName}-checklist-history.xlsx`
      : type === "appointment"
        ? `${userName}-appointment-history.xlsx`
        : `${userName}-daily-expense-history.xlsx`;

  XLSX.writeFile(workbook, fileName);
}
