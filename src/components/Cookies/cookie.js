document.addEventListener("astro:page-load", () => {
  const btnAcceptCookies = document.getElementById('btn-accept-cookies');
  const noticeCookies = document.getElementById('notice-Cookies');
  dataLayer = [];

  if (!localStorage.getItem('cookies-aceptadas')) {
    noticeCookies.classList.add('active');
  } else {
    dataLayer.push({ 'event': 'cookies-aceptadas' });
  }

  btnAcceptCookies.addEventListener('click', () => {
    noticeCookies.classList.remove('active');
    localStorage.setItem('cookies-aceptadas', true);
    dataLayer.push({ 'event': 'cookies-aceptadas' });
  });
});