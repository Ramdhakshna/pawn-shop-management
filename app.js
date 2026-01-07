// Data Storage Keys
const STORAGE_KEYS = {
    CUSTOMERS: 'pawnshop_customers',
    LOANS: 'pawnshop_loans',
    PAYMENTS: 'pawnshop_payments',
    INTEREST_HISTORY: 'pawnshop_interest_history'
};

// Interest Rates
const INTEREST_RATES = {
    gold: 0.02,  // 2% per month
    silver: 0.03 // 3% per month
};

// Initialize Data
function initData() {
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOANS)) {
        localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INTEREST_HISTORY)) {
        localStorage.setItem(STORAGE_KEYS.INTEREST_HISTORY, JSON.stringify([]));
    }
}

// Get Data from Storage
function getCustomers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || '[]');
}

function getLoans() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOANS) || '[]');
}

function getPayments() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
}

function getInterestHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.INTEREST_HISTORY) || '[]');
}

// Save Data to Storage
function saveCustomers(customers) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
}

function saveLoans(loans) {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
}

function savePayments(payments) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
}

function saveInterestHistory(history) {
    localStorage.setItem(STORAGE_KEYS.INTEREST_HISTORY, JSON.stringify(history));
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.getAttribute('data-section');
        switchSection(section);
    });
});

function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    if (sectionId === 'customers') {
        loadCustomers();
    } else if (sectionId === 'loans') {
        loadLoans();
    } else if (sectionId === 'payments') {
        loadPayments();
    } else if (sectionId === 'reports') {
        loadReportLoans();
    }
}

// Interest Calculation Logic
function calculateOutstandingBalance(loan, asOfDate = new Date()) {
    const startDate = new Date(loan.startDate);
    const endDate = new Date(asOfDate);
    
    // Get all payments for this loan
    const payments = getPayments().filter(p => p.loanId === loan.id);
    
    // Calculate months since loan start
    const monthsDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));
    const effectiveMonths = Math.max(0, monthsDiff);
    
    let principal = loan.principalAmount;
    let totalInterest = 0;
    let currentYear = 0;
    let monthsInCurrentYear = 0;
    let capitalizedInterest = 0;
    
    // Interest history for this loan
    const history = getInterestHistory().filter(h => h.loanId === loan.id);
    
    for (let month = 1; month <= effectiveMonths; month++) {
        const monthlyInterest = principal * INTEREST_RATES[loan.loanType];
        totalInterest += monthlyInterest;
        monthsInCurrentYear++;
        
        // Add to interest history
        const interestDate = new Date(startDate);
        interestDate.setMonth(interestDate.getMonth() + month - 1);
        
        // Check if this month already has history
        const existingHistory = history.find(h => {
            const hDate = new Date(h.date);
            return hDate.getMonth() === interestDate.getMonth() && 
                   hDate.getFullYear() === interestDate.getFullYear();
        });
        
        if (!existingHistory) {
            history.push({
                id: Date.now() + month,
                loanId: loan.id,
                date: interestDate.toISOString(),
                month: month,
                principal: principal,
                monthlyInterest: monthlyInterest,
                accumulatedInterest: totalInterest,
                capitalized: false
            });
        }
        
        // Capitalize interest at end of every 12 months
        if (monthsInCurrentYear === 12) {
            principal += totalInterest;
            capitalizedInterest += totalInterest;
            currentYear++;
            monthsInCurrentYear = 0;
            
            // Update history for capitalization
            history.forEach(h => {
                if (h.month === month && !h.capitalized) {
                    h.capitalized = true;
                    h.newPrincipal = principal;
                }
            });
            
            totalInterest = 0;
        }
    }
    
    // Save updated history
    const allHistory = getInterestHistory();
    const otherHistory = allHistory.filter(h => h.loanId !== loan.id);
    otherHistory.push(...history);
    saveInterestHistory(otherHistory);
    
    // Calculate outstanding = principal + remaining interest
    let outstanding = principal + totalInterest;
    
    // Subtract payments
    payments.forEach(payment => {
        outstanding -= payment.amount;
    });
    
    return Math.max(0, outstanding);
}

// Customer Management
function loadCustomers() {
    const customers = getCustomers();
    const tbody = document.getElementById('customersTableBody');
    
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No customers found. Click "Add Customer" to create one.</td></tr>';
        return;
    }
    
    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.mobile}</td>
            <td>${customer.address}</td>
            <td>${customer.aadhar}</td>
            <td>
                <button class="btn btn-info" onclick="editCustomer('${customer.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteCustomer('${customer.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openCustomerModal(customerId = null) {
    const modal = document.getElementById('customerModal');
    const form = document.getElementById('customerForm');
    const title = document.getElementById('customerModalTitle');
    
    form.reset();
    document.getElementById('customerId').value = '';
    
    if (customerId) {
        const customer = getCustomers().find(c => c.id === customerId);
        if (customer) {
            title.textContent = 'Edit Customer';
            document.getElementById('customerId').value = customer.id;
            document.getElementById('customerName').value = customer.name;
            document.getElementById('customerMobile').value = customer.mobile;
            document.getElementById('customerAddress').value = customer.address;
            document.getElementById('customerAadhar').value = customer.aadhar;
        }
    } else {
        title.textContent = 'Add Customer';
    }
    
    modal.style.display = 'block';
}

function closeCustomerModal() {
    document.getElementById('customerModal').style.display = 'none';
}

function saveCustomer(event) {
    event.preventDefault();
    
    const id = document.getElementById('customerId').value;
    const name = document.getElementById('customerName').value;
    const mobile = document.getElementById('customerMobile').value;
    const address = document.getElementById('customerAddress').value;
    const aadhar = document.getElementById('customerAadhar').value;
    
    let customers = getCustomers();
    
    if (id) {
        // Update existing
        customers = customers.map(c => 
            c.id === id ? { id, name, mobile, address, aadhar } : c
        );
    } else {
        // Add new
        customers.push({
            id: Date.now().toString(),
            name,
            mobile,
            address,
            aadhar
        });
    }
    
    saveCustomers(customers);
    loadCustomers();
    closeCustomerModal();
}

function editCustomer(id) {
    openCustomerModal(id);
}

function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer? This will also delete all associated loans.')) {
        let customers = getCustomers();
        customers = customers.filter(c => c.id !== id);
        saveCustomers(customers);
        
        // Delete associated loans
        let loans = getLoans();
        loans = loans.filter(l => l.customerId !== id);
        saveLoans(loans);
        
        loadCustomers();
        if (document.getElementById('loans').classList.contains('active')) {
            loadLoans();
        }
    }
}

// Loan Management
function loadLoans() {
    const loans = getLoans();
    const customers = getCustomers();
    const tbody = document.getElementById('loansTableBody');
    
    if (loans.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No loans found. Click "Add Loan" to create one.</td></tr>';
        return;
    }
    
    tbody.innerHTML = loans.map(loan => {
        const customer = customers.find(c => c.id === loan.customerId);
        const outstanding = calculateOutstandingBalance(loan);
        const badgeClass = loan.loanType === 'gold' ? 'badge-gold' : 'badge-silver';
        
        return `
            <tr>
                <td>${loan.billNo}</td>
                <td>${customer ? customer.name : 'Unknown'}</td>
                <td><span class="badge ${badgeClass}">${loan.loanType.toUpperCase()}</span></td>
                <td>${loan.ornamentGrams} g</td>
                <td>₹${loan.principalAmount.toLocaleString('en-IN')}</td>
                <td>${new Date(loan.startDate).toLocaleDateString('en-IN')}</td>
                <td>₹${outstanding.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>
                    <button class="btn btn-info" onclick="viewLoanReport('${loan.id}')">View Report</button>
                    <button class="btn btn-danger" onclick="deleteLoan('${loan.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function openLoanModal(loanId = null) {
    const modal = document.getElementById('loanModal');
    const form = document.getElementById('loanForm');
    const title = document.getElementById('loanModalTitle');
    const customerSelect = document.getElementById('loanCustomer');
    
    form.reset();
    document.getElementById('loanId').value = '';
    
    // Populate customers
    const customers = getCustomers();
    customerSelect.innerHTML = '<option value="">Select Customer</option>' +
        customers.map(c => `<option value="${c.id}">${c.name} - ${c.mobile}</option>`).join('');
    
    // Set today's date as default
    document.getElementById('loanStartDate').value = new Date().toISOString().split('T')[0];
    
    if (loanId) {
        const loan = getLoans().find(l => l.id === loanId);
        if (loan) {
            title.textContent = 'Edit Loan';
            document.getElementById('loanId').value = loan.id;
            document.getElementById('loanCustomer').value = loan.customerId;
            document.getElementById('loanBillNo').value = loan.billNo;
            document.getElementById('loanType').value = loan.loanType;
            document.getElementById('loanOrnament').value = loan.ornamentGrams;
            document.getElementById('loanPrincipal').value = loan.principalAmount;
            document.getElementById('loanStartDate').value = loan.startDate.split('T')[0];
        }
    } else {
        title.textContent = 'Add Loan';
    }
    
    modal.style.display = 'block';
}

function closeLoanModal() {
    document.getElementById('loanModal').style.display = 'none';
}

function saveLoan(event) {
    event.preventDefault();
    
    const id = document.getElementById('loanId').value;
    const customerId = document.getElementById('loanCustomer').value;
    const billNo = document.getElementById('loanBillNo').value;
    const loanType = document.getElementById('loanType').value;
    const ornamentGrams = parseFloat(document.getElementById('loanOrnament').value);
    const principalAmount = parseFloat(document.getElementById('loanPrincipal').value);
    const startDate = document.getElementById('loanStartDate').value;
    
    // Check if bill number already exists
    let loans = getLoans();
    const existingLoan = loans.find(l => l.billNo === billNo && l.id !== id);
    if (existingLoan) {
        alert('Bill number already exists!');
        return;
    }
    
    if (id) {
        // Update existing
        loans = loans.map(l => 
            l.id === id ? {
                id,
                customerId,
                billNo,
                loanType,
                ornamentGrams,
                principalAmount,
                startDate
            } : l
        );
    } else {
        // Add new
        loans.push({
            id: Date.now().toString(),
            customerId,
            billNo,
            loanType,
            ornamentGrams,
            principalAmount,
            startDate
        });
    }
    
    saveLoans(loans);
    loadLoans();
    closeLoanModal();
}

function deleteLoan(id) {
    if (confirm('Are you sure you want to delete this loan? This will also delete all associated payments.')) {
        let loans = getLoans();
        loans = loans.filter(l => l.id !== id);
        saveLoans(loans);
        
        // Delete associated payments
        let payments = getPayments();
        payments = payments.filter(p => p.loanId !== id);
        savePayments(payments);
        
        // Delete associated interest history
        let history = getInterestHistory();
        history = history.filter(h => h.loanId !== id);
        saveInterestHistory(history);
        
        loadLoans();
        if (document.getElementById('payments').classList.contains('active')) {
            loadPayments();
        }
    }
}

// Payment Management
function loadPayments() {
    const payments = getPayments();
    const loans = getLoans();
    const customers = getCustomers();
    const tbody = document.getElementById('paymentsTableBody');
    
    if (payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No payments found. Click "Add Payment" to create one.</td></tr>';
        return;
    }
    
    // Sort payments by date (newest first)
    payments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tbody.innerHTML = payments.map(payment => {
        const loan = loans.find(l => l.id === payment.loanId);
        const customer = loan ? customers.find(c => c.id === loan.customerId) : null;
        
        return `
            <tr>
                <td>${new Date(payment.date).toLocaleDateString('en-IN')}</td>
                <td>${loan ? loan.billNo : 'Unknown'}</td>
                <td>${customer ? customer.name : 'Unknown'}</td>
                <td>₹${payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td><span class="badge">${payment.type}</span></td>
                <td>
                    <button class="btn btn-danger" onclick="deletePayment('${payment.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function openPaymentModal(paymentId = null) {
    const modal = document.getElementById('paymentModal');
    const form = document.getElementById('paymentForm');
    const title = document.getElementById('paymentModalTitle');
    const loanSelect = document.getElementById('paymentLoan');
    
    form.reset();
    document.getElementById('paymentId').value = '';
    
    // Populate loans
    const loans = getLoans();
    loanSelect.innerHTML = '<option value="">Select Loan</option>' +
        loans.map(l => {
            const outstanding = calculateOutstandingBalance(l);
            return `<option value="${l.id}" data-bill="${l.billNo}">${l.billNo} (Outstanding: ₹${outstanding.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</option>`;
        }).join('');
    
    // Set today's date as default
    document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
    
    document.getElementById('loanInfo').innerHTML = '';
    
    if (paymentId) {
        const payment = getPayments().find(p => p.id === paymentId);
        if (payment) {
            title.textContent = 'Edit Payment';
            document.getElementById('paymentId').value = payment.id;
            document.getElementById('paymentLoan').value = payment.loanId;
            document.getElementById('paymentDate').value = payment.date.split('T')[0];
            document.getElementById('paymentType').value = payment.type;
            document.getElementById('paymentAmount').value = payment.amount;
            updateLoanDetails();
        }
    } else {
        title.textContent = 'Add Payment';
    }
    
    modal.style.display = 'block';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function updateLoanDetails() {
    const loanId = document.getElementById('paymentLoan').value;
    const loanInfo = document.getElementById('loanInfo');
    
    if (!loanId) {
        loanInfo.innerHTML = '';
        return;
    }
    
    const loan = getLoans().find(l => l.id === loanId);
    if (loan) {
        const outstanding = calculateOutstandingBalance(loan);
        const customer = getCustomers().find(c => c.id === loan.customerId);
        
        loanInfo.innerHTML = `
            <p><strong>Customer:</strong> ${customer ? customer.name : 'Unknown'}</p>
            <p><strong>Loan Type:</strong> ${loan.loanType.toUpperCase()}</p>
            <p><strong>Principal:</strong> ₹${loan.principalAmount.toLocaleString('en-IN')}</p>
            <p><strong>Outstanding Balance:</strong> ₹${outstanding.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        `;
    }
}

function savePayment(event) {
    event.preventDefault();
    
    const id = document.getElementById('paymentId').value;
    const loanId = document.getElementById('paymentLoan').value;
    const date = document.getElementById('paymentDate').value;
    const type = document.getElementById('paymentType').value;
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    
    let payments = getPayments();
    
    if (id) {
        // Update existing
        payments = payments.map(p => 
            p.id === id ? { id, loanId, date, type, amount } : p
        );
    } else {
        // Add new
        payments.push({
            id: Date.now().toString(),
            loanId,
            date,
            type,
            amount
        });
    }
    
    savePayments(payments);
    loadPayments();
    closePaymentModal();
    
    // Reload loans to update outstanding amounts
    if (document.getElementById('loans').classList.contains('active')) {
        loadLoans();
    }
}

function deletePayment(id) {
    if (confirm('Are you sure you want to delete this payment?')) {
        let payments = getPayments();
        payments = payments.filter(p => p.id !== id);
        savePayments(payments);
        loadPayments();
        
        // Reload loans to update outstanding amounts
        if (document.getElementById('loans').classList.contains('active')) {
            loadLoans();
        }
    }
}

// Reports
function loadReportLoans() {
    const loans = getLoans();
    const customers = getCustomers();
    const select = document.getElementById('reportLoanSelect');
    
    select.innerHTML = '<option value="">Select a Loan</option>' +
        loans.map(l => {
            const customer = customers.find(c => c.id === l.customerId);
            return `<option value="${l.id}">${l.billNo} - ${customer ? customer.name : 'Unknown'}</option>`;
        }).join('');
}

function loadLoanReport() {
    const loanId = document.getElementById('reportLoanSelect').value;
    const reportDiv = document.getElementById('loanReport');
    
    if (!loanId) {
        reportDiv.innerHTML = '';
        return;
    }
    
    const loan = getLoans().find(l => l.id === loanId);
    if (!loan) return;
    
    const customer = getCustomers().find(c => c.id === loan.customerId);
    const payments = getPayments().filter(p => p.loanId === loanId);
    const history = getInterestHistory().filter(h => h.loanId === loanId);
    
    const outstanding = calculateOutstandingBalance(loan);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    
    // Calculate stats
    const monthsSinceStart = Math.floor((new Date() - new Date(loan.startDate)) / (1000 * 60 * 60 * 24 * 30.44));
    const totalInterestAccrued = outstanding + totalPaid - loan.principalAmount;
    
    let html = `
        <div class="stats-grid">
            <div class="stat-card">
                <h4>Principal Amount</h4>
                <div class="value">₹${loan.principalAmount.toLocaleString('en-IN')}</div>
            </div>
            <div class="stat-card">
                <h4>Outstanding Balance</h4>
                <div class="value">₹${outstanding.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="stat-card">
                <h4>Total Paid</h4>
                <div class="value">₹${totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="stat-card">
                <h4>Months Active</h4>
                <div class="value">${monthsSinceStart}</div>
            </div>
        </div>
        
        <div class="report-section">
            <h3>Loan Details</h3>
            <p><strong>Bill Number:</strong> ${loan.billNo}</p>
            <p><strong>Customer:</strong> ${customer ? customer.name : 'Unknown'}</p>
            <p><strong>Loan Type:</strong> ${loan.loanType.toUpperCase()} (${INTEREST_RATES[loan.loanType] * 100}% per month)</p>
            <p><strong>Ornament Weight:</strong> ${loan.ornamentGrams} grams</p>
            <p><strong>Start Date:</strong> ${new Date(loan.startDate).toLocaleDateString('en-IN')}</p>
            <p><strong>Interest Accrued:</strong> ₹${totalInterestAccrued.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
    `;
    
    if (history.length > 0) {
        html += `
            <div class="report-section interest-history">
                <h3>Interest History</h3>
        `;
        
        // Group history by capitalization events
        let currentYear = 0;
        history.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        history.forEach(item => {
            const itemDate = new Date(item.date);
            const year = Math.floor(item.month / 12);
            
            if (year !== currentYear) {
                if (currentYear > 0) {
                    html += `</div>`; // Close previous year
                }
                html += `<h4>Year ${year + 1} (Month ${year * 12 + 1} - ${(year + 1) * 12})</h4><div>`;
                currentYear = year;
            }
            
            const capitalizedClass = item.capitalized ? 'capitalization' : '';
            html += `
                <div class="interest-history-item ${capitalizedClass}">
                    <strong>Month ${item.month}</strong> (${itemDate.toLocaleDateString('en-IN')})
                    <p>Principal: ₹${item.principal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p>Monthly Interest: ₹${item.monthlyInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p>Accumulated Interest: ₹${item.accumulatedInterest.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    ${item.capitalized ? `<p><strong>✨ Capitalized! New Principal: ₹${item.newPrincipal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>` : ''}
                </div>
            `;
        });
        
        html += `</div></div>`; // Close last year and section
    }
    
    if (payments.length > 0) {
        html += `
            <div class="report-section">
                <h3>Payment History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        payments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        payments.forEach(payment => {
            html += `
                <tr>
                    <td>${new Date(payment.date).toLocaleDateString('en-IN')}</td>
                    <td>${payment.type}</td>
                    <td>₹${payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    reportDiv.innerHTML = html;
}

function viewLoanReport(loanId) {
    switchSection('reports');
    setTimeout(() => {
        document.getElementById('reportLoanSelect').value = loanId;
        loadLoanReport();
    }, 100);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = ['customerModal', 'loanModal', 'paymentModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initData();
    loadCustomers();
});