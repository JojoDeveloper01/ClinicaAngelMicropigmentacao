interface Window {
  dataLayer: any[];
}

function gtag(
  p0: string,
  p1: string,
  p2: {
    ad_storage: string;
    ad_user_data: string;
    analytics_storage: string;
  },
) {
  window.dataLayer.push(arguments);
}

document.addEventListener("astro:page-load", () => {
  const $ = document.getElementById.bind(document)
  const btnAcceptCookies = $('btn-accept-cookies')
  const btnAcceptCookies1 = $('btn-accept-cookies1')
  const btnManageCookies = $('btn-manage-cookies')
  const manageCookies = $("manage-Cookies")
  const btnChooseCookies = $('btn-accept-selected-cookies')
  const btnRejectCookies = $('btn-reject-cookies')
  const btnRejectCookies1 = $('btn-reject-cookies1')
  const noticeCookies = $('notice-Cookies')
  const bgCookie = $('bgCookie')

  btnManageCookies?.addEventListener("click", function () {
    if (noticeCookies && manageCookies) {
      noticeCookies.classList.add("max-43")
      // Clear all children except the title
      while (noticeCookies.childNodes.length > 1) {
        noticeCookies.removeChild(noticeCookies.lastChild!);
      }

      // Move children from manage-Cookies to notice-Cookies
      while (manageCookies.firstChild) {
        noticeCookies.appendChild(manageCookies.firstChild);
      }
    }
  });

  document.querySelectorAll(".aside-Consents p").forEach((element) => {
    element.addEventListener("click", function (this: HTMLElement) {
      const targetId = this.getAttribute("data-target");
      if (targetId) {
        document.querySelectorAll(".option").forEach((content) => {
          (content as HTMLElement).style.display = "none";
        });
        ($(targetId) as HTMLElement).style.display = "flex";
      }
    });
  });

  window.dataLayer = window.dataLayer || []

  const consentDetailsString = localStorage.getItem('cookies-accepted');
  if (consentDetailsString) {
    const consentDetails = JSON.parse(consentDetailsString);
    window.dataLayer.push({
      event: consentDetails.accepted ? 'cookies-accepted' : 'cookies-rejected',
      CookieConsent: `advertisement=${consentDetails.advertisement} analytics=${consentDetails.analytics}`
    });
  } else {
    if (noticeCookies && bgCookie) {
      document.body.classList.add("no-scroll");
      noticeCookies.classList.add('active');
      bgCookie.classList.add('active');
    }
  }

  function handleCookieAcceptance(acceptAll: boolean) {
    const consentDetails = {
      accepted: acceptAll,
      advertisement: acceptAll || ($('cookies-behavioral') as HTMLInputElement)?.checked ? 'yes' : 'no',
      analytics: acceptAll || ($('cookies-analytics') as HTMLInputElement)?.checked ? 'yes' : 'no',
    };

    localStorage.setItem('cookies-accepted', JSON.stringify(consentDetails));

    window.dataLayer.push({
      event: consentDetails.accepted ? 'cookies-accepted' : 'cookies-rejected',
      CookieConsent: `advertisement=${consentDetails.advertisement} analytics=${consentDetails.analytics}}`
    });

    if (noticeCookies && bgCookie) {
      noticeCookies.classList.remove('active');
      bgCookie.classList.remove('active');
      document.body.classList.remove("no-scroll");
    }
  }

  [btnAcceptCookies, btnAcceptCookies1].forEach(button => {
    button?.addEventListener('click', () => handleCookieAcceptance(true));
  });

  [btnRejectCookies, btnRejectCookies1].forEach(button => {
    button?.addEventListener('click', () => handleCookieAcceptance(false));
  });

  btnChooseCookies?.addEventListener('click', () => handleCookieAcceptance(false));
})
