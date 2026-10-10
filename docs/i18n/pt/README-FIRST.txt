Português | ../README.md
Estes documentos são traduções automáticas de textos de projetos públicos e nem todos foram revistos por falantes nativos. Consulte a fonte em inglês ou chinês para obter ambiguidade técnica. Nenhum dado privado do utilizador está incluído.

Local AI Studio: pacote fonte de migração para um Mac Apple Silicon novo

Esta versão revista inclui a fonte frontend/backend, testes, manifestos de download de modelo, dependências fixadas, fonte de motor nativo e patches experimentais de vídeo da Apple. Pode ficar atrás do desenvolvimento ou da produção local.
Exclui pesos, ambientes virtuais, tarefas anteriores, imagens de referência, registos de chat, configuração de contas e segredos. Não é um app de um clique.

Entregue esta pasta inteira a um assistente de codificação no Mac de destino, incluindo o INSTALL-PROMPT.en.txt.
A máquina de validação original era um M2 Max com memória 96GB. Verifique primeiro o modelo de destino, a memória e o sistema operativo. Não reutilize cegamente as definições de vídeo em Macs com pouca memória.

Conteúdo:
 src/ Frontend, backend, ferramentas download/validation, manifestos de modelo
 Testes tests/; alguns requerem models/services. instalado Não execute todos indiscriminadamente
 requirements/viggle-pinned.txt Ambiente de imagem fixada
 src/h3_requirements.lock Ambiente de vídeo fixado separado
 vendor/ Fonte nativa sem binários compilados; reter licenças a montante
 patches/ ComfyUI/ClipProj confirma e implementa alterações em Python
 Somas de verificação por ficheiro SHA256SUMS.txt

Pontos de entrada do modelo: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (base model/adapters), wai_model.json, upscale_model.json e h3_apple_models.json (vídeo), em src/. Verifique cada manifesto e o seu instalador antes de fazer o download.
Modelo de texto: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, ficheiro Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Este pacote não inclui um revision/hash fixo completo para esse modelo. Obtenha e registe primeiro metadados upstream fiáveis; não reivindique a equivalência byte a byte com a máquina original.

Uma instalação de uma nova máquina não foi validada. Reveja os caminhos da máquina original, os aliases do modelo e os caminhos das ferramentas do sistema para o utilizador alvo. Não reaplique patches históricos a fontes de fornecedores já modificadas. Um download bem-sucedido não é evidência de inferência bem-sucedida ou de qualidade aceitável.

Utilize o menu de idiomas no canto superior direito para escolher os idiomas 33. O navegador recorda a sua seleção. Os pacotes de idiomas são servidos localmente; mudar de idioma não envia conteúdo para um serviço de tradução online. Os pedidos do utilizador, as conversas e o conteúdo guardado mantêm o idioma original.
