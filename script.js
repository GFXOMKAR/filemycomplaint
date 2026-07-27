/* ==========================================================================
   AETHER BUDGET — FULL-STACK VANILLA JAVASCRIPT APP ENGINE
   LocalStorage State Management, Dynamic Canvas Charts, Unlimited Months & CRUD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. DEFAULT SEED DATA & CONSTANTS
     -------------------------------------------------------------------------- */
  const DEFAULT_CATEGORIES = {
    house: { name: 'House Expenses', icon: '🏠', budget: 1200, color: '#7C3AED' },
    grocery: { name: 'Grocery', icon: '🥦', budget: 600, color: '#10B981' },
    petrol: { name: 'Bike Petrol', icon: '⛽', budget: 200, color: '#F59E0B' },
    medical: { name: 'Medical', icon: '💊', budget: 300, color: '#EF4444' },
    recharge: { name: 'Recharge', icon: '📱', budget: 100, color: '#3B82F6' },
    fun: { name: 'Fun & Leisure', icon: '🎉', budget: 400, color: '#EC4899' },
    emi: { name: 'EMI & Loans', icon: '🏦', budget: 800, color: '#6366F1' },
    emergency: { name: 'Emergency Fund', icon: '💰', budget: 300, color: '#22D3EE' },
    investment: { name: 'Investment', icon: '📈', budget: 400, color: '#A855F7' },
    propfirm: { name: 'Prop Firm', icon: '💼', budget: 200, color: '#14B8A6' }
  };

  const DEFAULT_INITIAL_STATE = {
    months: ['July 2026'],
    activeMonth: 'July 2026',
    currency: '$',
    data: {
      'July 2026': {
        totalBudget: 4500,
        categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
        expenses: [
          { id: 'exp_1', name: 'Apartment Rent', amount: 1100, category: 'house', date: '2026-07-02', month: 'July 2026', notes: 'July Rent' },
          { id: 'exp_2', name: 'Supermarket Weekly', amount: 145.50, category: 'grocery', date: '2026-07-05', month: 'July 2026', notes: 'Whole Foods Market' },
          { id: 'exp_3', name: 'Shell Fuel Refill', amount: 45.00, category: 'petrol', date: '2026-07-08', month: 'July 2026', notes: 'Full Tank' },
          { id: 'exp_4', name: 'Health Insurance', amount: 150.00, category: 'medical', date: '2026-07-10', month: 'July 2026', notes: 'Monthly Premium' },
          { id: 'exp_5', name: 'Fiber Internet Bill', amount: 79.99, category: 'recharge', date: '2026-07-12', month: 'July 2026', notes: 'Gigabit Connection' },
          { id: 'exp_6', name: 'Weekend Dinner & Movies', amount: 120.00, category: 'fun', date: '2026-07-15', month: 'July 2026', notes: 'IMAX Cinema' },
          { id: 'exp_7', name: 'Car Loan Installment', amount: 350.00, category: 'emi', date: '2026-07-18', month: 'July 2026', notes: 'Auto Loan EMI' },
          { id: 'exp_8', name: 'S&P 500 Index SIP', amount: 400.00, category: 'investment', date: '2026-07-20', month: 'July 2026', notes: 'Vanguard Index Fund' }
        ],
        income: [
          { id: 'inc_1', source: 'Primary Salary', amount: 5500, date: '2026-07-01', month: 'July 2026' },
          { id: 'inc_2', source: 'Freelance UI Design', amount: 1200, date: '2026-07-14', month: 'July 2026' }
        ],
        savingsGoals: [
          { id: 'sav_1', name: '6-Month Emergency Cushion', target: 15000, current: 8500 },
          { id: 'sav_2', name: 'M3 Max Workstation Rig', target: 4000, current: 2800 },
          { id: 'sav_3', name: 'Crypto & Stock Reserve', target: 10000, current: 4200 }
        ]
      }
    }
  };

  /* --------------------------------------------------------------------------
     2. APP STATE MANAGER (LOCAL STORAGE PERSISTENCE)
     -------------------------------------------------------------------------- */
  class BudgetApp {
    constructor() {
      this.loadState();
      this.initDOM();
      this.bindEvents();
      this.renderAll();
    }

    loadState() {
      const stored = localStorage.getItem('aether_budget_app_state');
      if (stored) {
        try {
          this.state = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse state from LocalStorage, falling back to default', e);
          this.state = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
        }
      } else {
        this.state = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
        this.saveState();
      }

      // Ensure active month data structure exists
      if (!this.state.data[this.state.activeMonth]) {
        this.initMonthStructure(this.state.activeMonth);
      }
    }

    saveState() {
      localStorage.setItem('aether_budget_app_state', JSON.stringify(this.state));
    }

    initMonthStructure(monthName, copyFromMonth = null) {
      let catCopy = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
      let initBudget = 4500;

      if (copyFromMonth && this.state.data[copyFromMonth]) {
        const sourceData = this.state.data[copyFromMonth];
        catCopy = JSON.parse(JSON.stringify(sourceData.categories));
        initBudget = sourceData.totalBudget;
      }

      this.state.data[monthName] = {
        totalBudget: initBudget,
        categories: catCopy,
        expenses: [],
        income: [],
        savingsGoals: [
          { id: 'sav_1', name: '6-Month Emergency Cushion', target: 15000, current: 8500 },
          { id: 'sav_2', name: 'M3 Max Workstation Rig', target: 4000, current: 2800 }
        ]
      };

      if (!this.state.months.includes(monthName)) {
        this.state.months.push(monthName);
      }
      this.saveState();
    }

    getActiveMonthData() {
      return this.state.data[this.state.activeMonth] || {
        totalBudget: 0,
        categories: {},
        expenses: [],
        income: [],
        savingsGoals: []
      };
    }

    formatMoney(amount) {
      const curr = this.state.currency || '$';
      const num = parseFloat(amount) || 0;
      return `${curr}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    /* --------------------------------------------------------------------------
       3. DOM CACHING & EVENT BINDINGS
       -------------------------------------------------------------------------- */
    initDOM() {
      // Views
      this.navItems = document.querySelectorAll('.nav-item');
      this.viewPanes = document.querySelectorAll('.view-pane');
      
      // Top Bar Elements
      this.monthSelect = document.getElementById('month-select');
      this.globalSearch = document.getElementById('global-search');
      this.activeMonthTexts = document.querySelectorAll('.active-month-text');
      this.sidebarActiveMonth = document.getElementById('sidebar-active-month');
      this.sidebarExpenseCount = document.getElementById('sidebar-expense-count');
      this.mobileToggle = document.getElementById('mobile-toggle');
      this.sidebar = document.getElementById('sidebar');

      // Modals
      this.modalExpense = document.getElementById('modal-expense');
      this.modalIncome = document.getElementById('modal-income');
      this.modalMonth = document.getElementById('modal-month');
      this.modalCategoryBudget = document.getElementById('modal-category-budget');
      this.modalSavingsDeposit = document.getElementById('modal-savings-deposit');
      this.modalCustomCategory = document.getElementById('modal-custom-category');

      // Toast Container
      this.toastContainer = document.getElementById('toast-container');
    }

    bindEvents() {
      // Navigation tab switching
      this.navItems.forEach(item => {
        item.addEventListener('click', () => {
          const targetView = item.getAttribute('data-view');
          this.switchView(targetView);
        });
      });

      // Quick view triggers from sub-links
      document.querySelectorAll('[data-view-trigger]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.switchView(btn.getAttribute('data-view-trigger'));
        });
      });

      // Mobile Sidebar Toggle
      this.mobileToggle?.addEventListener('click', () => {
        this.sidebar?.classList.toggle('active');
      });

      // Month Selector
      this.monthSelect?.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === '__NEW__') {
          this.openModal(this.modalMonth);
          this.monthSelect.value = this.state.activeMonth;
        } else {
          this.state.activeMonth = val;
          this.saveState();
          this.renderAll();
          this.showToast(`Switched active month to ${val}`, 'success');
        }
      });

      // Sidebar "+ New Month" button
      document.getElementById('sidebar-add-month-btn')?.addEventListener('click', () => {
        this.openModal(this.modalMonth);
      });

      // Global Search Filter
      this.globalSearch?.addEventListener('input', (e) => {
        this.renderExpensesTable(e.target.value.trim());
      });

      // Quick Add Expense Buttons
      document.getElementById('topbar-quick-add-btn')?.addEventListener('click', () => this.openExpenseModal());
      document.getElementById('dash-add-expense-btn')?.addEventListener('click', () => this.openExpenseModal());
      document.getElementById('expenses-add-btn')?.addEventListener('click', () => this.openExpenseModal());

      // Quick Add Income Buttons
      document.getElementById('dash-add-income-btn')?.addEventListener('click', () => this.openIncomeModal());
      document.getElementById('income-add-btn')?.addEventListener('click', () => this.openIncomeModal());

      // Edit Budget Limit Button
      document.getElementById('edit-budget-btn')?.addEventListener('click', () => {
        const monthData = this.getActiveMonthData();
        const newLimit = prompt(`Enter new Total Budget limit for ${this.state.activeMonth}:`, monthData.totalBudget);
        if (newLimit !== null && !isNaN(newLimit) && parseFloat(newLimit) >= 0) {
          monthData.totalBudget = parseFloat(newLimit);
          this.saveState();
          this.renderAll();
          this.showToast(`Updated Total Budget limit to ${this.formatMoney(newLimit)}`, 'success');
        }
      });

      // Modal Close Buttons
      document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.closest('.modal-backdrop')?.classList.remove('active');
        });
      });

      // Custom Category Buttons
      document.getElementById('cat-add-btn')?.addEventListener('click', () => this.openModal(this.modalCustomCategory));
      document.getElementById('cat-mgmt-add-btn')?.addEventListener('click', () => this.openModal(this.modalCustomCategory));

      // Form Submissions
      document.getElementById('form-expense')?.addEventListener('submit', (e) => this.handleExpenseSubmit(e));
      document.getElementById('form-income')?.addEventListener('submit', (e) => this.handleIncomeSubmit(e));
      document.getElementById('form-month')?.addEventListener('submit', (e) => this.handleMonthSubmit(e));
      document.getElementById('form-category-budget')?.addEventListener('submit', (e) => this.handleCategoryBudgetSubmit(e));
      document.getElementById('form-savings-deposit')?.addEventListener('submit', (e) => this.handleSavingsDepositSubmit(e));
      document.getElementById('form-custom-category')?.addEventListener('submit', (e) => this.handleCustomCategorySubmit(e));

      // Filter Controls for Expenses View
      document.getElementById('filter-category')?.addEventListener('change', () => this.renderExpensesTable());
      document.getElementById('filter-sort')?.addEventListener('change', () => this.renderExpensesTable());

      // Settings Data Handlers
      document.getElementById('export-expenses-csv-btn')?.addEventListener('click', () => this.exportCSV('expenses'));
      document.getElementById('export-income-csv-btn')?.addEventListener('click', () => this.exportCSV('income'));
      document.getElementById('export-json-btn')?.addEventListener('click', () => this.exportJSON());
      document.getElementById('import-trigger-btn')?.addEventListener('click', () => {
        document.getElementById('import-file-input')?.click();
      });
      document.getElementById('import-file-input')?.addEventListener('change', (e) => this.importFile(e));
      
      document.getElementById('setting-currency')?.addEventListener('change', (e) => {
        this.state.currency = e.target.value;
        this.saveState();
        this.renderAll();
        this.showToast(`Currency format updated to ${e.target.value}`, 'success');
      });

      document.getElementById('reset-storage-btn')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all storage data? This cannot be undone.')) {
          localStorage.removeItem('aether_budget_app_state');
          this.loadState();
          this.renderAll();
          this.showToast('All app data has been reset to defaults.', 'success');
        }
      });

      // Add Savings Goal button
      document.getElementById('savings-add-btn')?.addEventListener('click', () => {
        const name = prompt('Enter Savings Goal Name:');
        if (!name) return;
        const target = prompt('Enter Target Goal Amount ($):');
        if (!target || isNaN(target)) return;

        const monthData = this.getActiveMonthData();
        monthData.savingsGoals.push({
          id: `sav_${Date.now()}`,
          name: name.trim(),
          target: parseFloat(target),
          current: 0
        });
        this.saveState();
        this.renderSavingsView();
        this.showToast(`Created savings goal "${name}"`, 'success');
      });
    }

    switchView(targetView) {
      this.navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === targetView);
      });

      this.viewPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === `view-${targetView}`);
      });

      this.sidebar?.classList.remove('active');
      
      // Trigger canvas chart re-render if switching to dashboard
      if (targetView === 'dashboard') {
        setTimeout(() => this.renderCharts(), 50);
      }
    }

    openModal(modalEl) {
      modalEl?.classList.add('active');
    }

    closeModal(modalEl) {
      modalEl?.classList.remove('active');
    }

    /* --------------------------------------------------------------------------
       4. CRUD OPERATIONS
       -------------------------------------------------------------------------- */
    openExpenseModal(expId = null) {
      const monthData = this.getActiveMonthData();
      const form = document.getElementById('form-expense');
      form.reset();

      // Populate Category Select
      const catSelect = document.getElementById('exp-category');
      catSelect.innerHTML = Object.entries(monthData.categories).map(([key, cat]) => `
        <option value="${key}">${cat.icon} ${cat.name}</option>
      `).join('');

      // Populate Month Select
      const monthSelect = document.getElementById('exp-month');
      monthSelect.innerHTML = this.state.months.map(m => `
        <option value="${m}" ${m === this.state.activeMonth ? 'selected' : ''}>${m}</option>
      `).join('');

      // Set default date to today
      document.getElementById('exp-date').value = new Date().toISOString().split('T')[0];

      if (expId) {
        const exp = monthData.expenses.find(e => e.id === expId);
        if (exp) {
          document.getElementById('modal-expense-title').textContent = 'Edit Expense';
          document.getElementById('exp-id').value = exp.id;
          document.getElementById('exp-name').value = exp.name;
          document.getElementById('exp-amount').value = exp.amount;
          document.getElementById('exp-category').value = exp.category;
          document.getElementById('exp-date').value = exp.date;
          document.getElementById('exp-month').value = exp.month;
          document.getElementById('exp-notes').value = exp.notes || '';
        }
      } else {
        document.getElementById('modal-expense-title').textContent = 'Add New Expense';
        document.getElementById('exp-id').value = '';
      }

      this.openModal(this.modalExpense);
    }

    handleExpenseSubmit(e) {
      e.preventDefault();
      const id = document.getElementById('exp-id').value;
      const name = document.getElementById('exp-name').value.trim();
      const amount = parseFloat(document.getElementById('exp-amount').value);
      const category = document.getElementById('exp-category').value;
      const date = document.getElementById('exp-date').value;
      const targetMonth = document.getElementById('exp-month').value;
      const notes = document.getElementById('exp-notes').value.trim();

      if (!this.state.data[targetMonth]) {
        this.initMonthStructure(targetMonth);
      }

      const monthData = this.state.data[targetMonth];

      if (id) {
        // Edit existing
        const index = monthData.expenses.findIndex(item => item.id === id);
        if (index !== -1) {
          monthData.expenses[index] = { id, name, amount, category, date, month: targetMonth, notes };
        }
        this.showToast(`Updated expense "${name}"`, 'success');
      } else {
        // Add new
        const newExp = {
          id: `exp_${Date.now()}`,
          name,
          amount,
          category,
          date,
          month: targetMonth,
          notes
        };
        monthData.expenses.push(newExp);
        this.showToast(`Added expense "${name}" (${this.formatMoney(amount)})`, 'success');
      }

      this.saveState();
      this.closeModal(this.modalExpense);
      this.renderAll();
    }

    deleteExpense(id) {
      if (confirm('Are you sure you want to delete this expense record?')) {
        const monthData = this.getActiveMonthData();
        monthData.expenses = monthData.expenses.filter(e => e.id !== id);
        this.saveState();
        this.renderAll();
        this.showToast('Expense deleted.', 'success');
      }
    }

    openIncomeModal(incId = null) {
      const form = document.getElementById('form-income');
      form.reset();

      const monthSelect = document.getElementById('inc-month');
      monthSelect.innerHTML = this.state.months.map(m => `
        <option value="${m}" ${m === this.state.activeMonth ? 'selected' : ''}>${m}</option>
      `).join('');

      document.getElementById('inc-date').value = new Date().toISOString().split('T')[0];

      if (incId) {
        const monthData = this.getActiveMonthData();
        const inc = monthData.income.find(i => i.id === incId);
        if (inc) {
          document.getElementById('modal-income-title').textContent = 'Edit Income Record';
          document.getElementById('inc-id').value = inc.id;
          document.getElementById('inc-source').value = inc.source;
          document.getElementById('inc-amount').value = inc.amount;
          document.getElementById('inc-date').value = inc.date;
          document.getElementById('inc-month').value = inc.month;
        }
      } else {
        document.getElementById('modal-income-title').textContent = 'Add New Income';
        document.getElementById('inc-id').value = '';
      }

      this.openModal(this.modalIncome);
    }

    handleIncomeSubmit(e) {
      e.preventDefault();
      const id = document.getElementById('inc-id').value;
      const source = document.getElementById('inc-source').value.trim();
      const amount = parseFloat(document.getElementById('inc-amount').value);
      const date = document.getElementById('inc-date').value;
      const targetMonth = document.getElementById('inc-month').value;

      if (!this.state.data[targetMonth]) {
        this.initMonthStructure(targetMonth);
      }

      const monthData = this.state.data[targetMonth];

      if (id) {
        const index = monthData.income.findIndex(i => i.id === id);
        if (index !== -1) {
          monthData.income[index] = { id, source, amount, date, month: targetMonth };
        }
        this.showToast(`Updated income record "${source}"`, 'success');
      } else {
        monthData.income.push({
          id: `inc_${Date.now()}`,
          source,
          amount,
          date,
          month: targetMonth
        });
        this.showToast(`Added income "${source}" (${this.formatMoney(amount)})`, 'success');
      }

      this.saveState();
      this.closeModal(this.modalIncome);
      this.renderAll();
    }

    deleteIncome(id) {
      if (confirm('Are you sure you want to delete this income record?')) {
        const monthData = this.getActiveMonthData();
        monthData.income = monthData.income.filter(i => i.id !== id);
        this.saveState();
        this.renderAll();
        this.showToast('Income record deleted.', 'success');
      }
    }

    handleMonthSubmit(e) {
      e.preventDefault();
      const newMonthName = document.getElementById('month-name').value.trim();
      const copyFrom = document.getElementById('month-copy-from').value;

      if (!newMonthName) return;

      if (this.state.months.includes(newMonthName)) {
        alert('A month with this name already exists!');
        return;
      }

      this.initMonthStructure(newMonthName, copyFrom !== 'none' ? copyFrom : null);
      this.state.activeMonth = newMonthName;
      this.saveState();

      this.closeModal(this.modalMonth);
      this.renderAll();
      this.showToast(`Created new month "${newMonthName}"`, 'success');
    }

    openCategoryBudgetModal(catKey) {
      const monthData = this.getActiveMonthData();
      const cat = monthData.categories[catKey];
      if (!cat) return;

      document.getElementById('cat-budget-key').value = catKey;
      document.getElementById('cat-budget-label').textContent = `${cat.icon} ${cat.name} Budget Limit ($)`;
      document.getElementById('cat-budget-limit').value = cat.budget;

      this.openModal(this.modalCategoryBudget);
    }

    handleCategoryBudgetSubmit(e) {
      e.preventDefault();
      const catKey = document.getElementById('cat-budget-key').value;
      const newLimit = parseFloat(document.getElementById('cat-budget-limit').value);

      const monthData = this.getActiveMonthData();
      if (monthData.categories[catKey]) {
        monthData.categories[catKey].budget = newLimit;
        this.saveState();
        this.closeModal(this.modalCategoryBudget);
        this.renderAll();
        this.showToast('Category budget limit updated.', 'success');
      }
    }

    openSavingsDepositModal(goalId) {
      const monthData = this.getActiveMonthData();
      const goal = monthData.savingsGoals.find(g => g.id === goalId);
      if (!goal) return;

      document.getElementById('savings-goal-id').value = goalId;
      document.getElementById('modal-savings-title').textContent = `Add Deposit to "${goal.name}"`;
      document.getElementById('savings-deposit-amount').value = '';

      this.openModal(this.modalSavingsDeposit);
    }

    handleSavingsDepositSubmit(e) {
      e.preventDefault();
      const goalId = document.getElementById('savings-goal-id').value;
      const amount = parseFloat(document.getElementById('savings-deposit-amount').value);

      const monthData = this.getActiveMonthData();
      const goal = monthData.savingsGoals.find(g => g.id === goalId);
      if (goal && amount > 0) {
        goal.current += amount;
        this.saveState();
        this.closeModal(this.modalSavingsDeposit);
        this.renderAll();
        this.showToast(`Added ${this.formatMoney(amount)} deposit to ${goal.name}`, 'success');
      }
    }

    /* --------------------------------------------------------------------------
       5. RENDERING PIPELINE & METRICS COMPUTATION
       -------------------------------------------------------------------------- */
    renderAll() {
      this.updateMonthDropdowns();
      this.renderDashboard();
      this.renderCategoriesView();
      this.renderExpensesTable();
      this.renderIncomeTable();
      this.renderSavingsView();
      this.renderCharts();
    }

    updateMonthDropdowns() {
      if (this.monthSelect) {
        this.monthSelect.innerHTML = `
          ${this.state.months.map(m => `<option value="${m}" ${m === this.state.activeMonth ? 'selected' : ''}>${m}</option>`).join('')}
          <option value="__NEW__">+ Create New Month...</option>
        `;
      }

      // Populate Copy Month dropdown in Create Month Modal
      const copySelect = document.getElementById('month-copy-from');
      if (copySelect) {
        copySelect.innerHTML = `<option value="none">Start Fresh (Default Limits)</option>` +
          this.state.months.map(m => `<option value="${m}">Copy from ${m}</option>`).join('');
      }

      // Update Header Text Badges
      this.activeMonthTexts.forEach(el => el.textContent = this.state.activeMonth);
      if (this.sidebarActiveMonth) this.sidebarActiveMonth.textContent = this.state.activeMonth;

      // Currency Setting Select
      const settingCurr = document.getElementById('setting-currency');
      if (settingCurr) settingCurr.value = this.state.currency || '$';
    }

    renderDashboard() {
      const monthData = this.getActiveMonthData();

      // Compute Total Income
      const totalIncome = monthData.income.reduce((sum, item) => sum + item.amount, 0);

      // Compute Total Expenses
      const totalExpenses = monthData.expenses.reduce((sum, item) => sum + item.amount, 0);

      // Total Allocated Budget
      const totalBudget = monthData.totalBudget;

      // Remaining Budget
      const remainingBudget = totalBudget - totalExpenses;

      // Total Savings Allocation
      const totalSavings = monthData.savingsGoals.reduce((sum, goal) => sum + goal.current, 0);

      // Update Metric Cards
      document.getElementById('card-total-budget').textContent = this.formatMoney(totalBudget);
      document.getElementById('card-total-income').textContent = this.formatMoney(totalIncome);
      document.getElementById('card-total-expenses').textContent = this.formatMoney(totalExpenses);
      
      const cardRem = document.getElementById('card-remaining-budget');
      const cardRemStatus = document.getElementById('card-remaining-status');
      if (cardRem) {
        cardRem.textContent = this.formatMoney(remainingBudget);
        if (remainingBudget < 0) {
          cardRem.className = 'metric-value c-danger';
          if (cardRemStatus) {
            cardRemStatus.textContent = 'Budget Exceeded!';
            cardRemStatus.className = 'metric-tag tag-pink';
          }
        } else {
          cardRem.className = 'metric-value c-green';
          if (cardRemStatus) {
            cardRemStatus.textContent = 'Safe Balance';
            cardRemStatus.className = 'metric-tag tag-cyan';
          }
        }
      }

      document.getElementById('card-total-savings').textContent = this.formatMoney(totalSavings);
      document.getElementById('card-income-count').textContent = `${monthData.income.length} Income Sources`;
      document.getElementById('card-savings-goals-count').textContent = `${monthData.savingsGoals.length} Active Goals`;

      // Used Percent
      const usedPercent = totalBudget > 0 ? ((totalExpenses / totalBudget) * 100).toFixed(1) : 0;
      document.getElementById('card-used-percent').textContent = `${usedPercent}% of Budget`;
      if (this.sidebarExpenseCount) this.sidebarExpenseCount.textContent = monthData.expenses.length;

      // Update Budget Progress Bar
      const fillBar = document.getElementById('bar-budget-fill');
      const percentText = document.getElementById('bar-budget-percent-text');
      if (fillBar && percentText) {
        const clampedPct = Math.min(usedPercent, 100);
        fillBar.style.width = `${clampedPct}%`;
        percentText.textContent = `${usedPercent}%`;
        if (usedPercent > 90) {
          fillBar.style.background = 'var(--danger)';
        } else {
          fillBar.style.background = 'linear-gradient(90deg, var(--primary), var(--pink))';
        }
      }
      document.getElementById('bar-budget-spent-sub').textContent = `${this.formatMoney(totalExpenses)} spent`;
      document.getElementById('bar-budget-total-sub').textContent = `${this.formatMoney(totalBudget)} total budget`;

      // Update Savings Progress Bar
      const totalSavingsTarget = monthData.savingsGoals.reduce((sum, g) => sum + g.target, 0);
      const savingsPct = totalSavingsTarget > 0 ? ((totalSavings / totalSavingsTarget) * 100).toFixed(1) : 0;
      const savFill = document.getElementById('bar-savings-fill');
      if (savFill) savFill.style.width = `${Math.min(savingsPct, 100)}%`;
      document.getElementById('bar-savings-percent-text').textContent = `${savingsPct}%`;
      document.getElementById('bar-savings-saved-sub').textContent = `${this.formatMoney(totalSavings)} saved`;

      // Render Recent Dashboard Expenses Preview Table
      const recentTbody = document.getElementById('dash-recent-tbody');
      if (recentTbody) {
        const recentExpenses = [...monthData.expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        if (recentExpenses.length === 0) {
          recentTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-dim);">No transactions recorded for ${this.state.activeMonth}</td></tr>`;
        } else {
          recentTbody.innerHTML = recentExpenses.map(exp => {
            const cat = monthData.categories[exp.category] || { icon: '🏷️', name: exp.category };
            return `
              <tr>
                <td>${exp.date}</td>
                <td><strong>${exp.name}</strong></td>
                <td><span class="category-pill">${cat.icon} ${cat.name}</span></td>
                <td>${exp.notes || '-'}</td>
                <td class="c-pink"><strong>${this.formatMoney(exp.amount)}</strong></td>
                <td>
                  <div class="action-btn-group">
                    <button class="action-btn" onclick="window.app.openExpenseModal('${exp.id}')" title="Edit">✏️</button>
                    <button class="action-btn" onclick="window.app.deleteExpense('${exp.id}')" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            `;
          }).join('');
        }
      }
    }

    renderCategoriesView() {
      const monthData = this.getActiveMonthData();
      const catGrids = [
        document.getElementById('category-cards-grid'),
        document.getElementById('category-management-grid')
      ];

      // Compute total spent per category
      const catSpentMap = {};
      monthData.expenses.forEach(exp => {
        catSpentMap[exp.category] = (catSpentMap[exp.category] || 0) + exp.amount;
      });

      const cardsHtml = Object.entries(monthData.categories).map(([key, cat]) => {
        const spent = catSpentMap[key] || 0;
        const budget = cat.budget || 0;
        const remaining = budget - spent;
        const pct = budget > 0 ? Math.min(((spent / budget) * 100), 100).toFixed(0) : 0;

        return `
          <div class="glass-card cat-card">
            <div class="cat-card-header">
              <div class="cat-icon-title">
                <span class="cat-icon">${cat.icon}</span>
                <span class="cat-name">${cat.name}</span>
              </div>
              <button class="icon-edit-btn" onclick="window.app.openCategoryBudgetModal('${key}')" title="Edit Category Limit">✏️</button>
            </div>

            <div class="cat-metrics-row">
              <div class="cat-submetric">
                <span class="lbl">BUDGET</span>
                <span class="val">${this.formatMoney(budget)}</span>
              </div>
              <div class="cat-submetric">
                <span class="lbl">SPENT</span>
                <span class="val c-pink">${this.formatMoney(spent)}</span>
              </div>
              <div class="cat-submetric">
                <span class="lbl">REMAINING</span>
                <span class="val ${remaining < 0 ? 'c-danger' : 'c-green'}">${this.formatMoney(remaining)}</span>
              </div>
            </div>

            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${pct}%; background: ${remaining < 0 ? 'var(--danger)' : 'var(--primary)'}"></div>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-dim); text-align: right; margin-top: 4px;">
              ${pct}% used
            </div>
          </div>
        `;
      }).join('');

      catGrids.forEach(grid => {
        if (grid) grid.innerHTML = cardsHtml;
      });

      // Filter Category options in Expenses View
      const filterCatSelect = document.getElementById('filter-category');
      if (filterCatSelect) {
        filterCatSelect.innerHTML = `<option value="ALL">All Categories</option>` +
          Object.entries(monthData.categories).map(([key, cat]) => `
            <option value="${key}">${cat.icon} ${cat.name}</option>
          `).join('');
      }
    }

    renderExpensesTable(searchQuery = '') {
      const monthData = this.getActiveMonthData();
      const tbody = document.getElementById('full-expenses-tbody');
      if (!tbody) return;

      const catFilter = document.getElementById('filter-category')?.value || 'ALL';
      const sortVal = document.getElementById('filter-sort')?.value || 'date-desc';

      let filtered = monthData.expenses.filter(exp => {
        const matchesCategory = catFilter === 'ALL' || exp.category === catFilter;
        const matchesSearch = !searchQuery || 
          exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      });

      // Sort
      filtered.sort((a, b) => {
        if (sortVal === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortVal === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortVal === 'amount-desc') return b.amount - a.amount;
        if (sortVal === 'amount-asc') return a.amount - b.amount;
        return 0;
      });

      // Update Filter Toolbar Stats
      const totalFilteredSum = filtered.reduce((s, e) => s + e.amount, 0);
      document.getElementById('expense-filtered-count').textContent = filtered.length;
      document.getElementById('expense-filtered-sum').textContent = this.formatMoney(totalFilteredSum);

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-dim); padding: 32px;">No matching expense items found</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(exp => {
        const cat = monthData.categories[exp.category] || { icon: '🏷️', name: exp.category };
        return `
          <tr>
            <td>${exp.date}</td>
            <td><strong>${exp.name}</strong></td>
            <td><span class="category-pill">${cat.icon} ${cat.name}</span></td>
            <td>${exp.month}</td>
            <td>${exp.notes || '-'}</td>
            <td class="c-pink"><strong>${this.formatMoney(exp.amount)}</strong></td>
            <td>
              <div class="action-btn-group">
                <button class="action-btn" onclick="window.app.openExpenseModal('${exp.id}')" title="Edit">✏️</button>
                <button class="action-btn" onclick="window.app.deleteExpense('${exp.id}')" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    renderIncomeTable() {
      const monthData = this.getActiveMonthData();
      const tbody = document.getElementById('income-tbody');
      if (!tbody) return;

      if (monthData.income.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-dim); padding: 32px;">No income records added for ${this.state.activeMonth}</td></tr>`;
        return;
      }

      tbody.innerHTML = monthData.income.map(inc => `
        <tr>
          <td>${inc.date}</td>
          <td><strong>${inc.source}</strong></td>
          <td>${inc.month}</td>
          <td class="c-cyan"><strong>${this.formatMoney(inc.amount)}</strong></td>
          <td>
            <div class="action-btn-group">
              <button class="action-btn" onclick="window.app.openIncomeModal('${inc.id}')" title="Edit">✏️</button>
              <button class="action-btn" onclick="window.app.deleteIncome('${inc.id}')" title="Delete">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    renderSavingsView() {
      const monthData = this.getActiveMonthData();
      const grid = document.getElementById('savings-cards-grid');
      if (!grid) return;

      if (monthData.savingsGoals.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color: var(--text-dim); padding: 48px;">No savings goals created yet. Click "+ New Goal" to start saving!</div>`;
        return;
      }

      grid.innerHTML = monthData.savingsGoals.map(goal => {
        const pct = goal.target > 0 ? Math.min(((goal.current / goal.target) * 100), 100).toFixed(0) : 0;
        return `
          <div class="glass-card savings-card">
            <div class="savings-card-header">
              <span class="savings-goal-name">🎯 ${goal.name}</span>
              <span class="metric-tag tag-purple">${pct}% Complete</span>
            </div>

            <div class="cat-metrics-row" style="margin-bottom: 16px;">
              <div class="cat-submetric">
                <span class="lbl">SAVED</span>
                <span class="val c-purple">${this.formatMoney(goal.current)}</span>
              </div>
              <div class="cat-submetric">
                <span class="lbl">TARGET</span>
                <span class="val">${this.formatMoney(goal.target)}</span>
              </div>
              <div class="cat-submetric">
                <span class="lbl">REMAINING</span>
                <span class="val c-cyan">${this.formatMoney(Math.max(0, goal.target - goal.current))}</span>
              </div>
            </div>

            <div class="progress-bar-track">
              <div class="progress-bar-fill secondary" style="width: ${pct}%"></div>
            </div>

            <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
              <button class="btn btn-secondary btn-xs" onclick="window.app.openSavingsDepositModal('${goal.id}')">+ Add Deposit</button>
            </div>
          </div>
        `;
      }).join('');
    }

    /* --------------------------------------------------------------------------
       6. INTERACTIVE NATIVE CANVAS CHARTS
       -------------------------------------------------------------------------- */
    renderCharts() {
      const monthData = this.getActiveMonthData();

      // Chart 1: Daily Spending Overview
      const spendingCanvas = document.getElementById('spending-chart');
      if (spendingCanvas) {
        const ctx = spendingCanvas.getContext('2d');
        const width = spendingCanvas.width = spendingCanvas.parentElement.clientWidth;
        const height = spendingCanvas.height = spendingCanvas.parentElement.clientHeight;

        ctx.clearRect(0, 0, width, height);

        // Group expenses by day of month
        const daysMap = {};
        for (let i = 1; i <= 31; i++) daysMap[i] = 0;

        monthData.expenses.forEach(exp => {
          const day = new Date(exp.date).getDate();
          if (daysMap[day] !== undefined) {
            daysMap[day] += exp.amount;
          }
        });

        const dayKeys = Object.keys(daysMap);
        const maxVal = Math.max(...Object.values(daysMap), 500);

        const padding = 30;
        const chartW = width - padding * 2;
        const chartH = height - padding * 2;

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padding + (chartH / 4) * i;
          ctx.beginPath();
          ctx.moveTo(padding, y);
          ctx.lineTo(width - padding, y);
          ctx.stroke();
        }

        // Draw Area Fill & Line
        const points = dayKeys.map((day, idx) => {
          const x = padding + (chartW / (dayKeys.length - 1)) * idx;
          const y = padding + chartH - (daysMap[day] / maxVal) * chartH;
          return { x, y };
        });

        // Area Gradient
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, 'rgba(124, 58, 237, 0.4)');
        grad.addColorStop(1, 'rgba(124, 58, 237, 0)');

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.lineTo(points[points.length - 1].x, padding + chartH);
        ctx.lineTo(points[0].x, padding + chartH);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Chart 2: Category Breakdown Donut Chart
      const categoryCanvas = document.getElementById('category-chart');
      if (categoryCanvas) {
        const ctx = categoryCanvas.getContext('2d');
        const size = Math.min(categoryCanvas.parentElement.clientWidth, categoryCanvas.parentElement.clientHeight);
        categoryCanvas.width = size;
        categoryCanvas.height = size;

        ctx.clearRect(0, 0, size, size);

        const catSpent = {};
        monthData.expenses.forEach(exp => {
          catSpent[exp.category] = (catSpent[exp.category] || 0) + exp.amount;
        });

        const totalSpent = Object.values(catSpent).reduce((a, b) => a + b, 0);

        if (totalSpent === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('No Expense Data', size / 2, size / 2);
          return;
        }

        const centerX = size / 2;
        const centerY = size / 2;
        const outerRadius = size * 0.4;
        const innerRadius = size * 0.25;

        let startAngle = -Math.PI / 2;

        Object.entries(catSpent).forEach(([catKey, amount]) => {
          const sliceAngle = (amount / totalSpent) * Math.PI * 2;
          const endAngle = startAngle + sliceAngle;
          const color = monthData.categories[catKey]?.color || '#A855F7';

          ctx.beginPath();
          ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
          ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();

          startAngle = endAngle;
        });

        // Center Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.formatMoney(totalSpent), centerX, centerY - 6);
        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('TOTAL SPENT', centerX, centerY + 14);
      }
    }

    /* --------------------------------------------------------------------------
       7. DATA EXPORT / IMPORT & TOAST SYSTEM
       -------------------------------------------------------------------------- */
    exportCSV(type) {
      const monthData = this.getActiveMonthData();
      let csvContent = 'data:text/csv;charset=utf-8,';

      if (type === 'expenses') {
        csvContent += 'ID,Date,Name,Category,Month,Amount,Notes\n';
        monthData.expenses.forEach(e => {
          csvContent += `"${e.id}","${e.date}","${e.name}","${e.category}","${e.month}","${e.amount}","${e.notes || ''}"\n`;
        });
      } else {
        csvContent += 'ID,Date,Source,Month,Amount\n';
        monthData.income.forEach(i => {
          csvContent += `"${i.id}","${i.date}","${i.source}","${i.month}","${i.amount}"\n`;
        });
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `aether_budget_${type}_${this.state.activeMonth.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showToast(`Exported ${type} CSV successfully.`, 'success');
    }

    exportJSON() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `aether_budget_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.showToast('Full JSON backup exported.', 'success');
    }

    importFile(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedState = JSON.parse(event.target.result);
          if (importedState.data && importedState.activeMonth) {
            this.state = importedState;
            this.saveState();
            this.renderAll();
            this.showToast('Successfully restored data backup!', 'success');
          } else {
            alert('Invalid backup file format.');
          }
        } catch (err) {
          alert('Error parsing uploaded backup file.');
        }
      };
      reader.readAsText(file);
    }

    showToast(message, type = 'info') {
      if (!this.toastContainer) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <span>${type === 'success' ? '✓' : '⚠️'}</span>
        <span>${message}</span>
      `;

      this.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  }

  // Attach app instance to global window for inline onclick handlers
  window.app = new BudgetApp();

});
