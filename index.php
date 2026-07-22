<?php
// ==============================================================================
// CONFIGURAÇÃO DE CONEXÃO COM O SUPABASE (Via Pooler IPv4 para o Render)
// ==============================================================================
$host = 'aws-0-us-east-2.pooler.supabase.com'; // Host Pooler para US East (Ohio)
$port = '6543';                                // Porta do Transaction Pooler
$db   = 'postgres';
$user = 'postgres.rtzlswsbywvqpeynzfqt';        // ID do projeto anexado para autenticação no Pooler
$pass = 'MinhaLoja2026#Segura';                // Sua senha redefinida

$dsn = "pgsql:host=$host;port=$port;dbname=$db;";

$produtos = [];
$erro = null;

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // Busca os produtos da tabela "produtos"
    $stmt = $pdo->query('SELECT id, nome, imagem, tamanhos, preço FROM produtos');
    $produtos = $stmt->fetchAll();

} catch (PDOException $e) {
    $erro = "Erro ao conectar com o banco de dados: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loja de Roupas</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen text-gray-800">

  <header class="bg-white shadow-sm border-b sticky top-0 z-10">
    <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-gray-900">Loja de Roupas (PHP)</h1>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6">Produtos em Destaque</h2>

    <?php if ($erro): ?>
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
        <strong>Atenção:</strong> <?php echo htmlspecialchars($erro); ?>
      </div>
    <?php endif; ?>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <?php if (empty($produtos) && !$erro): ?>
        <p class="text-gray-500 col-span-3 text-center py-8">Nenhum produto cadastrado na tabela ainda.</p>
      <?php else: ?>
        <?php foreach ($produtos as $prod): ?>
          <div class="bg-white rounded-lg shadow-sm border p-4 flex flex-col justify-between">
            <div>
              <?php if (!empty($prod['imagem'])): ?>
                <img src="<?php echo htmlspecialchars($prod['imagem']); ?>" alt="<?php echo htmlspecialchars($prod['nome']); ?>" class="w-full h-64 object-cover rounded-md mb-4">
              <?php endif; ?>
              
              <h3 class="font-semibold text-lg leading-tight mb-1">
                <?php echo htmlspecialchars($prod['nome']); ?>
              </h3>
              
              <p class="text-gray-900 font-bold mb-3">
                R$ <?php echo number_format($prod['preço'], 2, ',', '.'); ?>
              </p>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Tamanhos disponíveis:</label>
              <p class="text-sm bg-gray-100 p-2 rounded mb-3 font-mono">
                <?php echo htmlspecialchars($prod['tamanhos']); ?>
              </p>
              
              <button class="w-full bg-black text-white py-2 rounded-md font-medium text-sm hover:bg-gray-800 transition">
                Comprar
              </button>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </main>

</body>
</html>
