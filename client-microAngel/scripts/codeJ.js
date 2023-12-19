
function nextSlide() {
  const controlNext = document.querySelector(".carousel-control-next");
  const controlNext1 = document.querySelector(".ccn");
  const controlNext2 = document.querySelector(".ccn1");
  controlNext.click();
  controlNext1.click();
  controlNext2.click();
}

setInterval(nextSlide, 6000);

function showPanel(element) {
  var panel = document.querySelector(".sideBar");

  element.style.display = "block";
  panel.style.display = "block";
  panel.style.animation = 'openPanel 0.5s forwards';
}

function quitPanel(element) {
  var panel = document.querySelector(".sideBar");

  panel.style.animation = 'closePanel 0.5s forwards';
  setTimeout(function () {
    panel.style.display = "none";
  }, 500);
  setTimeout(function () {
    element.style.display = "none";
  }, 150);

}

function exitdistorted() {
  var exitD = document.querySelector('.distorted');

  exitD.style.display = "none";
  quitPanel(exitD);
}

function screenSizePC() {
  if (window.innerWidth >= 992) {
    quitPanel(document.querySelector('.distorted'));
  }
}

window.onload = screenSizePC;
window.onresize = screenSizePC;


function toggleDropdown(className, element) {
  var dropdownList = document.getElementsByClassName(className);

  for (var i = 0; i < dropdownList.length; i++) {
    var dropdown = dropdownList[i];

    if (dropdown.classList.contains('open')) {
      dropdown.style.maxHeight = '0';
      dropdown.classList.remove('open');
    } else {
      dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
      dropdown.classList.add('open');
    }
  }

  element.classList.toggle('rotated');
}

function open_close(style, object) {
  if (style.display === 'none') {
    object.style.display = 'block';
  } else {
    setTimeout(function () {
      object.style.display = 'none';
    }, 500);
  }
}


function ser(className, element) {
  var object = document.querySelector(".dropdown1");
  var style = window.getComputedStyle(object);

  open_close(style, object);

  toggleDropdown(className, element);

  element.classList.toggle('open');
}


function blog(className, element) {
  var object = document.querySelector(".dropdown2");
  var style = window.getComputedStyle(object);

  open_close(style, object);

  toggleDropdown(className, element);

  element.classList.toggle('open');
}

function loja(className, element) {
  var object = document.querySelector(".dropdown3");
  var style = window.getComputedStyle(object);

  open_close(style, object);

  toggleDropdown(className, element);

  element.classList.toggle('open');
}

function ask(className, element) {
  var object = document.querySelector(".dropdown4");
  var style = window.getComputedStyle(object);

  open_close(style, object);

  toggleDropdown(className, element);

  element.classList.toggle('open');
}

function pre_fq(className, element) {
  var object = document.querySelector(".fq-vermais");
  var style = window.getComputedStyle(object);

  open_close(style, object);

  toggleDropdown(className, element);

  element.classList.toggle('open');
}

function showDropdown(className) {
  var dropdown = document.querySelector('.' + className);
  dropdown.style.display = 'flex';
}

function hideDropdown(className) {
  var dropdown = document.querySelector('.' + className);
  dropdown.style.display = 'none';
}

var btTop = document.getElementById("bt-top");

window.onscroll = function () {
  if (document.documentElement.scrollTop > 150) {
    document.querySelector(".bt-top")
    btTop.style.display = "block";
  }
  else {
    document.querySelector(".bt-top")
    btTop.style.display = "none";
  }
}

btTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

function openChat() {
  var open = document.querySelector(".boxChat");

  open.style.display = "block";
}

function quitChat() {
  var quit = document.querySelector(".boxChat");

  setTimeout(function () {
    quit.style.display = "none";
  }, 100);

}

const buttonForm = document.querySelector(".contact-form form button");
if (buttonForm) {
  document.querySelector('form').addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const telemovel = document.getElementById("telemovel").value;
  const mensagem = document.getElementById("mensagem").value;

  let it_works = true;

  clearAlerts();

  if (!nome) {
    it_works = false;
    displayAlert("nomeAlert");
  }

  if (!mensagem) {
    it_works = false;
    displayAlert("mensagemAlert");
  }

  if (!telemovel && !email) {
    it_works = false;
    displayAlert("telemovelAlert");
    displayAlert("emailAlert");
  }

  if (telemovel && !isValidPhoneNumber(telemovel)) {
    it_works = false;
    displayAlert("formatTelemovel");
  }

  if (email && !isValidEmail(email)) {
    it_works = false;
    displayAlert("formatEmail");
  }

  if (it_works === true) {
    const data = Object.fromEntries(new FormData(event.target));
    sendFormData(data);
    const inputs = document.querySelectorAll('.contact-form form input');

    inputs.forEach(input => {
      input.value = '';
    });

    document.querySelector('.contact-form form textarea').value = '';
  }
}

function sendFormData(data) {
  const xhr = new XMLHttpRequest();

  xhr.open('POST', '/send-email', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  const jsonData = JSON.stringify(data);

  xhr.send(jsonData);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      handleResponse(xhr.status, xhr.responseText);
    }
  };
}

function handleResponse(status, responseText) {
  if (status === 200) {
    buttonForm.style.backgroundColor = '#38d391';
    buttonForm.style.transition = 'background-color 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
    displayAlert('sucessAlert')
    console.log('Requisição bem-sucedida:', responseText);
  } else {
    buttonForm.style.backgroundColor = '#ff0050';
    buttonForm.style.transition = 'background-color 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
    displayAlert('errorAlert')
    console.error('Erro na requisição:', status);
  }
}

function displayAlert(alertId) {
  document.getElementById(alertId).style.display = "block";
}

function clearAlerts() {
  const alerts = document.getElementsByClassName("customAlert");
  for (const alert of alerts) {
    alert.style.display = "none";
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(telefone) {
  const numeroRegex = /^\d+$/;
  return numeroRegex.test(telefone);
}

if (buttonForm) {
  buttonForm.addEventListener("blur", function () {
    this.style.backgroundColor = '';
    this.style.transition = '';
  });
}

function creditos() {
  const panel = document.querySelector(".creditos-section");
  panel.style.display = "block";
}