<?php
// ==============================================================================
// CONEXÃO VIA API REST DO SUPABASE (Funciona no Render sem erro de banco/IPv6)
// ==============================================================================
$supabaseUrl = 'https://rtzlswsbywvqpeynzfqt.supabase.co';
$supabaseKey = 'sb_publishable_xKFbqTiOkI2jrp3670_tNw_N9pQWy1M'; // Pegue em Project Settings -> API no Supabase

$produtos = [];
$erro = null;

// Requisição HTTP para a API REST da tabela 'produtos'
$opts = [
    "http" => [
        "method" => "GET",
        "header" => "apikey: " . $supabaseKey . "\r\n" .
                    "Authorization: Bearer " . $supabaseKey . "\r\n"
    ]
];

$context = stream_context_create($opts);
$response = @file_get_contents($supabaseUrl . "/rest/v1/produtos?select=*", false, $context);

if ($response !== false) {
    $produtos = json_decode($response, true);
} else {
    $erro = "Não foi possível carregar os produtos via API do Supabase.";
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
                R$ <?php echo number_format($prod['preço'] ?? $prod['preco'] ?? 0, 2, ',', '.'); ?>
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
