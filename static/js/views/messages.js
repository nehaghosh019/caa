/**
 * CampusMart — Messages & Chat View
 */

let activeThreadUserId = null;
let activeThreadProductId = null;

async function renderMessagesView() {
  if (!state.currentUser) {
    showToast('Please log in to view your messages.', 'info');
    window.location.hash = '#/login';
    return;
  }

  const appView = document.getElementById('app-view');
  appView.innerHTML = `
    <div class="container" style="padding: 24px 0 40px;">
      <div style="margin-bottom: 20px;">
        <span class="badge badge-emerald" style="margin-bottom:6px;">Campus Chat</span>
        <h1 style="font-size: 2rem;">Campus Messages</h1>
        <p style="color:var(--text-muted); font-size:0.9rem;">Chat with student buyers and sellers to arrange item inspection and campus handovers.</p>
      </div>

      <div class="messages-container">
        <!-- Sidebar: Conversation Threads -->
        <div class="conversations-sidebar">
          <div class="conversations-header">
            Conversations
          </div>
          <div class="conversations-list" id="convo-threads-list">
            <div class="view-loading" style="padding:40px 10px;"><div class="spinner"></div><p>Loading messages...</p></div>
          </div>
        </div>

        <!-- Right Side: Active Chat Window -->
        <div class="chat-window" id="chat-active-window">
          <div class="empty-state" style="margin:auto; background:none; border:none;">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3 class="empty-title">Select a conversation</h3>
            <p class="empty-subtitle">Choose a thread from the left or contact a seller directly from any product page.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  await loadConversations();
}

async function loadConversations() {
  const listEl = document.getElementById('convo-threads-list');
  if (!listEl) return;

  try {
    const convos = await api.getConversations();

    if (convos.length === 0) {
      listEl.innerHTML = `
        <div style="padding:40px 20px; text-align:center; color:var(--text-muted); font-size:0.88rem;">
          No conversations yet.<br>
          <a href="#/browse" style="color:var(--primary-light); font-weight:600; margin-top:8px; display:inline-block;">Browse listings</a> to contact a student seller.
        </div>
      `;
      return;
    }

    listEl.innerHTML = convos.map((c, index) => {
      const isSelected = (activeThreadUserId === c.other_user_id && activeThreadProductId === c.product_id) || (!activeThreadUserId && index === 0);
      
      // Select the first thread by default if none selected
      if (!activeThreadUserId && index === 0) {
        activeThreadUserId = c.other_user_id;
        activeThreadProductId = c.product_id;
      }

      return `
        <div class="convo-item ${isSelected ? 'active' : ''}" 
             onclick="selectConversationThread(${c.other_user_id}, ${c.product_id}, this)">
          <div class="seller-avatar-mini" style="width:40px; height:40px; font-size:1rem;">
            ${(c.other_user_name || 'S')[0].toUpperCase()}
          </div>
          <div class="convo-details">
            <div class="convo-top-row">
              <span class="convo-user-name">${escapeHtml(c.other_user_name)}</span>
              <span class="convo-time">${formatRelativeDate(c.last_message_time)}</span>
            </div>
            <div class="convo-item-title">Item: ${escapeHtml(c.product_title)} (₹${c.product_price})</div>
            <div class="convo-snippet">${escapeHtml(c.last_message || 'Chat started')}</div>
          </div>
          ${c.unread_count > 0 ? `<span class="badge-count" style="position:static;">${c.unread_count}</span>` : ''}
        </div>
      `;
    }).join('');

    // If we have an active thread, load its messages
    if (activeThreadUserId && activeThreadProductId) {
      loadThreadMessages(activeThreadUserId, activeThreadProductId);
    }
  } catch (err) {
    listEl.innerHTML = `<div style="padding:20px; color:var(--rose);">Failed to load conversations: ${err.message}</div>`;
  }
}

function selectConversationThread(otherUserId, productId, element) {
  activeThreadUserId = otherUserId;
  activeThreadProductId = productId;

  document.querySelectorAll('.convo-item').forEach(el => el.classList.remove('active'));
  element.classList.add('active');

  loadThreadMessages(otherUserId, productId);
}

async function loadThreadMessages(otherUserId, productId) {
  const windowEl = document.getElementById('chat-active-window');
  if (!windowEl) return;

  windowEl.innerHTML = `<div class="view-loading"><div class="spinner"></div><p>Loading messages...</p></div>`;

  try {
    const threadData = await api.getMessages(otherUserId, productId);
    const { product, other_user, messages } = threadData;

    windowEl.innerHTML = `
      <div class="chat-header">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="seller-avatar-mini" style="width:42px; height:42px;">${(other_user.name || 'S')[0].toUpperCase()}</div>
          <div>
            <div style="font-weight:700; font-size:1rem; color:var(--text-primary);">${escapeHtml(other_user.name)}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(other_user.department)} • ${escapeHtml(other_user.year)}</div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:12px;">
          <div style="text-align:right;">
            <a href="#/product/${product.id}" style="font-size:0.85rem; font-weight:700; color:var(--primary-light);" title="View listing">
              ${escapeHtml(product.title)} &rarr;
            </a>
            <div style="font-size:0.8rem; color:#38bdf8; font-weight:800;">₹${Number(product.price).toLocaleString('en-IN')}</div>
          </div>
          <img src="${product.image_url}" style="width:44px; height:44px; border-radius:var(--radius-sm); object-fit:cover;" onerror="this.src='/static/images/categories/other.svg'" />
        </div>
      </div>

      <!-- Messages Body -->
      <div class="chat-messages-body" id="chat-messages-scroll">
        ${messages.map(m => {
          const isSent = m.sender_id === state.currentUser.id;
          return `
            <div class="chat-bubble ${isSent ? 'sent' : 'received'}">
              <div>${escapeHtml(m.content)}</div>
              <div class="chat-msg-time">${formatChatTime(m.created_at)}</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Quick Meetup Suggestions -->
      <div style="padding: 0 24px 8px; display:flex; gap:8px; overflow-x:auto;">
        <button class="prompt-chip" onclick="insertMeetupText('Can we meet at the Central Library today?')">Meet at Library</button>
        <button class="prompt-chip" onclick="insertMeetupText('Is 4:30 PM outside the Student Union good for you?')">4:30 PM Canteen</button>
        <button class="prompt-chip" onclick="insertMeetupText('I can pay in cash or UPI on pickup.')">Cash / UPI ready</button>
      </div>

      <!-- Input Bar -->
      <form class="chat-input-area" onsubmit="event.preventDefault(); sendChatMessage(${other_user.id}, ${product.id});">
        <input type="text" id="chat-text-input" class="form-input" placeholder="Type a message to ${escapeHtml(other_user.name.split(' ')[0])}..." autocomplete="off" required />
        <button type="submit" class="btn btn-primary" id="chat-send-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Send
        </button>
      </form>
    `;

    // Scroll to bottom of chat
    const scrollEl = document.getElementById('chat-messages-scroll');
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;

  } catch (err) {
    windowEl.innerHTML = `<div style="padding:40px; color:var(--rose);">Error loading messages: ${err.message}</div>`;
  }
}

function insertMeetupText(text) {
  const input = document.getElementById('chat-text-input');
  if (input) {
    input.value = text;
    input.focus();
  }
}

async function sendChatMessage(receiverId, productId) {
  const input = document.getElementById('chat-text-input');
  const content = input.value.trim();
  if (!content) return;

  const btn = document.getElementById('chat-send-btn');
  btn.disabled = true;

  try {
    await api.sendMessage(receiverId, productId, content);
    input.value = '';
    // Reload messages
    await loadThreadMessages(receiverId, productId);
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

function formatChatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
