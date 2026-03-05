<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'landing_advocacia';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
    exit;
}

$nome = isset($_POST['nome']) ? trim($_POST['nome']) : '';
$telefone = isset($_POST['telefone']) ? trim($_POST['telefone']) : '';
$area = isset($_POST['area']) ? trim($_POST['area']) : '';
$mensagem = isset($_POST['mensagem']) ? trim($_POST['mensagem']) : '';

if ($nome === '' || $telefone === '' || $area === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Preencha nome, telefone e área do caso.']);
    exit;
}

$conn = @mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco. Verifique as credenciais e se a tabela existe.']);
    exit;
}

mysqli_set_charset($conn, 'utf8mb4');

$stmt = mysqli_prepare($conn, 'INSERT INTO consultas (nome, telefone, area, mensagem) VALUES (?, ?, ?, ?)');
if (!$stmt) {
    mysqli_close($conn);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao preparar inserção.']);
    exit;
}

mysqli_stmt_bind_param($stmt, 'ssss', $nome, $telefone, $area, $mensagem);
$ok = mysqli_stmt_execute($stmt);
mysqli_stmt_close($stmt);
mysqli_close($conn);

if (!$ok) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar os dados.']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Solicitação recebida. Entraremos em contato em breve.']);
