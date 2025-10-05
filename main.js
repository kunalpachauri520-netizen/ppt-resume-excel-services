import './style.css';
import { supabase } from './supabase.js';

const PRICES = {
  'PPT': 12,
  'Resume': 25,
  'Excel Data Entry': 15,
  'YouTube Video Editing': 2000,
  'YouTube Clip': 500
};

let totalPrice = 0;

const elements = {
  orderForm: document.getElementById('orderForm'),
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  service: document.getElementById('service'),
  pages: document.getElementById('pages'),
  design: document.getElementById('design'),
  notes: document.getElementById('notes'),
  deadline: document.getElementById('deadline'),
  totalPrice: document.getElementById('totalPrice'),
  paymentAmount: document.getElementById('paymentAmount'),
  paymentSection: document.getElementById('paymentSection'),
  thankYou: document.getElementById('thankYou'),
  copyBtn: document.getElementById('copyBtn'),
  refreshBtn: document.getElementById('refreshBtn'),
  ordersBody: document.getElementById('ordersBody')
};

function updatePrice() {
  const service = elements.service.value;
  const pages = parseInt(elements.pages.value) || 0;

  if (service === 'YouTube Video Editing') {
    totalPrice = 2000;
    if (pages === 0) {
      elements.pages.value = 1;
    }
  } else {
    totalPrice = (PRICES[service] || 0) * pages;
  }

  elements.totalPrice.textContent = totalPrice;
  elements.paymentAmount.textContent = totalPrice;
}

elements.service.addEventListener('change', updatePrice);
elements.pages.addEventListener('input', updatePrice);

elements.copyBtn.addEventListener('click', async () => {
  const upiId = document.getElementById('upiId').textContent;
  try {
    await navigator.clipboard.writeText(upiId);
    elements.copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      elements.copyBtn.textContent = 'Copy UPI ID';
    }, 2000);
  } catch (err) {
    alert('Failed to copy UPI ID');
  }
});

elements.orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  updatePrice();

  const orderId = 'ORD' + Date.now();

  const orderData = {
    id: orderId,
    name: elements.name.value,
    email: elements.email.value,
    phone: elements.phone.value,
    service: elements.service.value,
    pages: parseInt(elements.pages.value),
    design: elements.design.value,
    notes: elements.notes.value,
    deadline: elements.deadline.value,
    amount: totalPrice,
    status: 'pending'
  };

  try {
    const { error } = await supabase
      .from('orders')
      .insert([orderData]);

    if (error) throw error;

    elements.orderForm.style.display = 'none';
    elements.paymentSection.style.display = 'block';
    elements.thankYou.style.display = 'block';

    setTimeout(() => {
      loadOrders();
    }, 1000);
  } catch (error) {
    console.error('Error saving order:', error);
    alert('Failed to submit order. Please try again.');
  }
});

async function loadOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      elements.ordersBody.innerHTML = '<tr><td colspan="6" class="loading">No orders yet</td></tr>';
      return;
    }

    elements.ordersBody.innerHTML = data.map(order => {
      const date = new Date(order.created_at).toLocaleDateString('en-IN');
      const statusClass = `status-${order.status}`;

      return `
        <tr>
          <td>${order.id}</td>
          <td>${order.name}</td>
          <td>${order.service}</td>
          <td>$${order.amount}</td>
          <td class="${statusClass}">${order.status}</td>
          <td>${date}</td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading orders:', error);
    elements.ordersBody.innerHTML = '<tr><td colspan="6" class="loading">Error loading orders</td></tr>';
  }
}

elements.refreshBtn.addEventListener('click', loadOrders);

updatePrice();
loadOrders();
