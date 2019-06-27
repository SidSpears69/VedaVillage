    <?php
    if ($_POST) { 
      
      $name = htmlspecialchars($_POST["name"]); 
      $email = htmlspecialchars($_POST["email"]);
      $message = htmlspecialchars($_POST["message"]);
      $phone = htmlspecialchars($_POST["phone"]);
      $header = htmlspecialchars($_POST["header"]);
      $price = htmlspecialchars($_POST["price"]);
      $money = htmlspecialchars($_POST["money"]);
      $self = htmlspecialchars($_POST["self-money"]);
      $loan = htmlspecialchars($_POST["loan-money"]);
      $json = array(); 
      if (!$name or !$email) { 
        $json['error'] = 'Вы зaпoлнили нe всe пoля.'; 
        echo json_encode($json); 
        die();
      }
      if(!preg_match("|^[-0-9a-z_\.]+@[-0-9a-z_^\.]+\.[a-z]{2,6}$|i", $email)) { 
        $json['error'] = 'Нe вeрный фoрмaт почты.'; 
        echo json_encode($json); 
        die(); 
      }
      // Кодировка для отправленных писем 
      function mime_header_encode($str, $data_charset, $send_charset) { 
        if($data_charset != $send_charset)
        $str=iconv($data_charset,$send_charset.'//IGNORE',$str);
        return ('=?'.$send_charset.'?B?'.base64_encode($str).'?=');
      }
      
      // Класс для отправки писем на почту
      class TEmail {
      public $from_email;
      public $from_name;
      public $to_email;
      public $to_name;
      public $subject;
      public $data_charset='UTF-8';
      public $send_charset='windows-1251';
      public $body='';
      public $type='text/plain';
      function send(){
        $dc=$this->data_charset;
        $sc=$this->send_charset;
        $enc_to=mime_header_encode($this->to_name,$dc,$sc).' <'.$this->to_email.'>';
        $enc_subject=mime_header_encode($this->subject,$dc,$sc);
        $enc_from=mime_header_encode($this->from_name,$dc,$sc).' <'.$this->from_email.'>';
        $enc_body=$dc==$sc?$this->body:iconv($dc,$sc.'//IGNORE',$this->body);
        $headers='';
        $headers.="Mime-Version: 1.0\r\n";
        $headers.="Content-type: ".$this->type."; charset=".$sc."\r\n";
        $headers.="From: ".$enc_from."\r\n";
        return mail($enc_to,$enc_subject,$enc_body,$headers);
      }
      }
      $emailgo = new TEmail; 
      $emailgo->from_email =  $email; // Почта отправителя 
      $emailgo->from_name  = $name; // Имя отправителя 
      $emailgo->to_email   = "sidspears55@gmail.com";  // Куда будет отправлено письмо 
      $emailgo->subject    = "Заявка с сайта"; // Тема
      if(!$header) {
        $emailgo->body      = "Имя: ".$name." Телефон: ".$phone." Сообщение ".$message; // Сообщение
      }
      else {
        if($money == "Заемные") {
          $emailgo->body      ="Имя: ".$name." Телефон: ".$phone." Сообщение ".$message."\r\n".$header." Стоимостью: ".$price."рублей Способ инвестиции: ".$money." Доход в месяц: ".$loan." рублей";
        }
        else {
          $emailgo->body      = "Имя: ".$name." Телефон: ".$phone." Сообщение ".$message."\r\n".$header." Стоимостью: ".$price."рублей Способ инвестиции: ".$money." Доход в месяц: ".$self." рублей";
        }
      }
      $emailgo->send(); 
      $json['error'] = 0;
      echo json_encode($json); 
    } else { 
      echo 'У вас нет прав для входа на эту страницу!'; 
    }
    ?>