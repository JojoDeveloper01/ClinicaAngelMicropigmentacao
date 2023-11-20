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

document.querySelector('form')
  .addEventListener('submit', event => {
    event.preventDefault();

    const data = Object.fromEntries(
      new FormData(event.target)
    )

    const xhr = new XMLHttpRequest();

    // Configurar a requisição
    xhr.open('POST', '/send-email', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Converter o objeto de dados para uma string JSON
    const jsonData = JSON.stringify(data);

    // Enviar a requisição com os dados em JSON
    xhr.send(jsonData);

    // Manipular a resposta do servidor
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Sucesso
          console.log('Requisição bem-sucedida:', xhr.responseText);
        } else {
          // Erro
          console.error('Erro na requisição:', xhr.status);
        }
      }
    }

  });