<?php
function get_data($url) {
    $curl = curl_init(); //активация

    curl_setopt($curl, CURLOPT_URL, $url); //кто будет работать, какую опцию ставим, что передаем

    $data = curl_exec($curl);//запуск

    curl_close($curl);

    return $data;

}