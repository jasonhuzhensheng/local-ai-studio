[Português (Brasil)](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Esses documentos são traduções automáticas de textos de projetos públicos e nem todos foram revisados por falantes nativos. Consulte a fonte em inglês ou chinês para ambiguidade técnica. Nenhum dado privado do usuário está incluído.

# Contas de sites

## Uso

No Mac que executa o serviço, abra `http://127.0.0.1:1235/setup` para criar o primeiro administrador. Os nomes de usuário contêm letras, dígitos, sublinhados ou hifens 3–32 e são normalizados para letras minúsculas. As senhas contêm caracteres 12–128. Não há credenciais padrão. Os dispositivos remotos não podem reivindicar a conta de administrador inicial.

Após a configuração, os dispositivos não autenticados verão a página de login. Abra **Conta/Sair** (`/account`) para alterar sua senha ou sair. Os administradores podem criar users/administrators, redefinir senhas, contas disable/enable, alterar funções e excluir contas. As alterações de exclusão e permissão exigem confirmação. O servidor impede a exclusão, desabilitação ou rebaixamento do último administrador habilitado. Excluir uma conta não exclui tarefas compartilhadas.

Use o menu de idiomas no canto superior direito para escolher os idiomas 33. O navegador lembra sua seleção. Os pacotes de idiomas são servidos localmente; mudar de idioma não envia conteúdo para um serviço de tradução online. As solicitações do usuário, as conversas e o conteúdo salvo mantêm o idioma original.

Este é um estúdio compartilhado. Os usuários conectados compartilham acesso a imagens, vídeos e tarefas de bate-papo no servidor. O histórico de bate-papo do navegador permanece em localStorage. Não há isolamento multilocatário, armazenamento de tarefas por usuário ou cobrança. A restrição existente de vídeo apenas local permanece.

## Armazenamento e proteção

- `src/studio_auth.mjs` é executado antes das rotas comerciais, incluindo APIs e arquivos image/reference/video. Redirecionamento de páginas não autenticadas com 303; APIs e mídia retornam 401. Os ativos da conta, os ativos linguísticos e o status setup/sign-in não secreto são públicos.
- Arquivo de conta: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, padrão `app/.local/auth/users.json`; a implantação dedicada usa `runtime/auth/users.json`. Modo diretório: 0700; modo de arquivo: 0600. As senhas usam scrypt N32768/r8/p1, sais aleatórios e comparação de hash em tempo constante. As gravações são atômicas e as alterações da conta serializadas. Um banco de dados existente corrompido impede a inicialização em vez de reabrir o registro.
- As sessões usam bytes aleatórios 32; o servidor armazena apenas o resumo. Os cookies são HttpOnly, SameSite=Strict, válidos para as horas 12. A reinicialização requer login novamente. Alterações, redefinições, desativação e exclusão de Password/role revogam as sessões afetadas. Sair não exclui nem executa novamente tarefas já iniciadas.
- As gravações requerem Origin e JSON da mesma origem. X-Forwarded-For não é confiável. Cada IP de origem obtém no máximo 15 sign-in/setup/self-password-change tentativas por 15 minutos. Limites: derivações de senha simultâneas 4 e contas 100. Reiniciar limpa os limites de tentativas.
- A implantação existente usa HTTP sobre Tailscale privado. Tailscale criptografa o transporte dispositivo a dispositivo; O HTTP comum da LAN em si não. O acesso público e o TLS não são configurados por este pacote. Os cookies Secure são definidos apenas para solicitações TLS nativas. Não o exponha diretamente por HTTP público.
- Nunca carregue o banco de dados de autenticação, sessões ou senhas. Inicialize novas contas ao migrar. stdio MCP, LM Studio local e permissões de arquivo do sistema operacional estão fora da autenticação do site.

## Validação

Execute `node tests/studio_auth.mjs` com seu banco de dados de contas temporário e nenhum models real. Abrange bloqueio API/media não autenticado, restrições de origem de configuração inicial, funções, modos de senha hashing/file, proteção do último administrador, revogação de sessão, persistência, rejeição de arquivo corrompido e limites de taxa.

Os testes local_chat, chat_background, image_studio e video_web fazem login com administradores de teste isolados; não há desvio de autenticação de produção. As senhas reais são inseridas pelo usuário e não devem ser salvas em testes ou documentações.
