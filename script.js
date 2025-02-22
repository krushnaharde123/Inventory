body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    margin: 0;
}

.header {
    background-color: #009999;
    color: #fff;
    padding: 10px;
    text-align: center;
}

.header nav a {
    margin: 0 15px;
    color: #fff;
    text-decoration: none;
}

.header nav a:hover {
    text-decoration: underline;
}

.sidebar {
    position: fixed;
    width: 200px;
    height: 100%;
    background-color: #333;
    padding-top: 20px;
}

.sidebar ul {
    list-style-type: none;
    padding: 0;
}

.sidebar ul li {
    padding: 8px;
    text-align: center;
}

.sidebar ul li a {
    color: #fff;
    text-decoration: none;
    display: block;
}

.sidebar ul li a:hover {
    background-color: #575757;
}

.content {
    margin-left: 220px;
    padding: 20px;
}

.container {
    width: 600px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
    position: relative;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    font-weight: bold;
}

.form-group input, .form-group select, .form-group button {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.form-group button {
    width: auto;
    background-color: #007BFF;
    color: #fff;
    border: none;
    cursor: pointer;
}

.form-group button:hover {
    background-color: #0056b3;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

table, th, td {
    border: 1px solid #ddd;
}

th, td {
    padding: 10px;
    text-align: left;
}

.action-buttons {
    margin-top: 20px;
    text-align: center;
}

.action-buttons button {
    margin-right: 10px;
    padding: 10px 15px;
    border-radius: 5px;
    border: none;
    color: #fff;
    font-size: 0.8em;
}

.action-buttons #generate-inventory-file {
    background-color: #28a745;
}

.action-buttons #generate-inventory-file:hover {
    background-color: #218838;
}

.action-buttons #preview-inventory-file {
    background-color: #17a2b8;
}

.action-buttons #preview-inventory-file:hover {
    background-color: #138496;
}

#files-table button {
    font-size: 0.8em;
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    color: #fff;
}

#files-table .download-file {
    background-color: #007BFF;
}

#files-table .delete-file {
    background-color: #DC3545;
}

.bold {
    font-weight: bold;
}
