document.addEventListener('DOMContentLoaded', function() {
    function updateTime() {
        const now = new Date();
        const utcString = now.toISOString().replace('T', ' ').substr(0, 19);
        const timeElement = document.getElementById('current-time');
        if (timeElement) timeElement.textContent = `UTC: ${utcString}`;
    }

    function getCurrentUser() {
        return 'krushnaharde123';
    }

    function setCurrentUser() {
        const userLoginSpan = document.getElementById('user-login');
        if (userLoginSpan) {
            userLoginSpan.textContent = `User: ${getCurrentUser()}`;
        }
    }

    updateTime();
    setCurrentUser();
    setInterval(updateTime, 1000);

    let masterData = [];
    const cartonMasterFileInput = document.getElementById('carton-master-file');
    const materialDescriptionInput = document.getElementById('material-description');
    const materialNumberInput = document.getElementById('material-number');
    const previewButton = document.getElementById('preview-carton-file');
    const masterUploadError = document.getElementById('master-upload-error');

    if (!previewButton) {
        console.error("Preview Carton File button not found. Ensure it exists in the HTML.");
        return;
    }

    if (cartonMasterFileInput) {
        cartonMasterFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const validFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
                if (!validFileTypes.includes(file.type)) {
                    masterUploadError.textContent = 'Invalid file type. Please upload an Excel file (.xls or .xlsx).';
                    masterUploadError.style.color = 'red';
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];
                        masterData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        populateMaterialList(masterData);
                        masterUploadError.textContent = '';
                    } catch (error) {
                        masterUploadError.textContent = 'Error reading the file. Please try again.';
                        masterUploadError.style.color = 'red';
                    }
                };
                reader.readAsArrayBuffer(file);
            }
        });
    }

    function populateMaterialList(data) {
        const materialList = document.getElementById('material-list');
        if (!materialList) return;
        materialList.innerHTML = '';
        data.slice(1).forEach(item => {
            if (item[0]) {
                const option = document.createElement('option');
                option.value = item[0];
                materialList.appendChild(option);
            }
        });
    }

    if (materialDescriptionInput) {
        materialDescriptionInput.addEventListener('input', (event) => {
            const description = event.target.value;
            const material = masterData.find(item => item[0] === description);
            materialNumberInput.value = material ? material[1] : '';
        });
    }

    previewButton.addEventListener('click', function() {
        if (masterData.length === 0) {
            masterUploadError.textContent = 'No data available. Please upload a master file first.';
            masterUploadError.style.color = 'red';
            return;
        }
        console.table(masterData);
    });
});
