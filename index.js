// =========================================================================
// IMA STORE MULTI-VENDOR CORE LOGIC LAYER - ADMIN ISOLATION BALANCER
// =========================================================================

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL"; 
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; 

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let globalCachedProducts = [];

// SECURE DOORWAY: URL-la "?role=admin" endru irundhaal mattumae Admin View unlock aagum
function enforceEcosystemSecurityProtocols() {
    const params = new URLSearchParams(window.location.search);
    const userRole = params.get('role');
    const adminTabElement = document.getElementById('tab-admin');

    if(userRole === 'admin') {
        if(adminTabElement) adminTabElement.classList.remove('hidden-admin-node');
        console.log("IMA Store Admin Node Decoupled & Authenticated.");
    } else {
        if(adminTabElement) adminTabElement.classList.add('hidden-admin-node');
        // Accident-ah direct function hit panna storefront-ku reroute aagividum
        if(document.getElementById('admin-view').classList.contains('active')) {
            switchView('storefront-view');
        }
    }
}

function switchView(viewId) {
    // Force validation check before loading view elements block logic loops
    if(viewId === 'admin-view') {
        const params = new URLSearchParams(window.location.search);
        if(params.get('role') !== 'admin') {
            alert("Unauthorized Access Attempt.");
            return;
        }
    }

    document.querySelectorAll('.view-section').forEach(section => section.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');

    document.querySelectorAll('.panel-tab').forEach(tab => tab.classList.remove('active'));
    
    if(viewId === 'storefront-view') document.getElementById('tab-store').classList.add('active');
    if(viewId === 'cart-view') {
        // Clear active styles when on hidden cart node wrapper
    }
    if(viewId === 'vendor-view') {
        document.getElementById('tab-vendor').classList.add('active');
        executeVendorCoreLedgerProcessing();
    }
    if(viewId === 'admin-view') {
        document.getElementById('tab-admin').classList.add('active');
        executeAdminCoreMasterLedgerProcessing();
    }
}

// -------------------------------------------------------------
// CORE REVENUE OPERATIONS ENGINE MECHANICS (10% SPLITTING SYSTEM)
// -------------------------------------------------------------
async function bootstrapCustomerStorefrontCatalog() {
    const grid = document.getElementById('storefront-products-grid');
    if(!grid) return;

    try {
        let { data: products, error } = await supabase.from('products').select('*');
        if (error) throw error;

        globalCachedProducts = products || [];
        grid.innerHTML = '';
        
        const cartSelect = document.getElementById('cart-product-select');
        if(cartSelect) {
            cartSelect.innerHTML = '';
            globalCachedProducts.forEach(p => {
                let opt = document.createElement('option');
                opt.value = p.id;
                opt.innerText = `${p.name} - (₹${p.price})`;
                cartSelect.appendChild(opt);
            });
        }

        if(globalCachedProducts.length > 0) {
            globalCachedProducts.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-clean-card');
                card.innerHTML = `
                    <div class="product-img-wrapper">
                        <img src="${product.image_url || 'https://picsum.photos/200'}" alt="${product.name}">
                    </div>
                    <div class="product-details-box">
                        <h3>${product.name}</h3>
                        <div class="product-price-row">
                            <span class="act-price">₹${product.price}</span>
                        </div>
                        <button class="buy-action-btn" onclick="triggerImmediateCartIntent(${product.id})">Buy Product</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding:40px;">No marketplace dynamic entries found.</p>';
        }
    } catch (err) { console.error(err); }
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
        alert("Please completely fill shipping target metrics.");
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
        
        alert("🎉 Order Placed Successfully! (Cash on Delivery confirmed)");
        switchView('storefront-view');
        bootstrapCustomerStorefrontCatalog();
    } catch (err) { alert("Checkout disruption."); }
}

async function handleVendorProductUpload() {
    const name = document.getElementById('vp-title').value.trim();
    const price = document.getElementById('vp-price').value.trim();
    const img = document.getElementById('vp-image').value.trim();
    const desc = document.getElementById('vp-desc').value.trim();

    if(!name || !price || !img) {
        alert("Please set core listing dynamic properties map variables.");
        return;
    }

    try {
        const { data, error } = await supabase.from('products').insert([
            { name: name, price: parseInt(price), image_url: img, description: desc }
        ]);
        if (error) throw error;

        alert("🚀 Sourcing Catalog published securely.");
        document.getElementById('vp-title').value = '';
        document.getElementById('vp-price').value = '';
        document.getElementById('vp-image').value = '';
        document.getElementById('vp-desc').value = '';
        
        bootstrapCustomerStorefrontCatalog();
        executeVendorCoreLedgerProcessing();
    } catch (err) { console.error(err); }
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
                let commission = Math.round(ord.total_amount * 0.10);
                let payout = ord.total_amount - commission;

                let row = document.createElement('tr');
                row.innerHTML = `
                    <td>#${ord.id}</td>
                    <td><b>${ord.product_name}</b></td>
                    <td>₹${ord.total_amount}</td>
                    <td style="color:#ef4444;">₹${commission}</td>
                    <td style="color:var(--success-green); font-weight:700;">₹${payout}</td>
                    <td><span class="status-tag success">${ord.order_status}</span></td>
                `;
                ledger.appendChild(row);
            });
        } else {
            ledger.innerHTML = '<tr><td colspan="6" style="text-align:center;">No factory sales metrics rows inside stack.</td></tr>';
        }

        let totalComm = Math.round(gross * 0.10);
        let netPayout = gross - totalComm;

        document.getElementById('v-metric-gross').innerText = `₹${gross}`;
        document.getElementById('v-metric-comm').innerText = `₹${totalComm}`;
        document.getElementById('v-metric-net').innerText = `₹${netPayout}`;

    } catch (err) { console.error(err); }
}

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
                    <td style="color:var(--brand-blue); font-weight:700;">₹${platformComm}</td>
                    <td style="color:var(--success-green);">₹${vendorPayout}</td>
                    <td><span class="status-tag success">${ord.order_status}</span></td>
                `;
                ledger.appendChild(row);
            });
        }

        document.getElementById('a-metric-sales').innerText = `₹${globalSales}`;
        document.getElementById('a-metric-orders').innerText = orders ? orders.length : 0;
        document.getElementById('a-metric-revenue').innerText = `₹${globalRevenue}`;

    } catch (err) { console.error(err); }
}

document.addEventListener('DOMContentLoaded', () => {
    enforceEcosystemSecurityProtocols();
    bootstrapCustomerStorefrontCatalog();
});
