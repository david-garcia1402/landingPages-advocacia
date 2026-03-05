# Landing Page – Escritório de Advocacia

Landing page em HTML5, CSS3 e JavaScript para captação de leads via WhatsApp e formulário.

## Configuração

1. **WhatsApp**: em `script.js`, altere a variável `WHATSAPP_NUMBER` (ex: `5547999999999`).
2. **Imagens**: coloque em `imgs/` os arquivos `hero.jpg`, `advogado.jpg` e, se quiser, `logo.svg` (veja `imgs/README.md`).
3. **Formulário (opcional)**:
   - Crie o banco e a tabela executando `schema.sql` no MySQL.
   - Ajuste host, usuário, senha e banco no início de `form-handler.php`.
   - O formulário envia por fetch e exibe a resposta em JSON; sem PHP, o envio falha e o usuário pode ser orientado a usar o WhatsApp.

## Estrutura

- `index.html` – página principal
- `style.css` – estilos (paleta azul escuro + dourado)
- `script.js` – menu mobile, scroll suave, animações, `sendToWhatsApp(message)`, envio do formulário
- `form-handler.php` – backend opcional (recebe POST e grava em MySQL)
- `schema.sql` – criação da tabela `consultas`
- `imgs/` – imagens da landing

## Executar

Abra `index.html` no navegador ou sirva a pasta com um servidor (PHP ou estático). Para o formulário salvar no banco, use um servidor com PHP e MySQL.
