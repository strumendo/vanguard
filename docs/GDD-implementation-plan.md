# Plano de Implementação

## [Nome do Jogo — A Definir]

**Versão:** 1.0
**Data:** Dezembro 2025

---

# 1. Resumo das Fases

| Fase | Entregáveis Principais | Critérios de Conclusão |
|------|------------------------|------------------------|
| **Fase 0: Setup** | Infraestrutura base, repositórios, CI/CD | Ambiente funcional |
| **Fase 1: Core Engine** | Loop de jogo, sistema de tempo, estado | 1 país jogável (sem UI) |
| **Fase 2: Sistemas** | Política, Economia, Diplomacia, Conflito | Todos sistemas funcionais |
| **Fase 3: Integração IA** | Contextos, eventos dinâmicos, narração | IA respondendo em jogo |
| **Fase 4: UI/UX** | Todas as telas, navegação, tutorial | Jogo jogável no mobile |
| **Fase 5: Conteúdo** | 6 países, eventos, balanceamento | Conteúdo completo V1 |
| **Fase 6: Polish** | QA, performance, acessibilidade | Release candidate |
| **Fase 7: Lançamento** | Stores, marketing, suporte | V1.0 nas lojas |

---

# 2. Fase 0: Setup Inicial

**Objetivo:** Estabelecer toda a infraestrutura e ambiente de desenvolvimento.

## 2.1 Repositórios e Estrutura

### Task 0.1: Criar Repositórios
```
[ ] Criar repo: geopolitics-game-client (Unity)
[ ] Criar repo: geopolitics-game-backend (Node.js)
[ ] Criar repo: geopolitics-game-infra (Terraform)
[ ] Criar repo: geopolitics-game-docs (Documentação)
[ ] Configurar branch protection rules
[ ] Configurar templates de PR e Issues
```

### Task 0.2: Setup Unity Project
```
[ ] Criar projeto Unity 2022 LTS
[ ] Configurar estrutura de pastas (conforme arquitetura)
[ ] Configurar .gitignore e .gitattributes
[ ] Instalar pacotes essenciais:
    [ ] TextMeshPro
    [ ] Unity UI Toolkit
    [ ] Newtonsoft.Json
    [ ] UniTask
[ ] Configurar build settings iOS/Android
[ ] Criar cenas base (Boot, MainMenu, Gameplay)
```

### Task 0.3: Setup Backend Project
```
[ ] Inicializar projeto Node.js com TypeScript
[ ] Configurar ESLint + Prettier
[ ] Configurar Jest para testes
[ ] Instalar dependências:
    [ ] fastify
    [ ] @anthropic-ai/sdk
    [ ] pg (PostgreSQL)
    [ ] ioredis
    [ ] zod
    [ ] jsonwebtoken
[ ] Criar estrutura de pastas (conforme arquitetura)
[ ] Configurar variáveis de ambiente (.env.example)
```

## 2.2 Infraestrutura

### Task 0.4: Setup AWS Base
```
[ ] Criar conta AWS dedicada
[ ] Configurar IAM users e roles
[ ] Criar VPC com subnets
[ ] Configurar Security Groups base
[ ] Setup S3 buckets:
    [ ] Assets bucket
    [ ] Backups bucket
    [ ] Terraform state bucket
```

### Task 0.5: Setup Banco de Dados
```
[ ] Criar instância RDS PostgreSQL (dev)
[ ] Configurar backup automático
[ ] Criar schema inicial (migrations)
[ ] Configurar conexão segura
[ ] Seed com dados de teste
```

### Task 0.6: Setup Redis
```
[ ] Criar ElastiCache Redis (dev)
[ ] Configurar security group
[ ] Testar conexão do backend
```

### Task 0.7: Setup CI/CD
```
[ ] Configurar GitHub Actions:
    [ ] Workflow de testes (backend)
    [ ] Workflow de lint
    [ ] Workflow de build Unity
    [ ] Workflow de deploy staging
[ ] Configurar secrets no GitHub
[ ] Criar ambiente staging na AWS
```

## 2.3 Serviços Externos

### Task 0.8: Setup Anthropic
```
[ ] Criar conta Anthropic
[ ] Obter API key
[ ] Configurar limites de uso
[ ] Testar integração básica
```

### Task 0.9: Setup Pinecone
```
[ ] Criar conta Pinecone
[ ] Criar index para RAG
[ ] Configurar dimensões e métricas
[ ] Testar inserção e busca
```

### Task 0.10: Setup Analytics
```
[ ] Criar projeto Mixpanel
[ ] Configurar eventos base
[ ] Integrar SDK no Unity
[ ] Testar tracking básico
```

---

# 3. Fase 1: Core Engine

**Objetivo:** Implementar o núcleo do jogo — loop principal, estado e tempo.

## 3.1 Game State Manager

### Task 1.1: Modelo de Estado
```
[ ] Implementar GameState.cs com todas as classes:
    [ ] PoliticsState
    [ ] EconomyState
    [ ] DiplomacyState
    [ ] MilitaryState
    [ ] IdeologyState
    [ ] SocialGroup
[ ] Implementar serialização JSON
[ ] Testes unitários para serialização
```

### Task 1.2: State Machine Central
```
[ ] Implementar GameStateMachine.cs:
    [ ] Estados: Menu, Playing, Paused, Event, GameOver
    [ ] Transições válidas
    [ ] Callbacks de entrada/saída
[ ] Testes unitários para transições
```

### Task 1.3: Save/Load System
```
[ ] Implementar SaveManager.cs:
    [ ] Save local (PlayerPrefs ou arquivo)
    [ ] Auto-save periódico
    [ ] Múltiplos slots
[ ] Implementar SaveRepository.cs (backend sync)
[ ] Testar save/load round-trip
```

## 3.2 Sistema de Tempo

### Task 1.4: Time Manager
```
[ ] Implementar TimeManager.cs:
    [ ] Controle de velocidade (pause, 1x, 2x, 3x)
    [ ] Evento OnTurnAdvanced
    [ ] Evento OnMonthChanged
    [ ] Evento OnYearChanged
[ ] Sistema de data in-game
[ ] Testes unitários
```

### Task 1.5: Turn Processor
```
[ ] Implementar TurnProcessor.cs:
    [ ] Fase 1: Atualizar métricas
    [ ] Fase 2: Processar eventos
    [ ] Fase 3: Aguardar input
    [ ] Fase 4: Processar reações
    [ ] Fase 5: Resolver turno
[ ] Ordem de processamento definida
[ ] Testes de integração
```

## 3.3 Dados Base

### Task 1.6: Country Data
```
[ ] Criar CountryData ScriptableObject
[ ] Implementar dados do Brasil:
    [ ] Valores iniciais de todas métricas
    [ ] Grupos sociais
    [ ] Posição ideológica inicial
    [ ] Relações diplomáticas iniciais
[ ] Validação de dados
```

### Task 1.7: Event Data Structure
```
[ ] Criar EventData ScriptableObject
[ ] Implementar estrutura de triggers
[ ] Implementar estrutura de opções
[ ] Implementar estrutura de efeitos
[ ] Parser de JSON para eventos
```

---

# 4. Fase 2: Sistemas Principais

**Objetivo:** Implementar os 4 pilares do jogo.

## 4.1 Sistema Político

### Task 2.1: Politics System Core
```
[ ] Implementar PoliticsSystem.cs:
    [ ] Cálculo de aprovação
    [ ] Cálculo de estabilidade
    [ ] Cálculo de polarização
    [ ] Cálculo de legitimidade
[ ] Fórmulas conforme GDD-systems-detailed.md
[ ] Testes unitários para cada fórmula
```

### Task 2.2: Social Groups Manager
```
[ ] Implementar GroupManager.cs:
    [ ] Atualização de opinião por grupo
    [ ] Cálculo de alinhamento ideológico
    [ ] Capacidade de mobilização
    [ ] Demandas dinâmicas
[ ] Testes de interação entre grupos
```

### Task 2.3: Political Actions
```
[ ] Implementar sistema de ações políticas:
    [ ] Reformas legislativas
    [ ] Decretos executivos
    [ ] Discursos
    [ ] Nomeações
[ ] Custo político de cada ação
[ ] Efeitos aplicados corretamente
```

### Task 2.4: Election System
```
[ ] Implementar ElectionSystem.cs:
    [ ] Ciclo eleitoral por país
    [ ] Fase de campanha
    [ ] Cálculo de votos
    [ ] Resultado e consequências
[ ] Teste de eleição completa
```

## 4.2 Sistema Econômico

### Task 2.5: Economy System Core
```
[ ] Implementar EconomySystem.cs:
    [ ] Cálculo de PIB e crescimento
    [ ] Cálculo de inflação
    [ ] Cálculo de desemprego
    [ ] Cálculo de dívida
    [ ] Cálculo de Gini
[ ] Fórmulas conforme documentação
[ ] Testes unitários
```

### Task 2.6: Sector Manager
```
[ ] Implementar SectorManager.cs:
    [ ] 5 setores econômicos
    [ ] Propriedade (estatal/privada/estrangeira)
    [ ] Produtividade
    [ ] Emprego por setor
[ ] Interações entre setores
```

### Task 2.7: Economic Policies
```
[ ] Implementar políticas fiscais:
    [ ] Alteração de impostos
    [ ] Gastos públicos
    [ ] Austeridade
[ ] Implementar políticas monetárias:
    [ ] Taxa de juros
    [ ] Emissão de moeda
[ ] Implementar políticas estruturais:
    [ ] Nacionalização
    [ ] Privatização
    [ ] Investimento em infra
```

## 4.3 Sistema Diplomático

### Task 2.8: Diplomacy System Core
```
[ ] Implementar DiplomacySystem.cs:
    [ ] Relações bilaterais
    [ ] Cálculo de opinião
    [ ] Dependência comercial
    [ ] Alinhamento ideológico
[ ] Matriz de relações iniciais
```

### Task 2.9: Organization System
```
[ ] Implementar OrganizationSystem.cs:
    [ ] ONU
    [ ] FMI/Banco Mundial
    [ ] BRICS+
    [ ] Blocos regionais
[ ] Mecânicas de cada organização
[ ] Benefícios e obrigações
```

### Task 2.10: Diplomatic Actions
```
[ ] Implementar ações diplomáticas:
    [ ] Tratados comerciais
    [ ] Alianças
    [ ] Sanções
    [ ] Entrada/saída de organizações
[ ] Reações de outros países
```

## 4.4 Sistema de Conflito

### Task 2.11: Conflict System Core
```
[ ] Implementar ConflictSystem.cs:
    [ ] Tensão interna
    [ ] Triggers de crise
    [ ] Verificação de guerra civil
[ ] Thresholds configuráveis
```

### Task 2.12: Military Manager
```
[ ] Implementar MilitaryManager.cs:
    [ ] Efetivo
    [ ] Equipamento
    [ ] Moral
    [ ] Lealdade
[ ] Orçamento militar
[ ] Ações militares
```

### Task 2.13: Civil War System (Básico)
```
[ ] Implementar CivilWarSystem.cs:
    [ ] Eclosão de guerra civil
    [ ] Facções
    [ ] Controle territorial (simplificado)
    [ ] Resolução (vitória/derrota/negociação)
[ ] Game over se perder
```

## 4.5 Sistema de Ideologia

### Task 2.14: Ideology System
```
[ ] Implementar IdeologySystem.cs:
    [ ] 4 eixos ideológicos
    [ ] Movimento por decisão
    [ ] Inércia após consolidação
    [ ] Alinhamento com grupos
[ ] Visualização de posição
```

---

# 5. Fase 3: Integração de IA

**Objetivo:** Integrar IA para contextos históricos, eventos e narração.

## 5.1 Backend AI Service

### Task 3.1: AI Service Core
```
[ ] Implementar AIService.ts no backend:
    [ ] Conexão com Anthropic API
    [ ] Rate limiting
    [ ] Error handling
    [ ] Retry logic
[ ] Testes de integração com API
```

### Task 3.2: Prompt Builder
```
[ ] Implementar PromptBuilder.ts:
    [ ] Template de contexto histórico
    [ ] Template de geração de evento
    [ ] Template de narração
    [ ] Injeção de estado do jogo
[ ] Testes de geração de prompts
```

### Task 3.3: Response Validator
```
[ ] Implementar ResponseValidator.ts:
    [ ] Validação de JSON
    [ ] Verificação de consistência
    [ ] Checagem de fatos (básica)
    [ ] Moderação de conteúdo
[ ] Testes de validação
```

### Task 3.4: RAG Service
```
[ ] Implementar RAGService.ts:
    [ ] Conexão com Pinecone
    [ ] Busca semântica
    [ ] Ranking de relevância
[ ] Popular base com documentos históricos:
    [ ] 100+ contextos políticos
    [ ] 50+ casos econômicos
    [ ] 50+ crises diplomáticas
```

## 5.2 Cache e Fallback

### Task 3.5: AI Cache System
```
[ ] Implementar CacheRepository.ts:
    [ ] Cache em Redis
    [ ] TTL configurável
    [ ] Invalidação seletiva
    [ ] Métricas de hit/miss
[ ] Pré-gerar respostas comuns (100+)
```

### Task 3.6: Offline Fallback
```
[ ] Criar catálogo de respostas offline:
    [ ] 50+ contextos genéricos
    [ ] 100+ eventos pré-escritos
    [ ] Narração padrão por tom
[ ] Implementar fallback no cliente
[ ] Testar modo offline
```

## 5.3 Cliente IA

### Task 3.7: AI Client Service
```
[ ] Implementar AIClientService.cs no Unity:
    [ ] Chamadas HTTP para backend
    [ ] Cache local
    [ ] Queue de requests
    [ ] Timeout handling
[ ] UI de loading para respostas
```

### Task 3.8: Context Display
```
[ ] Implementar ContextPanel.cs:
    [ ] Exibição de contexto histórico
    [ ] Lista de paralelos
    [ ] Recomendações de literatura
[ ] Animação de aparição
```

### Task 3.9: Dynamic Events
```
[ ] Integrar eventos gerados por IA:
    [ ] Request para backend
    [ ] Parsing de resposta
    [ ] Inserção no sistema de eventos
    [ ] Fallback se falhar
[ ] Limite de 2 eventos IA/mês
```

---

# 6. Fase 4: UI/UX

**Objetivo:** Criar toda a interface do jogo para mobile.

## 6.1 Sistema de UI Base

### Task 4.1: UI Framework Setup
```
[ ] Configurar UI Toolkit
[ ] Criar tema visual base:
    [ ] Cores
    [ ] Tipografia
    [ ] Espaçamentos
    [ ] Bordas e sombras
[ ] Componentes base:
    [ ] Button
    [ ] Card
    [ ] Modal
    [ ] Toggle
    [ ] Slider
```

### Task 4.2: Navigation System
```
[ ] Implementar NavigationManager.cs:
    [ ] Stack de telas
    [ ] Transições animadas
    [ ] Deep linking
    [ ] Back button handling
[ ] Gestos de navegação (swipe)
```

### Task 4.3: Responsive Layout
```
[ ] Sistema de layout responsivo:
    [ ] Breakpoints (phone/tablet)
    [ ] Safe areas (notch, etc)
    [ ] Orientação (portrait/landscape)
[ ] Testar em múltiplos devices
```

## 6.2 Telas Principais

### Task 4.4: Main Menu Screen
```
[ ] Implementar MainMenuScreen:
    [ ] Logo e título
    [ ] Novo Jogo
    [ ] Continuar (se houver save)
    [ ] Configurações
    [ ] Créditos
[ ] Animações de entrada
```

### Task 4.5: Country Selection Screen
```
[ ] Implementar CountrySelectScreen:
    [ ] Grid de países (6)
    [ ] Preview de cada país:
        [ ] Bandeira
        [ ] Métricas resumidas
        [ ] Dificuldade
    [ ] Botão de confirmar
```

### Task 4.6: Objective Selection Screen
```
[ ] Implementar ObjectiveSelectScreen:
    [ ] Lista de 6 objetivos
    [ ] Descrição de cada um
    [ ] Desafios associados
    [ ] Confirmação
```

### Task 4.7: Dashboard Screen (Principal)
```
[ ] Implementar DashboardScreen:
    [ ] Header com data e velocidade
    [ ] Cards de métricas principais:
        [ ] Aprovação
        [ ] Economia
        [ ] Estabilidade
        [ ] Tensão
    [ ] Navegação inferior (4 abas)
[ ] Pull-to-refresh para eventos
```

### Task 4.8: Politics Tab
```
[ ] Implementar PoliticsView:
    [ ] Métricas políticas detalhadas
    [ ] Lista de grupos sociais
    [ ] Opinião de cada grupo (barra)
    [ ] Ações disponíveis
[ ] Detalhes ao tocar em grupo
```

### Task 4.9: Economy Tab
```
[ ] Implementar EconomyView:
    [ ] Métricas econômicas
    [ ] Gráfico de tendência
    [ ] Setores econômicos
    [ ] Políticas disponíveis
[ ] Detalhes de cada setor
```

### Task 4.10: Diplomacy Tab
```
[ ] Implementar DiplomacyView:
    [ ] Lista de países
    [ ] Status de relação (ícone)
    [ ] Organizações
    [ ] Ações diplomáticas
[ ] Detalhes ao tocar em país
```

### Task 4.11: Conflicts Tab
```
[ ] Implementar ConflictsView:
    [ ] Tensão interna (gauge)
    [ ] Status militar
    [ ] Alertas de risco
    [ ] Ações disponíveis
[ ] Detalhes de cada alerta
```

### Task 4.12: Event Screen
```
[ ] Implementar EventScreen:
    [ ] Título e imagem
    [ ] Descrição do evento
    [ ] Botão "Contexto Histórico"
    [ ] Opções de resposta
    [ ] Preview de consequências
[ ] Animação de aparição
```

### Task 4.13: Decision Confirmation
```
[ ] Implementar DecisionConfirmModal:
    [ ] Resumo da decisão
    [ ] Efeitos previstos
    [ ] Confirmar / Cancelar
[ ] Feedback visual de confirmação
```

### Task 4.14: Library Screen
```
[ ] Implementar LibraryScreen:
    [ ] Contextos históricos salvos
    [ ] Recomendações de literatura
    [ ] Busca/filtro
[ ] Links externos para livros
```

### Task 4.15: Settings Screen
```
[ ] Implementar SettingsScreen:
    [ ] Velocidade do jogo
    [ ] Volume de som
    [ ] Notificações
    [ ] Idioma
    [ ] Acessibilidade
    [ ] Conta/Login
[ ] Persistência de configurações
```

## 6.3 Componentes Especializados

### Task 4.16: Metric Cards
```
[ ] Implementar MetricCard.cs:
    [ ] Valor atual
    [ ] Tendência (seta)
    [ ] Cor por status (verde/amarelo/vermelho)
    [ ] Tooltip com detalhes
```

### Task 4.17: Group Panel
```
[ ] Implementar GroupPanel.cs:
    [ ] Nome e ícone do grupo
    [ ] Barra de opinião (-100 a +100)
    [ ] Indicador de mobilização
    [ ] Demandas atuais
```

### Task 4.18: Country Relation Card
```
[ ] Implementar CountryRelationCard.cs:
    [ ] Bandeira
    [ ] Nome do país
    [ ] Indicador de relação
    [ ] Preview de comércio
```

### Task 4.19: Timeline Component
```
[ ] Implementar TimelineView.cs:
    [ ] Histórico de eventos
    [ ] Scroll horizontal
    [ ] Detalhes ao tocar
    [ ] Marcadores importantes
```

### Task 4.20: Notification System
```
[ ] Implementar NotificationManager.cs:
    [ ] Badge de notificações
    [ ] Lista expansível
    [ ] Tipos de notificação:
        [ ] Evento crítico
        [ ] Alerta de métrica
        [ ] Sugestão
[ ] Priorização de notificações
```

## 6.4 Tutorial

### Task 4.21: Tutorial System
```
[ ] Implementar TutorialManager.cs:
    [ ] Sequência de passos
    [ ] Highlight de elementos UI
    [ ] Texto explicativo
    [ ] Skip disponível
    [ ] Progresso salvo
```

### Task 4.22: Tutorial Content
```
[ ] Criar conteúdo do tutorial:
    [ ] Introdução (5 passos)
    [ ] Dashboard (3 passos)
    [ ] Primeira decisão (4 passos)
    [ ] Explicação de métricas (6 passos)
    [ ] Contexto IA (2 passos)
[ ] Testar com usuários novatos
```

---

# 7. Fase 5: Conteúdo

**Objetivo:** Popular o jogo com todos os países, eventos e balanceamento.

## 7.1 Países

### Task 5.1: Brasil — Conteúdo Completo
```
[ ] Dados iniciais verificados (2025)
[ ] 8 grupos sociais configurados
[ ] 20+ eventos únicos
[ ] Relações diplomáticas
[ ] Desafios balanceados
[ ] Teste de gameplay completo
```

### Task 5.2: Estados Unidos
```
[ ] Dados iniciais verificados (2025)
[ ] Grupos sociais adaptados
[ ] 20+ eventos únicos
[ ] Relações diplomáticas
[ ] Teste de gameplay
```

### Task 5.3: China
```
[ ] Dados iniciais (sistema político diferente)
[ ] Grupos sociais adaptados
[ ] 20+ eventos únicos
[ ] Relações diplomáticas
[ ] Mecânicas específicas (partido único)
```

### Task 5.4: Rússia
```
[ ] Dados iniciais
[ ] Grupos sociais
[ ] 20+ eventos únicos (incluindo conflito)
[ ] Relações diplomáticas
[ ] Sanções como mecânica central
```

### Task 5.5: Índia
```
[ ] Dados iniciais
[ ] Grupos sociais (diversidade religiosa)
[ ] 20+ eventos únicos
[ ] Relações diplomáticas
[ ] Tensões com vizinhos
```

### Task 5.6: África do Sul
```
[ ] Dados iniciais
[ ] Grupos sociais (legado apartheid)
[ ] 20+ eventos únicos
[ ] Relações diplomáticas
[ ] Desigualdade como tema central
```

## 7.2 Eventos Globais

### Task 5.7: Eventos Econômicos
```
[ ] 30+ eventos econômicos globais
[ ] Triggers configurados
[ ] Opções balanceadas
[ ] Contextos históricos
[ ] Teste de todos os eventos
```

### Task 5.8: Eventos Políticos
```
[ ] 30+ eventos políticos
[ ] Triggers e consequências
[ ] Cadeias de eventos
[ ] Teste de gameplay
```

### Task 5.9: Eventos Diplomáticos
```
[ ] 25+ eventos diplomáticos
[ ] Interações entre países
[ ] Organizações internacionais
[ ] Teste de cenários
```

### Task 5.10: Eventos Sociais e Militares
```
[ ] 25+ eventos sociais
[ ] 15+ eventos militares
[ ] Guerra civil funcional
[ ] Teste de edge cases
```

## 7.3 Base de Conhecimento IA

### Task 5.11: Documentos Históricos
```
[ ] Curar 200+ documentos históricos:
    [ ] Reformas econômicas (50)
    [ ] Transições políticas (40)
    [ ] Conflitos e guerras (30)
    [ ] Diplomacia (40)
    [ ] Movimentos sociais (40)
[ ] Embeddings gerados
[ ] Upload para Pinecone
```

### Task 5.12: Literatura
```
[ ] Curar lista de 100+ livros:
    [ ] Por tema
    [ ] Por região
    [ ] Por período
[ ] Metadados (autor, ano, sinopse)
[ ] Links de compra/biblioteca
```

## 7.4 Balanceamento

### Task 5.13: Balanceamento Inicial
```
[ ] Calibrar fórmulas base
[ ] Testar cada país isoladamente
[ ] Ajustar dificuldade relativa
[ ] Documentar parâmetros
```

### Task 5.14: Playtest Interno
```
[ ] 10+ sessões completas por país
[ ] Registro de métricas
[ ] Identificar desequilíbrios
[ ] Ajustes iterativos
```

### Task 5.15: Condições de Vitória
```
[ ] Testar cada objetivo
[ ] Verificar atingibilidade
[ ] Ajustar thresholds se necessário
[ ] Tempo médio para vitória
```

---

# 8. Fase 6: Polish

**Objetivo:** Polir o jogo para qualidade de lançamento.

## 8.1 Performance

### Task 6.1: Profiling Mobile
```
[ ] Profile no iOS (iPhone 8+)
[ ] Profile no Android (mid-range)
[ ] Identificar gargalos:
    [ ] CPU
    [ ] Memória
    [ ] GPU
    [ ] Network
[ ] Otimizações necessárias
```

### Task 6.2: Otimização de Memória
```
[ ] Object pooling implementado
[ ] Assets carregados sob demanda
[ ] Garbage collection minimizado
[ ] Memory leaks corrigidos
[ ] Target: < 500MB RAM
```

### Task 6.3: Otimização de Bateria
```
[ ] Frame rate adaptativo
[ ] Background processing mínimo
[ ] Network batching
[ ] Target: 2h+ de gameplay contínuo
```

## 8.2 Qualidade

### Task 6.4: QA Testing
```
[ ] Test plan completo
[ ] Teste de regressão
[ ] Teste de edge cases
[ ] Teste de crash/ANR
[ ] Bug tracking configurado
```

### Task 6.5: Crash Reporting
```
[ ] Sentry integrado
[ ] Breadcrumbs configurados
[ ] Alertas de crash rate
[ ] Dashboard de issues
```

### Task 6.6: Analytics Verificados
```
[ ] Todos os eventos trackados
[ ] Funis configurados
[ ] Dashboards criados
[ ] A/B testing preparado
```

## 8.3 Acessibilidade

### Task 6.7: Acessibilidade Visual
```
[ ] Modo daltônico (3 tipos)
[ ] Alto contraste
[ ] Texto escalável (100%-200%)
[ ] Ícones com labels
```

### Task 6.8: Acessibilidade Motor
```
[ ] Áreas de toque grandes
[ ] Sem gestos obrigatórios complexos
[ ] Timeout configurável
```

## 8.4 Localização

### Task 6.9: Português (Base)
```
[ ] Todos os textos em PT-BR
[ ] Revisão ortográfica
[ ] Consistência terminológica
```

### Task 6.10: Inglês
```
[ ] Tradução completa
[ ] Revisão por nativo
[ ] Teste de layout (textos maiores)
```

### Task 6.11: Espanhol (Opcional V1)
```
[ ] Tradução
[ ] Revisão
[ ] Teste
```

## 8.5 Som e Feedback

### Task 6.12: Sound Design
```
[ ] Música ambiente (3+ tracks)
[ ] Efeitos de UI
[ ] Feedback de decisões
[ ] Volume configurável
```

### Task 6.13: Haptic Feedback
```
[ ] Feedback tátil em decisões
[ ] Alertas críticos
[ ] Configurável on/off
```

---

# 9. Fase 7: Lançamento

**Objetivo:** Preparar e executar o lançamento nas lojas.

## 9.1 Preparação para Lojas

### Task 7.1: App Store Preparation
```
[ ] App Store Connect configurado
[ ] Screenshots (6.5", 5.5")
[ ] Preview video
[ ] Descrição e keywords
[ ] Classificação etária
[ ] Privacy policy
[ ] TestFlight beta
```

### Task 7.2: Google Play Preparation
```
[ ] Google Play Console configurado
[ ] Screenshots
[ ] Feature graphic
[ ] Descrição e keywords
[ ] Classificação etária
[ ] Data safety form
[ ] Internal/Closed testing
```

### Task 7.3: Legal e Compliance
```
[ ] Termos de uso
[ ] Política de privacidade
[ ] LGPD compliance
[ ] GDPR compliance (se Europa)
[ ] Disclaimer do jogo
```

## 9.2 Beta Testing

### Task 7.4: Closed Beta
```
[ ] Recrutar 100-200 testers
[ ] Distribuir via TestFlight/Internal testing
[ ] Formulário de feedback
[ ] Monitorar métricas
[ ] Iterar em bugs críticos
```

### Task 7.5: Open Beta
```
[ ] Expandir para 1000+ testers
[ ] Testar escalabilidade
[ ] Últimos ajustes de balanceamento
[ ] Go/No-go decision
```

## 9.3 Lançamento

### Task 7.6: Soft Launch (Opcional)
```
[ ] Lançar em 1-2 países menores
[ ] Monitorar métricas reais
[ ] Ajustes finais
[ ] Preparar para global
```

### Task 7.7: Global Launch
```
[ ] Submeter para review (iOS/Android)
[ ] Preparar press release
[ ] Coordenar com marketing
[ ] Monitorar lançamento
[ ] Responder reviews
```

## 9.4 Pós-Lançamento

### Task 7.8: Monitoramento
```
[ ] Dashboard de KPIs:
    [ ] DAU/MAU
    [ ] Retention D1/D7/D30
    [ ] Revenue
    [ ] Crash rate
[ ] Alertas configurados
[ ] Plantão de suporte
```

### Task 7.9: Hotfixes
```
[ ] Processo de hotfix definido
[ ] Critérios para hotfix
[ ] Rollback plan
```

### Task 7.10: Suporte ao Usuário
```
[ ] FAQ criado
[ ] Email de suporte
[ ] Respostas padrão
[ ] Escalonamento definido
```

---

# 10. Métricas de Sucesso

## 10.1 KPIs de Desenvolvimento

| Métrica | Target Fase 4 | Target Lançamento |
|---------|---------------|-------------------|
| Crash rate | < 1% | < 0.1% |
| ANR rate | < 0.5% | < 0.1% |
| Load time | < 5s | < 3s |
| FPS médio | > 30 | > 45 |
| Memory usage | < 600MB | < 500MB |

## 10.2 KPIs de Produto

| Métrica | Target Mês 1 | Target Mês 6 |
|---------|--------------|--------------|
| Downloads | 10,000 | 100,000 |
| DAU | 1,000 | 10,000 |
| D1 Retention | 40% | 50% |
| D7 Retention | 20% | 30% |
| D30 Retention | 10% | 15% |
| Avg Session | 15 min | 20 min |
| Rating | 4.0+ | 4.5+ |

## 10.3 KPIs de Negócio

| Métrica | Target Mês 1 | Target Mês 6 |
|---------|--------------|--------------|
| Revenue | $5,000 | $30,000 |
| ARPU | $0.50 | $0.30 |
| Conversion (paid) | 5% | 8% |
| CAC | < $2 | < $1 |
| LTV | > $3 | > $5 |

---

# 11. Equipe Sugerida

## 11.1 Equipe Mínima Viável (MVP)

| Role | Quantidade | Responsabilidades |
|------|------------|-------------------|
| **Game Designer / PM** | 1 | Design, balanceamento, gestão |
| **Unity Developer** | 2 | Cliente, UI, sistemas |
| **Backend Developer** | 1 | API, IA, infra |
| **Artist / UI Designer** | 1 | Arte, UI/UX |
| **QA** | 1 (part-time) | Testes, bug tracking |

**Total: 5-6 pessoas**

## 11.2 Equipe Ideal

| Role | Quantidade | Responsabilidades |
|------|------------|-------------------|
| **Producer / PM** | 1 | Gestão de projeto |
| **Lead Game Designer** | 1 | Design, balanceamento |
| **Narrative Designer** | 1 | Eventos, textos, IA |
| **Lead Unity Developer** | 1 | Arquitetura, sistemas |
| **Unity Developer** | 2 | Features, UI |
| **Backend Developer** | 2 | API, IA, infra |
| **UI/UX Designer** | 1 | Interface, fluxos |
| **Artist** | 1 | Arte 2D, ícones |
| **QA Lead** | 1 | Testes, qualidade |
| **Community Manager** | 1 | Beta, suporte, social |

**Total: 12 pessoas**

---

# 12. Riscos e Contingências

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Escopo cresce demais | Alta | Cortar features, priorizar MVP |
| Custo de IA alto demais | Média | Aumentar cache, reduzir chamadas |
| Rejeição nas lojas | Baixa | Consultar guidelines, backup web |
| Competidor lança antes | Baixa | Focar em diferenciação |
| Dificuldade de balanceamento | Alta | Beta longo, telemetria, iteração |
| Controvérsia política | Média | Tom neutro, disclaimers, moderação |

---

*— Fim do Plano de Implementação —*

*Versão 1.0 — Dezembro 2025*
