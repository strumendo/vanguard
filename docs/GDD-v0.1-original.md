# GAME DESIGN DOCUMENT

## [Nome do Jogo — A Definir]

**Grand Strategy Mobile com Simulação Geopolítica Real**

---

**Versão:** 0.1 — Draft Inicial
**Data:** Dezembro 2025
**Status:** Em Desenvolvimento

---

# 1. Visão Geral

## 1.1 Conceito

Um grand strategy mobile onde o jogador assume o controle de um país real no contexto geopolítico de 2025. O diferencial é a honestidade política: o jogo não esconde ideologias, mas as coloca como mecânica central, permitindo ao jogador explorar caminhos históricos reais de transformação social — seja para consolidar o sistema vigente ou para rompê-lo através de revolução.

A IA é integrada como motor narrativo e educacional, trazendo contexto histórico, paralelos com eventos reais e recomendações de literatura para cada decisão do jogador.

## 1.2 Informações Básicas

| Campo | Valor |
|-------|-------|
| **Título** | [A Definir] |
| **Gênero** | Grand Strategy / Simulação Política |
| **Plataformas** | iOS, Android (Mobile-first) |
| **Público-alvo** | 18+ · Interessados em política, história e geopolítica |
| **Classificação** | 16+ (temas políticos complexos) |
| **Sessão típica** | 15-30 minutos |
| **Modo de jogo** | Single-player (multiplayer em roadmap futuro) |

## 1.3 Pitch

> *"Assuma um país real. Enfrente a geopolítica atual. Reescreva a história — com a verdade histórica como seu guia."*

## 1.4 Pilares de Design

1. **Honestidade Ideológica:** O jogo não esconde política — ela é a mecânica central.
2. **Verdade Histórica:** Decisões são contextualizadas com paralelos históricos reais e literatura.
3. **Consequências Realistas:** Ações têm reações coerentes com a dinâmica geopolítica real.
4. **Acessibilidade Mobile:** Complexidade de grand strategy adaptada para sessões curtas e toque.
5. **Educação Integrada:** Aprender sobre história e política é parte orgânica da experiência.

---

# 2. Gameplay

## 2.1 Core Loop

O ciclo fundamental do jogo segue uma estrutura de decisão-consequência-adaptação:

1. **Avaliar:** O jogador analisa o estado atual do país (economia, aprovação, tensões).
2. **Decidir:** Toma decisões políticas, econômicas ou diplomáticas.
3. **Contextualizar:** A IA apresenta paralelos históricos e possíveis consequências.
4. **Executar:** A decisão é implementada e o tempo avança.
5. **Reagir:** O mundo reage — grupos internos, outros países, mercados.
6. **Adaptar:** O jogador ajusta sua estratégia baseado nos resultados.

## 2.2 Sistema de Objetivos

Ao iniciar uma partida, o jogador define seu objetivo ideológico/político. Isso personaliza tutoriais, eventos, métricas de vitória e desafios.

| Objetivo | Descrição | Desafios Típicos |
|----------|-----------|------------------|
| **Estabilidade Democrática** | Fortalecer instituições, reduzir polarização, manter liberdades | Desinformação, extremismos, pressão econômica |
| **Hegemonia Capitalista** | Maximizar crescimento, atrair investimentos, liberalizar economia | Desigualdade, dependência externa, instabilidade social |
| **Transição Socialista** | Reformas graduais rumo a economia planificada e justiça social | Fuga de capitais, sanções, sabotagem, golpes |
| **Revolução Popular** | Ruptura radical via mobilização de massas | Repressão, guerra civil, isolamento internacional |
| **Autoritarismo Nacionalista** | Consolidar poder, suprimir oposição, controlar narrativa | Resistência interna, sanções, êxodo de talentos |
| **Soberania Regional** | Liderar bloco regional, reduzir dependência de potências | Pressão diplomática, guerra econômica, divisões internas |

---

# 3. Sistemas Principais

O jogo é estruturado em 4 pilares sistêmicos interconectados. Cada decisão em um pilar afeta os outros, criando uma simulação orgânica e realista.

## 3.1 Política Interna

Gerencia a dinâmica política doméstica do país.

### Métricas

- **Aprovação Popular** (0-100%): Suporte geral da população ao governo.
- **Estabilidade** (0-100): Coesão institucional e ordem pública.
- **Polarização** (0-100): Nível de divisão ideológica na sociedade.
- **Legitimidade** (0-100): Percepção de autoridade legítima do governo.

### Grupos Sociais

Cada grupo tem opinião sobre o governo, posição ideológica e capacidade de mobilização:

- Trabalhadores urbanos
- Classe média
- Elite empresarial / Oligarquia
- Militares
- Rurais / Agricultores
- Jovens / Estudantes
- Religiosos
- Mídia / Intelectuais

### Ações Disponíveis

- Reformas constitucionais e legislativas
- Nomeação de ministros e gabinete
- Regulação de mídia e redes sociais
- Políticas de segurança pública
- Programas sociais e de renda
- Discursos e posicionamentos públicos

## 3.2 Economia

Simula a economia nacional com foco em decisões macro e suas consequências sociais.

### Métricas

- **PIB e Crescimento:** Tamanho e velocidade de expansão da economia.
- **Inflação:** Variação de preços — afeta poder de compra e aprovação.
- **Desemprego:** Taxa de desocupação — afeta estabilidade e aprovação.
- **Dívida Pública:** Relação dívida/PIB — limita capacidade de gastos.
- **Desigualdade (Gini):** Concentração de renda — afeta coesão social.
- **Reservas Internacionais:** Capacidade de defesa cambial.

### Setores Econômicos

- Agricultura e recursos naturais
- Indústria e manufatura
- Serviços e tecnologia
- Energia (petróleo, renováveis)
- Finanças e mercado de capitais

### Ações Disponíveis

- Política fiscal (impostos, gastos, austeridade)
- Política monetária (juros, emissão)
- Nacionalização ou privatização
- Acordos comerciais
- Investimento em infraestrutura
- Reforma trabalhista

## 3.3 Diplomacia

Gerencia relações com outros países e organizações internacionais.

### Métricas por Relação

- **Opinião** (-100 a +100): De hostilidade a aliança.
- **Dependência Econômica** (0-100%): Quanto seu comércio depende deste país.
- **Alinhamento Ideológico** (-100 a +100): Proximidade política.

### Organizações Internacionais

- ONU e agências especializadas
- FMI e Banco Mundial
- BRICS+
- OTAN (se aplicável)
- Blocos regionais (Mercosul, União Africana, ASEAN)
- OMC

### Ações Disponíveis

- Estabelecer ou romper relações diplomáticas
- Propor ou aceitar alianças
- Negociar acordos comerciais
- Aplicar ou sofrer sanções
- Entrar ou sair de organizações
- Soft power (cultura, ajuda humanitária)

## 3.4 Geopolítica e Conflito

Gerencia tensões, influência regional e conflitos. Na versão inicial, apenas guerras civis são simuladas em detalhe; conflitos internacionais serão adicionados em atualizações futuras.

### Métricas

- **Tensão Interna** (0-100): Risco de conflito civil.
- **Força Militar** (índice): Capacidade de defesa e projeção.
- **Influência Regional** (0-100): Peso nas decisões regionais.
- **Soft Power** (0-100): Influência cultural e diplomática.

### Guerra Civil (V1)

Se Tensão Interna ultrapassar limiar crítico, guerra civil pode eclodir. O sistema simula:

- Facções em conflito (baseadas em grupos sociais)
- Controle territorial por região
- Apoio externo a cada facção
- Negociações de paz
- Consequências humanitárias

### Ações Disponíveis

- Investimento militar
- Operações de inteligência
- Apoio a movimentos em outros países
- Mediação de conflitos
- Repressão ou diálogo com insurgentes

---

# 4. Sistema de Ideologias

O posicionamento ideológico do governo é representado em múltiplos eixos, evitando simplificações binárias. Cada decisão move o país nesses eixos.

## 4.1 Eixos Ideológicos

| Eixo | Polos |
|------|-------|
| **Econômico** | Economia Planificada ←→ Livre Mercado |
| **Liberdades** | Autoritário ←→ Libertário |
| **Identidade** | Nacionalismo ←→ Internacionalismo |
| **Mudança** | Conservador ←→ Progressista |

## 4.2 Efeitos do Posicionamento

- **Apoio de grupos:** Cada grupo social tem preferências ideológicas. Alinhamento gera apoio; divergência gera oposição.
- **Relações diplomáticas:** Países com ideologia similar tendem a cooperar; opostos geram tensão.
- **Eventos disponíveis:** Certas opções só aparecem em posições ideológicas específicas.
- **Caminhos de vitória:** O objetivo escolhido no início tem requisitos de posicionamento.

---

# 5. Integração com IA

A inteligência artificial é integrada como motor narrativo e educacional, diferenciando o jogo de grand strategies tradicionais.

## 5.1 Funções da IA

### Contextualização Histórica

Antes de decisões importantes, a IA apresenta paralelos históricos:

> *Exemplo: "Você está considerando nacionalizar o setor de energia. Historicamente, o Chile de Allende (1970-73) tentou isso e enfrentou boicote internacional e golpe militar. A Noruega conseguiu com a Statoil através de modelo híbrido. A Bolívia de Evo Morales nacionalizou gás em 2006 com relativo sucesso inicial."*

### Recomendações de Literatura

A IA sugere livros e textos relevantes para aprofundamento:

> *Exemplo: "Para entender melhor os caminhos de transição democrática ao socialismo, considere: 'A Via Chilena' de Joan Garcés, 'O Longo Século XX' de Giovanni Arrighi."*

### Geração de Eventos Dinâmicos

A IA reconhece padrões nas ações do jogador e gera eventos coerentes com a história real. Reformas agrárias podem disparar reação de latifundiários; aproximação com China pode gerar pressão americana.

### Narrador Adaptativo

O tom e perspectiva do narrador se adaptam às escolhas do jogador. Um governo autoritário terá narração diferente de um governo democrático — sem julgamento, mas com contextualização apropriada.

### Simulação de Reações

A IA simula como outros países, organizações e grupos internos reagiriam a decisões, baseado em padrões históricos e posicionamento ideológico.

## 5.2 Implementação Técnica

- **LLM para narrativa:** Geração de texto contextual via API (Claude, GPT, ou modelo local).
- **Base de conhecimento:** RAG com documentos históricos, livros e análises geopolíticas.
- **Cache inteligente:** Respostas comuns pré-geradas para reduzir latência e custo.
- **Fallback offline:** Conteúdo pré-escrito para situações sem conectividade.
- **Validação de consistência:** A IA não pode contradizer o estado atual do jogo.

---

# 6. Países Jogáveis

Na versão inicial, o foco está nas grandes potências e BRICS para garantir profundidade. Expansões futuras adicionarão mais países.

## 6.1 Lançamento (V1)

| País | Categoria | Desafios Únicos |
|------|-----------|-----------------|
| **Brasil** | BRICS / Regional | Polarização extrema, desigualdade, pressão ambiental, potência agrícola |
| **Estados Unidos** | Superpotência | Polarização, declínio hegemônico, dívida, tensão com China |
| **China** | Superpotência | Crescimento vs. controle, Taiwan, Belt and Road, demografia |
| **Rússia** | Grande Potência | Sanções, dependência de energia, conflito na Ucrânia, sucessão |
| **Índia** | BRICS / Emergente | Diversidade religiosa, Paquistão, crescimento vs. desigualdade |
| **África do Sul** | BRICS / Regional | Legado do apartheid, ANC, desigualdade, liderança africana |

## 6.2 Expansões Futuras

- **Expansão BRICS+:** Irã, Egito, Etiópia, Emirados, Arábia Saudita
- **Expansão Europa:** Alemanha, França, Reino Unido, Polônia
- **Expansão Américas:** México, Argentina, Colômbia, Venezuela
- **Expansão Ásia:** Indonésia, Japão, Coreia do Sul, Turquia

---

# 7. Interface e UX Mobile

## 7.1 Princípios de Design

1. **Toque primeiro:** Toda interação pensada para dedos, não mouse.
2. **Informação progressiva:** Dados revelados em camadas — visão geral → detalhes.
3. **Sessões respeitadas:** Auto-save constante, fácil pausar e retomar.
4. **Notificações inteligentes:** Alertas apenas para eventos críticos.
5. **Acessibilidade:** Texto escalável, modo daltônico, contraste alto.

## 7.2 Telas Principais

- **Mapa:** Visão geográfica com camadas (político, econômico, tensões). Gestos de zoom e pan.
- **Dashboard:** Métricas principais em cards deslizáveis. Acesso rápido a cada sistema.
- **Timeline:** Histórico de eventos e decisões. Controle de velocidade do tempo.
- **Decisões:** Cards de decisão com contexto da IA, opções e consequências previstas.
- **Diplomacia:** Lista de países com status de relação. Detalhes ao tocar.
- **Biblioteca:** Acesso às recomendações de literatura e contextos históricos salvos.

## 7.3 HUD Durante Gameplay

- Barra superior: Data atual, velocidade do tempo, recursos principais
- Barra inferior: Navegação entre sistemas (abas)
- Centro: Área de conteúdo contextual
- Notificações: Badge com contador, lista expansível

---

# 8. Narrativa e Tom

## 8.1 Tom Educativo

O jogo adota um tom educativo sem ser didático ou condescendente. A informação histórica e política é apresentada como ferramenta para o jogador tomar decisões informadas, não como lição de moral.

- Neutralidade apresentacional: mostrar consequências, não julgar escolhas
- Complexidade respeitada: evitar simplificações binárias (bom vs. mau)
- Fontes citadas: quando possível, indicar origem das informações

## 8.2 Narrador Adaptativo

O narrador (gerado por IA) adapta seu tom e vocabulário baseado nas escolhas do jogador:

- **Governo democrático:** Tom institucional, foco em consenso e legitimidade.
- **Governo autoritário:** Tom pragmático, foco em controle e estabilidade.
- **Governo revolucionário:** Tom mobilizador, foco em transformação e luta.

## 8.3 Sensibilidade Política

O jogo aborda temas políticos reais. Diretrizes para tratamento:

- Conflitos ativos: apresentar com cuidado, sem glorificação
- Figuras vivas: evitar representação direta, usar cargos genéricos
- Atrocidades históricas: mencionar com respeito às vítimas
- Disclaimer inicial: o jogo é simulação, não endosso de ideologias

---

# 9. Escopo Técnico

## 9.1 Stack Tecnológica (Sugestão)

| Componente | Tecnologia |
|------------|------------|
| **Engine** | Unity (C#) ou Godot — cross-platform mobile |
| **Backend** | Node.js/Python + PostgreSQL para saves e leaderboards |
| **IA/LLM** | Claude API / OpenAI API com RAG para contexto histórico |
| **Base de conhecimento** | Vector DB (Pinecone/Weaviate) com documentos históricos |
| **Analytics** | Firebase Analytics / Mixpanel |
| **Cloud** | AWS / GCP para escalabilidade |

## 9.2 Requisitos de Dispositivo

- **iOS:** iPhone 8+ / iOS 14+
- **Android:** Android 8.0+ / 3GB RAM mínimo
- **Armazenamento:** ~500MB inicial + saves
- **Conectividade:** Requer internet para IA; modo offline limitado disponível

## 9.3 Arquitetura de Dados

- **Dados estáticos:** Países, grupos, eventos base — empacotados no app
- **Dados dinâmicos:** Estado do jogo, histórico de decisões — salvo local + cloud sync
- **Dados de IA:** Cache de respostas frequentes, embeddings pré-computados
- **Atualizações:** Dados geopolíticos atualizados periodicamente via servidor

---

# 10. Monetização

## 10.1 Modelo Base

Recomendação: Premium com expansões pagas. Evita design predatório e atrai público mais engajado que busca experiência completa.

| Item | Detalhes |
|------|----------|
| **Jogo base** | $9.99 — 6 países, todos os sistemas, IA integrada |
| **Expansões de países** | $2.99-4.99 cada — pacotes regionais com novos países |
| **Cenários históricos** | $1.99 cada — pontos de início alternativos (ex: 2008, 2020) |
| **Assinatura IA+** | $2.99/mês — respostas de IA mais elaboradas e rápidas |

## 10.2 O que NÃO terá

- Energia/vidas limitadas
- Pay-to-win (vantagens mecânicas compráveis)
- Anúncios intrusivos
- Loot boxes ou gacha

---

# 11. Roadmap de Desenvolvimento

## 11.1 Fases

| Fase | Duração Est. | Entregáveis |
|------|--------------|-------------|
| **Pré-produção** | 2-3 meses | GDD finalizado, protótipo de papel, arte conceitual, arquitetura técnica |
| **Protótipo** | 3-4 meses | 1 país jogável, sistemas básicos, UI funcional, integração IA inicial |
| **Alpha** | 4-6 meses | 3 países, todos sistemas, balanceamento inicial, testes internos |
| **Beta** | 3-4 meses | 6 países, polimento, beta fechado, ajustes de balanceamento |
| **Lançamento** | - | Versão 1.0 nas lojas |
| **Pós-lançamento** | Contínuo | Expansões, atualizações de dados, multiplayer (futuro) |

## 11.2 Milestones V1 → V2

### V1 (Lançamento)

- 6 países jogáveis (Brasil, EUA, China, Rússia, Índia, África do Sul)
- 4 sistemas principais (Política, Economia, Diplomacia, Geopolítica)
- 6 objetivos de vitória
- Guerra civil apenas (sem conflitos internacionais)
- IA integrada para contexto e narrativa
- Single-player apenas

### V2 (Expansão)

- Conflitos internacionais
- Mais países via DLCs
- Multiplayer assíncrono
- Cenários históricos alternativos

---

# 12. Riscos e Mitigações

| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| **Controvérsia política** | Alta | Alto | Tom neutro, disclaimer claro, evitar figuras vivas nomeadas |
| **Custo de IA elevado** | Média | Alto | Cache agressivo, conteúdo pré-gerado, tier de assinatura |
| **Complexidade excessiva** | Alta | Alto | Tutoriais progressivos, automação de micro, testes com novatos |
| **Balanceamento difícil** | Alta | Médio | Beta longo, telemetria, suporte a mods/feedback |
| **Dados desatualizados** | Média | Médio | Pipeline de atualização, usar IA para extrapolar |
| **Rejeição nas lojas** | Baixa | Alto | Consultar guidelines antes, versão web como backup |
| **Escopo inflado** | Alta | Alto | MVP rígido, roadmap claro, cortar features se necessário |

---

# 13. Referências e Inspirações

## 13.1 Jogos de Referência

- **Victoria 3:** Simulação econômica profunda, política interna, movimentos sociais
- **Crusader Kings III:** Narrativa emergente, foco em personagens e decisões
- **Democracy 4:** Simulação política detalhada, grupos de interesse
- **Rebel Inc.:** Grand strategy mobile bem executado, decisões com consequências
- **Reigns:** UI mobile elegante, decisões binárias com impacto

## 13.2 Diferenciais Competitivos

1. **Geopolítica real e atual:** Não é fantasia ou história distante — é o mundo de 2025.
2. **IA como motor narrativo:** Contexto histórico dinâmico, não scripts pré-escritos.
3. **Honestidade ideológica:** Permite explorar qualquer caminho político sem julgamento.
4. **Educação integrada:** Aprender história e política é parte da experiência.
5. **Mobile-first de verdade:** Não é port de PC — foi pensado para toque e sessões curtas.

---

*— Fim do Documento —*

*Versão 0.1 — Dezembro 2025*
