const data = [
  ["ULMIND Profit Sheets"],
  ["Sl No", "Date", "Client Name", "Project Name", "Service Type", "Payment Mode", "Amount", "Net Income", "Payment Status", "Invoice No"],
  [1, "17/11/25", "Milan", "Website", "Domain", "Online", 97, 97, "Paid", 0],
  [2, "21/12/25", "Jamai", "Website", "Domain", "Online", 500, 500, "Paid", 0],
  [3, "21/12/25", "Jamai", "Website", "Domain", "Online", 97, 97, "Paid", 0],
  [4, "23/12/25", "Smart", "Website", "Domain", "Online", 630, 630, "Paid", 0],
  [5, "24/01/26", "Jharkhand", "AWS", "Database", "Online", 385, 385, "Paid", 0, "Total Profit", "Total Cost", "NET Profit"],
  [6, "28/01/26", "Sarva", "MLM", "Website", "Online", 7000, 7000, "Paid", 0, 82762.58, 8639.8, 74072.78],
  [7, "29/01/26", "Sarva", "Domain", "Website", "Online", 90, 90, "Paid", 0]
];

const colCounts = [];
for (let i = 0; i < Math.min(30, data.length); i++) {
  const count = (data[i] || []).filter(c => {
    if (c === undefined || c === null) return false;
    if (typeof c === 'string' && c.replace(/\s+/g, '') === '') return false;
    return true;
  }).length;
  colCounts.push(count);
}

const countsMap = new Map();
colCounts.forEach(c => {
  if (c > 1) { // Ignore single-column rows like main titles
    countsMap.set(c, (countsMap.get(c) || 0) + 1);
  }
});

let mode = 0;
let maxFreq = 0;
countsMap.forEach((freq, count) => {
  if (freq > maxFreq || (freq === maxFreq && count > mode)) {
    maxFreq = freq;
    mode = count;
  }
});

let headerRowIndex = 0;
if (mode > 0) {
  headerRowIndex = colCounts.findIndex(c => c >= mode);
} else {
  let maxCols = 0;
  colCounts.forEach((c, i) => {
    if (c > maxCols) {
      maxCols = c;
      headerRowIndex = i;
    }
  });
}

console.log({
  colCounts,
  mode,
  headerRowIndex,
  headers: data[headerRowIndex]
});
