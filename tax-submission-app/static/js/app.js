// API Configuration
const API_BASE_URL = 'https://application-18.29mcwwdwrirt.us-south.codeengine.appdomain.cloud';

// Income Types Mapping (Thai)
const INCOME_TYPES = {
    1: 'เงินเดือนหรือเงินได้ตามสัญญาจ้างแรงงาน (มาตรา 40(1))',
    2: 'เงินได้ที่นายจ้างจ่ายให้ครั้งเดียวเพราะเหตุออกจากงาน (กรณีไม่นำไปรวมคำนวณภาษี) (มาตรา 40(1))',
    3: 'เงินได้จากการรับจ้าง ฟรีแลนซ์ ค่าตำแหน่ง เบี้ยประชุม หรือค่านายหน้า (มาตรา 40(2))',
    4: 'ค่าลิขสิทธิ์ ค่าสิทธิ์ในทรัพย์สินทางปัญญา (Royalty) และค่ากู๊ดวิลล์ (Goodwill) หรือเงินได้รายปีที่ได้มาจากนิติกรรม และคำพิพากษาของศาล (มาตรา 40(3))',
    5: 'ค่าเช่า ค่าผิดสัญญาเช่าซื้อหรือซื้อขายเงินผ่อน (มาตรา 40(5))',
    6: 'ค่าตอบแทนจากการประกอบวิชาชีพอิสระ วิชากฎหมาย การประกอบโรคศิลปะ วิศวกรรม สถาปัตยกรรม การบัญชี ประณีตศิลปกรรม (มาตรา 40(6))',
    7: 'เงินได้จากการรับเหมาที่ผู้รับเหมาทั้งค่าแรงและค่าของ ที่ต้องลงทุนด้วยการจัดหาสัมภาระ ในส่วนสำคัญ นอกจากเครื่องมือ (มาตรา 40(7))',
    8: 'เงินได้จากธุรกิจ การพาณิชย์ การเกษตร การอุตสาหกรรม การขนส่ง และเงินได้อื่นๆ (มาตรา 40(8))',
    9: 'เงินได้จากการขายอสังหาริมทรัพย์ฯ (มาตรา 40(8))',
    10: 'ดอกเบี้ย เงินเทียบเท่าเงินปันผล เงินปันผลจากบริษัทต่างประเทศ ประโยชน์ใดๆ จากคริปโทเคอร์เรนซีหรือโทเคนดิจิทัล เงินเพิ่มทุน เงินลดทุน (มาตรา 40(4))',
    11: 'เงินปันผล ส่วนแบ่งกำไรจากหุ้น/กองทุน (มาตรา 40(4)(ข))',
    12: 'กำไรจากการขายกองทุนรวมเพื่อการเลี้ยงชีพ (RMF)',
    13: 'กำไรจากการขายกองทุนรวมหุ้นระยะยาว (LTF)',
    14: 'กำไรจากการขายกองทุนเพื่อการออม (SSF)',
    15: 'กำไรจากการขายหน่วยลงทุนในกองทุนรวมไทยเพื่อความยั่งยืน (Thai ESG)/แบบพิเศษ (Thai ESGX)',
    16: 'เงินได้พึงประเมินที่ได้ใช้สิทธิเลือกเสียภาษีโดยไม่ต้องนำมารวมคำนวณภาษีกับเงินได้อื่น',
    17: 'เงินได้จากการให้หรือการรับ (มาตรา 40(8))'
};

// Store income data temporarily
let incomeData = {};

// Utility Functions
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'block';
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function formatNumber(num) {
    return new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// API Functions
async function fetchHistory() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/api/history`);
        
        if (!response.ok) {
            throw new Error('ไม่สามารถดึงข้อมูลประวัติได้');
        }
        
        const data = await response.json();
        hideLoading();
        return data.submissions || [];
    } catch (error) {
        hideLoading();
        showAlert('เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ: ' + error.message);
        return [];
    }
}

async function submitTaxForm(formData) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/api/submit-tax`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        hideLoading();
        
        if (!response.ok) {
            throw new Error(data.message || 'ไม่สามารถส่งแบบฟอร์มได้');
        }
        
        return data;
    } catch (error) {
        hideLoading();
        showAlert('เกิดข้อผิดพลาดในการส่งแบบฟอร์ม: ' + error.message);
        throw error;
    }
}

// Page: History
function displayHistory(submissions) {
    const tbody = document.getElementById('historyTableBody');
    
    if (!submissions || submissions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <div class="empty-state">
                        <div class="empty-state-icon">📋</div>
                        <p>ยังไม่มีประวัติการยื่นแบบฟอร์มภาษี</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = submissions.map((submission, index) => {
        const totalIncome = submission.income_data.reduce((sum, item) => sum + (item.amount || 0), 0);
        const incomeTypes = submission.income_data.length;
        
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${submission.name || '-'}</td>
                <td>${submission.national_id || '-'}</td>
                <td>${incomeTypes} ประเภท</td>
                <td>${formatNumber(totalIncome)} บาท</td>
                <td>${formatDateTime(submission.submission_date)}</td>
            </tr>
        `;
    }).join('');
}

async function loadHistory() {
    const submissions = await fetchHistory();
    displayHistory(submissions);
}

// Page: Submit Form
function initializeSubmitForm() {
    const tbody = document.getElementById('incomeTableBody');
    
    tbody.innerHTML = Object.entries(INCOME_TYPES).map(([typeId, typeName]) => `
        <tr>
            <td>${typeName}</td>
            <td>
                <input 
                    type="number" 
                    id="income-${typeId}" 
                    min="0" 
                    step="0.01" 
                    placeholder="0.00"
                    data-type="${typeId}"
                >
            </td>
        </tr>
    `).join('');
}

function collectIncomeData() {
    incomeData = {};
    let hasData = false;
    
    Object.keys(INCOME_TYPES).forEach(typeId => {
        const input = document.getElementById(`income-${typeId}`);
        const amount = parseFloat(input.value) || 0;
        
        if (amount > 0) {
            incomeData[typeId] = amount;
            hasData = true;
        }
    });
    
    if (!hasData) {
        showAlert('กรุณากรอกจำนวนเงินอย่างน้อย 1 ประเภท');
        return false;
    }
    
    return true;
}

function goToConfirmation() {
    if (collectIncomeData()) {
        window.location.href = 'confirmation.html';
    }
}

// Page: Confirmation
function displayConfirmation() {
    const storedData = localStorage.getItem('incomeData');
    
    if (!storedData) {
        showAlert('ไม่พบข้อมูล กรุณากรอกแบบฟอร์มใหม่');
        setTimeout(() => {
            window.location.href = 'submit.html';
        }, 2000);
        return;
    }
    
    incomeData = JSON.parse(storedData);
    const tbody = document.getElementById('confirmationTableBody');
    let totalAmount = 0;
    
    const rows = Object.entries(incomeData).map(([typeId, amount]) => {
        totalAmount += amount;
        return `
            <tr>
                <td>${INCOME_TYPES[typeId]}</td>
                <td>${formatNumber(amount)} บาท</td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = rows + `
        <tr class="total-row">
            <td><strong>รวมทั้งหมด</strong></td>
            <td><strong>${formatNumber(totalAmount)} บาท</strong></td>
        </tr>
    `;
}

async function confirmSubmit() {
    const storedData = localStorage.getItem('incomeData');
    
    if (!storedData) {
        showAlert('ไม่พบข้อมูล กรุณากรอกแบบฟอร์มใหม่');
        return;
    }
    
    incomeData = JSON.parse(storedData);
    
    // Prepare submission data
    const income_data = Object.entries(incomeData).map(([typeId, amount]) => ({
        type: parseInt(typeId),
        amount: amount
    }));
    
    const formData = {
        name: 'John Doe',
        national_id: '1234567890123',
        income_data: income_data
    };
    
    try {
        const result = await submitTaxForm(formData);
        
        if (result.success) {
            // Clear stored data
            localStorage.removeItem('incomeData');
            
            showAlert('ส่งแบบฟอร์มภาษีสำเร็จ!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    } catch (error) {
        // Error already handled in submitTaxForm
    }
}

// Navigation Functions
function goToHistory() {
    window.location.href = 'history.html';
}

function goToSubmit() {
    window.location.href = 'submit.html';
}

function goToHome() {
    window.location.href = 'index.html';
}

function goBack() {
    window.history.back();
}

// Store income data before navigation
function storeAndNavigate() {
    if (collectIncomeData()) {
        localStorage.setItem('incomeData', JSON.stringify(incomeData));
        window.location.href = 'confirmation.html';
    }
}

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('history.html')) {
        loadHistory();
    } else if (path.includes('submit.html')) {
        initializeSubmitForm();
    } else if (path.includes('confirmation.html')) {
        displayConfirmation();
    }
});

// Made with Bob
