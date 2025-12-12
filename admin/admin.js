// Admin panel logic (client-side)
(function(){
  const $ = id => document.getElementById(id);
  const loginPanel = $('login-panel');
  const adminPanel = $('admin-panel');
  const loginBtn = $('login-btn');
  const pwInput = $('pw');
  const loginMsg = $('login-msg');

  function sha256(str){
    // use SubtleCrypto
    const enc = new TextEncoder();
    return crypto.subtle.digest('SHA-256', enc.encode(str)).then(buf=>{
      return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
    });
  }

  loginBtn.addEventListener('click', async ()=>{
    const val = pwInput.value || '';
    const h = await sha256(val);
    if(h === window.ADMIN_CONFIG.password_hash){
      loginPanel.style.display='none'; adminPanel.style.display='block';
      loadContentToForm();
    } else {
      loginMsg.textContent = 'Incorrect password.';
    }
  });

  // content handling
  const defaults = {
    homeTitle: 'Welcome to Fort Zumwalt',
    homeSub: 'Community. Learning. Growth.',
    announcements: [
      {title:'Welcome Back!', body:'School year 2025-2026 is underway. Check events.'}
    ],
    aboutTitle:'About Fort Zumwalt',
    aboutBody:'Fort Zumwalt is committed to excellence in education and community service.',
    contactTitle:'Contact Us',
    contactBody:'For general inquiries, call (555) 555-5555 or email info@fortzumwalt.example'
  };

  function getContent(){ return JSON.parse(localStorage.getItem('fz_content')||'null') || defaults; }
  function saveContent(obj){ localStorage.setItem('fz_content', JSON.stringify(obj)); }

  function loadContentToForm(){
    const c = getContent();
    $('homeTitle').value = c.homeTitle;
    $('homeSub').value = c.homeSub;
    $('aboutTitle').value = c.aboutTitle;
    $('aboutBody').value = c.aboutBody;
    $('contactTitle').value = c.contactTitle;
    $('contactBody').value = c.contactBody;
    $('announcements').value = JSON.stringify(c.announcements, null, 2);
  }

  $('save-content').addEventListener('click', ()=>{
    try{
      const newc = {
        homeTitle:$('homeTitle').value,
        homeSub:$('homeSub').value,
        aboutTitle:$('aboutTitle').value,
        aboutBody:$('aboutBody').value,
        contactTitle:$('contactTitle').value,
        contactBody:$('contactBody').value,
        announcements: JSON.parse($('announcements').value || '[]')
      };
      saveContent(newc);
      alert('Content saved. Open public pages to see updates.');
    }catch(e){ alert('Invalid JSON in announcements.'); }
  });

  $('reset-content').addEventListener('click', ()=>{
    if(confirm('Reset site content to defaults?')){ localStorage.removeItem('fz_content'); loadContentToForm(); alert('Reset.'); }
  });

  $('export-content').addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(getContent(),null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'fz_content.json'; a.click(); URL.revokeObjectURL(url);
  });

  $('import-content').addEventListener('click', ()=>$('import-file').click());
  $('import-file').addEventListener('change', (e)=>{
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=>{ try{ const obj=JSON.parse(reader.result); saveContent(obj); loadContentToForm(); alert('Imported.'); }catch(err){ alert('Invalid JSON file.'); } };
    reader.readAsText(f);
  });

  // messages
  $('load-msgs').addEventListener('click', ()=>{
    const msgs = JSON.parse(localStorage.getItem('fz_messages')||'[]');
    const out = msgs.map(m=>'<div class="card"><strong>'+m.name+'</strong> <span class="muted">('+m.email+')</span><p>'+m.message+'</p><small class="muted">'+m.date+'</small></div>').join('');
    $('messages').innerHTML = out || '<p class="muted">No messages.</p>';
  });
  $('clear-msgs').addEventListener('click', ()=>{ if(confirm('Clear stored messages?')){ localStorage.removeItem('fz_messages'); $('messages').innerHTML=''; } });

  // change pw
  $('change-pw').addEventListener('click', async ()=>{
    const newpw = $('newpw').value || '';
    if(newpw.length < 4){ $('pwmsg').textContent = 'Password too short.'; return; }
    const h = await sha256(newpw);
    // update config.js in client-side only: store in localStorage override
    localStorage.setItem('fz_admin_hash', h);
    // reflect for login: modify ADMIN_CONFIG at runtime
    window.ADMIN_CONFIG.password_hash = h;
    $('pwmsg').textContent = 'Password changed (client-side).';
    $('newpw').value='';
  });

  // allow override from localStorage (so password change persists)
  const storedHash = localStorage.getItem('fz_admin_hash');
  if(storedHash) window.ADMIN_CONFIG.password_hash = storedHash;

  $('logout').addEventListener('click', ()=>{
    adminPanel.style.display='none'; loginPanel.style.display='block'; pwInput.value=''; loginMsg.textContent='';
  });

})();
