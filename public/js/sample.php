<?php
require('../connection_page.php');
session_start();

try {
    // Check if the user is not logged in, redirect to login page
    if (!isset($_SESSION['alias']) || !isset($_SESSION['approved_role'])) {
        header('Location: ../login_page.php');
        exit(); // Ensure that no further code is executed after the redirect
    }

    $req_status_open = "open";
    $req_status_on_hold = "on hold";
    $req_status_on_blank = '';
    $request_id = '';
    $req_status = '';
    $alias = $_SESSION['alias'];
    $approved_role = $_SESSION['approved_role'];
    $role_status = "Active";
    $role_right = "update_demand_details_page.php";

    // Check user access rights
    $query = "SELECT * FROM t_access_rights WHERE role='$approved_role' and status='$role_status' and rights='$role_right'";
    $data = mysqli_query($conn, $query);
    $count = mysqli_num_rows($data);

    if ($count > 0) {
        // Fetch demand data
        $query = "SELECT * FROM t_demand WHERE req_status='$req_status_open' || req_status='$req_status_on_hold' || req_status='$req_status_on_blank' ORDER BY manager_name ASC, sourcer_name ASC";
        $data = mysqli_query($conn, $query);

        if (isset($_POST['updated_demand_detail'])) {
            //$request_id = $_POST['selected_request_id'];
            $request_id = isset($_POST['selected_request_id']) ? $_POST['selected_request_id'] : null;
            function validate_form($request_id)
            {
                $errors = []; // Initialize an array to store errors
                //$revised_demand = $POST['revised_demand' . $request_id];
                $revised_demand_key = 'revised_demand_' . $request_id;
                $revised_demand = isset($_POST[$revised_demand_key]) ? $_POST[$revised_demand_key] : null;
                if (!preg_match('/^\d+$/', $revised_demand)) {
                    $errors['revised_demand_' . $request_id] = "Demand should contain only Numbers";
                }
                $inclines_key = 'inclines_' . $request_id;
                $inclines = isset($_POST[$inclines_key]) ? $_POST[$inclines_key] : null;
                if (!preg_match('/^\d+$/', $inclines)) {
                    $errors['inclines_' . $request_id] = "Incline should contain only Numbers";
                }

                return $errors;
            }

            $formErrors = validate_form($request_id); // Call the validate function

            if (empty($formErrors)) {
                $revised_demand = $POST['revised_demand' . $request_id];
                $req_status = $POST['req_status'.$request_id];
                $last_modified_by = $alias;
                $last_modified_date = date_default_timezone_set('Asia/Kolkata') ? date('Y/m/d H:i:s') : '';
                $comments=$POST['comments'.$request_id];
                $inclines = $POST['inclines' . $request_id];
                $sourcer_name=$POST['sourcer_name'.$request_id];
                $sourcer_alias = trim(htmlspecialchars(mysqli_fetch_assoc(mysqli_query($conn, "SELECT alias FROM t_sourcer_list WHERE sourcer_name='$sourcer_name'"))['alias']));
                $manager_name=$POST['manager_name'.$request_id];
                $manager_alias = trim(htmlspecialchars(mysqli_fetch_assoc(mysqli_query($conn, "SELECT alias FROM t_manager_list WHERE manager_name='$manager_name'"))['alias']));

                // Perform the necessary database update or insert operation
                $query = "UPDATE t_demand SET req_status='$req_status',revised_demand='$revised_demand',last_modified_by='$last_modified_by',last_modified_date='$last_modified_date',inclines='$inclines',comments='$comments',sourcer_name='$sourcer_name',sourcer_alias='$sourcer_alias',manager_name='$manager_name',manager_alias='$manager_alias' WHERE request_id = '$request_id'";
                $data = mysqli_query($conn, $query);

                // Redirect back to the demand page
                header('Location:update_demand_details_page.php?success=1');
                die();
            } else {
               $failed= "Failed To Update"; // Display an error message if the data insertion failed

            }
        }
    } else {
        header('Location: access_restricted_page.php');
    }

    $conn->close();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?> 