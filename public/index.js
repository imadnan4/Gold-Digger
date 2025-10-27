// DOM Elements
const displayPrice = document.getElementById('price-display');
const connectionStatus = document.getElementById('connection-status');
const investmentInput = document.getElementById('investment-amount');
const investBtn = document.getElementById('invest-btn');
const investmentSummary = document.getElementById('investment-summary');
const dialog = document.querySelector('dialog');
const dialogButton = dialog.querySelector('button');

let currentPrice = 0;

// Fetch and update live price
async function updatePrice() {
    try {
        const response = await fetch('/price');
        const data = await response.json();
        currentPrice = data.price;
        displayPrice.textContent = currentPrice.toFixed(2);
        connectionStatus.textContent = 'Live Price 🟢';
    } catch (error) {
        console.error('Error fetching price:', error);
        displayPrice.textContent = '----.--';
        connectionStatus.textContent = 'Connection Lost 🔴';
    }
}

// Update price every 2 seconds for live feed
updatePrice();
setInterval(updatePrice, 2000);

// Handle investment form submission
investBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const investment = parseFloat(investmentInput.value);
    
    if (!investment || investment <= 0) {
        alert('Please enter a valid investment amount');
        return;
    }
    
    try {
        const response = await fetch('/investment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ investment })
        });
        
        const data = await response.json();
        
        // Update dialog with purchase details
        investmentSummary.textContent = 
            `You just bought ${data.ounces} ounces (ozt) for £${investment.toFixed(2)}. You will receive documentation shortly.`;
        
        dialog.showModal();
        investmentInput.value = '';
        
    } catch (error) {
        console.error('Error processing investment:', error);
        alert('Error processing investment. Please try again.');
    }
});

// Close dialog
dialogButton.addEventListener('click', () => {
    dialog.close();
});