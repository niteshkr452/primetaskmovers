<?php
  // Enable CORS
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");

  // Replace with your real receiving email address
  $receiving_email_address = 'your-real-email@example.com';

  // Check if PHP Email Form exists
  $php_email_form_path = '../assets/vendor/php-email-form/php-email-form.php';
  if (!file_exists($php_email_form_path)) {
    die('Error: Unable to load the "PHP Email Form" Library!');
  }
  
  include($php_email_form_path);

  $contact = new PHP_Email_Form;
  $contact->ajax = true;

  // Secure SMTP Configuration (Use environment variables)
  $contact->smtp = array(
    'host' => getenv('SMTP_HOST') ?: 'smtp.example.com', // Use environment variable
    'username' => getenv('SMTP_USER') ?: 'your-email@example.com', // Secure username
    'password' => getenv('SMTP_PASS') ?: 'your-email-password', // Secure password
    'port' => getenv('SMTP_PORT') ?: 587, // Use port 587 for TLS
    'encryption' => 'tls' // Use 'ssl' for port 465
  );

  // Handle preflight OPTIONS request
  if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
  }

  // Validate form data
  if (empty($_POST['name']) || empty($_POST['email']) || empty($_POST['subject']) || empty($_POST['message'])) {
    die('Error: All fields are required!');
  }

  if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    die('Error: Invalid email format!');
  }

  // Assign email details
  $contact->to = $receiving_email_address;
  $contact->from_name = htmlspecialchars($_POST['name']);
  $contact->from_email = htmlspecialchars($_POST['email']);
  $contact->subject = htmlspecialchars($_POST['subject']);

  // Add messages with validation
  $contact->add_message($_POST['name'], 'From');
  $contact->add_message($_POST['email'], 'Email');
  $contact->add_message($_POST['message'], 'Message', 10);

  // Send email and check success
  if ($contact->send()) {
    echo 'Success: Your message has been sent!';
  } else {
    echo 'Error: Email sending failed!';
  }
?>
