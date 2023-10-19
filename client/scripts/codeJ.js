//Observer

//import { console } from "console";

/*const fickleAni = document.querySelectorAll("picture");

function fickleAnimation(entries) {
  entries.forEach(entry => {
    const fickle = entry.target.querySelector("img");
    fickle.classList.toggle("showAni", entry.isIntersecting);
  });
}
const options = {
  root: null,
  rootMargin: '0px',
  threshold: .25
}

const observer = new IntersectionObserver(fickleAnimation, options);

fickleAni.forEach(fickle => {
  observer.observe(fickle);
})
 */
//Panel

function showPanel(element) {
  var panel = document.querySelector(".sideBar");

  element.style.display = "block";
  panel.style.display = "block";
  panel.style.animation = 'openPanel 0.5s forwards'; //animacao abrir painel
}

function quitPanel(element) {
  var panel = document.querySelector(".sideBar");

  panel.style.animation = 'closePanel 0.5s forwards'; //animacao fechar painel
  setTimeout(function () {
    panel.style.display = "none";
  }, 500); // atraso para que o painel seja desativado depois da animacao ser feita
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

//Dropdown-nav do menu do painel

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
  // Rotação do ícone
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

  toggleDropdown(className, element); // Chama a função toggleDropdown para abrir/fechar o dropdown e aplicar a rotação

  element.classList.toggle('open');
}


function blog(className, element) {
  var object = document.querySelector(".dropdown2");
  var style = window.getComputedStyle(object);

  open_close(style, object);

  toggleDropdown(className, element); // Chama a função toggleDropdown para abrir/fechar o dropdown e aplicar a rotação

  element.classList.toggle('open');
}

function loja(className, element) {
  var object = document.querySelector(".dropdown3");
  var style = window.getComputedStyle(object);

  open_close(style, object);

  toggleDropdown(className, element); // Chama a função toggleDropdown para abrir/fechar o dropdown e aplicar a rotação

  element.classList.toggle('open');
}

function ask(className, element) {
  var object = document.querySelector(".dropdown4");
  var style = window.getComputedStyle(object);

  open_close(style, object);

  toggleDropdown(className, element); // Chama a função toggleDropdown para abrir/fechar o dropdown e aplicar a rotação

  element.classList.toggle('open');
}

//VER MAIS -- PERGUNTAS FREQUENTES

function pre_fq(className, element) {
  var object = document.querySelector(".fq-vermais");
  var style = window.getComputedStyle(object);

  open_close(style, object);

  toggleDropdown(className, element); // Chama a função toggleDropdown para abrir/fechar o dropdown e aplicar a rotação

  element.classList.toggle('open');
}

//PARA MENU-BAR VISTA, DE PC

function showDropdown(className) {
  var dropdown = document.querySelector('.' + className);
  dropdown.style.display = 'flex';
}

function hideDropdown(className) {
  var dropdown = document.querySelector('.' + className);
  dropdown.style.display = 'none';
}

//Rolagem para o topo

// Obtém o botão e a janela de visualização
var btTop = document.getElementById("bt-top");
var scroll = document.documentElement;

// Mostra o botão quando o usuário rolar 400px para baixo a partir do topo
window.onscroll = function () {
  if (scroll.scrollTop > 150) {
    btTop.style.display = "block";
  } else {
    btTop.style.display = "none";
  }
};

// Rolamento suave ao topo quando o botão é clicado
btTop.addEventListener("click", function () {
  scrollToTop(100); // Tempo de animação (em milissegundos)
});

function scrollToTop(duration) {
  var start = scroll.scrollTop;
  var startTime = performance.now();

  function animateScroll(currentTime) {
    var elapsedTime = currentTime - startTime;
    var ease = easeOutQuad(elapsedTime, start, -start, duration);
    scroll.scrollTop = ease;
    if (elapsedTime < duration) {
      requestAnimationFrame(animateScroll);
    }
  }

  function easeOutQuad(t, b, c, d) {
    t /= d;
    return -c * t * (t - 2) + b;
  }

  requestAnimationFrame(animateScroll);
}

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