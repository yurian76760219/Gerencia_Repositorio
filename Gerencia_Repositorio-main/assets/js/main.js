// ===== NOISE OVERLAY =====
document.body.insertAdjacentHTML('afterbegin', '<div class="noise"></div>');

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== HAMBURGER =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));
document.addEventListener('click', (e) => {
  if (!navbar?.contains(e.target)) navLinks?.classList.remove('open');
});

// ===== PARTICLES (subtle, gold & blue tones) =====
(function createParticles() {
  const colors = ['rgba(201,146,42,0.5)', 'rgba(26,63,111,0.4)', 'rgba(232,184,75,0.4)', 'rgba(74,144,217,0.3)'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1.5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}vw;
      background:${color};
      animation-duration:${Math.random()*20+14}s;
      animation-delay:${Math.random()*15}s;
      filter:blur(0.5px);
      border-radius:${Math.random()>0.5?'2px;transform:rotate(45deg)':'50%'};
    `;
    document.body.appendChild(p);
  }
})();

// ===== PROGRESS BARS =====
window.addEventListener('load', () => {
  document.querySelectorAll('.progress-fill[data-progress]').forEach(el => {
    const val = el.dataset.progress;
    setTimeout(() => el.style.width = val + '%', 300);
  });
  document.querySelectorAll('.course-progress-fill').forEach((el, i) => {
    const vals = [100, 65, 40, 10];
    setTimeout(() => el.style.width = (vals[i] || 0) + '%', 500 + i*150);
  });
});

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.unit-card, .course-card, .contact-info-card, .contact-form-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `all 0.5s ease ${i * 0.1}s`;
  revealObs.observe(el);
});

// ===== COUNTER ANIMATION =====
window.addEventListener('load', () => {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = target / 50;
    const t = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current) + suffix;
      if (current >= target) clearInterval(t);
    }, 25);
  });
});

// ===== TOAST =====
let toastTimer;
function showToast(msg, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  const icon = type === 'success' ? '✅' : '❌';
  toast.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  toast.className = `toast ${type}`;
  clearTimeout(toastTimer);
  setTimeout(() => toast.classList.add('show'), 10);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ===== GLOBAL FILE MODAL =====
function createModal() {
  if (document.getElementById('globalModal')) return;
  const m = document.createElement('div');
  m.id = 'globalModal';
  m.className = 'modal';
  m.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <span class="modal-title" id="modalTitle">Archivo</span>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body" id="modalBody"></div>
    </div>
  `;
  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) closeModal(); });
}

function openFileModal(title, content, type) {
  createModal();
  document.getElementById('modalTitle').textContent = title.toUpperCase();
  const body = document.getElementById('modalBody');
  body.innerHTML = '';
  if (type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = content;
    body.appendChild(img);
  } else if (type === 'application/pdf') {
    body.innerHTML = `<iframe src="${content}" style="width:100%;height:100%;border:none;border-radius:8px;"></iframe>`;
  } else {
    body.innerHTML = `<div class="modal-unsupported"><span>📄</span><p>No hay previsualización disponible<br>para este tipo de archivo.</p></div>`;
  }
  document.getElementById('globalModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const m = document.getElementById('globalModal');
  if (m) {
    m.classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('modalBody').innerHTML = '';
  }
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== FILE EMOJI BY TYPE =====
function fileEmoji(type, name) {
  if (type.startsWith('image/')) return '🖼️';
  if (type === 'application/pdf') return '📄';
  if (type.includes('word')) return '📝';
  if (type.includes('zip') || type.includes('rar')) return '🗜️';
  if (type.includes('video')) return '🎬';
  if (type.includes('audio')) return '🎵';
  if (name.endsWith('.pptx') || name.endsWith('.ppt')) return '📊';
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return '📈';
  return '📁';
}

// ===== FILE STORAGE KEY =====
function storageKey(page, week) { return `porto_yurian_${page}_w${week}`; }

// ===== SAVE FILE =====
function saveFile(page, week, file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = { id: Date.now(), name: file.name, type: file.type, size: file.size, content: e.target.result };
      const key = storageKey(page, week);
      let list = [];
      try { list = JSON.parse(localStorage.getItem(key)) || []; } catch {}
      list.push(data);
      try {
        localStorage.setItem(key, JSON.stringify(list));
        resolve(data);
      } catch {
        reject('Archivo demasiado grande para almacenamiento local.');
      }
    };
    reader.onerror = () => reject('Error al leer el archivo.');
    reader.readAsDataURL(file);
  });
}

// ===== DELETE FILE =====
function deleteFile(page, week, id) {
  const key = storageKey(page, week);
  let list = [];
  try { list = JSON.parse(localStorage.getItem(key)) || []; } catch {}
  list = list.filter(f => f.id !== id);
  localStorage.setItem(key, JSON.stringify(list));
}

// ===== GET FILES =====
function getFiles(page, week) {
  try { return JSON.parse(localStorage.getItem(storageKey(page, week))) || []; } catch { return []; }
}

// ===== RENDER FILE LIST =====
function renderFileList(page, week, container) {
  const files = getFiles(page, week);
  container.innerHTML = '';
  files.forEach(f => {
    const item = document.createElement('div');
    item.className = 'file-item';
    const shortName = f.name.length > 22 ? f.name.substring(0, 20) + '...' : f.name;
    item.innerHTML = `
      <span class="file-emoji">${fileEmoji(f.type, f.name)}</span>
      <span class="file-name" title="${f.name}">${shortName}</span>
      <div class="file-actions">
        <button class="file-btn file-btn-view" title="Ver archivo" onclick="openFileModal('${f.name.replace(/'/g,"\\'")}', this.closest('.file-item').dataset.content, this.closest('.file-item').dataset.type)">👁️</button>
        <button class="file-btn file-btn-del" title="Eliminar archivo" onclick="handleDelete('${page}', ${week}, ${f.id}, this)">🗑️</button>
      </div>
    `;
    item.dataset.content = f.content;
    item.dataset.type = f.type;
    container.appendChild(item);
  });
}

function handleDelete(page, week, id, btn) {
  const item = btn.closest('.file-item');
  item.style.transform = 'translateX(20px)';
  item.style.opacity = '0';
  item.style.transition = 'all 0.3s';
  setTimeout(() => {
    deleteFile(page, week, id);
    const container = item.parentElement;
    renderFileList(page, week, container);
    showToast('Archivo eliminado', 'error');
  }, 300);
}

// ===== INIT UPLOAD ZONES =====
function initUploadZone(page, week, zoneEl, listEl) {
  renderFileList(page, week, listEl);

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.mp4,.mp3';
  input.style.display = 'none';
  document.body.appendChild(input);

  zoneEl.addEventListener('click', () => input.click());
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    input.value = '';
    try {
      await saveFile(page, week, file);
      renderFileList(page, week, listEl);
      showToast(`✔ ${file.name.substring(0, 20)} cargado`, 'success');
    } catch (err) {
      showToast(err, 'error');
    }
  });

  zoneEl.addEventListener('dragover', e => { e.preventDefault(); zoneEl.classList.add('dragover'); });
  zoneEl.addEventListener('dragleave', () => zoneEl.classList.remove('dragover'));
  zoneEl.addEventListener('drop', async e => {
    e.preventDefault(); zoneEl.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    try {
      await saveFile(page, week, file);
      renderFileList(page, week, listEl);
      showToast(`✔ ${file.name.substring(0, 20)} cargado`, 'success');
    } catch (err) {
      showToast(err, 'error');
    }
  });
}

// ===== FORM SUBMIT =====
const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-primary');
  btn.textContent = '✅ ¡Mensaje enviado!';
  btn.style.background = 'linear-gradient(135deg, #2d7a4f, #1a5c38)';
  setTimeout(() => {
    btn.textContent = '📨 Enviar Mensaje';
    btn.style.background = '';
    contactForm.reset();
  }, 3000);
});
