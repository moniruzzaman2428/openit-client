// ============================================================
// FILE: src/components/payments/paymentUtils.js
// Shared helpers used by the Admin and Student payment pages
// and by the receipt modal.
// ============================================================

export const METHOD_LABEL = {
  cash: 'Cash',
  bkash: 'bKash',
  nagad: 'Nagad',
  bank: 'Bank Transfer',
};

export const formatCurrency = (value) => {
  const number = Number(value || 0);
  return `৳${number.toLocaleString('en-BD')}`;
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ------------------------------------------------------------
// Amount in words (Bangladeshi numbering: Crore, Lakh, Thousand)
// ------------------------------------------------------------

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
];

const twoDigits = (n) => {
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '');
};

const threeDigits = (n) => {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  return [hundreds ? `${ONES[hundreds]} Hundred` : '', rest ? twoDigits(rest) : '']
    .filter(Boolean)
    .join(' ');
};

export const amountInWords = (value) => {
  const amount = Math.round(Number(value || 0) * 100) / 100;
  const taka = Math.floor(amount);
  const paisa = Math.round((amount - taka) * 100);

  if (!taka && !paisa) return 'Zero Taka Only';

  const units = [
    [10000000, 'Crore'],
    [100000, 'Lakh'],
    [1000, 'Thousand'],
  ];

  let rest = taka;
  const parts = [];

  units.forEach(([size, label]) => {
    const quotient = Math.floor(rest / size);
    if (quotient) {
      parts.push(`${threeDigits(quotient)} ${label}`);
      rest %= size;
    }
  });

  if (rest) parts.push(threeDigits(rest));

  let words = taka ? `${parts.join(' ')} Taka` : '';
  if (paisa) {
    words += `${words ? ' and ' : ''}${twoDigits(paisa)} Paisa`;
  }

  return `${words} Only`;
};
