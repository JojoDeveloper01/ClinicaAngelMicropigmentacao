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

  // Recuperar e processar o consentimento armazenado
  const consentDetailsString = localStorage.getItem('cookies-accepted');
  if (consentDetailsString) {
    const consentDetails = JSON.parse(consentDetailsString);
    window.dataLayer.push({
      'event': consentDetails.accepted ? 'cookies-accepted' : 'cookies-rejected',
      'CookieConsent': `advertisement=${consentDetails.advertisement} analytics=${consentDetails.analytics}`
    });
  } else {
    if (noticeCookies && bgCookie) {
      document.body.classList.add("no-scroll");
      noticeCookies.classList.add('active');
      bgCookie.classList.add('active');
    }
  }

  function handleCookieAcceptance(isAccepted: boolean) {
    const consentDetails = {
      accepted: isAccepted,
      advertisement: isAccepted ? 'yes' : 'no',
      analytics: isAccepted ? 'yes' : 'no'
    };

    // Armazenar informações detalhadas sob a chave 'cookies-accepted'
    localStorage.setItem('cookies-accepted', JSON.stringify(consentDetails));

    // Empurrar informações detalhadas para o dataLayer
    window.dataLayer.push({
      'event': isAccepted ? 'cookies-accepted' : 'cookies-rejected',
      'CookieConsent': `advertisement=${consentDetails.advertisement} analytics=${consentDetails.analytics}`
    });

    // Atualizar a interface
    if (noticeCookies && bgCookie) {
      noticeCookies.classList.remove('active');
      bgCookie.classList.remove('active');
      document.body.classList.remove("no-scroll");
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
