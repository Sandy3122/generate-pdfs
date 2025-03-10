// Function to format date and time
function formatDateTime(dateTime) {
  const date = new Date(dateTime._seconds * 1000);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return formattedDate + " " + formattedTime;
}

// Function to display employee data and documents
function formatKey(key) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camel case
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
}

// Function to capitalize each word in a string
function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function displayEmployeeData(employees) {
  $("#userDataContainer").empty();

  employees.forEach(function (employee, index) {
    // Create a new container for each employee
    var userContainer = $("<div class='container mt-3'></div>");

    // Append employee details to the container
    var userDetailsTable = $("<table class='table table-striped'></table>");
    var userDetailsHtml =
      "<thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>";
    for (const [key, value] of Object.entries(employee)) {
      if (
        key !== "kycDocumentUrl" &&
        key !== "resumeUrl" &&
        key !== "photoUrl" &&
        key !== "pin" &&
        key !== "routeAccess"
      ) {
        let displayKey = formatKey(key); // Format the key
        if (
          key === "joiningDate" ||
          key === "timestamp" ||
          key === "accountCreatedDateTime"
        ) {
          userDetailsHtml +=
            "<tr><td>" +
            displayKey +
            "</td><td>" +
            formatDateTime(value) +
            "</td></tr>";
        } else {
          userDetailsHtml +=
            "<tr><td>" + displayKey + "</td><td>" + capitalizeWords(value) + "</td></tr>";
        }
      } else if (key === "routeAccess") {
        userDetailsHtml +=
          "<tr><td>" + formatKey(key) + "</td><td>" + JSON.stringify(value) + "</td></tr>";
      }
    }
    userDetailsHtml += "</tbody>";
    userDetailsTable.append(userDetailsHtml);

    // Append file boxes with previews
    var fileBoxes = $(
      "<div class='row m-2 pb-5 d-flex justify-content-around'></div>"
    );
    var fileBoxHtml =
      "<div class='col-4' style='width: 150px;'><div class='file-box' style='width: 150px; height: 150px'><h5>KYC Document</h5><a href='" +
      employee.kycDocumentUrl +
      "' target='_blank'><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png' class='file-preview' style='width: 100%; height: 100%;' alt='KYC Document'></a></div></div>";
    fileBoxHtml +=
      "<div class='col-4' style='width: 150px;'><div class='file-box' style='width: 150px; height: 150px'><h5>Profile Photo</h5><a href='" +
      employee.photoUrl +
      "' target='_blank'><img src='" +
      employee.photoUrl +
      "' class='file-preview' style='width: 100%; height: 100%;' alt='Profile Photo'></a></div></div>";
    fileBoxHtml +=
      "<div class='col-4' style='width: 150px;'><div class='file-box' style='width: 150px; height: 150px'><h5>Resume</h5><a href='" +
      employee.resumeUrl +
      "' target='_blank'><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png' class='file-preview' style='width: 100%; height: 100%;' alt='Resume'></a></div></div>";
    fileBoxes.append(fileBoxHtml);

    // Append details and files to the user container
    userContainer.append(
      "<h2 class='text-center'>Employee " + (index + 1) + "</h2>"
    );
    userContainer.append(userDetailsTable);
    userContainer.append(fileBoxes);

    // Append the user container to the main container
    $("#userDataContainer").append(userContainer);
  });
}




// Function to search employees
function searchEmployees() {
  const searchTerm = document.getElementById("searchInput").value.trim();

  if (!searchTerm) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter a search term.",
    });
    return;
  }

  // Handle error like login router
  fetch(`/api/employee-search?query=${searchTerm}`)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Unauthorized: Token not provided.");
        }
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.message) {
        Swal.fire({
          icon: "info",
          title: "No Matching Employees Found",
          text: data.message,
        });
      } else {
        displayEmployeeData(data);
      }
    })
    .catch((error) => {
      if (error.message === "Network response was not ok") {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "There was a problem with the network. Please try again later.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Unauthorized Access",
          text: error.message,
        });
      }
    });
}
