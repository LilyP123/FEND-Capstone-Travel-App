const { handleSubmit } = require('./js/formHandler.js');

require('./styles/resets.scss');
require('./styles/base.scss');
require('./styles/footer.scss');
require('./styles/form.scss');
require('./styles/header.scss');

// Call the handleSubmit function
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSubmit(event);
  });
}

// Call the onBlur function
const input = document.getElementById('country-input');
if (input) {
  input.addEventListener('blur', onBlur);
}

function onBlur() {
  const inputValue = document.getElementById('country-input')?.value;
    console.log('Input value:', inputValue);
}

module.exports = {
  handleSubmit,
  onBlur
};