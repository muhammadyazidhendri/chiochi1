<?php
/*Install Midtrans PHP Library (https://github.com/Midtrans/midtrans-php)
composer require midtrans/midtrans-php
                              
Alternatively, if you are not using **Composer**, you can download midtrans-php library 
(https://github.com/Midtrans/midtrans-php/archive/master.zip), and then require 
the file manually.   

require_once dirname(__FILE__) . '/pathofproject/Midtrans.php'; */
require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';

//SAMPLE REQUEST START HERE

// Set your Merchant Server Key
\Midtrans\Config::$serverKey = 'SB-Mid-server-44Q63hLmFl8jIxZ15gZCCu8l';
// Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
\Midtrans\Config::$isProduction = false;
// Set sanitization on (default)
\Midtrans\Config::$isSanitized = false;
// Set 3DS transaction for credit card to true
\Midtrans\Config::$is3ds = true;

// Ambil data JSON yang dikirim
$data = json_decode(file_get_contents('php://input'), true);

// Pastikan data diterima
if (isset($data['total']) && isset($data['items']) && isset($data['name']) && isset($data['email']) && isset($data['phone'])) {
 // Lanjutkan dengan proses pembayaran
 $params = array(
    'transaction_details' => array(
        'order_id' => rand(),
        'gross_amount' => $data['total'],
    ),
    'item_details' => $data['items'],
    'customer_details' => array(
        'first_name' => $data['name'],
        'email' => $data['email'],
        'phone' => $data['phone'],
    ),
);

$snapToken = \Midtrans\Snap::getSnapToken($params);
echo $snapToken; // Kirim token kembali ke JavaScript
} else {
    echo 'Data tidak lengkap'; // Tampilkan pesan error jika data tidak lengkap
}
?>