import axios from 'axios';
import { mockDb, generateId, delay } from './mockData';

const USE_MOCKS = true; // Set to true to use static data while DB is down

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// --- STATIC DATA MOCK ADAPTER ---
if (USE_MOCKS) {
  console.warn('CPAMS is currently running in MOCK DATA mode because the database is offline.');
  
  api.defaults.adapter = async (config) => {
    await delay(400); // Simulate network latency

    const url = config.url.replace(api.defaults.baseURL, '');
    const method = config.method.toUpperCase();
    const data = config.data ? JSON.parse(config.data) : null;
    let responseData = null;
    let status = 200;

    try {
      // 1. AUTH
      if (url.includes('/auth/login') && method === 'POST') {
        const user = mockDb.users.find(u => u.username === data.username);
        if (!user || data.password !== user.username) {
          throw { status: 401, data: { error: 'Invalid credentials. Use admin/admin, staff/staff, customer/customer' } };
        }
        responseData = { token: 'mock-jwt-token', user };
      }
      else if (url.includes('/auth/me') && method === 'GET') {
        responseData = mockDb.users[0]; // Just return admin for quick testing if token exists
      }

      // 2. USERS
      else if (url.match(/^\/users$/) && method === 'GET') {
        responseData = mockDb.users;
      }
      else if (url.includes('/users/pending-customers') && method === 'GET') {
        responseData = mockDb.users.filter(u => u.account_status === 'Pending' && u.role === 'Customer');
      }
      else if (url.includes('/users/staff') && method === 'POST') {
        const newUser = {
          user_id: generateId('users'),
          ...data,
          role: 'Staff',
          account_status: 'Approved',
          created_at: new Date().toISOString()
        };
        mockDb.users.unshift(newUser);
        responseData = { message: 'Staff created' };
        status = 201;
      }
      else if (url.includes('/users/customers') && method === 'POST') {
        // Staff creating a pending customer
        const newUser = {
          user_id: generateId('users'),
          ...data,
          role: 'Customer',
          account_status: 'Pending',
          created_at: new Date().toISOString()
        };
        mockDb.users.unshift(newUser);
        responseData = { message: 'Customer created' };
        status = 201;
      }
      else if (url.match(/\/users\/customers\/\d+\/approve/) && method === 'POST') {
        const id = parseInt(url.split('/')[3]);
        const user = mockDb.users.find(u => u.user_id === id);
        if (user) user.account_status = 'Approved';
        responseData = { message: 'Approved' };
      }
      else if (url.match(/\/users\/customers\/\d+\/reject/) && method === 'POST') {
        const id = parseInt(url.split('/')[3]);
        const user = mockDb.users.find(u => u.user_id === id);
        if (user) user.account_status = 'Rejected';
        responseData = { message: 'Rejected' };
      }
      else if (url.match(/\/users\/\d+\/status/) && method === 'PATCH') {
        const id = parseInt(url.split('/')[2]);
        const user = mockDb.users.find(u => u.user_id === id);
        if (user) user.account_status = data.status;
        responseData = { message: 'Status updated' };
      }

      // 3. CEMETERY SETUP (Sections & Plots)
      else if (url.match(/^\/sections$/) && method === 'GET') {
        responseData = mockDb.sections;
      }
      else if (url.match(/^\/sections$/) && method === 'POST') {
        const newSec = { section_id: generateId('sections'), ...data, block_count: 0 };
        mockDb.sections.push(newSec);
        responseData = { message: 'Section created' };
      }
      else if (url.match(/^\/blocks$/) && method === 'GET') {
        responseData = mockDb.blocks;
      }
      else if (url.match(/^\/plots$/) && method === 'GET') {
        responseData = mockDb.plots;
      }
      else if (url.match(/^\/plots$/) && method === 'POST') {
        const newPlot = { plot_id: generateId('plots'), ...data, status: 'Available' };
        mockDb.plots.push(newPlot);
        responseData = { message: 'Plot created' };
      }

      // 4. RESERVATIONS
      else if (url.match(/^\/reservations\/my$/) && method === 'GET') {
        // Identify current user from the token (mock: parse from Authorization header)
        const token = config.headers?.Authorization?.replace('Bearer ', '');
        const currentUser = mockDb.users.find(u => token === 'mock-jwt-token') || null;
        // Since all sessions share the same mock token, we scope by stored user from sessionStorage
        // The frontend passes customer_id as query param when needed; otherwise filter by last logged-in customer
        const custId = config.params?.customer_id || 3;
        responseData = mockDb.reservations.filter(r => r.customer_id === parseInt(custId));
      }
      else if (url.match(/^\/reservations$/) && method === 'GET') {
        responseData = mockDb.reservations;
      }
      else if (url.match(/^\/reservations$/) && method === 'POST') {
        const plot = mockDb.plots.find(p => p.plot_id === data.plot_id);
        const customer = mockDb.users.find(u => u.user_id === data.customer_id);
        if (plot) plot.status = data.payment_type === 'Full Payment' ? 'Occupied' : 'Reserved';
        
        const newRes = {
          reservation_id: generateId('reservations'),
          ...data,
          reservation_date: new Date().toISOString(),
          total_price: plot ? plot.price : 0,
          balance_status: data.payment_type === 'Full Payment' ? 'Fully Paid' : 'Pending Balance',
          customer_name: customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown',
          plot_number: plot ? plot.plot_number : 'Unknown'
        };
        mockDb.reservations.unshift(newRes);

        // Also record the down payment automatically
        const newPayment = {
          payment_id: generateId('payments'),
          plot_id: data.plot_id,
          customer_id: data.customer_id,
          processed_by: data.reserved_by,
          payment_type: data.payment_type,
          amount_paid: data.amount_paid,
          or_number: `OR-${10000 + mockDb.payments.length}`,
          payment_date: new Date().toISOString(),
          customer_name: newRes.customer_name,
          plot_number: newRes.plot_number,
          staff_name: 'System'
        };
        mockDb.payments.unshift(newPayment);

        responseData = { message: 'Reserved' };
      }
      else if (url.match(/\/reservations\/\d+\/balance/) && method === 'GET') {
        const id = parseInt(url.split('/')[2]);
        const res = mockDb.reservations.find(r => r.reservation_id === id);
        if (res) {
          const payments = mockDb.payments.filter(p => p.plot_id === res.plot_id);
          const sum = payments.reduce((acc, p) => acc + p.amount_paid, 0);
          responseData = {
            total_price: res.total_price,
            total_paid: sum,
            remaining_balance: Math.max(0, res.total_price - sum)
          };
        } else {
          responseData = { total_price: 0, total_paid: 0, remaining_balance: 0 };
        }
      }

      // 5. PAYMENTS
      else if (url.match(/^\/payments$/) && method === 'GET') {
        responseData = mockDb.payments;
      }
      else if (url.match(/^\/payments\/my$/) && method === 'GET') {
        responseData = mockDb.payments.filter(p => p.customer_id === 3); // mock for john doe
      }
      else if (url.match(/^\/payments$/) && method === 'POST') {
        const newPayment = {
          payment_id: generateId('payments'),
          ...data,
          or_number: `OR-${10000 + mockDb.payments.length}`,
          payment_date: new Date().toISOString(),
          customer_name: 'Customer',
          plot_number: 'Plot',
          staff_name: 'Staff'
        };
        mockDb.payments.unshift(newPayment);
        
        // Update balance
        const res = mockDb.reservations.find(r => r.plot_id === data.plot_id);
        const payments = mockDb.payments.filter(p => p.plot_id === data.plot_id);
        const sum = payments.reduce((acc, p) => acc + p.amount_paid, 0);
        let rem = 0;
        if (res) {
          rem = Math.max(0, res.total_price - sum);
          if (rem === 0) {
            res.balance_status = 'Fully Paid';
            const plot = mockDb.plots.find(p => p.plot_id === data.plot_id);
            if (plot) plot.status = 'Occupied';
          }
        }
        responseData = { message: 'Payment recorded', or_number: newPayment.or_number, remaining_balance: rem };
      }

      // 6. DECEASED
      else if (url.match(/^\/deceased$/) && method === 'GET') {
        responseData = mockDb.deceased;
      }
      else if (url.match(/^\/deceased\/my$/) && method === 'GET') {
        responseData = mockDb.deceased.filter(d => d.customer_id === 3);
      }
      else if (url.match(/^\/deceased$/) && method === 'POST') {
        const newDec = { deceased_id: generateId('deceased'), ...data, plot_number: 'N/A', customer_name: 'N/A' };
        mockDb.deceased.unshift(newDec);
        responseData = { message: 'Deceased registered' };
      }

      // 7. REPORTS
      else if (url.includes('/reports/occupancy') && method === 'GET') {
        responseData = {
          by_status: [
            { status: 'Available', count: mockDb.plots.filter(p => p.status === 'Available').length },
            { status: 'Reserved', count: mockDb.plots.filter(p => p.status === 'Reserved').length },
            { status: 'Occupied', count: mockDb.plots.filter(p => p.status === 'Occupied').length }
          ]
        };
      }
      else if (url.includes('/reports/revenue/monthly') && method === 'GET') {
        responseData = [
          { month: '2023-01', total_revenue: 150000 },
          { month: '2023-02', total_revenue: 0 },
          { month: '2023-03', total_revenue: 0 },
          { month: '2023-04', total_revenue: 50000 }
        ];
      }

      // 8. WALK-IN PROFILING TRANSACTION
      else if (url.includes('/walk-in') && method === 'POST') {
        let customerId = data.customer_id;
        let customerName = data.customer_name || 'Unknown';
        
        // 1. If new customer, create the customer
        if (data.is_new_customer) {
          customerId = generateId('users');
          const newUser = {
            user_id: customerId,
            username: data.customer_data.username,
            first_name: data.customer_data.first_name,
            last_name: data.customer_data.last_name,
            email: data.customer_data.email,
            phone: data.customer_data.phone,
            role: 'Customer',
            account_status: 'Approved', // Auto-approved for walk-ins
            created_at: new Date().toISOString()
          };
          mockDb.users.push(newUser);
          customerName = `${newUser.first_name} ${newUser.last_name}`;
        } else {
          const existingUser = mockDb.users.find(u => u.user_id === customerId);
          if (existingUser) customerName = `${existingUser.first_name} ${existingUser.last_name}`;
        }

        // 2. Reserve Plot
        const plot = mockDb.plots.find(p => p.plot_id === data.plot_id);
        if (!plot) throw { status: 404, data: { error: 'Plot not found' } };
        plot.status = data.payment_type === 'Full Payment' ? 'Occupied' : 'Reserved';

        const newRes = {
          reservation_id: generateId('reservations'),
          plot_id: data.plot_id,
          customer_id: customerId,
          reserved_by: data.staff_id,
          reservation_date: new Date().toISOString(),
          intended_use_date: data.intended_use_date,
          total_price: plot.price,
          amount_paid: data.amount_paid,
          balance_status: data.payment_type === 'Full Payment' ? 'Fully Paid' : 'Pending Balance',
          customer_name: customerName,
          plot_number: plot.plot_number
        };
        mockDb.reservations.unshift(newRes);

        // 3. Register Deceased
        const newDec = {
          deceased_id: generateId('deceased'),
          plot_id: data.plot_id,
          customer_id: customerId,
          registered_by: data.staff_id,
          deceased_name: data.deceased_data.deceased_name,
          date_of_birth: data.deceased_data.date_of_birth,
          date_of_death: data.deceased_data.date_of_death,
          date_of_burial: data.intended_use_date,
          cause_of_death: data.deceased_data.cause_of_death,
          notes: '',
          plot_number: plot.plot_number,
          customer_name: customerName
        };
        mockDb.deceased.unshift(newDec);

        // 4. Record Payment
        const newPayment = {
          payment_id: generateId('payments'),
          plot_id: data.plot_id,
          customer_id: customerId,
          processed_by: data.staff_id,
          payment_type: data.payment_type,
          amount_paid: data.amount_paid,
          or_number: `OR-${10000 + mockDb.payments.length}`,
          payment_date: new Date().toISOString(),
          customer_name: customerName,
          plot_number: plot.plot_number,
          staff_name: 'Walk-in Process'
        };
        mockDb.payments.unshift(newPayment);

        responseData = { message: 'Walk-in transaction completed successfully', reservation: newRes };
      }

      // Fallback
      else {
        console.warn(`Mock adapter did not intercept: ${method} ${url}`);
        responseData = [];
      }

      return { data: responseData, status, statusText: 'OK', headers: {}, config, request: {} };

    } catch (e) {
      const err = new Error('Mock request failed');
      err.response = e.status ? { status: e.status, data: e.data } : { status: 500, data: { error: 'Mock Server Error' } };
      throw err;
    }
  };
}

export default api;
