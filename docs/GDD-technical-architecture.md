# Arquitetura Técnica

## VOLUTION

**Versão:** 1.0
**Data:** Dezembro 2025

---

# 1. Visão Geral da Arquitetura

## 1.1 Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENTE MOBILE                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   UI/UX     │  │   Game      │  │   Data      │  │   Network   │ │
│  │   Layer     │  │   Engine    │  │   Layer     │  │   Layer     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ HTTPS/WSS
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY                                 │
│              (AWS API Gateway / Cloud Functions)                     │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  Game State   │  │   AI/LLM      │  │   Analytics   │
│   Service     │  │   Service     │  │   Service     │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                   │
        ▼                  ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  PostgreSQL   │  │  Vector DB    │  │  BigQuery/    │
│  (Saves)      │  │  (RAG)        │  │  Analytics    │
└───────────────┘  └───────────────┘  └───────────────┘
```

## 1.2 Stack Tecnológica Recomendada

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Game Engine** | Unity 2022 LTS | Cross-platform, C# robusto, comunidade ativa |
| **UI Framework** | Unity UI Toolkit | Moderno, performático, flexível |
| **Networking** | Unity Netcode + REST | Tempo real + APIs |
| **Backend Runtime** | Node.js 20 LTS | Performance, async, TypeScript |
| **API Framework** | Fastify | Mais rápido que Express |
| **Database** | PostgreSQL 15 | JSONB para flexibilidade, maduro |
| **Cache** | Redis | Cache de sessão e IA |
| **AI/LLM** | Claude API (Anthropic) | Qualidade, contexto longo, confiável |
| **Vector DB** | Pinecone | Managed, escalável, fácil integração |
| **Cloud Provider** | AWS | Abrangente, confiável |
| **CDN** | CloudFront | Integrado com AWS |
| **Analytics** | Mixpanel | Eventos customizados, funis |
| **Crash Reporting** | Sentry | Multi-plataforma |
| **CI/CD** | GitHub Actions | Integrado, flexível |

---

# 2. Arquitetura do Cliente (Mobile)

## 2.1 Estrutura de Pastas Unity

```
Assets/
├── _Project/
│   ├── Scripts/
│   │   ├── Core/
│   │   │   ├── GameManager.cs
│   │   │   ├── SaveManager.cs
│   │   │   ├── EventSystem.cs
│   │   │   └── TimeManager.cs
│   │   ├── Systems/
│   │   │   ├── Politics/
│   │   │   │   ├── PoliticsSystem.cs
│   │   │   │   ├── GroupManager.cs
│   │   │   │   └── ElectionSystem.cs
│   │   │   ├── Economy/
│   │   │   │   ├── EconomySystem.cs
│   │   │   │   ├── SectorManager.cs
│   │   │   │   └── TradeSystem.cs
│   │   │   ├── Diplomacy/
│   │   │   │   ├── DiplomacySystem.cs
│   │   │   │   ├── RelationsManager.cs
│   │   │   │   └── OrganizationSystem.cs
│   │   │   └── Conflict/
│   │   │       ├── ConflictSystem.cs
│   │   │       ├── MilitaryManager.cs
│   │   │       └── CivilWarSystem.cs
│   │   ├── Data/
│   │   │   ├── Models/
│   │   │   │   ├── GameState.cs
│   │   │   │   ├── Country.cs
│   │   │   │   ├── Event.cs
│   │   │   │   └── Decision.cs
│   │   │   ├── Repositories/
│   │   │   │   ├── CountryRepository.cs
│   │   │   │   ├── EventRepository.cs
│   │   │   │   └── SaveRepository.cs
│   │   │   └── Services/
│   │   │       ├── APIService.cs
│   │   │       ├── AIService.cs
│   │   │       └── AnalyticsService.cs
│   │   ├── UI/
│   │   │   ├── Screens/
│   │   │   │   ├── MainMenuScreen.cs
│   │   │   │   ├── GameplayScreen.cs
│   │   │   │   ├── DashboardScreen.cs
│   │   │   │   └── EventScreen.cs
│   │   │   ├── Components/
│   │   │   │   ├── MetricCard.cs
│   │   │   │   ├── GroupPanel.cs
│   │   │   │   └── DecisionCard.cs
│   │   │   └── Managers/
│   │   │       ├── UIManager.cs
│   │   │       └── NavigationManager.cs
│   │   └── Utilities/
│   │       ├── Extensions.cs
│   │       ├── Constants.cs
│   │       └── Helpers.cs
│   ├── Resources/
│   │   ├── Countries/
│   │   ├── Events/
│   │   └── Localization/
│   ├── Prefabs/
│   ├── Scenes/
│   └── Settings/
├── Plugins/
│   ├── iOS/
│   └── Android/
└── StreamingAssets/
    └── Data/
        ├── countries.json
        ├── events.json
        └── historical_contexts.json
```

## 2.2 Modelo de Dados do Cliente

### GameState.cs

```csharp
[Serializable]
public class GameState
{
    public string Id { get; set; }
    public string PlayerId { get; set; }
    public string CountryId { get; set; }
    public string ObjectiveId { get; set; }

    public int CurrentTurn { get; set; }
    public DateTime GameDate { get; set; }

    public PoliticsState Politics { get; set; }
    public EconomyState Economy { get; set; }
    public DiplomacyState Diplomacy { get; set; }
    public MilitaryState Military { get; set; }
    public IdeologyState Ideology { get; set; }

    public List<SocialGroup> Groups { get; set; }
    public List<ActiveEvent> ActiveEvents { get; set; }
    public List<HistoryEntry> History { get; set; }

    public GameSettings Settings { get; set; }
    public DateTime LastSaved { get; set; }
}

[Serializable]
public class PoliticsState
{
    public float Approval { get; set; }          // 0-100
    public float Stability { get; set; }          // 0-100
    public float Polarization { get; set; }       // 0-100
    public float Legitimacy { get; set; }         // 0-100
    public float InternalTension { get; set; }    // 0-100

    public GovernmentType GovernmentType { get; set; }
    public int MonthsInPower { get; set; }
    public int NextElectionTurn { get; set; }
}

[Serializable]
public class EconomyState
{
    public double GDP { get; set; }               // em bilhões USD
    public float Growth { get; set; }             // % anual
    public float Inflation { get; set; }          // % anual
    public float Unemployment { get; set; }       // %
    public float DebtToGDP { get; set; }          // %
    public float Gini { get; set; }               // 0-1
    public double Reserves { get; set; }          // em bilhões USD

    public Dictionary<string, SectorState> Sectors { get; set; }
    public float TaxRate { get; set; }
    public float InterestRate { get; set; }
}

[Serializable]
public class SocialGroup
{
    public string Id { get; set; }
    public string Name { get; set; }
    public float PopulationShare { get; set; }    // 0-1
    public float EconomicPower { get; set; }      // 0-100
    public float Mobilization { get; set; }       // 0-100
    public float Opinion { get; set; }            // -100 to +100

    public IdeologyPreferences Preferences { get; set; }
    public List<string> CurrentDemands { get; set; }
}

[Serializable]
public class IdeologyState
{
    public float Economic { get; set; }           // -100 to +100
    public float Liberties { get; set; }          // -100 to +100
    public float Identity { get; set; }           // -100 to +100
    public float Change { get; set; }             // -100 to +100
}
```

## 2.3 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                         GAME LOOP                                │
└─────────────────────────────────────────────────────────────────┘
                              │
     ┌────────────────────────┼────────────────────────┐
     ▼                        ▼                        ▼
┌─────────┐            ┌─────────────┐          ┌─────────────┐
│ UPDATE  │            │   EVENTS    │          │   INPUT     │
│ METRICS │            │  PROCESSOR  │          │   HANDLER   │
└────┬────┘            └──────┬──────┘          └──────┬──────┘
     │                        │                        │
     └────────────────────────┼────────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │   STATE MACHINE │
                    │    (Central)    │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    ┌───────────┐     ┌───────────┐      ┌───────────┐
    │    UI     │     │   SAVE    │      │    AI     │
    │  UPDATER  │     │  MANAGER  │      │  SERVICE  │
    └───────────┘     └───────────┘      └───────────┘
```

## 2.4 Sistema de Cache Local

```csharp
public class LocalCache
{
    private const string CACHE_PREFIX = "game_cache_";
    private const int MAX_CACHE_SIZE_MB = 50;

    // Cache de respostas de IA
    private Dictionary<string, CachedAIResponse> _aiCache;

    // Cache de contextos históricos
    private Dictionary<string, HistoricalContext> _contextCache;

    // Cache de eventos pré-carregados
    private List<GameEvent> _preloadedEvents;

    public async Task<string> GetAIResponse(string promptHash)
    {
        if (_aiCache.TryGetValue(promptHash, out var cached))
        {
            if (cached.ExpiresAt > DateTime.UtcNow)
            {
                return cached.Response;
            }
        }
        return null;
    }

    public async Task CacheAIResponse(string promptHash, string response, TimeSpan ttl)
    {
        _aiCache[promptHash] = new CachedAIResponse
        {
            Response = response,
            ExpiresAt = DateTime.UtcNow.Add(ttl)
        };

        // Persist to disk for offline
        await PersistCacheToDisk();
    }
}
```

---

# 3. Arquitetura do Backend

## 3.1 Estrutura de Serviços

```
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── game.routes.ts
│   │   │   ├── ai.routes.ts
│   │   │   └── analytics.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── game.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rateLimit.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   └── validators/
│   │       ├── game.validator.ts
│   │       └── ai.validator.ts
│   ├── services/
│   │   ├── game/
│   │   │   ├── GameStateService.ts
│   │   │   ├── EventService.ts
│   │   │   └── SimulationService.ts
│   │   ├── ai/
│   │   │   ├── AIService.ts
│   │   │   ├── PromptBuilder.ts
│   │   │   ├── ResponseValidator.ts
│   │   │   └── RAGService.ts
│   │   └── analytics/
│   │       └── AnalyticsService.ts
│   ├── data/
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── GameSave.ts
│   │   │   └── AICache.ts
│   │   ├── repositories/
│   │   │   ├── UserRepository.ts
│   │   │   ├── GameRepository.ts
│   │   │   └── CacheRepository.ts
│   │   └── migrations/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── ai.ts
│   │   └── env.ts
│   └── utils/
│       ├── logger.ts
│       ├── errors.ts
│       └── helpers.ts
├── tests/
├── scripts/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 3.2 API Endpoints

### Autenticação

```yaml
POST /api/v1/auth/register
  Request:
    email: string
    password: string
    displayName: string
  Response:
    userId: string
    token: string

POST /api/v1/auth/login
  Request:
    email: string
    password: string
  Response:
    userId: string
    token: string
    refreshToken: string

POST /api/v1/auth/refresh
  Request:
    refreshToken: string
  Response:
    token: string
```

### Game State

```yaml
GET /api/v1/games
  Headers:
    Authorization: Bearer {token}
  Response:
    games: GameSave[]

POST /api/v1/games
  Headers:
    Authorization: Bearer {token}
  Request:
    countryId: string
    objectiveId: string
    settings: GameSettings
  Response:
    gameId: string
    initialState: GameState

GET /api/v1/games/{gameId}
  Response:
    state: GameState

PUT /api/v1/games/{gameId}
  Request:
    state: GameState
  Response:
    success: boolean
    syncedAt: DateTime

POST /api/v1/games/{gameId}/actions
  Request:
    actionType: string
    actionData: object
  Response:
    newState: GameState
    events: Event[]
    aiContext: string (optional)
```

### AI Service

```yaml
POST /api/v1/ai/context
  Request:
    gameState: GameState
    decisionType: string
    decisionDetails: object
  Response:
    historicalContext: string
    suggestions: string[]
    literature: Book[]

POST /api/v1/ai/event
  Request:
    gameState: GameState
    recentDecisions: Decision[]
    eventType: string (optional)
  Response:
    event: GeneratedEvent

POST /api/v1/ai/narration
  Request:
    gameState: GameState
    recentEvents: Event[]
    tone: string
  Response:
    narration: string
```

## 3.3 Modelo de Dados (PostgreSQL)

```sql
-- Usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_expires_at TIMESTAMP
);

-- Saves de Jogo
CREATE TABLE game_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    country_id VARCHAR(50) NOT NULL,
    objective_id VARCHAR(50) NOT NULL,
    current_turn INT NOT NULL DEFAULT 1,
    game_date DATE NOT NULL,
    state JSONB NOT NULL,  -- GameState completo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_type VARCHAR(50),  -- victory, defeat, abandoned
    playtime_minutes INT DEFAULT 0
);

-- Histórico de Decisões (para analytics)
CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES game_saves(id) ON DELETE CASCADE,
    turn_number INT NOT NULL,
    decision_type VARCHAR(100) NOT NULL,
    decision_data JSONB NOT NULL,
    effects JSONB,
    ai_context_requested BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cache de IA
CREATE TABLE ai_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_hash VARCHAR(64) UNIQUE NOT NULL,
    prompt_type VARCHAR(50) NOT NULL,
    response TEXT NOT NULL,
    tokens_used INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    hit_count INT DEFAULT 0
);

-- Eventos Pré-definidos
CREATE TABLE events (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    subtype VARCHAR(50),
    country_specific VARCHAR(50),  -- null = todos os países
    title_key VARCHAR(100) NOT NULL,  -- chave de localização
    description_key VARCHAR(100) NOT NULL,
    triggers JSONB NOT NULL,
    options JSONB NOT NULL,
    historical_context TEXT,
    literature JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_game_saves_user ON game_saves(user_id);
CREATE INDEX idx_game_saves_updated ON game_saves(updated_at DESC);
CREATE INDEX idx_decisions_game ON decisions(game_id);
CREATE INDEX idx_ai_cache_hash ON ai_cache(prompt_hash);
CREATE INDEX idx_ai_cache_expires ON ai_cache(expires_at);
CREATE INDEX idx_events_country ON events(country_specific);
```

## 3.4 Serviço de IA

### AIService.ts

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { RAGService } from './RAGService';
import { PromptBuilder } from './PromptBuilder';
import { ResponseValidator } from './ResponseValidator';
import { CacheRepository } from '../data/repositories/CacheRepository';

export class AIService {
    private client: Anthropic;
    private ragService: RAGService;
    private promptBuilder: PromptBuilder;
    private validator: ResponseValidator;
    private cache: CacheRepository;

    constructor() {
        this.client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });
        this.ragService = new RAGService();
        this.promptBuilder = new PromptBuilder();
        this.validator = new ResponseValidator();
        this.cache = new CacheRepository();
    }

    async getHistoricalContext(
        gameState: GameState,
        decision: Decision
    ): Promise<HistoricalContextResponse> {
        // Gerar hash do prompt para cache
        const promptHash = this.generatePromptHash(gameState, decision);

        // Verificar cache
        const cached = await this.cache.get(promptHash);
        if (cached) {
            await this.cache.incrementHitCount(promptHash);
            return JSON.parse(cached.response);
        }

        // Buscar contexto relevante via RAG
        const relevantDocs = await this.ragService.search(
            decision.type,
            decision.details,
            5 // top 5 documentos
        );

        // Construir prompt
        const prompt = this.promptBuilder.buildContextPrompt(
            gameState,
            decision,
            relevantDocs
        );

        // Chamar API
        const response = await this.client.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
            system: SYSTEM_PROMPTS.HISTORICAL_CONTEXT,
            messages: [{ role: 'user', content: prompt }]
        });

        const responseText = response.content[0].text;

        // Validar resposta
        const validated = await this.validator.validateHistoricalContext(
            responseText,
            gameState
        );

        // Cachear
        await this.cache.set(promptHash, JSON.stringify(validated), {
            ttl: 24 * 60 * 60 // 24 horas
        });

        return validated;
    }

    async generateEvent(
        gameState: GameState,
        recentDecisions: Decision[]
    ): Promise<GeneratedEvent> {
        // Buscar padrões similares
        const patterns = await this.ragService.searchPatterns(
            gameState,
            recentDecisions
        );

        const prompt = this.promptBuilder.buildEventPrompt(
            gameState,
            recentDecisions,
            patterns
        );

        const response = await this.client.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 800,
            system: SYSTEM_PROMPTS.EVENT_GENERATION,
            messages: [{ role: 'user', content: prompt }]
        });

        const event = JSON.parse(response.content[0].text);

        // Validar evento
        const validated = await this.validator.validateEvent(event, gameState);

        return validated;
    }
}

const SYSTEM_PROMPTS = {
    HISTORICAL_CONTEXT: `Você é um historiador especializado em política comparada.
Sua função é contextualizar decisões políticas com paralelos históricos reais.

Regras:
1. Cite apenas eventos históricos reais e verificáveis
2. Apresente múltiplas perspectivas quando relevante
3. Não faça julgamentos morais - apresente fatos e consequências
4. Mantenha resposta em 2-3 parágrafos (máximo 200 palavras)
5. Inclua datas e nomes específicos
6. Se não houver paralelo claro, diga isso

Responda em JSON:
{
    "context": "texto do contexto histórico",
    "parallels": [{"event": "nome", "year": "ano", "relevance": "explicação"}],
    "literature": [{"title": "título", "author": "autor"}]
}`,

    EVENT_GENERATION: `Você é um designer de jogos especializado em simulação política.
Gere eventos realistas baseados no estado atual do jogo.

Regras:
1. Evento deve ser plausível dado o contexto
2. Ofereça 2-4 opções de resposta
3. Cada opção tem consequências claras
4. Não pode contradizer o estado do jogo
5. Mantenha tom neutro e informativo

Responda em JSON:
{
    "id": "evt_generated_xxx",
    "title": "título do evento",
    "description": "descrição (50-100 palavras)",
    "historicalParallel": "paralelo histórico real",
    "options": [
        {
            "id": "opt_a",
            "text": "texto da opção",
            "effects": {
                "approval": +/-valor,
                "stability": +/-valor,
                ...
            }
        }
    ]
}`
};
```

### RAGService.ts

```typescript
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from './embeddings';

export class RAGService {
    private pinecone: Pinecone;
    private embeddings: OpenAIEmbeddings;
    private indexName = 'historical-contexts';

    constructor() {
        this.pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });
        this.embeddings = new OpenAIEmbeddings();
    }

    async search(
        decisionType: string,
        details: object,
        topK: number = 5
    ): Promise<RelevantDocument[]> {
        // Criar query de busca
        const queryText = this.buildSearchQuery(decisionType, details);

        // Gerar embedding
        const queryEmbedding = await this.embeddings.embed(queryText);

        // Buscar no Pinecone
        const index = this.pinecone.Index(this.indexName);
        const results = await index.query({
            vector: queryEmbedding,
            topK,
            includeMetadata: true,
            filter: {
                type: { $in: [decisionType, 'general'] }
            }
        });

        return results.matches.map(match => ({
            id: match.id,
            content: match.metadata.content,
            source: match.metadata.source,
            relevance: match.score
        }));
    }

    private buildSearchQuery(type: string, details: object): string {
        // Construir query semântica baseada no tipo de decisão
        const templates = {
            'nationalization': `nacionalização de ${details.sector} consequências históricas`,
            'trade_agreement': `acordo comercial ${details.partner} impactos`,
            'social_program': `programa social ${details.type} resultados`,
            // ... mais templates
        };

        return templates[type] || `${type} ${JSON.stringify(details)}`;
    }
}
```

---

# 4. Infraestrutura

## 4.1 Arquitetura AWS

```
┌─────────────────────────────────────────────────────────────────────┐
│                              VPC                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     Public Subnet                            │    │
│  │  ┌─────────────┐      ┌─────────────┐     ┌─────────────┐   │    │
│  │  │     ALB     │      │   NAT GW    │     │  Bastion    │   │    │
│  │  └──────┬──────┘      └─────────────┘     └─────────────┘   │    │
│  └─────────┼────────────────────────────────────────────────────┘    │
│            │                                                         │
│  ┌─────────┼────────────────────────────────────────────────────┐   │
│  │         │            Private Subnet                           │   │
│  │         ▼                                                     │   │
│  │  ┌─────────────┐      ┌─────────────┐     ┌─────────────┐    │   │
│  │  │   ECS       │      │   ECS       │     │   ECS       │    │   │
│  │  │  (API)      │      │  (AI Svc)   │     │  (Workers)  │    │   │
│  │  └─────────────┘      └─────────────┘     └─────────────┘    │   │
│  │         │                    │                   │            │   │
│  │         └────────────────────┼───────────────────┘            │   │
│  │                              ▼                                │   │
│  │                    ┌─────────────────┐                        │   │
│  │                    │  ElastiCache    │                        │   │
│  │                    │    (Redis)      │                        │   │
│  │                    └─────────────────┘                        │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     Data Subnet                                │  │
│  │  ┌─────────────────┐           ┌─────────────────┐            │  │
│  │  │      RDS        │           │      RDS        │            │  │
│  │  │   (Primary)     │◄─────────►│   (Replica)     │            │  │
│  │  │  PostgreSQL     │           │   PostgreSQL    │            │  │
│  │  └─────────────────┘           └─────────────────┘            │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

External Services:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  CloudFront │  │   Pinecone  │  │  Anthropic  │  │   Mixpanel  │
│    (CDN)    │  │  (VectorDB) │  │  (Claude)   │  │ (Analytics) │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

## 4.2 Configuração Terraform (Resumida)

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "geopolitics-game-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true  # Pode ser múltiplo em produção
}

module "ecs" {
  source = "terraform-aws-modules/ecs/aws"

  cluster_name = "geopolitics-game-cluster"

  fargate_capacity_providers = {
    FARGATE = {
      default_capacity_provider_strategy = {
        weight = 100
      }
    }
  }
}

module "rds" {
  source = "terraform-aws-modules/rds/aws"

  identifier = "geopolitics-game-db"

  engine               = "postgres"
  engine_version       = "15"
  family               = "postgres15"
  major_engine_version = "15"
  instance_class       = "db.t3.medium"

  allocated_storage     = 20
  max_allocated_storage = 100

  db_name  = "geopolitics"
  username = "admin"
  port     = 5432

  multi_az               = true
  db_subnet_group_name   = module.vpc.database_subnet_group
  vpc_security_group_ids = [module.security_group_rds.security_group_id]

  backup_retention_period = 7
  deletion_protection     = true
}

module "elasticache" {
  source = "terraform-aws-modules/elasticache/aws"

  cluster_id           = "geopolitics-cache"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_group_name  = module.vpc.elasticache_subnet_group_name
  security_group_ids = [module.security_group_redis.security_group_id]
}
```

## 4.3 Estimativa de Custos

### Cenário: 10.000 DAU (Daily Active Users)

| Serviço | Especificação | Custo Mensal Est. |
|---------|---------------|-------------------|
| **ECS Fargate** | 3 tasks x 0.5 vCPU, 1GB | $50 |
| **RDS PostgreSQL** | db.t3.medium, Multi-AZ | $150 |
| **ElastiCache Redis** | cache.t3.micro | $15 |
| **ALB** | + Data Transfer | $30 |
| **CloudFront** | 100GB transfer | $10 |
| **Anthropic API** | ~500k tokens/dia | $300 |
| **Pinecone** | Starter tier | $70 |
| **S3** | Assets + Backups | $10 |
| **Outros** | Logs, monitoring | $20 |
| **Total** | | **~$655/mês** |

### Cenário: 100.000 DAU

| Serviço | Especificação | Custo Mensal Est. |
|---------|---------------|-------------------|
| **ECS Fargate** | 10 tasks, auto-scaling | $300 |
| **RDS PostgreSQL** | db.r6g.large, Multi-AZ | $600 |
| **ElastiCache Redis** | cache.m6g.large cluster | $200 |
| **ALB** | + Data Transfer | $150 |
| **CloudFront** | 1TB transfer | $100 |
| **Anthropic API** | ~5M tokens/dia | $2,500 |
| **Pinecone** | Standard tier | $200 |
| **Total** | | **~$4,050/mês** |

---

# 5. CI/CD Pipeline

## 5.1 GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: geopolitics-game-api

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linting
        run: npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image to Amazon ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster geopolitics-game-cluster \
            --service api-service \
            --force-new-deployment

  deploy-unity:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - uses: game-ci/unity-builder@v4
        with:
          targetPlatform: iOS
          unityVersion: 2022.3.0f1

      - uses: game-ci/unity-builder@v4
        with:
          targetPlatform: Android
          unityVersion: 2022.3.0f1

      - name: Upload to App Store Connect
        if: success()
        run: |
          # Fastlane ou similar para upload
          fastlane ios beta

      - name: Upload to Google Play
        if: success()
        run: |
          fastlane android beta
```

---

# 6. Segurança

## 6.1 Autenticação e Autorização

```typescript
// JWT com refresh tokens
interface AuthTokens {
    accessToken: string;   // 15 min expiry
    refreshToken: string;  // 7 days expiry
}

// Middleware de autenticação
async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// Rate limiting por usuário
const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 100, // 100 requests por minuto
    keyGenerator: (req) => req.user?.id || req.ip,
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many requests' });
    }
});
```

## 6.2 Proteção de Dados

```typescript
// Criptografia de dados sensíveis
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(text: string): EncryptedData {
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        iv: iv.toString('hex'),
        content: encrypted,
        tag: cipher.getAuthTag().toString('hex')
    };
}

function decrypt(data: EncryptedData): string {
    const decipher = createDecipheriv(
        ALGORITHM,
        KEY,
        Buffer.from(data.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(data.tag, 'hex'));

    let decrypted = decipher.update(data.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
```

## 6.3 Validação de Input

```typescript
// Usando Zod para validação
import { z } from 'zod';

const GameActionSchema = z.object({
    actionType: z.enum([
        'policy',
        'diplomacy',
        'economy',
        'military'
    ]),
    actionId: z.string().min(1).max(100),
    parameters: z.record(z.unknown()).optional(),
    timestamp: z.number().int().positive()
});

const GameStateSchema = z.object({
    currentTurn: z.number().int().min(1).max(1000),
    politics: z.object({
        approval: z.number().min(0).max(100),
        stability: z.number().min(0).max(100),
        // ...
    }),
    // ... resto do schema
});

// Middleware de validação
function validateBody(schema: z.ZodSchema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            res.status(400).json({
                error: 'Validation failed',
                details: error.errors
            });
        }
    };
}
```

---

# 7. Monitoramento e Observabilidade

## 7.1 Logging

```typescript
// Winston logger configuration
import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'geopolitics-api' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Structured logging
logger.info('Game action processed', {
    userId: user.id,
    gameId: game.id,
    actionType: action.type,
    duration: processingTime
});
```

## 7.2 Métricas

```typescript
// Prometheus metrics
import { Counter, Histogram, Registry } from 'prom-client';

const registry = new Registry();

const httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    registers: [registry]
});

const aiRequestCount = new Counter({
    name: 'ai_requests_total',
    help: 'Total number of AI API requests',
    labelNames: ['type', 'status'],
    registers: [registry]
});

const gameActionsCount = new Counter({
    name: 'game_actions_total',
    help: 'Total number of game actions',
    labelNames: ['country', 'action_type'],
    registers: [registry]
});
```

## 7.3 Alertas

```yaml
# CloudWatch Alarms (via Terraform)
resource "aws_cloudwatch_metric_alarm" "api_errors" {
  alarm_name          = "api-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "5XXError"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "High API error rate"

  alarm_actions = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "ai_latency" {
  alarm_name          = "ai-high-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "ai_request_duration_seconds"
  namespace           = "GeopoliticsGame"
  period              = 60
  statistic           = "Average"
  threshold           = 5
  alarm_description   = "AI response latency too high"

  alarm_actions = [aws_sns_topic.alerts.arn]
}
```

---

*— Fim do Documento de Arquitetura Técnica —*

*Versão 1.0 — Dezembro 2025*
