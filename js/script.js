document.addEventListener('DOMContentLoaded', function () {

    'use strict';
    const overlay = document.querySelector('.overlay');
    const quiz = document.querySelector('.quiz');
    const passTestButton = document.querySelector('.pass-test__button');
    const form = document.querySelector('.quiz-body__form');
    const formItems = form.querySelectorAll('fieldset');
    const btnsNext = form.querySelectorAll('.form-button__btn-next');
    const btnsPrev = form.querySelectorAll('.form-button__btn-prev');
    const answersObj = {
        step0: {
            question: '',
            answers: [],
        },
        step1: {
            question: '',
            answers: [],
        },
        step2: {
            question: '',
            answers: [],
        },
        step3: {
            question: '',
            answers: [],
        },
        step4: {
            name: '',
            phone: '',
            email: '',
            call: '',
        },
    };

    btnsNext.forEach((btn, btnIndex) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            formItems[btnIndex].style.display = 'none';
            formItems[btnIndex + 1].style.display = 'block';
        });

        btn.disabled = true;
    });

    btnsPrev.forEach((btn, btnIndex) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            formItems[btnIndex + 1].style.display = 'none';
            formItems[btnIndex].style.display = 'block';
        });
    });

    formItems.forEach((formItem, formItemIndex) => {
        if (formItemIndex === 0) {
            formItem.style.display = 'block';
        } else {
            formItem.style.display = 'none';
        }

        if (formItemIndex !== formItems.length - 1) {
            const inputs = formItem.querySelectorAll('input');
            const itemTitle = formItem.querySelector('.form__title');

            answersObj[`step${formItemIndex}`].question = itemTitle.textContent;

            inputs.forEach((input) => {
                const parent = input.parentNode; //нашли родителя input
                input.checked = false; //сбросим чекбоксы
                parent.classList.remove('active-radio'); //удаляем класс активности
                parent.classList.remove('active-checkbox'); //удаляем класс активности
            });
        }

        //выбор radio и checkbox через делегирование
        formItem.addEventListener('change', (e) => {
            const target = e.target;
            const inputsChecked = formItem.querySelectorAll('input:checked');

            if (formItemIndex !== formItems.length - 1) {
                answersObj[`step${formItemIndex}`].answers.length = 0;

                inputsChecked.forEach((inputChecked) => {
                    answersObj[`step${formItemIndex}`].answers.push(inputChecked.value);
                });

                if (inputsChecked.length > 0) {
                    btnsNext[formItemIndex].disabled = false;
                } else {
                    btnsNext[formItemIndex].disabled = true;
                }

                if (target.classList.contains('form__radio')) {
                    const radios = formItem.querySelectorAll('.form__radio');

                    radios.forEach((input) => {
                        if (input === target) {
                            input.parentNode.classList.add('active-radio');
                        } else {
                            input.parentNode.classList.remove('active-radio');
                        }
                    });

                } else if (target.classList.contains('form__input')) {
                    target.parentNode.classList.toggle('active-checkbox');
                } else {
                    return;
                }
            }

        });

    });

    //отправлять данные
    const sendForm = () => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            answersObj.step4.name = document.getElementById('quiz-name').value;
            answersObj.step4.phone = document.getElementById('quiz-phone').value;
            answersObj.step4.email = document.getElementById('quiz-email').value;
            answersObj.step4.call = document.getElementById('quiz-call').value;


            if (document.getElementById('quiz-policy').checked === true) {
                postData(answersObj)
                    .then((res) => res.json())
                    .then((res) => {
                        if (res['status'] === 'ok') {
                            overlay.style.display = 'none';
                            quiz.style.display = 'none';
                            form.reset();
                            alert(res['message']);
                        } else if (res['status'] === 'error') {
                            alert(res['message']);
                        }
                    });
            } else {
                alert('Подтвердите согласие на обработку персональных данных');
            }
        });
    };

    //собирать и запуск отправки данных
    const postData = (body) => {
        return fetch('./server.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    };

    overlay.style.display = 'none';
    quiz.style.display = 'none';

    passTestButton.addEventListener('click', () => {

        formItems.forEach((formItem, formItemIndex) => {
            if (formItemIndex === 0) {
                formItem.style.display = "block";
            } else {
                formItem.style.display = "none";
            }

            const inputs = formItem.querySelectorAll("input");
            inputs.forEach((input) => {
                const parent = input.parentNode;
                input.checked = false;
                parent.classList.remove("active-radio");
                parent.classList.remove("active-checkbox");
            });
        });

        btnsNext.forEach((btn) => {
            btn.disabled = true;
        });


        overlay.style.display = 'block';
        quiz.style.display = 'block';

    });

    sendForm();

});