[Português](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Estes documentos são traduções automáticas de textos de projetos públicos e nem todos foram revistos por falantes nativos. Consulte a fonte em inglês ou chinês para obter ambiguidade técnica. Nenhum dado privado do utilizador está incluído.

# MacBook Pro Studio

Um estúdio local de imagem, chat e vídeo experimental para Macs Apple Silicon.

## Idioma da interface

Utilize o menu de idiomas no canto superior direito para escolher os idiomas 33. O navegador recorda a sua seleção. Os pacotes de idiomas são servidos localmente; mudar de idioma não envia conteúdo para um serviço de tradução online. Os pedidos do utilizador, as conversas e o conteúdo guardado mantêm o idioma original.

## Pré-visualizações da interface

Estas visualizações utilizam os estilos de página libertados. Todos os avisos, IDs de tarefas, carimbos de data/hora, ilustrações e conversas são conteúdo de demonstração fictício criado para este README. Não contêm contas reais, imagens de utilizadores ou registos de chat. As ilustrações são desenhadas de forma programática e não são referências de modelo ou declarações de qualidade.

### Estúdio de imagem

Escolha um modelo, introduza um aviso e navegue pelas tarefas e resultados de imagens.

![Estúdio de imagem com tarefas fictícias e ilustrações de paisagens desenhadas programaticamente](../../images/image-studio-demo.en.png)

### Chat local

Converse no mesmo estúdio e selecione um modo e duração de resposta.

![Chat local com uma conversa fictícia de planeamento de ilustração escrita manualmente](../../images/chat-studio-demo.en.png)

## Configurar um novo Mac

1. Clone este repositório.
2. Leia o [guia de implementação](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Forneça o [prompt de instalação](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) para um assistente de codificação no Mac de destino para instalar dependências e descarregar o models apropriado para esse hardware.

Páginas: `/edit` para imagens, `/chat` para chat, `/video` para vídeo. A porta web predefinida é `1235`.

Este repositório é uma versão revista e uma cópia de migração. Pode ficar atrás do desenvolvimento ou da produção local. Exclui pesos de modelo, ambientes virtuais, tarefas de utilizador, registos de chat, imagens de referência e configuração de conta. Uma instalação completa numa máquina nova não foi validada. Este não é um aplicativo de um clique.

## Conteúdo do repositório

- `src/`: frontend, backend, manifestos de modelo, ferramentas de instalação e validação.
- `tests/`: testes; alguns requerem models instalado ou serviços em execução.
- `requirements/`: dependências fixadas.
- `vendor/`: motor de origem nativo, com licenças upstream retidas.
- `patches/`: versões fixas e adaptações da Apple.

Os modelos e fontes de terceiros mantêm as suas licenças a montante. O suporte H3/ClipProj da Apple é experimental. Uma pequena amostra bem-sucedida não estabelece suporte para todas as resoluções ou durações.

## Login e contas

No Mac que executa o serviço, abra o `http://127.0.0.1:1235/setup` para criar o primeiro administrador e inicie sessão noutros dispositivos. Os administradores podem criar, desativar e eliminar contas e repor palavras-passe. Consulte [documentação da conta](accounts.md) ([中文](../../accounts.md)). Não existe senha padrão. Os ficheiros da conta permanecem no diretório de dados runtime e não devem ser carregados. As tarefas permanecem como dados de estúdio partilhados.

## Viggle v0.3

Estão disponíveis modos de detalhe separados de seis e nove passos, com o padrão anterior mantido. Consulte [instalação e validação](viggle-v03.md) ([中文](../../viggle-v03.md)). Transfira os pesos dos modelos separadamente no Mac de destino.
