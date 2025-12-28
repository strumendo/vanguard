# VOLUTION — Game Design Document

> *"O destino gira. Você decide."*

## Documentação do Projeto

Este repositório contém a documentação completa do Game Design Document (GDD) para **VOLUTION**, um grand strategy mobile focado em simulação geopolítica real.

---

## Documentos

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [GDD Original](./GDD-v0.1-original.md) | Documento de design inicial (v0.1) | ✅ Atualizado |
| [Análise e Revisão](./GDD-review-analysis.md) | Análise de lacunas e recomendações | ✅ Completo |
| [Sistemas Detalhados](./GDD-systems-detailed.md) | Especificação completa de todos os sistemas | ✅ Completo |
| [Eventos e Balanceamento](./GDD-events-balancing.md) | Sistema de eventos e fórmulas de balanceamento | ✅ Completo |
| [Arquitetura Técnica](./GDD-technical-architecture.md) | Especificações técnicas de implementação | ✅ Completo |
| [Plano de Implementação](./GDD-implementation-plan.md) | Roadmap detalhado com tarefas | ✅ Completo |
| [IA de NPCs](./GDD-npc-ai-logic.md) | Lógica de IA para países não-jogáveis | ✅ Completo |

### Dados dos Países

| País | Arquivo | Status |
|------|---------|--------|
| 🇧🇷 Brasil | [brazil.json](./data/countries/brazil.json) | ✅ Completo |
| 🇺🇸 Estados Unidos | [usa.json](./data/countries/usa.json) | ✅ Completo |
| 🇨🇳 China | [china.json](./data/countries/china.json) | ✅ Completo |
| 🇷🇺 Rússia | [russia.json](./data/countries/russia.json) | ✅ Completo |
| 🇮🇳 Índia | [india.json](./data/countries/india.json) | ✅ Completo |
| 🇿🇦 África do Sul | [south_africa.json](./data/countries/south_africa.json) | ✅ Completo |

---

## Visão Geral do Projeto

### O Nome

**VOLUTION** vem da raiz latina *volvere* (girar), presente em:
- **E**volution — Evolução, desenvolvimento gradual
- **Re**volution — Revolução, ruptura transformadora
- **In**volution — Involução, regressão
- **De**volution — Descentralização de poder
- **Con**tinuation — Continuação do status quo

Cada caminho representa uma possibilidade no jogo.

### Conceito

**VOLUTION** é um grand strategy mobile onde o jogador assume o controle de um país real no contexto geopolítico de 2025, com integração de IA para contextos históricos e narrativa dinâmica.

O diferencial é a honestidade política: o jogo não esconde ideologias, mas as coloca como mecânica central, permitindo ao jogador explorar caminhos históricos reais de transformação social.

### Classificação

| Campo | Valor |
|-------|-------|
| **Classificação Etária** | 16+ |
| **Play Store** | Teen (Violence, Political Themes) |
| **App Store** | 12+ (Infrequent/Mild Realistic Violence) |

### Pilares de Design

1. **Honestidade Ideológica** — Política como mecânica central
2. **Verdade Histórica** — Paralelos históricos reais
3. **Consequências Realistas** — Simulação coerente
4. **Acessibilidade Mobile** — Sessões de 15-30 minutos
5. **Educação Integrada** — Aprendizado orgânico

### Países Jogáveis (V1)

- 🇧🇷 Brasil
- 🇺🇸 Estados Unidos
- 🇨🇳 China
- 🇷🇺 Rússia
- 🇮🇳 Índia
- 🇿🇦 África do Sul

### Sistemas Principais

- **Política Interna** — Aprovação, grupos sociais, eleições
- **Economia** — PIB, inflação, setores, políticas
- **Diplomacia** — Relações bilaterais, organizações
- **Conflito** — Tensão interna, militar, guerra civil

---

## Stack Tecnológica

| Componente | Tecnologia |
|------------|------------|
| Game Engine | Unity 2022 LTS |
| Backend | Node.js + Fastify |
| Database | PostgreSQL |
| Cache | Redis |
| AI/LLM | Claude API (Anthropic) |
| Vector DB | Pinecone |
| Cloud | AWS |

---

## Estrutura de Arquivos

```
docs/
├── README.md                      # Este arquivo
├── GDD-v0.1-original.md          # Documento original
├── GDD-review-analysis.md        # Análise e revisão
├── GDD-systems-detailed.md       # Sistemas detalhados
├── GDD-events-balancing.md       # Eventos e balanceamento
├── GDD-technical-architecture.md # Arquitetura técnica
├── GDD-implementation-plan.md    # Plano de implementação
├── GDD-npc-ai-logic.md           # Lógica de IA para NPCs
└── data/
    └── countries/
        ├── brazil.json
        ├── usa.json
        ├── china.json
        ├── russia.json
        ├── india.json
        └── south_africa.json
```

---

## Próximos Passos

1. ✅ ~~Revisar e aprovar documentação~~
2. ✅ ~~Definir nome do jogo~~ → **VOLUTION**
3. ✅ ~~Criar dados dos 6 países~~
4. ✅ ~~Especificar IA de NPCs~~
5. ⏳ Iniciar Fase 0 (Setup do Projeto)
6. ⏳ Criar eventos detalhados para cada país
7. ⏳ Desenvolver wireframes de UI
8. ⏳ Recrutar equipe se necessário

---

*Versão: 1.1 — Janeiro 2025*
