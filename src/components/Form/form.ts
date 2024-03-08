document.addEventListener("astro:page-load", () => {
  if (typeof document !== 'undefined') {
    const form = document.querySelector('form') as HTMLFormElement;
    const buttonForm = form?.querySelector('button');

    if (buttonForm) {
      form?.addEventListener('submit', handleSubmit);
      buttonForm.addEventListener("blur", () => resetButtonStyle());
    }

    async function handleSubmit(event: Event) {
      event.preventDefault();
      clearAlerts();

      const inputs = form?.querySelectorAll('input, textarea');
      let it_works = true;

      ['nome', 'telemovel', 'mensagem'].forEach(field => {
        const value = getFormValue(field);
        if (!value) {
          it_works = false;
          displayAlert(`${field}Alert`);
        }
        else if (field === 'nome' && /\d/.test(value)) {
          it_works = false;
          displayAlert("nameStringAlert");
        }
      });

      const telemovel = getFormValue('telemovel');
      if (telemovel && !isValidPhoneNumber(telemovel)) {
        it_works = false;
      }

      const email = getFormValue('email');
      if (email && !isValidEmail(email)) {
        it_works = false;
        displayAlert("formatEmail");
      }

      if (it_works) {
        const data = Object.fromEntries(new FormData(form));
        await sendFormData(data);
        resetForm(inputs);
      }
    }

    async function sendFormData(data: object) {
      try {
        const response = await fetch('/api/send-email.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        handleResponse(response.status);
      } catch (error) {
        console.error('Error in sending data:', error);
      }
    }

    function handleResponse(status: number) {
      const successColor = '#38d391';
      const errorColor = '#ff0050';
      if (buttonForm) {
        buttonForm.style.backgroundColor = (status === 200) ? successColor : errorColor;
        buttonForm.style.transition = 'background-color 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
      }
      displayAlert((status === 200) ? 'successAlert' : 'errorAlert');
      if (status !== 200) console.error('Erro na requisição:', status);
    }

    function displayAlert(alertId: string) {
      const AlertID = document.getElementById(alertId);
      if (AlertID) AlertID.style.display = "block";
    }

    function clearAlerts() {
      const alerts = document.getElementsByClassName("customAlert") as HTMLCollectionOf<HTMLElement>;
      for (const alert of alerts) {
        alert.style.display = "none";
      }
    }

    function isValidPhoneNumber(phoneNum: string) {
      const hasSpaces = /\s/.test(phoneNum);
      const hasNonNumeric = /\D/.test(phoneNum);

      if (hasSpaces || hasNonNumeric || phoneNum.length < 9) {
        displayAlert(
          hasSpaces ? "phoneSpaceAlert" :
            hasNonNumeric ? "phoneStringAlert" :
              "phoneNumMinAlert"
        );
        return false;
      }

      return true;
    }

    function isValidEmail(email: string) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function getFormValue(field: string): string | undefined {
      return (form?.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement)?.value;
    }

    function resetForm(inputs: NodeListOf<Element> | null) {
      inputs?.forEach(input => {
        (input as HTMLInputElement).value = '';
      });
    }

    function resetButtonStyle() {
      if (buttonForm) {
        buttonForm.style.backgroundColor = '';
        buttonForm.style.transition = '';
      }
    }
  }
})