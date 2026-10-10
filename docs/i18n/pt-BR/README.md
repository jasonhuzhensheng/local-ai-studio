[Português (Brasil)](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Esses documentos são traduções automáticas de textos de projetos públicos e nem todos foram revisados por falantes nativos. Consulte a fonte em inglês ou chinês para ambiguidade técnica. Nenhum dado privado do usuário está incluído.

# MacBook Pro Studio

Um estúdio local de imagem, bate-papo e vídeo experimental para Macs Apple Silicon.

## Idioma da interface

Use o menu de idiomas no canto superior direito para escolher os idiomas 33. O navegador lembra sua seleção. Os pacotes de idiomas são servidos localmente; mudar de idioma não envia conteúdo para um serviço de tradução online. As solicitações do usuário, as conversas e o conteúdo salvo mantêm o idioma original.

## Pré-visualizações da interface

Essas visualizações usam os estilos de página liberados. Todos os prompts, IDs de tarefas, carimbos de data/hora, ilustrações e conversas são conteúdo de demonstração fictício criado para este README. Eles não contêm contas reais, imagens de usuários ou registros de bate-papo. As ilustrações são desenhadas de forma programática e não são referências de modelo ou declarações de qualidade.

### Estúdio de imagem

Escolha um modelo, insira um prompt e navegue pelas tarefas e resultados de imagens.

![Estúdio de imagem com tarefas fictícias e ilustrações de paisagens desenhadas programaticamente](../../images/image-studio-demo.en.png)

### Bate-papo local

Converse no mesmo estúdio e selecione um modo e duração de resposta.

![Bate-papo local com uma conversa fictícia de planejamento de ilustração escrita manualmente](../../images/chat-studio-demo.en.png)

## Configure um novo Mac

1. Clone este repositório.
2. Leia o [guia de implantação](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Forneça o [prompt de instalação](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) para um assistente de codificação no Mac de destino para instalar dependências e baixar models apropriado para esse hardware.

Páginas: `/edit` para imagens, `/chat` para bate-papo, `/video` para vídeo. A porta da web padrão é `1235`.

Este repositório é uma versão revisada e uma cópia de migração. Pode ficar atrás do desenvolvimento ou da produção local. Exclui pesos de modelo, ambientes virtuais, tarefas de usuário, registros de chat, imagens de referência e configuração de conta. Uma instalação completa em uma máquina nova não foi validada. Este não é um aplicativo de um clique.

## Conteúdo do repositório

- `src/`: frontend, backend, manifestos de modelo, ferramentas de instalação e validação.
- `tests/`: testes; alguns requerem models instalado ou serviços em execução.
- `requirements/`: dependências fixadas.
- `vendor/`: motor de origem nativo, com licenças upstream retidas.
- `patches/`: versões fixadas e adaptações da Apple.

Os modelos e fontes de terceiros mantêm suas licenças upstream. O suporte H3/ClipProj da Apple é experimental. Uma pequena amostra bem-sucedida não estabelece suporte para todas as resoluções ou durações.

## Login e contas

No Mac que executa o serviço, abra `http://127.0.0.1:1235/setup` para criar o primeiro administrador e faça login em outros dispositivos. Os administradores podem criar, desativar e excluir contas e redefinir senhas. Consulte [documentação da conta](accounts.md) ([中文](../../accounts.md)). Não há senha padrão. Os arquivos da conta permanecem no diretório de dados runtime e não devem ser carregados. As tarefas permanecem como dados de estúdio compartilhados.

## Viggle v0.3

Estão disponíveis modos de detalhes separados de seis e nove etapas, com o padrão anterior mantido. Consulte [instalação e validação](viggle-v03.md) ([中文](../../viggle-v03.md)). Baixe os pesos dos modelos separadamente no Mac de destino.
