
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  const newsletterForm = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('emailInput');
  const newsletterMessage = document.getElementById('newsletterMessage');

  newsletterForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = emailInput.value;

    if (validateEmail(email)) {
      newsletterMessage.textContent = 'Thank you for subscribing!';
      newsletterMessage.style.color = '#4CAF50';
      emailInput.value = '';
    } else {
      newsletterMessage.textContent = 'Please enter a valid email address.';
      newsletterMessage.style.color = '#F44336';
    }

    setTimeout(() => {
      newsletterMessage.textContent = '';
    }, 5000);
  });

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
