<?php
    require './config.php';
    require './func.php';

//как получить данные
$data = file_get_contents('php://input');

if (!isset($data) || empty($data)) die("Ничего не передано");

//как посмотреть, что нам прилетает - 
//создастся файл 1.json
// file_put_contents('1.json', $data);

//преобразование строки в массив (указывая true)
$json = json_decode($data, true);

$message = "Новая заявка с сайта!\n\n";

//вывод определенной строки массива
//echo $json['step0']['question'];

//проверка json на пустоту
if ($json['step0']['question'] && $json['step0']['answers']) {
      //добавляем в строку сообщение
      $message .= "\n" . $json['step0']['question'] . ": " . implode(", ", $json['step0']['answers']);
} else {
  $response = [
    'status' => 'error',
    'message' => 'Что-то пошло не так'
  ];

}

//проверка json на пустоту
if ($json['step1']['question'] && $json['step1']['answers']) {
      //true, добавляем сообщение, которое есть
      $message .= "\n" . $json['step1']['question'] . ": " . implode(", ", $json['step1']['answers']);

} else {
  $response = [
    'status' => 'error',
    'message' => 'Что-то пошло не так'
  ];

}

//проверка json на пустоту
if ($json['step2']['question'] && $json['step2']['answers']) {
      //true, добавляем сообщение, которое есть
      $message .= "\n" . $json['step2']['question'] . ": " . implode(", ", $json['step2']['answers']);

} else {
  $response = [
    'status' => 'error',
    'message' => 'Что-то пошло не так'
  ];

}

//проверка json на пустоту
if ($json['step3']['question'] && $json['step3']['answers']) {
      //true, добавляем сообщение, которое есть
      $message .= "\n" . $json['step3']['question'] . ": " . implode(", ", $json['step3']['answers']);

} else {
  $response = [
    'status' => 'error',
    'message' => 'Что-то пошло не так'
  ];

}

//ПРОВЕРКА 4 ШАГА БУДЕТ С УСЛОВИЕМ НА ПУСТОТУ
$data_empty = false;

foreach($json['step4'] as $item) {
  if (!$item) $data_empty = true;
}

//проверка json на пустоту
if (!$data_empty) {
  //добавляем в строку сообщения
  $message .= "\n\nИмя: " . $json['step4']['name'];
  $message .= "\nТелефон: " . $json['step4']['phone'];
  $message .= "\nEmail: " . $json['step4']['email'];
  $message .= "\nВид связи: " . $json['step4']['call'];

  $my_data = [
    'message' => $message,
  ];

  get_data(BASE_URL . TOKEN . "/send?" . http_build_query($my_data));

  $response = [
    'status' => 'ok',
    'message' => 'Спасибо, скоро мы с вами свяжемся!'
];

} else {
  if (!$json['step4']['name']) {
    $error_message = 'Введите имя';
  } else if (!$json['step4']['phone']) {
    $error_message = 'Введите номер телефона';
  } else if (!$json['step4']['email']) {
    $error_message = 'Введите email';
  } else if (!$json['step4']['call']) {
    $error_message = 'Выберите способ связи';
  } else {
    $error_message = 'Что-то пошло не так...';
  }

  $response = [
    'status' => 'error',
    'message' => $error_message
  ];

}

//отправка в виде json
header('Content-Type: application/json; charset=utf-8');
echo json_encode($response);

