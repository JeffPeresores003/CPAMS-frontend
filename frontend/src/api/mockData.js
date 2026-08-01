/**
 * Initial Static Data for CPAMS (Mock Database)
 */

export const mockDb = {
  users: [
    { user_id: 1, username: 'admin', role: 'Admin', account_status: 'Approved', first_name: 'System', last_name: 'Admin', email: 'admin@cpams.local', created_at: '2023-01-01T00:00:00Z' },
    { user_id: 2, username: 'staff', role: 'Staff', account_status: 'Approved', first_name: 'General', last_name: 'Staff', email: 'staff@cpams.local', created_at: '2023-02-15T10:30:00Z' },
    { user_id: 3, username: 'customer', role: 'Customer', account_status: 'Approved', first_name: 'John', last_name: 'Doe', email: 'customer@cpams.local', created_at: '2023-03-20T14:20:00Z' },
    { user_id: 4, username: 'janedoe', role: 'Customer', account_status: 'Pending', first_name: 'Jane', last_name: 'Doe', email: 'jane@cpams.local', created_at: new Date().toISOString() },
  ],
  sections: [
    {
        "section_id": 1,
        "section_name": "Private",
        "description": "Private plots",
        "block_count": 1
    },
    {
        "section_id": 2,
        "section_name": "Public",
        "description": "Public plots",
        "block_count": 1
    }
],
  blocks: [
    {
        "block_id": 1,
        "section_id": 1,
        "block_name": "Private-Block",
        "row_count": 1
    },
    {
        "block_id": 2,
        "section_id": 2,
        "block_name": "Public-Block",
        "row_count": 1
    }
],
  plots: [
    {
        "plot_id": 1,
        "block_id": 1,
        "plot_number": "Private-01",
        "plot_type": "Private",
        "price": 150000,
        "status": "Occupied"
    },
    {
        "plot_id": 2,
        "block_id": 1,
        "plot_number": "Private-02",
        "plot_type": "Private",
        "price": 150000,
        "status": "Reserved"
    },
    {
        "plot_id": 3,
        "block_id": 1,
        "plot_number": "Private-03",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 4,
        "block_id": 1,
        "plot_number": "Private-04",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 5,
        "block_id": 1,
        "plot_number": "Private-05",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 6,
        "block_id": 1,
        "plot_number": "Private-06",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 7,
        "block_id": 1,
        "plot_number": "Private-07",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 8,
        "block_id": 1,
        "plot_number": "Private-08",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 9,
        "block_id": 1,
        "plot_number": "Private-09",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 10,
        "block_id": 1,
        "plot_number": "Private-10",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 11,
        "block_id": 1,
        "plot_number": "Private-11",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 12,
        "block_id": 1,
        "plot_number": "Private-12",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 13,
        "block_id": 1,
        "plot_number": "Private-13",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 14,
        "block_id": 1,
        "plot_number": "Private-14",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 15,
        "block_id": 1,
        "plot_number": "Private-15",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 16,
        "block_id": 1,
        "plot_number": "Private-16",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 17,
        "block_id": 1,
        "plot_number": "Private-17",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 18,
        "block_id": 1,
        "plot_number": "Private-18",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 19,
        "block_id": 1,
        "plot_number": "Private-19",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 20,
        "block_id": 1,
        "plot_number": "Private-20",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 21,
        "block_id": 1,
        "plot_number": "Private-21",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 22,
        "block_id": 1,
        "plot_number": "Private-22",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 23,
        "block_id": 1,
        "plot_number": "Private-23",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 24,
        "block_id": 1,
        "plot_number": "Private-24",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 25,
        "block_id": 1,
        "plot_number": "Private-25",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 26,
        "block_id": 1,
        "plot_number": "Private-26",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 27,
        "block_id": 1,
        "plot_number": "Private-27",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 28,
        "block_id": 1,
        "plot_number": "Private-28",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 29,
        "block_id": 1,
        "plot_number": "Private-29",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 30,
        "block_id": 1,
        "plot_number": "Private-30",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 31,
        "block_id": 1,
        "plot_number": "Private-31",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 32,
        "block_id": 1,
        "plot_number": "Private-32",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 33,
        "block_id": 1,
        "plot_number": "Private-33",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 34,
        "block_id": 1,
        "plot_number": "Private-34",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 35,
        "block_id": 1,
        "plot_number": "Private-35",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 36,
        "block_id": 1,
        "plot_number": "Private-36",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 37,
        "block_id": 1,
        "plot_number": "Private-37",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 38,
        "block_id": 1,
        "plot_number": "Private-38",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 39,
        "block_id": 1,
        "plot_number": "Private-39",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 40,
        "block_id": 1,
        "plot_number": "Private-40",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 41,
        "block_id": 1,
        "plot_number": "Private-41",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 42,
        "block_id": 1,
        "plot_number": "Private-42",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 43,
        "block_id": 1,
        "plot_number": "Private-43",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 44,
        "block_id": 1,
        "plot_number": "Private-44",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 45,
        "block_id": 1,
        "plot_number": "Private-45",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 46,
        "block_id": 1,
        "plot_number": "Private-46",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 47,
        "block_id": 1,
        "plot_number": "Private-47",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 48,
        "block_id": 1,
        "plot_number": "Private-48",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 49,
        "block_id": 1,
        "plot_number": "Private-49",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 50,
        "block_id": 1,
        "plot_number": "Private-50",
        "plot_type": "Private",
        "price": 150000,
        "status": "Available"
    },
    {
        "plot_id": 51,
        "block_id": 2,
        "plot_number": "Public-01",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 52,
        "block_id": 2,
        "plot_number": "Public-02",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 53,
        "block_id": 2,
        "plot_number": "Public-03",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 54,
        "block_id": 2,
        "plot_number": "Public-04",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 55,
        "block_id": 2,
        "plot_number": "Public-05",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 56,
        "block_id": 2,
        "plot_number": "Public-06",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 57,
        "block_id": 2,
        "plot_number": "Public-07",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 58,
        "block_id": 2,
        "plot_number": "Public-08",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 59,
        "block_id": 2,
        "plot_number": "Public-09",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 60,
        "block_id": 2,
        "plot_number": "Public-10",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 61,
        "block_id": 2,
        "plot_number": "Public-11",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 62,
        "block_id": 2,
        "plot_number": "Public-12",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 63,
        "block_id": 2,
        "plot_number": "Public-13",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 64,
        "block_id": 2,
        "plot_number": "Public-14",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 65,
        "block_id": 2,
        "plot_number": "Public-15",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 66,
        "block_id": 2,
        "plot_number": "Public-16",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 67,
        "block_id": 2,
        "plot_number": "Public-17",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 68,
        "block_id": 2,
        "plot_number": "Public-18",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 69,
        "block_id": 2,
        "plot_number": "Public-19",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 70,
        "block_id": 2,
        "plot_number": "Public-20",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 71,
        "block_id": 2,
        "plot_number": "Public-21",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 72,
        "block_id": 2,
        "plot_number": "Public-22",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 73,
        "block_id": 2,
        "plot_number": "Public-23",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 74,
        "block_id": 2,
        "plot_number": "Public-24",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 75,
        "block_id": 2,
        "plot_number": "Public-25",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 76,
        "block_id": 2,
        "plot_number": "Public-26",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 77,
        "block_id": 2,
        "plot_number": "Public-27",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 78,
        "block_id": 2,
        "plot_number": "Public-28",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 79,
        "block_id": 2,
        "plot_number": "Public-29",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 80,
        "block_id": 2,
        "plot_number": "Public-30",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 81,
        "block_id": 2,
        "plot_number": "Public-31",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 82,
        "block_id": 2,
        "plot_number": "Public-32",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 83,
        "block_id": 2,
        "plot_number": "Public-33",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 84,
        "block_id": 2,
        "plot_number": "Public-34",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 85,
        "block_id": 2,
        "plot_number": "Public-35",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 86,
        "block_id": 2,
        "plot_number": "Public-36",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 87,
        "block_id": 2,
        "plot_number": "Public-37",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 88,
        "block_id": 2,
        "plot_number": "Public-38",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 89,
        "block_id": 2,
        "plot_number": "Public-39",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 90,
        "block_id": 2,
        "plot_number": "Public-40",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 91,
        "block_id": 2,
        "plot_number": "Public-41",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 92,
        "block_id": 2,
        "plot_number": "Public-42",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 93,
        "block_id": 2,
        "plot_number": "Public-43",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 94,
        "block_id": 2,
        "plot_number": "Public-44",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 95,
        "block_id": 2,
        "plot_number": "Public-45",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 96,
        "block_id": 2,
        "plot_number": "Public-46",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 97,
        "block_id": 2,
        "plot_number": "Public-47",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 98,
        "block_id": 2,
        "plot_number": "Public-48",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 99,
        "block_id": 2,
        "plot_number": "Public-49",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    },
    {
        "plot_id": 100,
        "block_id": 2,
        "plot_number": "Public-50",
        "plot_type": "Public",
        "price": 50000,
        "status": "Available"
    }
],
  reservations: [
    { 
      reservation_id: 1, plot_id: 2, customer_id: 3, reserved_by: 2, 
      reservation_date: '2023-04-10T09:00:00Z', intended_use_date: '2024-12-01', 
      total_price: 150000.00, amount_paid: 50000.00, balance_status: 'Pending Balance',
      customer_name: 'John Doe', plot_number: 'A-02'
    },
    { 
      reservation_id: 2, plot_id: 1, customer_id: 3, reserved_by: 2, 
      reservation_date: '2023-01-15T11:00:00Z', intended_use_date: '2023-01-16', 
      total_price: 150000.00, amount_paid: 150000.00, balance_status: 'Fully Paid',
      customer_name: 'John Doe', plot_number: 'A-01'
    }
  ],
  payments: [
    {
      payment_id: 1, plot_id: 2, customer_id: 3, processed_by: 2,
      payment_type: 'Down Payment', amount_paid: 50000.00, or_number: 'OR-10001',
      payment_date: '2023-04-10T09:05:00Z', customer_name: 'John Doe', plot_number: 'A-02', staff_name: 'General Staff'
    },
    {
      payment_id: 2, plot_id: 1, customer_id: 3, processed_by: 2,
      payment_type: 'Full Payment', amount_paid: 150000.00, or_number: 'OR-10000',
      payment_date: '2023-01-15T11:00:00Z', customer_name: 'John Doe', plot_number: 'A-01', staff_name: 'General Staff'
    }
  ],
  deceased: [
    {
      deceased_id: 1, plot_id: 1, customer_id: 3, registered_by: 2,
      deceased_name: 'Richard Doe', date_of_birth: '1950-05-12', date_of_death: '2023-01-10', date_of_burial: '2023-01-16',
      cause_of_death: 'Natural Causes', notes: '', plot_number: 'A-01', customer_name: 'John Doe'
    }
  ],
  audit_logs: [
    { log_id: 1, action: 'LOGIN', details: 'System Admin logged in', logged_at: new Date().toISOString(), username: 'admin' }
  ]
};

// Auto-increment ID helper
export const generateId = (collection) => {
  if (mockDb[collection].length === 0) return 1;
  return Math.max(...mockDb[collection].map(item => item[Object.keys(item)[0]])) + 1;
};

// Delay helper to simulate network latency
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
