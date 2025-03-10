// getAllEmployees.js
// document.write('<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"><\/script>');

// Define updateStatus function
function updateStatus(employeeId, status) {
    fetch(`/api/employee-status/${employeeId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to update status");
        }
        return response.json();
    })
    .then((data) => {
        // Reload employee data after status update
        fetchEmployees();
        console.log("Status updated successfully:", data);
        // Update the status in the table cell
        const statusCell = document.querySelector(`#status-${employeeId}`);
        statusCell.textContent = status;
        statusCell.className = status === "active" ? "status-active" : "status-inactive";
    })
    .catch((error) => console.error("Error updating status:", error));
}

// Define updateRole function
function updateRole(employeeId, role) {
    fetch(`/api/updateRole/${employeeId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to update role");
        }
        return response.json();
    })
    .then((data) => {
        // Reload employee data after role update
        fetchEmployees();
        console.log("Role updated successfully:", data);
    })
    .catch((error) => console.error("Error updating role:", error));
}

// Define fetchEmployees function
function fetchEmployees() {
    const employeeTableBody = document.getElementById("employeeTableBody");
    fetch("/api/getall-employees")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to fetch employees");
        }
        return response.json();
    })
    .then((data) => {
        // Clear existing table rows
        employeeTableBody.innerHTML = "";
        // Iterate over employee data and populate table
        data.forEach((employee) => {
            const row = document.createElement("tr");
            row.classList.add("text-center");
            row.innerHTML = `
                <td>${employee.data.employeeId}</td>
                <td class="textCapitalize">${employee.data.firstName} ${employee.data.lastName}</td>
                <td>${employee.data.phoneNumber}</td>
                <td id="role-${employee.data.employeeId}" class="role-${employee.data.role.toLowerCase()} textCapitalize">${employee.data.role}</td>
                <td id="status-${employee.data.employeeId}" class="${employee.data.accountStatus === "active" ? "status-active" : "status-inactive"} textCapitalize">${employee.data.accountStatus}</td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="actionsDropdown-${employee.data.employeeId}" data-bs-toggle="dropdown" aria-expanded="false">
                            Actions
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="actionsDropdown-${employee.data.employeeId}">
                            <li><a class="dropdown-item" href="#" onclick="updateStatus('${employee.data.employeeId}', 'active')">Active</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateStatus('${employee.data.employeeId}', 'inactive')">Inactive</a></li>
                        </ul>
                    </div>
                </td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="roleDropdown-${employee.data.employeeId}" data-bs-toggle="dropdown" aria-expanded="false">
                            Assign Role
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="roleDropdown-${employee.data.employeeId}">
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.data.employeeId}', 'user')">User</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.data.employeeId}', 'employee')">Employee</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.data.employeeId}', 'manager')">Manager</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.data.employeeId}', 'admin')">Admin</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.data.employeeId}', 'superAdmin')">Super Admin</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.data.employeeId}', 'thirdPartyAgent')">Third Party Agent</a></li>
                        </ul>
                    </div>
                </td>`;
            employeeTableBody.appendChild(row);
        });
    })
    .catch((error) => {
        console.error("Error fetching employees:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error fetching user data. Please try again later.',
        });
    });
}

// Initial fetch of employee data
fetchEmployees();
