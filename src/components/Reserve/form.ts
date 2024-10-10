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
    }

    async function handleSubmit(event: Event) {
      event.preventDefault();
      clearAlerts();

      let it_works = true;

      ['name', 'contact', 'email', 'date'].forEach(field => {
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

      const email = getFormValue('email');
      if (email && !isValidEmail(email)) {
        it_works = false;
        displayAlert("formatEmail");
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
      fillTableValue('#email', data.email);
      fillTableValue('#date', data.date);
    }

    function fillTableValue(selector: string, value: any) {
      const element = document.querySelector(`#form-pay-method ${selector}`);
      if (element !== null) {
        element.textContent = value || '';
      }
    }

    /* Confirm Email Code */

    const counterElement = document.getElementById("counterCode")
    const sendCode = document.getElementById("send") as HTMLButtonElement
    const subscribe = document.getElementById('subscribe') as HTMLInputElement
    let code: string | null
    const codeConfirmation = document.getElementById('code') as HTMLInputElement

    sendCode?.addEventListener("click", async () => {
      const nameInput = document.getElementById('name') as HTMLInputElement
      const emailInput = document.getElementById('email') as HTMLInputElement
      code = Math.floor(1000 + Math.random() * 9000).toString()

      if (!nameInput || !emailInput || !counterElement) return;

      const type = 'email_validation' //know about the type of email to send
      const name = nameInput.value;
      const email = emailInput.value;

      const data = {
        type: type,
        name: name,
        email: email,
        code: code,
      }

      sendCode.disabled = true
      subscribe.disabled = true
      let timeLeft = 120; // 2 min em segundos

      await sendEmailCode(data)

      const interval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        counterElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
          clearInterval(interval);
          sendCode.disabled = false;
          sendCode.textContent = 'Reenviar';
        }

        timeLeft--;
      }, 1000); // Atualiza a cada segundo
    })

    subscribe?.addEventListener('click', () => {
      const nameInput = document.getElementById('name') as HTMLInputElement
      const contactInput = document.getElementById('contact') as HTMLInputElement
      const emailInput = document.getElementById('email') as HTMLInputElement
      const dateInput = document.getElementById('date') as HTMLInputElement

      if (!nameInput || !contactInput || !emailInput || !dateInput) return;

      const type = 'booking_confirmation' //know about the type of email to send
      const name = nameInput.value
      const contact = contactInput.value
      const email = emailInput.value
      const date = dateInput.value

      if (codeConfirmation.value === code) {
        //Booking date scheduled
        const data = {
          type: type,
          name: name,
          contact: contact,
          email: email,
          date: date,
        }
        //Sends reservation information to the customer's email
        subConfirm(data)
        displayAlert('successAlert')
      } else {
        displayAlert('invalidCode')
      }
    })

    async function sendEmailCode(data: object) {
      try {
        const response = await fetch('/api/send-email.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        console.log("response: ", response)
        subscribe.disabled = false

      } catch (error) {
        console.error('Error in sending data:', error);
      }
    }

    async function subConfirm(data: object) {
      try {
        const response = await fetch('/api/send-email.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        console.log("response: ", response)
        subscribe.disabled = false

      } catch (error) {
        console.error('Error in sending data:', error);
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

    function isValidEmail(email: string) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function getFormValue(field: string): string | undefined {
      return (form?.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement)?.value;
    }
  }
})