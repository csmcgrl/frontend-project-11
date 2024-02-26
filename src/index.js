// import 'bootstrap';
import '../main.css';
import * as yup from 'yup';

const schema = yup.string().url();

const form = document.querySelector('form');
const input = document.getElementById('url-input');
const feedback = document.getElementsByClassName('feedback')[0];
const feedHistory = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const inputValue = document.getElementById('url-input').value;

  // Проверяем, соответствует ли введенное значение схеме валидации
  schema.isValid(inputValue).then((valid) => {
    if (valid) {
      if (feedHistory.includes(inputValue)) {
        feedback.textContent = 'RSS уже существует';
        feedback.classList.add('text-danger');
      } else {
        feedHistory.push(inputValue);
        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        input.classList.remove('is-invalid');
        feedback.textContent = 'RSS успешно загружен';
        input.value = '';
        input.focus();
      }
    } else {
      feedback.textContent = 'Ссылка должна быть валидным URL';
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
    }
  });
  // .catch((error) => {
  //   console.log(error); // Обработка ошибки, если что-то пошло не так
  // });
});
