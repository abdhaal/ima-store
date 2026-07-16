// =========================================================================
// IMA STORE INTERPRISE MULTI-VENDOR CORE LOGIC SCHEMAS ENGINE
// =========================================================================

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL"; 
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; 

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// State tracking configurations cache matrix registers layer modules
let globalCachedProducts = [];

// -------------------------------------------------------------
// CLIENT ROUTER PANEL CONTROLLER ENGINE SWITCHER
// -------------------------------------------------------------
function switchView(viewId) {
    // Structural layouts toggle layers
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');

    // Tab items styling updates loops
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    
    if(viewId === 'storefront-view') document.getElementById('link-store').classList.add('active');
    if(viewId === 'cart-view') document.getElementById('link-cart').classList.add('active');
    if(viewId === 'vendor-view') {
        document.getElementById('link-vendor').classList.add('active');
        executeVendorCoreLedgerProcessing();
    }
    if(viewId === 'admin-view') {
        document.getElementById('link-admin').classList.add('active');
        executeAdminCoreMasterLedgerProcessing();
    }
}

// -------------------------------------------------------------
// FLOW MODULE 1: CUSTOMER CATALOG ENGINE RENDER STORES FRONT
// -------------------------------------------------------------
async function bootstrapCustomerStorefrontCatalog() {
    const grid = document.getElementById('storefront-products-grid');
    if(!grid) return;

    try {
        let { data: products, error } = await supabase.from('products').select('*');
        if (error) throw error;

        globalCachedProducts = products || [];
        grid.innerHTML = '';
        
        // Populate select box inside cart view natively dynamically map rows
        const cartSelect = document.getElementById('cart-product-select');
        if(cartSelect) {
            cartSelect.innerHTML = '';
            globalCachedProducts.forEach(p => {
                let opt = document.createElement('option');
                opt.value = p.id;
                opt.innerText = `${p.name} - (Price: ₹${p.price})`;
                cartSelect.appendChild(opt);
            });
        }

        if(globalCachedProducts.length > 0) {
            globalCachedProducts.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                card.innerHTML = `
                    <img src="${product.image_url || 'https://picsum.photos/200'}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">₹${product.price}</p>
                    <button class="add-to-cart" onclick="triggerImmediateCartIntent(${product.id})"><i class="fa fa-shopping-cart"></i> Buy Product</button>
                `;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding:40px;">No marketplace catalogs found in storage nodes layer.</p>';
        }
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:red; padding:40px;">Database Pipeline Connection Disruption.</p>';
    }
}

function triggerImmediateCartIntent(productId) {
    const cartSelect = document.getElementById('cart-product-select');
    if(cartSelect) {
        cartSelect.value = productId;
        calculateCartPriceSummary();
    }
    switchView('cart-view');
}

function calculateCartPriceSummary() {
    const select = document.getElementById('cart-product-select');
    if(!select || !select.value) return;
    
    const targetProduct = globalCachedProducts.find(p => p.id == select.value);
    if(targetProduct) {
        document.getElementById('billing-subtotal').innerText = `₹${targetProduct.price}`;
        document.getElementById('billing-total').innerText = `₹${targetProduct.price}`;
    }
}

async function executeCheckoutOrder() {
    const select = document.getElementById('cart-product-select');
    const name = document.getElementById('order-cust-name').value.trim();
    const phone = document.getElementById('order-cust-phone').value.trim();
    const address = document.getElementById('order-cust-address').value.trim();

    if(!select.value || !name || !phone || !address) {
        alert("Please specify clean shipping destination properties fields data parameters matrix.");
        return;
    }

    const targetProduct = globalCachedProducts.find(p => p.id == select.value);

    try {
        const { data, error } = await supabase.from('orders').insert([
            {
                customer_name: name,
                customer_phone: phone,
                shipping_address: address,
                product_id: targetProduct.id,
                product_name: targetProduct.name,
                total_amount: parseInt(targetProduct.price),
                order_status: 'Approved'
            }
        ]);

        if (error) throw error;
        
        alert("🎉 Order Placed Successfully at IMA Store! Processing logistics routing.");
        switchView('storefront-view');
        bootstrapCustomerStorefrontCatalog();
    } catch (err) {
        console.error(err);
        alert("Checkout pipeline operations execution halted.");
    }
}

// -------------------------------------------------------------
// FLOW MODULE 2: SELLER ENGINE VENDOR PANEL COMMISSIONS BALANCER 
// -------------------------------------------------------------
async function handleVendorProductUpload() {
    const name = document.getElementById('vp-title').value.trim();
    const price = document.getElementById('vp-price').value.trim();
    const img = document.getElementById('vp-image').value.trim();
    const desc = document.getElementById('vp-desc').value.trim();

    if(!name || !price || !img) {
        alert("Please clarify primary commercial configurations records map variables matrices.");
        return;
    }

    try {
        const { data, error } = await supabase.from('products').insert([
            { name: name, price: parseInt(price), image_url: img, description: desc }
        ]);
        if (error) throw error;

        alert("🚀 Factory catalog system rows added securely.");
        document.getElementById('vp-title').value = '';
        document.getElementById('vp-price').value = '';
        document.getElementById('vp-image').value = '';
        document.getElementById('vp-desc').value = '';
        
        bootstrapCustomerStorefrontCatalog();
        executeVendorCoreLedgerProcessing();
    } catch (err) {
        console.error(err);
    }
}

async function executeVendorCoreLedgerProcessing() {
    const ledger = document.getElementById('vendor-sales-ledger');
    if(!ledger) return;

    try {
        let { data: orders, error: oErr } = await supabase.from('orders').select('*');
        let { data: products, error: pErr } = await supabase.from('products').select('*');

        if(oErr || pErr) throw oErr || pErr;

        document.getElementById('v-metric-products').innerText = products ? products.length : 0;

        let gross = 0;
        ledger.innerHTML = '';

        if(orders && orders.length > 0) {
            orders.forEach(ord => {
                gross += ord.total_amount;
                let commission = Math.round(ord.total_amount * 0.10); // 10% Platform split maths calculation
                let payout = ord.total_amount - commission;

                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>#${ord.id}</td>
                    <td><b>${ord.product_name}</b></td>
                    <td>₹${ord.total_amount}</td>
                    <td style="color:red;">₹${commission}</td>
                    <td style="color:green; font-weight:700;">₹${payout}</td>
                    <td><span class="badge approved">${ord.order_status}</span></td>
                `;
                ledger.appendChild(row);
            });
        } else {
            ledger.innerHTML = '<tr><td colspan="6" style="text-align:center;">No direct ledger entries available.</td></tr>';
        }

        let totalComm = Math.round(gross * 0.10);
        let netPayout = gross - totalComm;

        document.getElementById('v-metric-gross').innerText = `₹${gross}`;
        document.getElementById('v-metric-comm').innerText = `₹${totalComm}`;
        document.getElementById('v-metric-net').innerText = `₹${netPayout}`;

    } catch (err) { console.error(err); }
}

// -------------------------------------------------------------
// FLOW MODULE 3: MASTER ADMIN PANEL GLOBAL DATA SYSTEM TRACKER
// -------------------------------------------------------------
async function executeAdminCoreMasterLedgerProcessing() {
    const ledger = document.getElementById('admin-master-ledger');
    if(!ledger) return;

    try {
        let { data: orders, error } = await supabase.from('orders').select('*');
        if (error) throw error;

        let globalSales = 0;
        let globalRevenue = 0;
        ledger.innerHTML = '';

        if(orders && orders.length > 0) {
            orders.forEach(ord => {
                globalSales += ord.total_amount;
                let platformComm = Math.round(ord.total_amount * 0.10);
                globalRevenue += platformComm;
                let vendorPayout = ord.total_amount - platformComm;

                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>#${ord.id}</td>
                    <td><b>${ord.customer_name}</b><br><small>${ord.customer_phone}</small></td>
                    <td>${ord.product_name}</td>
                    <td style="font-weight:700;">₹${ord.total_amount}</td>
                    <td style="color:var(--primary-blue); font-weight:700;">₹${platformComm}</td>
                    <td style="color:green;">₹${vendorPayout}</td>
                    <td><span class="badge approved">${ord.order_status}</span></td>
                `;
                ledger.appendChild(row);
            });
        } else {
            ledger.innerHTML = '<tr><td colspan="7" style="text-align:center;">No global transactions logs recorded.</td></tr>';
        }

        document.getElementById('a-metric-sales').innerText = `₹${globalSales}`;
        document.getElementById('a-metric-orders').innerText = orders ? orders.length : 0;
        document.getElementById('a-metric-revenue').innerText = `₹${globalRevenue}`;

    } catch (err) { console.error(err); }
}

// -------------------------------------------------------------
// CORE ENGINE BOOTSTRAP INIT EVENT LOAD RUNTIMES
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    bootstrapCustomerStorefrontCatalog();
});
            
