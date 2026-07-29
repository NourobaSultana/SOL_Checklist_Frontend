import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function downloadChecklistPdf(checklist: any) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("Checklist Report", 14, 20);

  // Information
  doc.setFontSize(12);

  doc.text(`Title: ${checklist.title}`, 14, 35);
  doc.text(
    `Date: ${new Date(checklist.createdAt).toLocaleDateString()}`,
    14,
    43
  );
  doc.text(
    `Appointment: ${checklist.appointment || "-"}`,
    14,
    51
  );
  doc.text(
    `Daily Expense: ${checklist.dailyExpense}`,
    14,
    59
  );

  // Checklist Table
  autoTable(doc, {
    startY: 70,
    head: [["Question", "Answer"]],
    body: checklist.answers.map((answer: any) => [
      answer.question,
      answer.answer,
    ]),
  });

  doc.save(
    `${checklist.title}-${new Date(
      checklist.createdAt
    ).toLocaleDateString()}.pdf`
  );
}