# Game Design Document - Grand Strategy Geopolítico

## Documentação do Projeto

Este repositório contém a documentação completa do Game Design Document (GDD) para um grand strategy mobile focado em simulação geopolítica real.

---

## Documentos

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [GDD Original](./GDD-v0.1-original.md) | Documento de design inicial (v0.1) | Draft |
| [Análise e Revisão](./GDD-review-analysis.md) | Análise de lacunas e recomendações | Completo |
| [Sistemas Detalhados](./GDD-systems-detailed.md) | Especificação completa de todos os sistemas | Completo |
| [Eventos e Balanceamento](./GDD-events-balancing.md) | Sistema de eventos e fórmulas de balanceamento | Completo |
| [Arquitetura Técnica](./GDD-technical-architecture.md) | Especificações técnicas de implementação | Completo |
| [Plano de Implementação](./GDD-implementation-plan.md) | Roadmap detalhado com tarefas | Completo |

---

## Visão Geral do Projeto

### Conceito
Grand strategy mobile onde o jogador assume o controle de um país real no contexto geopolítico de 2025, com integração de IA para contextos históricos e narrativa dinâmica.

### Pilares de Design
1. **Honestidade Ideológica** — Política como mecânica central
2. **Verdade Histórica** — Paralelos históricos reais
3. **Consequências Realistas** — Simulação coerente
4. **Acessibilidade Mobile** — Sessões de 15-30 minutos
5. **Educação Integrada** — Aprendizado orgânico

### Países Jogáveis (V1)
- Brasil
- Estados Unidos
- China
- Rússia
- Índia
- África do Sul

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
└── GDD-implementation-plan.md    # Plano de implementação
```

---

## Próximos Passos

1. Revisar e aprovar documentação
2. Definir nome do jogo
3. Iniciar Fase 0 (Setup)
4. Recrutar equipe se necessário

---

*Versão: 1.0 — Dezembro 2025*
