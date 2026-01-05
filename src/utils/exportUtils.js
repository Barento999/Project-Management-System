// Export utilities for reports

// Export to CSV
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  let csv = headers.join(",") + "\n";

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // Handle nested objects
      if (typeof value === "object" && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      // Escape commas and quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csv += values.join(",") + "\n";
  });

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to Excel (using CSV format with .xls extension)
export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Get headers
  const headers = Object.keys(data[0]);

  // Create table HTML
  let html = "<table><thead><tr>";
  headers.forEach((header) => {
    html += `<th>${header}</th>`;
  });
  html += "</tr></thead><tbody>";

  data.forEach((row) => {
    html += "<tr>";
    headers.forEach((header) => {
      const value = row[header];
      if (typeof value === "object" && value !== null) {
        html += `<td>${JSON.stringify(value)}</td>`;
      } else {
        html += `<td>${value || ""}</td>`;
      }
    });
    html += "</tr>";
  });
  html += "</tbody></table>";

  // Create blob and download
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xls`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to PDF (using print functionality)
export const exportToPDF = (elementId, filename) => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert("Content not found");
    return;
  }

  // Create a new window for printing
  const printWindow = window.open("", "", "height=600,width=800");

  printWindow.document.write("<html><head><title>" + filename + "</title>");
  printWindow.document.write("<style>");
  printWindow.document.write(`
    body { font-family: Arial, sans-serif; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4F46E5; color: white; }
    tr:nth-child(even) { background-color: #f2f2f2; }
    h1, h2, h3 { color: #333; }
    .stat-card { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
    @media print {
      button { display: none; }
    }
  `);
  printWindow.document.write("</style></head><body>");
  printWindow.document.write(element.innerHTML);
  printWindow.document.write("</body></html>");

  printWindow.document.close();
  printWindow.focus();

  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

// Format data for export
export const formatDataForExport = (data, type) => {
  switch (type) {
    case "projects":
      return data.map((item) => ({
        Name: item.name,
        Description: item.description || "",
        Status: item.status,
        Team: item.team?.name || "",
        Owner: item.owner?.name || "",
        Members: item.members?.length || 0,
        "Created At": new Date(item.createdAt).toLocaleDateString(),
        "Updated At": new Date(item.updatedAt).toLocaleDateString(),
      }));

    case "tasks":
      return data.map((item) => ({
        Title: item.title,
        Description: item.description || "",
        Status: item.status,
        Priority: item.priority || "",
        Project: item.project?.name || "",
        "Assigned To": item.assignedTo?.name || "Unassigned",
        "Created By": item.createdBy?.name || "",
        "Due Date": item.dueDate
          ? new Date(item.dueDate).toLocaleDateString()
          : "",
        "Created At": new Date(item.createdAt).toLocaleDateString(),
      }));

    case "teams":
      return data.map((item) => ({
        Name: item.name,
        Description: item.description || "",
        Owner: item.owner?.name || "",
        Members: item.members?.length || 0,
        Projects: item.projects?.length || 0,
        "Created At": new Date(item.createdAt).toLocaleDateString(),
      }));

    case "timeTracking":
      return data.map((item) => ({
        Task: item.task?.title || "",
        Project: item.project?.name || "",
        User: item.user?.name || "",
        "Start Time": new Date(item.startTime).toLocaleString(),
        "End Time": item.endTime
          ? new Date(item.endTime).toLocaleString()
          : "Running",
        "Duration (hours)": item.duration
          ? (item.duration / 3600).toFixed(2)
          : "0",
        Description: item.description || "",
      }));

    default:
      return data;
  }
};
