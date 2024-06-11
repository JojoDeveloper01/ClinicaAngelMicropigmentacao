document.addEventListener("astro:page-load", () => {
  if (typeof document !== 'undefined') {
    const modalBackground = document.querySelector(".modalBackground");
    const reservaDialog = document.getElementById("reserva-dialog");
    const payDialog = document.getElementById("pay-dialog");
    const dateInput = document.getElementById("date") as HTMLInputElement;

    document.querySelector(".register")?.addEventListener("click", () => {
      toggleModal(reservaDialog, true);
    });

    document.querySelectorAll(".closeModal").forEach((button) => {
      button.addEventListener("click", () => {
        toggleModal(reservaDialog, false);
        toggleModal(payDialog, false);
      });
    });

    function isDateValid(): string | null {
      const today = new Date();
      const maxDate = new Date(
        today.getFullYear() + 2,
        today.getMonth(),
        today.getDate()
      );
      const selectedDate = new Date(dateInput.value);
      if (selectedDate < today) {
        return "A data não pode ser anterior à data atual.";
      } else if (selectedDate > maxDate) {
        return "A data não pode ser mais do que dois anos após a data atual.";
      } else {
        return null;
      }
    }

    modalBackground?.addEventListener("click", (event) => {
      if (event.target === modalBackground) {
        toggleModal(reservaDialog, false);
        toggleModal(payDialog, false);
      }
    });

    function toggleModal(dialog: any, isOpen: any) {
      if (isOpen) {
        modalBackground?.classList.remove("hidden");
        dialog.classList.remove("hidden");
        document.body.classList.add("no-scroll");
        setTimeout(() => modalBackground?.classList.add("openModal"));
      } else {
        if (!dialog.classList.contains("hidden")) {
          modalBackground?.classList.remove("openModal");
          document.body.classList.remove("no-scroll");
          setTimeout(() => {
            modalBackground?.classList.add("hidden");
            dialog.classList.add("hidden");
          });
        }
      }
    }

    /* ------  Form Alerts ---------------- */

    const form = document.getElementById('form-reserva') as HTMLFormElement;
    const buttonForm = form?.querySelector('button');

    if (buttonForm) {
      form?.addEventListener('submit', handleSubmit);
      buttonForm.addEventListener("blur", () => resetButtonStyle());
    }

    async function handleSubmit(event: Event) {
      event.preventDefault();
      clearAlerts();

      let it_works = true;

      ['name', 'contact', 'date'].forEach(field => {
        const value = getFormValue(field);
        if (!value) {
          it_works = false;
          displayAlert(`${field}Alert`);
        }
        else if (field === 'name' && /\d/.test(value)) {
          it_works = false;
          displayAlert("nameStringAlert");
        }
      });

      const contact = getFormValue('contact');
      if (contact && !isValidPhoneNumber(contact)) {
        it_works = false;
      }

      if (it_works) {
        const data = Object.fromEntries(new FormData(form));
        await sendFormData(data);
      }
    }

    async function sendFormData(data: any) {
      toggleModal(reservaDialog, false);
      toggleModal(payDialog, true);

      fillTableValue('#name', data.name);
      fillTableValue('#contact', data.contact);
      fillTableValue('#date', data.date);
    }

    function fillTableValue(selector: string, value: any) {
      const element = document.querySelector(`#form-pay-method ${selector}`);
      if (element !== null) {
        element.textContent = value || '';
      }
    }

    /*     function handleResponse(status: number) {
          const successColor = '#38d391';
          const errorColor = '#ff0050';
          if (buttonForm) {
            buttonForm.style.backgroundColor = (status === 200) ? successColor : errorColor;
            buttonForm.style.transition = 'background-color 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
          }
          displayAlert((status === 200) ? 'successAlert' : 'errorAlert');
          if (status !== 200) console.error('Erro na requisição:', status);
        }
     */

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