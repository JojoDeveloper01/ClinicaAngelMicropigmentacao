//Formulário

interface FormData {
  nome: string;
  telemovel: string;
  email: string;
  mensagem: string;
}

// Verificar se estamos no ambiente do navegador antes de acessar o objeto document
if (typeof document !== 'undefined') {
  const form = document.querySelector('form') as HTMLFormElement;
  const buttonForm = form.querySelector('button') as HTMLButtonElement;

  if (buttonForm) {
    form.addEventListener('submit', handleSubmit);
  }

  function handleSubmit(event: Event) {
    event.preventDefault();

    const inputs = form.querySelectorAll('input, textarea');
    let itWorks = true;
    clearAlerts();

    const requiredFields = ['nome', 'telemovel', 'mensagem'];
    for (const field of requiredFields) {
      const value = (form.elements[field as keyof typeof form.elements] as HTMLInputElement)?.value;
      if (!value) {
        itWorks = false;
        displayAlert(`${field}Alert`);
      }
    }

    const telemovelInput = (form.elements as any)['telemovel'] as HTMLInputElement;

    if (telemovelInput) {
      const telemovel = telemovelInput.value;
      if (telemovel && !isValidPhoneNumber(telemovel)) {
        itWorks = false;
        displayAlert("formatTelemovel");
      }
    }

    const email: string = (form.elements as any)['email'].value;
    if (email && !isValidEmail(email)) {
      itWorks = false;
      displayAlert("formatEmail");
    }

    if (itWorks) {
      const data = Object.fromEntries(new FormData(form)) as unknown as FormData;
      sendFormData(data);

      (inputs as NodeListOf<HTMLInputElement>).forEach((input) => {
        input.value = '';
      });
    }
  }

  function sendFormData(data: FormData) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/send-email', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => (xhr.readyState === XMLHttpRequest.DONE) && handleResponse(xhr.status);
    xhr.send(JSON.stringify(data));
  }

  function handleResponse(status: number) {
    const successColor = '#38d391';
    const errorColor = '#ff0050';
    buttonForm.style.backgroundColor = (status === 200) ? successColor : errorColor;
    buttonForm.style.transition = 'background-color 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
    displayAlert((status === 200) ? 'sucessAlert' : 'errorAlert');
    if (status !== 200) console.error('Erro na requisição:', status);
  }

  function displayAlert(alertId: string) {
    const alertElement = document.getElementById(alertId);

    if (alertElement) {
      alertElement.style.display = "block";
    } else {
      // Handle the case where the element is not found
      console.error(`Alert element with ID "${alertId}" not found.`);
    }
  }

  function clearAlerts() {
    const alerts = document.getElementsByClassName("customAlert") as HTMLCollectionOf<HTMLElement>;
    for (const alert of alerts) {
      alert.style.display = "none";
    }
  }

  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhoneNumber(telefone: string) {
    const numeroRegex = /^\d+$/;
    return numeroRegex.test(telefone);
  }

  if (buttonForm) {
    buttonForm.addEventListener("blur", () => {
      buttonForm.style.backgroundColor = '';
      buttonForm.style.transition = '';
    });
  }
}
