[Português](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Estes documentos são traduções automáticas de textos de projetos públicos e nem todos foram revistos por falantes nativos. Consulte a fonte em inglês ou chinês para obter ambiguidade técnica. Nenhum dado privado do utilizador está incluído.

# Contas de sites

## Uso

No Mac que executa o serviço, abra o `http://127.0.0.1:1235/setup` para criar o primeiro administrador. Os nomes de utilizador contêm letras, dígitos, sublinhados ou hífens 3–32 e estão normalizados para letras minúsculas. As palavras-passe contêm caracteres 12–128. Não existem credenciais padrão. Os dispositivos remotos não podem reclamar a conta de administrador inicial.

Após a configuração, os dispositivos não autenticados verão a página de início de sessão. Abra **Conta/Sair** (`/account`) para alterar a sua palavra-passe ou sair. Os administradores podem criar users/administrators, repor palavras-passe, contas disable/enable, alterar funções e eliminar contas. As alterações de eliminação e de permissão requerem confirmação. O servidor impede a eliminação, desabilitação ou despromoção do último administrador habilitado. Apagar uma conta não apaga as tarefas partilhadas.

Utilize o menu de idiomas no canto superior direito para escolher os idiomas 33. O navegador recorda a sua seleção. Os pacotes de idiomas são servidos localmente; mudar de idioma não envia conteúdo para um serviço de tradução online. Os pedidos do utilizador, as conversas e o conteúdo guardado mantêm o idioma original.

Este é um estúdio partilhado. Os utilizadores ligados partilham o acesso a imagens, vídeos e tarefas de chat no servidor. O histórico de chat do navegador permanece em localStorage. Não há isolamento multi-inquilino, armazenamento de tarefas por utilizador ou faturação. A restrição existente de vídeo apenas local mantém-se.

## Armazenamento e proteção

- O `src/studio_auth.mjs` é executado antes das rotas comerciais, incluindo as APIs e os ficheiros image/reference/video. Redireccionamento de páginas não autenticadas com 303; APIs e media retornam 401. Os ativos da conta, os ativos linguísticos e o estado setup/sign-in não secreto são públicos.
- Ficheiro de conta: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, norma `app/.local/auth/users.json`; a implementação dedicada utiliza `runtime/auth/users.json`. Modo de diretório: 0700; modo de ficheiro: 0600. As palavras-passe utilizam scrypt N32768/r8/p1, sais aleatórios e comparação de hash em tempo constante. As gravações são atómicas e as alterações da conta serializadas. Uma base de dados existente corrompida impede a inicialização em vez de reabrir o registo.
- As sessões utilizam bytes aleatórios 32; o servidor armazena apenas o resumo. Os cookies são HttpOnly, SameSite=Strict, válidos para as horas 12. A reinicialização requer novamente o login. As alterações, reinicializações, desativação e eliminação de Password/role revogam as sessões afetadas. Sair não elimina nem executa novamente as tarefas já iniciadas.
- As gravações requerem Origin e JSON da mesma origem. X-Forwarded-For não é fiável. Cada IP de origem obtém no máximo 15 sign-in/setup/self-password-change tentativas durante 15 minutos. Limites: derivações simultâneas de palavras-passe 4 e contas 100. Reiniciar limpa os limites de tentativas.
- A implementação existente utiliza HTTP sobre Tailscale privado. Tailscale encripta o transporte dispositivo a dispositivo; O HTTP comum da LAN em si não. O acesso público e o TLS não são configurados por este pacote. Os cookies Secure são definidos apenas para pedidos TLS nativos. Não o exponha diretamente por HTTP público.
- Nunca carregue a base de dados de autenticação, sessões ou palavras-passe. Inicializar novas contas ao migrar. stdio MCP, LM Studio local e permissões de ficheiro do sistema operativo estão fora da autenticação do site.

## Validação

Execute `node tests/studio_auth.mjs` com a sua base de dados de contas temporária e sem models real. Abrange o bloqueio API/media não autenticado, restrições de origem de configuração inicial, funções, modos de palavra-passe hashing/file, proteção do último administrador, revogação de sessão, persistência, rejeição de ficheiros corrompidos e limites de taxa.

Os testes local_chat, chat_background, image_studio e video_web fazem login com administradores de teste isolados; não há desvio de autenticação de produção. As palavras-passe reais são introduzidas pelo utilizador e não devem ser guardadas em testes ou documentação.
