interface Window {
  dataLayer: any[];
}

document.addEventListener("astro:page-load", () => {
  const $ = document.getElementById.bind(document);
  const btnAcceptCookies = $('btn-accept-cookies');
  const btnRejectCookies = $('btn-reject-cookies');
  const noticeCookies = $('notice-Cookies');
  const bgCookie = $('bgCookie');

  window.dataLayer = window.dataLayer || [];

  if (!localStorage.getItem('cookies-rejected') && !localStorage.getItem('cookies-accepted')) {
    if (noticeCookies && bgCookie) {
      document.body.classList.add("no-scroll");
      noticeCookies.classList.add('active');
      bgCookie.classList.add('active');
    }
  } else if (localStorage.getItem('cookies-accepted')) {
    window.dataLayer.push({ 'event': 'cookies-accepted' });
  }

  function handleCookieAcceptance(isAccepted: boolean) {
    if (noticeCookies && bgCookie) {
      noticeCookies.classList.remove('active');
      bgCookie.classList.remove('active');
      document.body.classList.remove("no-scroll");
    }

    if (isAccepted) {
      localStorage.setItem('cookies-accepted', 'true');
      localStorage.removeItem('cookies-rejected');
      window.dataLayer.push({ 'event': 'cookies-accepted' });
    } else {
      localStorage.setItem('cookies-rejected', 'true');
      localStorage.removeItem('cookies-accepted');
      window.dataLayer.push({ 'event': 'cookies-rejected' });
    }
  }

  if (btnAcceptCookies) {
    btnAcceptCookies.addEventListener('click', () => {
      handleCookieAcceptance(true);
    });
  }

  if (btnRejectCookies) {
    btnRejectCookies.addEventListener('click', () => {
      handleCookieAcceptance(false);
    });
  }
});
