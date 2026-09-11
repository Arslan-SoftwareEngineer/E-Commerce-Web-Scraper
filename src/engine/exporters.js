/**
 * Exporter utilities for CSV and JSON datasets.
 */

export function exportToCSV(products, filename = "omniscrpe_results.csv") {
  if (!products || products.length === 0) return;

  const headers = [
    "id",
    "source",
    "title",
    "price",
    "price_str",
    "rating",
    "reviews_count",
    "quantity",
    "shipping",
    "badge",
    "colors",
    "product_url",
    "image_url",
    "description",
  ];

  const csvRows = [];
  csvRows.push(headers.join(","));

  products.forEach((p) => {
    const values = headers.map((header) => {
      let val = p[header];
      if (val === undefined || val === null) {
        val = "";
      } else if (Array.isArray(val)) {
        val = val.join("; ");
      } else {
        val = String(val);
      }
      // Escape quotes and wrap in quotes
      val = val.replace(/"/g, '""');
      return `"${val}"`;
    });
    csvRows.push(values.join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
}

export function exportToJSON(products, filename = "omniscrpe_results.json") {
  if (!products || products.length === 0) return;

  const jsonString = JSON.stringify(products, null, 2);
  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
  downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
