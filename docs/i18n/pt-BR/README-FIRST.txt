Português (Brasil) | ../README.md
Esses documentos são traduções automáticas de textos de projetos públicos e nem todos foram revisados por falantes nativos. Consulte a fonte em inglês ou chinês para ambiguidade técnica. Nenhum dado privado do usuário está incluído.

Local AI Studio: pacote fonte de migração para um Mac Apple Silicon novo

Esta versão revisada inclui fonte frontend/backend, testes, manifestos de download de modelo, dependências fixadas, fonte de mecanismo nativo e patches experimentais de vídeo da Apple. Pode ficar atrás do desenvolvimento ou da produção local.
Exclui pesos, ambientes virtuais, tarefas anteriores, imagens de referência, registros de chat, configuração de contas e segredos. Não é um app de um clique.

Entregue esta pasta inteira a um assistente de codificação no Mac de destino, incluindo INSTALL-PROMPT.en.txt.
A máquina de validação original era um M2 Max com memória 96GB. Verifique primeiro o modelo de destino, a memória e o sistema operacional. Não reutilize cegamente as configurações de vídeo em Macs com pouca memória.

Conteúdo:
 src/ Frontend, backend, ferramentas download/validation, manifestos de modelo
 Testes tests/; alguns requerem models/services. instalado Não execute todos indiscriminadamente
 requirements/viggle-pinned.txt Ambiente de imagem fixada
 src/h3_requirements.lock Ambiente de vídeo fixado separado
 vendor/ Fonte nativa sem binários compilados; reter licenças upstream
 patches/ ComfyUI/ClipProj confirma e implanta alterações em Python
 Somas de verificação por arquivo SHA256SUMS.txt

Pontos de entrada do modelo: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (base model/adapters), wai_model.json, upscale_model.json e h3_apple_models.json (vídeo), em src/. Verifique cada manifesto e seu instalador antes de fazer o download.
Modelo de texto: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, arquivo Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Este pacote não inclui um revision/hash fixo completo para esse modelo. Obtenha e registre primeiro metadados upstream confiáveis; não reivindique equivalência byte por byte com a máquina original.

Uma instalação de máquina nova não foi validada. Revise os caminhos da máquina original, os aliases do modelo e os caminhos das ferramentas do sistema para o usuário alvo. Não reaplique patches históricos a fontes de fornecedores já modificadas. Um download bem-sucedido não é evidência de inferência bem-sucedida ou de qualidade aceitável.

Use o menu de idiomas no canto superior direito para escolher os idiomas 33. O navegador lembra sua seleção. Os pacotes de idiomas são servidos localmente; mudar de idioma não envia conteúdo para um serviço de tradução online. As solicitações do usuário, as conversas e o conteúdo salvo mantêm o idioma original.
