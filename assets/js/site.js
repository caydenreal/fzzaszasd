// Site JS: theme toggle, dynamic content from localStorage
(function(){
  const year = new Date().getFullYear();
  document.getElementById('year').textContent = year;

  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('site-theme') || 'dark';
  if(savedTheme === 'light') root.setAttribute('data-theme','light');

  themeToggle.addEventListener('click', ()=>{
    const now = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if(now === 'light') root.setAttribute('data-theme','light'); else root.removeAttribute('data-theme');
    localStorage.setItem('site-theme', now);
  });

  // Load editable content (admin writes these keys)
  const defaults = {
    homeTitle: 'Welcome to Fort Zumwalt',
    homeSub: 'Community. Learning. Growth.',
    announcements: [
      {title:'Welcome Back!', body:'School year 2025-2026 is underway. Check events.'},
      {title:'Open House', body:'Join us on September 5th for open house.'}
    ],
    aboutTitle:'About Fort Zumwalt',
    aboutBody:'Fort Zumwalt is committed to excellence in education and community service.',
    contactTitle:'Contact Us',
    contactBody:'For general inquiries, call (555) 555-5555 or email info@fortzumwalt.example'
  };
  const content = JSON.parse(localStorage.getItem('fz_content') || 'null') || defaults;

  document.getElementById('home-title').textContent = content.homeTitle;
  document.getElementById('home-sub').textContent = content.homeSub;
  document.getElementById('about-title')?.replaceWith(document.getElementById('about-title') || document.createElement('h1'));
  if(document.getElementById('about-title')) document.getElementById('about-title').textContent = content.aboutTitle;
  if(document.getElementById('about-body')) document.getElementById('about-body').textContent = content.aboutBody;
  if(document.getElementById('contact-title')) document.getElementById('contact-title').textContent = content.contactTitle;
  if(document.getElementById('contact-body')) document.getElementById('contact-body').textContent = content.contactBody;

  // Announcements render
  const annRoot = document.getElementById('announcements');
  if(annRoot){
    annRoot.innerHTML = '';
    (content.announcements || []).forEach(a=>{
      const c = document.createElement('div'); c.className='card';
      c.innerHTML = '<h3>'+a.title+'</h3><p class="muted">'+a.body+'</p>';
      annRoot.appendChild(c);
    });
  }

  // Contact form — just stores to localStorage (simulates sending)
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const fd = new FormData(form);
      const msg = {name:fd.get('name'), email:fd.get('email'), message:fd.get('message'), date:new Date().toISOString()};
      const msgs = JSON.parse(localStorage.getItem('fz_messages')||'[]');
      msgs.push(msg);
      localStorage.setItem('fz_messages', JSON.stringify(msgs));
      form.reset();
      document.getElementById('contact-status').textContent = 'Message stored (demo).';
    })
  }
})();
