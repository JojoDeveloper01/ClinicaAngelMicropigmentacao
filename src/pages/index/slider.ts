// Verificar se estamos no ambiente do navegador antes de acessar o objeto document
if (typeof document !== 'undefined') {
  // Selecionar os elementos dos slides anteriores e seguintes
  const slideAnterior = document.querySelectorAll(
    ".prev, .prev1, .prev2, .prev3, .prev4"
  );
  const slideSeguinte = document.querySelectorAll(
    ".next, .next1, .next2, .next3, .next4"
  );

  // Obter os estilos do elemento raiz
  const rootStyles = getComputedStyle(document.documentElement);

  // Definir uma função para atualizar o slide
  const updateSlide = (index: number, increment: number) => {
    // Obter o nome da propriedade CSS correspondente ao índice
    const propertyName = `--slides${index === 0 ? "" : index === 1 || index === 2 ? "1" : "2"}`;

    // Obter o valor atual da propriedade
    const slideMove = parseFloat(rootStyles.getPropertyValue(propertyName));
    // Valores mínimos e máximos dos slides 
    const minSlides = parseFloat(rootStyles.getPropertyValue("--minSlides"));
    const maxSlides = parseFloat(rootStyles.getPropertyValue("--maxSlides"));

    // Calcular o novo valor da propriedade
    let newValuesSlideMove: number;
    if (increment === -1 && slideMove === minSlides) {
      newValuesSlideMove = maxSlides;
    } else if (increment === 1 && slideMove === maxSlides) {
      newValuesSlideMove = minSlides;
    } else {
      newValuesSlideMove = slideMove + increment * 100;
    }

    // Atualizar a propriedade no elemento raiz
    document.documentElement.style.setProperty(
      propertyName,
      `${newValuesSlideMove}%`
    );
  };

  // Adicionar um evento de clique aos slides anteriores
  slideAnterior.forEach((element, index) => {
    element?.addEventListener("click", () => updateSlide(index, -1));
  });

  // Adicionar um evento de clique aos slides seguintes
  slideSeguinte.forEach((element, index) => {
    element?.addEventListener("click", () => {
      // Definir os valores máximos dos slides de acordo com o índice
      const maxValues = [300, 200, 700, 100, 600];
      document.documentElement.style.setProperty(
        "--maxSlides",
        `${maxValues[index]}`
      );
      updateSlide(index, 1);
    });
  });

  // Se o primeiro slide seguinte existir, clicar nele a cada 9 segundos
  setTimeout(() => {
    slideSeguinte[0]?.dispatchEvent(new Event("click"));
    setInterval(() => {
      slideSeguinte[0]?.dispatchEvent(new Event("click"));
    }, 14000);
  }, 14000);
}
