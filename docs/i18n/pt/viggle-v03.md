[Português](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Estes documentos são traduções automáticas de textos de projetos públicos e nem todos foram revistos por falantes nativos. Consulte a fonte em inglês ou chinês para obter ambiguidade técnica. Nenhum dado privado do utilizador está incluído.

# Instalação e modos de Viggle v0.3

Fonte oficial: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Revisão fixada, tamanhos e hashes: `src/viggle_turbo_v03_model.json`. Instalador: `src/install_viggle_turbo_v03.py`. Utiliza um diretório `models/viggle-qwen-turbo-v03` separado enquanto partilha o modelo básico instalado e o ambiente Python existente. Não atualiza dependências nem sobrescreve v0.1/v0.2.1.

O menu do modelo de imagem oferece:

- **Viggle v0.3 · Passos 6, imagens mais limpas**: programação sigma oficial de seis node, CFG1.
- **Viggle v0.3 · Passos 9, detalhes melhorados**: sete passos Turbo, depois desative o LoRA, mude a próxima passagem KV em cache para extração e utilize o modelo base para os dois passos finais. LoRA e o comportamento de encaminhamento são restaurados posteriormente. A simples definição de uma contagem regular de passos para nove não é equivalente.

v0.3 suporta até três referências, nenhum prompt negativo e um quadrado 1024px padrão quando selecionado. O padrão v0.2.1 anterior e as dimensões do iPhone mantêm-se; o modelo original suporta ainda dez referências. Os tamanhos grandes nativos, os ladrilhos VAE e o pós-processamento 8K existente permanecem selecionáveis, mas nem todas as combinações foram testadas.

O LoRA não está fundido nos pesos BF16; a força é 1. O planeador `shift_terminal` deve ser null. v0.3 pode ser menos granulado, mas um pouco mais suave; não é garantido que supere as versões mais antigas em todos os casos. Os índices oficiais de tempo de nove etapas não são referências locais.

## Validação

O `tests/viggle_model.mjs` utiliza acessórios de modelo esparso isolados para verificar contagens de passos, limites de referência, encaminhamento de grandes dimensões e marcadores de prontidão. O `tests/viggle_schedule.py` verifica a desativação do LoRA após o passo sete, uma reextração e restauração do KV.

Uma amostra de copo azul 512 × 512 de seis passos, semente-42, concluída em 52.98s, incluindo o carregamento de process/model. As dimensões e a imagem real foram verificadas. A primeira tentativa de nove passos foi interrompida quando uma nova ligação de texto acionou a proteção de recursos; isto não foi um erro de inferência.

A nova tentativa de nove passos concluída em 65.42s em 512×512, semente 42. Mudou para o modelo básico após o passo sete, completou nove passos e produziu as dimensões corretas. A inspeção visual não encontrou qualquer ruído green/magenta. Uma amostra por modo não é uma referência de desempenho estável. Múltiplas referências, imagens grandes e pós-processamento 8K não foram validados por estas execuções.
