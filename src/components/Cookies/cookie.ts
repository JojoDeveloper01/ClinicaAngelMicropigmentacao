interface Window {
  dataLayer: any[];
}

// Certifique-se de definir a função gtag globalmente
function gtag(
  p0: string,
  p1: string,
  p2: {
    ad_storage: string;
    ad_user_data: string;
    ad_personalization: string;
    analytics_storage: string;
    functionality_storage: string;
    personalization_storage: string;
    security_storage: string;
  },
) {
  window.dataLayer.push(arguments);
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
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted',
      'functionality_storage': 'granted',
      'personalization_storage': 'granted',
      'security_storage': 'granted',
    });
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
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted',
        'functionality_storage': 'granted',
        'personalization_storage': 'granted',
        'security_storage': 'granted',
      });
    } else {
      localStorage.setItem('cookies-rejected', 'true');
      localStorage.removeItem('cookies-accepted');
      window.dataLayer.push({ 'event': 'cookies-rejected' });
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'denied',
        'personalization_storage': 'denied',
        'security_storage': 'denied',
      });
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
