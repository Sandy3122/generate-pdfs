// Define updateStatus function
function updateStatus(employeeId, status) {
    fetch(`/api/employee-status/${employeeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      return response.json();
    })
    .then(data => {
      // Reload employee data after status update
      fetchEmployees();
      console.log('Status updated successfully:', data);

      // Update the status in the table cell
      const statusCell = document.querySelector(`#status-${employeeId}`);
      statusCell.textContent = status;
      statusCell.className = status === 'active' ? 'status-active' : 'status-inactive';
    })
    .catch(error => console.error('Error updating status:', error));
  }

  // Define fetchEmployees function
  function fetchEmployees() {
    const employeeTableBody = document.getElementById('employeeTableBody');
    fetch('/api/getall-employees')
      .then(response => response.json())
      .then(data => {
        // Clear existing table rows
        employeeTableBody.innerHTML = '';

        // Iterate over employee data and populate table
        data.forEach(employee => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${employee.data.employeeId}</td>
            <td>${employee.data.employeeDOB}</td>
            <td>${employee.data.firstName}</td>
            <td>${employee.data.lastName}</td>
            <td>${employee.data.employeePhoneNumber}</td>
            <td>${employee.data.maritalStatus}</td>
            <td>${employee.data.role}</td>
            <td>${employee.data.designation}</td>
            <td id="status-${employee.data.employeeId}" class="${employee.data.accountStatus === 'active' ? 'status-active' : 'status-inactive'}">${employee.data.accountStatus}</td>
            <td>
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="statusDropdown-${employee.data.employeeId}" data-bs-toggle="dropdown" aria-expanded="false">
                  Update Status
                </button>
                <ul class="dropdown-menu" aria-labelledby="statusDropdown-${employee.data.employeeId}">
                  <li><a class="dropdown-item" href="#" onclick="updateStatus('${employee.data.employeeId}', 'active')">Active</a></li>
                  <li><a class="dropdown-item" href="#" onclick="updateStatus('${employee.data.employeeId}', 'inactive')">Inactive</a></li>

                </ul>
              </div>
            </td>
          `;
          employeeTableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Error fetching employees:', error));
  }

  // Initial fetch of employee data
  fetchEmployees();