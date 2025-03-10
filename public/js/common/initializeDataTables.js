// Data Table Code
async function initializeDataTable(userRole, buttonOptions) {
    const dataTableOptions = {
      paging: true,
      responsive: true,
      searching: true,
      ordering: true,
      order: [[0, "asc"]],
      lengthMenu: [[15, 10, 20, 30, 50, -1], [15, 10, 20, 30, 50, "All"]],
      dom: 'Blrftip',
      // dom: '1Bfrtip',
      buttons: []
    };

    if (userRole === 'admin') {
        // Add buttons based on provided buttonOptions
        buttonOptions.forEach(btn => {
          dataTableOptions.buttons.push({
            extend: btn.type,
            text: btn.text,
            className: btn.className,
            exportOptions: btn.exportOptions
          });
        });
    
        // Always add default buttons 'excel' and 'print'
        dataTableOptions.buttons.push('excel', 'print', 'pdf');
    }

    if (userRole !== 'admin') {
        dataTableOptions.dom = 'lfrtip';
        }


    // Initialize DataTable with options
    $('#userDataTable').DataTable(dataTableOptions);
  }