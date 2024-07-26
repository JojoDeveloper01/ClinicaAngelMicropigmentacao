interface Window {
  dataLayer: any[];

}

function gtag(
  p0: string,
  p1: string,
  p2: {
    ad_storage: string;
    ad_user_data: string;
    ad_personalization: string;
    analytics_storage: string;
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

  if (localStorage.getItem('cookies-accepted') === null) {
    if (noticeCookies && bgCookie) {
      document.body.classList.add("no-scroll");
      noticeCookies.classList.add('active');
      bgCookie.classList.add('active');
    }
  } else {
    const cookiesAccepted = localStorage.getItem('cookies-accepted') === 'true';
    window.dataLayer.push({
      'event': cookiesAccepted ? 'cookies-accepted' : 'cookies-rejected',
      'CookieConsent': cookiesAccepted ? 'advertisement=yes analytics=yes' : 'advertisement=no analytics=no'
    });
  }

  function handleCookieAcceptance(isAccepted: boolean) {
    if (noticeCookies && bgCookie) {
      noticeCookies.classList.remove('active');
      bgCookie.classList.remove('active');
      document.body.classList.remove("no-scroll");
    }

    localStorage.setItem('cookies-accepted', isAccepted.toString());
    window.dataLayer.push({
      'event': isAccepted ? 'cookies-accepted' : 'cookies-rejected',
      'CookieConsent': isAccepted ? 'advertisement=yes analytics=yes' : 'advertisement=no analytics=no'
    });
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
