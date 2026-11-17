/**
 * CampusMart — Sell an Item View
 */

let selectedPresetImage = '/static/images/products/data_structures.svg';

async function renderSellView() {
  if (!state.currentUser) {
    showToast('Please log in to sell items on CampusMart.', 'info');
    window.location.hash = '#/login';
    return;
  }

  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <div class="container">
      <div class="sell-form-card">
        <div style="margin-bottom: 28px; text-align:center;">
          <span class="badge badge-primary" style="margin-bottom:8px;">Campus Seller Portal</span>
          <h1 style="font-size: 2.2rem; margin-bottom: 6px;">Sell an Item on CampusMart</h1>
          <p style="color:var(--text-muted);">List your used or new college essentials for students at your university.</p>
        </div>

        <form id="sell-product-form" onsubmit="event.preventDefault(); submitSellForm();">
          <div class="form-grid">
            <!-- Title -->
            <div class="form-group full-width">
              <label class="form-label">Item Title *</label>
              <input type="text" id="sell-title" class="form-input" 
                     placeholder="e.g. Data Structures Using C (Reema Thareja) or Casio fx-991EX" required />
            </div>

            <!-- Category -->
            <div class="form-group">
              <label class="form-label">Category *</label>
              <select id="sell-category" class="form-input" required onchange="handleSellCategoryChange(this.value)">
                <option value="">Select Category...</option>
                ${state.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
              </select>
            </div>

            <!-- Condition -->
            <div class="form-group">
              <label class="form-label">Condition *</label>
              <select id="sell-condition" class="form-input" required>
                <option value="Brand New">Brand New (Unopened / Unused)</option>
                <option value="Like New" selected>Like New (Barely used, pristine)</option>
                <option value="Good">Good (Minor wear, fully functional)</option>
                <option value="Fair">Fair (Noticeable wear, functional)</option>
              </select>
            </div>

            <!-- Price -->
            <div class="form-group">
              <label class="form-label">Asking Price (₹) *</label>
              <input type="number" id="sell-price" class="form-input" placeholder="e.g. 350" min="1" step="1" required />
            </div>

            <!-- Optional Brand / Publisher -->
            <div class="form-group">
              <label class="form-label">Brand / Publisher (Optional)</label>
              <input type="text" id="sell-brand" class="form-input" placeholder="e.g. Oxford, Casio, Wildcraft, Raymond" />
            </div>

            <!-- Campus Pickup Location -->
            <div class="form-group full-width">
              <label class="form-label">Campus Pickup Location *</label>
              <input type="text" id="sell-location" class="form-input" 
                     placeholder="e.g. Central Library Steps, Hostel Block 4, Cafeteria" required />
              <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px;">
                <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">Campus spots:</span>
                <button type="button" class="quick-chip" onclick="setSellLocation('Central Library Steps')">Library Steps</button>
                <button type="button" class="quick-chip" onclick="setSellLocation('Student Union Canteen')">Canteen</button>
                <button type="button" class="quick-chip" onclick="setSellLocation('Hostel Block 4')">Hostel 4</button>
                <button type="button" class="quick-chip" onclick="setSellLocation('Main Academic Block')">Main Block</button>
                <button type="button" class="quick-chip" onclick="setSellLocation('Mechanical Workshop')">Workshop</button>
              </div>
            </div>

            <!-- Description -->
            <div class="form-group full-width">
              <label class="form-label">Description *</label>
              <textarea id="sell-description" class="form-input" rows="4" 
                        placeholder="Mention the edition, semester used, highlight key features, note any pen marks or missing parts..." required></textarea>
            </div>

            <!-- Product Image Selection -->
            <div class="form-group full-width">
              <label class="form-label">Product Image *</label>
              
              <!-- Tabs / Options for image -->
              <div class="image-preset-picker">
                <span class="preset-label">Choose from high-quality campus presets, or upload a photo:</span>
                <div class="preset-chips-grid">
                  <div class="preset-chip-btn selected" onclick="selectPresetImage('/static/images/products/data_structures.svg', this)">
                    <img src="/static/images/products/data_structures.svg" class="preset-chip-img" />
                    <div class="preset-chip-name">Data Structures</div>
                  </div>
                  <div class="preset-chip-btn" onclick="selectPresetImage('/static/images/products/eng_maths.svg', this)">
                    <img src="/static/images/products/eng_maths.svg" class="preset-chip-img" />
                    <div class="preset-chip-name">Eng. Maths</div>
                  </div>
                  <div class="preset-chip-btn" onclick="selectPresetImage('/static/images/products/calculator.svg', this)">
                    <img src="/static/images/products/calculator.svg" class="preset-chip-img" />
                    <div class="preset-chip-name">Calculator</div>
                  </div>
                  <div class="preset-chip-btn" onclick="selectPresetImage('/static/images/products/lab_coat.svg', this)">
                    <img src="/static/images/products/lab_coat.svg" class="preset-chip-img" />
                    <div class="preset-chip-name">Lab Coat</div>
                  </div>
                  <div class="preset-chip-btn" onclick="selectPresetImage('/static/images/products/drawing_board.svg', this)">
                    <img src="/static/images/products/drawing_board.svg" class="preset-chip-img" />
                    <div class="preset-chip-name">Drawing Board</div>
                  </div>
                  <div class="preset-chip-btn" onclick="selectPresetImage('/static/images/products/backpack.svg', this)">
                    <img src="/static/images/products/backpack.svg" class="preset-chip-img" />
                    <div class="preset-chip-name">Backpack</div>
                  </div>
                  <div class="preset-chip-btn" onclick="selectPresetImage('/static/images/products/arduino_kit.svg', this)">
                    <img src="/static/images/products/arduino_kit.svg" class="preset-chip-img" />
                    <div class="preset-chip-name">Arduino Kit</div>
                  </div>
                  <div class="preset-chip-btn" onclick="selectPresetImage('/static/images/products/kettle.svg', this)">
                    <img src="/static/images/products/kettle.svg" class="preset-chip-img" />
                    <div class="preset-chip-name">Hostel Kettle</div>
                  </div>
                </div>

                <!-- Custom Upload Input -->
                <div style="margin-top: 14px; display:flex; align-items:center; gap:12px;">
                  <span style="font-size:0.85rem; color:var(--text-muted);">Or upload your own image:</span>
                  <input type="file" id="sell-custom-file" accept="image/*" onchange="handleCustomFileUpload(event)" style="font-size:0.85rem;" />
                </div>
                <input type="hidden" id="sell-final-image-url" value="/static/images/products/data_structures.svg" />
              </div>
            </div>

            <!-- Contact Preference -->
            <div class="form-group full-width">
              <label class="form-label">Contact Preference</label>
              <div style="display:flex; gap:16px; flex-wrap:wrap;">
                <label class="checkbox-item">
                  <input type="radio" name="contact-pref" value="Chat" checked />
                  <span>CampusMart In-App Chat (Recommended)</span>
                </label>
                <label class="checkbox-item">
                  <input type="radio" name="contact-pref" value="WhatsApp" />
                  <span>WhatsApp</span>
                </label>
                <label class="checkbox-item">
                  <input type="radio" name="contact-pref" value="Phone" />
                  <span>Phone Call</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div style="margin-top: 32px; display:flex; justify-content:flex-end; gap:12px;">
            <a href="#/browse" class="btn btn-secondary">Cancel</a>
            <button type="submit" id="btn-publish-listing" class="btn btn-primary btn-lg">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function setSellLocation(loc) {
  document.getElementById('sell-location').value = loc;
}

function selectPresetImage(url, chipElement) {
  document.querySelectorAll('.preset-chip-btn').forEach(el => el.classList.remove('selected'));
  chipElement.classList.add('selected');
  document.getElementById('sell-final-image-url').value = url;
  selectedPresetImage = url;
}

async function handleCustomFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  showToast('Uploading custom image...', 'info');
  try {
    const res = await api.uploadFile(file);
    document.getElementById('sell-final-image-url').value = res.url;
    document.querySelectorAll('.preset-chip-btn').forEach(el => el.classList.remove('selected'));
    showToast('Custom photo uploaded!', 'success');
  } catch (err) {
    showToast(`Upload failed: ${err.message}`, 'error');
  }
}

function handleSellCategoryChange(category) {
  // Suggest a preset image based on selected category if desired
  const catSlug = category.toLowerCase().replace(/ & /g, '_and_').replace(/ /g, '_');
  const catImage = `/static/images/categories/${catSlug}.svg`;
  // If user hasn't explicitly picked a photo, we can default to category vector
}

async function submitSellForm() {
  const title = document.getElementById('sell-title').value.trim();
  const category = document.getElementById('sell-category').value;
  const condition = document.getElementById('sell-condition').value;
  const price = document.getElementById('sell-price').value;
  const brand = document.getElementById('sell-brand').value.trim();
  const location = document.getElementById('sell-location').value.trim();
  const description = document.getElementById('sell-description').value.trim();
  const imageUrl = document.getElementById('sell-final-image-url').value;
  const contactPref = document.querySelector('input[name="contact-pref"]:checked')?.value || 'Chat';

  if (!title || !category || !condition || !price || !location || !description) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const publishBtn = document.getElementById('btn-publish-listing');
  publishBtn.disabled = true;
  publishBtn.textContent = 'Publishing to Campus...';

  try {
    const res = await api.createProduct({
      title,
      category,
      condition,
      price: parseFloat(price),
      brand,
      location,
      description,
      image_url: imageUrl,
      contact_pref: contactPref
    });

    showToast('🎉 Your listing is live on CampusMart!', 'success');
    window.location.hash = `#/product/${res.product_id}`;
  } catch (err) {
    showToast(err.message, 'error');
    publishBtn.disabled = false;
    publishBtn.textContent = 'Publish Listing';
  }
}
