# Sistema de IA para Países NPCs

## VOLUTION — Grand Strategy Geopolítico

**Versão:** 1.0
**Data:** Janeiro 2025

---

# 1. Visão Geral

Este documento especifica como países não controlados pelo jogador (NPCs) tomam decisões, reagem a eventos e interagem com o jogador.

## 1.1 Princípios de Design

1. **Previsibilidade com Surpresa**: NPCs seguem padrões baseados em ideologia/interesses, mas eventos podem causar mudanças
2. **Realismo Histórico**: Comportamentos baseados em padrões reais de política internacional
3. **Responsividade**: NPCs reagem às ações do jogador de forma coerente
4. **Performance**: Lógica eficiente para não impactar gameplay mobile

---

# 2. Arquitetura do Sistema

## 2.1 Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                     NPC DECISION ENGINE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Personality │    │   Memory    │    │  Interests  │         │
│  │    Matrix    │    │   System    │    │   Weights   │         │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘         │
│         │                  │                   │                 │
│         └──────────────────┼───────────────────┘                 │
│                            ▼                                     │
│                   ┌─────────────────┐                           │
│                   │ Decision Maker  │                           │
│                   └────────┬────────┘                           │
│                            │                                     │
│         ┌──────────────────┼──────────────────┐                 │
│         ▼                  ▼                  ▼                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  Diplomacy  │    │   Economy   │    │  Conflict   │         │
│  │   Actions   │    │   Actions   │    │   Actions   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Fluxo de Decisão

```
A cada turno (mês):
1. AVALIAR estado global e relação com jogador
2. PRIORIZAR objetivos baseado em personality + situação
3. DECIDIR ação (se necessária)
4. EXECUTAR e notificar jogador se relevante
5. ATUALIZAR memória de interações
```

---

# 3. Personality Matrix

Cada NPC tem uma matriz de personalidade que define seu comportamento base.

## 3.1 Dimensões de Personalidade

| Dimensão | Range | Descrição |
|----------|-------|-----------|
| **Assertiveness** | 0-100 | Quão agressivo em perseguir interesses |
| **Cooperation** | 0-100 | Tendência a buscar acordos vs. confronto |
| **Risk Tolerance** | 0-100 | Disposição para ações arriscadas |
| **Ideology Rigidity** | 0-100 | Quão importante é alinhamento ideológico |
| **Economic Focus** | 0-100 | Prioridade em ganhos econômicos |
| **Prestige Focus** | 0-100 | Importância de status e soft power |

## 3.2 Perfis por País

### Estados Unidos

```json
{
  "personality": {
    "assertiveness": 85,
    "cooperation": 55,
    "risk_tolerance": 60,
    "ideology_rigidity": 65,
    "economic_focus": 75,
    "prestige_focus": 90
  },
  "core_interests": [
    "maintain_hegemony",
    "counter_china",
    "protect_allies",
    "promote_democracy",
    "secure_trade_routes"
  ],
  "red_lines": [
    "attack_on_ally",
    "nuclear_proliferation_hostile",
    "taiwan_invasion"
  ],
  "preferred_tools": ["sanctions", "alliances", "military_presence", "economic_leverage"]
}
```

### China

```json
{
  "personality": {
    "assertiveness": 75,
    "cooperation": 50,
    "risk_tolerance": 45,
    "ideology_rigidity": 70,
    "economic_focus": 85,
    "prestige_focus": 80
  },
  "core_interests": [
    "taiwan_reunification",
    "belt_and_road",
    "tech_independence",
    "south_china_sea",
    "economic_growth"
  ],
  "red_lines": [
    "taiwan_independence",
    "xinjiang_intervention",
    "tibet_support"
  ],
  "preferred_tools": ["economic_leverage", "infrastructure_investment", "debt_diplomacy", "tech_competition"]
}
```

### Rússia

```json
{
  "personality": {
    "assertiveness": 80,
    "cooperation": 35,
    "risk_tolerance": 70,
    "ideology_rigidity": 50,
    "economic_focus": 60,
    "prestige_focus": 85
  },
  "core_interests": [
    "near_abroad_influence",
    "nato_containment",
    "energy_leverage",
    "great_power_status",
    "regime_survival"
  ],
  "red_lines": [
    "nato_expansion",
    "ukraine_nato",
    "regime_change_support"
  ],
  "preferred_tools": ["energy_leverage", "military_threat", "hybrid_warfare", "nuclear_signaling"]
}
```

### Índia

```json
{
  "personality": {
    "assertiveness": 55,
    "cooperation": 65,
    "risk_tolerance": 40,
    "ideology_rigidity": 35,
    "economic_focus": 80,
    "prestige_focus": 70
  },
  "core_interests": [
    "china_balance",
    "pakistan_containment",
    "economic_growth",
    "regional_leadership",
    "strategic_autonomy"
  ],
  "red_lines": [
    "kashmir_interference",
    "border_violation",
    "pakistan_support"
  ],
  "preferred_tools": ["multi_alignment", "economic_deals", "diaspora_soft_power", "regional_coalitions"]
}
```

### África do Sul

```json
{
  "personality": {
    "assertiveness": 40,
    "cooperation": 70,
    "risk_tolerance": 35,
    "ideology_rigidity": 45,
    "economic_focus": 75,
    "prestige_focus": 60
  },
  "core_interests": [
    "african_leadership",
    "non_alignment",
    "economic_recovery",
    "brics_cooperation",
    "domestic_stability"
  ],
  "red_lines": [
    "apartheid_comparison",
    "sovereignty_violation"
  ],
  "preferred_tools": ["quiet_diplomacy", "regional_mediation", "moral_authority", "multilateralism"]
}
```

---

# 4. Sistema de Memória

NPCs lembram das interações com o jogador e ajustam comportamento.

## 4.1 Estrutura de Memória

```json
{
  "memory": {
    "player_country": "brazil",
    "relationship_history": [
      {
        "turn": 1,
        "action": "trade_agreement_proposed",
        "player_response": "accepted",
        "impact": +15
      },
      {
        "turn": 5,
        "action": "player_criticized_us_publicly",
        "impact": -10
      }
    ],
    "trust_score": 45,
    "reliability_score": 70,
    "ideological_drift": -5,
    "total_trade_value": 50000000000,
    "treaties_honored": 3,
    "treaties_broken": 0,
    "conflicts": 0,
    "cooperation_instances": 5
  }
}
```

## 4.2 Decaimento de Memória

```python
def decay_memory(memory, turns_passed):
    """
    Eventos antigos perdem importância
    """
    DECAY_RATE = 0.05  # 5% por turno

    for event in memory.relationship_history:
        age = current_turn - event.turn
        event.current_impact = event.impact * (1 - DECAY_RATE) ** age

    # Eventos muito antigos são esquecidos
    memory.relationship_history = [
        e for e in memory.relationship_history
        if abs(e.current_impact) > 1
    ]
```

## 4.3 Formação de Trust Score

```python
def calculate_trust(memory):
    """
    Trust baseado em histórico de interações
    """
    base_trust = 50  # Neutro

    # Acordos cumpridos
    base_trust += memory.treaties_honored * 5

    # Acordos quebrados (peso maior)
    base_trust -= memory.treaties_broken * 15

    # Histórico de cooperação
    base_trust += memory.cooperation_instances * 3

    # Conflitos
    base_trust -= memory.conflicts * 20

    # Soma de impactos recentes
    recent_impact = sum(e.current_impact for e in memory.relationship_history)
    base_trust += recent_impact

    return clamp(base_trust, -100, 100)
```

---

# 5. Sistema de Decisão

## 5.1 Avaliação de Situação

```python
def evaluate_situation(npc, world_state, player_state):
    """
    Avalia situação global do NPC
    """
    assessment = {
        "threat_level": calculate_threats(npc, world_state),
        "opportunity_level": calculate_opportunities(npc, world_state),
        "player_threat": calculate_player_threat(npc, player_state),
        "player_opportunity": calculate_player_opportunity(npc, player_state),
        "domestic_pressure": npc.internal_tension,
        "resource_availability": calculate_resources(npc)
    }

    return assessment
```

## 5.2 Priorização de Objetivos

```python
def prioritize_objectives(npc, assessment):
    """
    Decide quais objetivos perseguir este turno
    """
    priorities = []

    for objective in npc.core_interests:
        score = calculate_objective_score(
            objective=objective,
            assessment=assessment,
            personality=npc.personality,
            current_progress=npc.objective_progress[objective]
        )
        priorities.append((objective, score))

    # Ordenar por score
    priorities.sort(key=lambda x: x[1], reverse=True)

    # Retornar top 3
    return priorities[:3]
```

## 5.3 Seleção de Ação

```python
def select_action(npc, priority_objectives, available_actions, player_state):
    """
    Escolhe a melhor ação para este turno
    """
    best_action = None
    best_score = -999

    for action in available_actions:
        # Verificar se ação é viável
        if not is_action_viable(npc, action):
            continue

        # Calcular utilidade
        score = calculate_action_utility(
            action=action,
            objectives=priority_objectives,
            personality=npc.personality,
            player_relation=npc.memory.get(player_state.country),
            risk=estimate_risk(action),
            cost=estimate_cost(action)
        )

        # Aplicar modificadores de personalidade
        if action.is_aggressive:
            score *= (npc.personality.assertiveness / 50)
        if action.is_cooperative:
            score *= (npc.personality.cooperation / 50)
        if action.is_risky:
            score *= (npc.personality.risk_tolerance / 50)

        if score > best_score:
            best_score = score
            best_action = action

    # Threshold mínimo para agir
    if best_score < 10:
        return None  # Não fazer nada este turno

    return best_action
```

---

# 6. Ações Disponíveis para NPCs

## 6.1 Ações Diplomáticas

| Ação | Trigger | Efeito |
|------|---------|--------|
| **Propor Tratado Comercial** | Relação > 20, interesse econômico | Inicia negociação com jogador |
| **Propor Aliança** | Relação > 50, ameaça comum | Inicia negociação de aliança |
| **Aplicar Sanções** | Relação < -30, violação de interesse | Penalidades econômicas |
| **Romper Relações** | Relação < -60, conflito grave | Reduz relação para -80 |
| **Condenar Publicamente** | Ação do jogador viola valores | Relação -10, soft power impact |
| **Oferecer Ajuda** | Crise no país do jogador, relação > 30 | Relação +15, cria obrigação |

## 6.2 Ações Econômicas

| Ação | Trigger | Efeito |
|------|---------|--------|
| **Aumentar Tarifas** | Déficit comercial alto, protecionismo | Comércio bilateral reduz |
| **Investir em País Alvo** | Oportunidade econômica, relação > 0 | Dependência aumenta |
| **Cortar Suprimento** | Alavanca estratégica, conflito | Crise no alvo (ex: gás russo) |
| **Propor Bloco Comercial** | Interesse regional | Nova organização |

## 6.3 Ações Geopolíticas

| Ação | Trigger | Efeito |
|------|---------|--------|
| **Exercício Militar** | Tensão com vizinho > 50 | Intimidação, tensão aumenta |
| **Apoiar Oposição** | Rival ideológico, oportunidade | Desestabilização |
| **Mediação de Conflito** | Conflito entre outros, prestígio | Soft power +, relações + |
| **Veto em ONU** | Resolução contra interesse | Bloqueia ação internacional |

---

# 7. Reações a Ações do Jogador

## 7.1 Matriz de Reações

```python
REACTION_MATRIX = {
    "player_sanctions_npc": {
        "conditions": {},
        "reactions": [
            {"action": "counter_sanctions", "probability": 0.7, "min_assertiveness": 50},
            {"action": "seek_allies", "probability": 0.5, "min_cooperation": 40},
            {"action": "public_condemnation", "probability": 0.9},
            {"action": "escalate_conflict", "probability": 0.3, "min_assertiveness": 70}
        ]
    },

    "player_military_buildup_near_border": {
        "conditions": {"border_shared": True},
        "reactions": [
            {"action": "military_exercise", "probability": 0.6},
            {"action": "diplomatic_protest", "probability": 0.8},
            {"action": "seek_security_guarantee", "probability": 0.4},
            {"action": "preemptive_strike", "probability": 0.1, "min_risk_tolerance": 80}
        ]
    },

    "player_ideological_shift_away": {
        "conditions": {"ideological_alignment_was_positive": True},
        "reactions": [
            {"action": "reduce_cooperation", "probability": 0.7},
            {"action": "support_opposition", "probability": 0.3, "min_ideology_rigidity": 60},
            {"action": "propaganda_campaign", "probability": 0.4}
        ]
    },

    "player_breaks_treaty": {
        "conditions": {"had_treaty": True},
        "reactions": [
            {"action": "trust_collapse", "probability": 1.0, "trust_modifier": -40},
            {"action": "retaliation", "probability": 0.6},
            {"action": "public_condemnation", "probability": 0.9},
            {"action": "seek_new_partners", "probability": 0.5}
        ]
    },

    "player_aids_rival": {
        "conditions": {"has_rival": True},
        "reactions": [
            {"action": "reassess_relationship", "probability": 1.0, "relation_modifier": -20},
            {"action": "counter_alliance", "probability": 0.5},
            {"action": "punish_economically", "probability": 0.4}
        ]
    }
}
```

## 7.2 Processamento de Reação

```python
def process_reaction(npc, player_action, world_state):
    """
    Determina como NPC reage à ação do jogador
    """
    # Encontrar reação apropriada
    reaction_template = REACTION_MATRIX.get(player_action.type)
    if not reaction_template:
        return None

    # Verificar condições
    if not check_conditions(reaction_template.conditions, npc, player_action):
        return None

    # Selecionar reação baseado em probabilidade e personalidade
    selected_reactions = []
    for reaction in reaction_template.reactions:
        # Verificar requisitos de personalidade
        if not meets_personality_requirements(npc.personality, reaction):
            continue

        # Roll probabilidade
        if random.random() < reaction.probability:
            selected_reactions.append(reaction)

    return selected_reactions
```

---

# 8. Comportamento em Crises

## 8.1 Escalation Ladder

```
NÍVEIS DE ESCALAÇÃO:
1. Diplomacia Normal → Tensão verbal
2. Tensão Verbal → Sanções leves
3. Sanções Leves → Sanções pesadas
4. Sanções Pesadas → Proxy conflict
5. Proxy Conflict → Confronto direto (V2)
```

## 8.2 De-escalation

NPCs também podem de-escalar:

```python
def consider_deescalation(npc, conflict, costs_so_far):
    """
    NPCs avaliam se vale continuar conflito
    """
    # Fatores para de-escalação
    deescalation_score = 0

    # Custos altos
    if costs_so_far > npc.economy.gdp * 0.05:
        deescalation_score += 30

    # Pressão doméstica
    if npc.internal_tension > 60:
        deescalation_score += 20

    # Terceiros oferecendo mediação
    if world_state.mediation_offered:
        deescalation_score += 15

    # Objetivo inalcançável
    if conflict.progress < 0.2 and conflict.duration > 12:
        deescalation_score += 25

    # Personalidade
    deescalation_score += (100 - npc.personality.assertiveness) * 0.2

    return deescalation_score > 50
```

---

# 9. Comunicação com Jogador

## 9.1 Tipos de Comunicação

| Tipo | Quando | Exemplo |
|------|--------|---------|
| **Proposta** | NPC quer iniciar acordo | "China propõe acordo comercial bilateral" |
| **Aviso** | Jogador próximo de red line | "EUA alertam sobre consequências de aproximação com Rússia" |
| **Protesto** | Ação do jogador incomoda | "União Europeia condena política ambiental do Brasil" |
| **Ultimato** | Situação crítica | "Rússia exige retirada de sanções em 30 dias" |
| **Elogio** | Ação do jogador agrada | "Índia celebra parceria estratégica com Brasil" |

## 9.2 Tom da Mensagem

Tom varia baseado em relação e personalidade:

```python
def get_message_tone(npc, player_relation, message_type):
    """
    Determina tom da mensagem
    """
    if player_relation > 50:
        return "friendly"
    elif player_relation > 0:
        return "cordial"
    elif player_relation > -30:
        return "formal"
    elif player_relation > -60:
        return "cold"
    else:
        return "hostile"
```

---

# 10. Balanceamento e Tuning

## 10.1 Parâmetros Configuráveis

```python
NPC_CONFIG = {
    "decision_frequency": 1,  # Decisões por turno
    "max_simultaneous_actions": 2,  # Ações por turno
    "memory_decay_rate": 0.05,
    "trust_recovery_rate": 2,  # Pontos por turno se sem conflito
    "reaction_delay_turns": 0,  # Imediato ou com delay
    "aggression_modifier": 1.0,  # Ajuste global de agressividade
    "cooperation_modifier": 1.0  # Ajuste global de cooperação
}
```

## 10.2 Dificuldade Adaptativa

```python
def adjust_npc_difficulty(player_performance):
    """
    Ajusta comportamento NPC baseado em performance do jogador
    """
    if player_performance.too_easy:
        NPC_CONFIG["aggression_modifier"] = 1.3
        NPC_CONFIG["cooperation_modifier"] = 0.8
    elif player_performance.too_hard:
        NPC_CONFIG["aggression_modifier"] = 0.8
        NPC_CONFIG["cooperation_modifier"] = 1.2
```

---

# 11. Otimização para Mobile

## 11.1 Estratégias de Performance

1. **Lazy Evaluation**: Só processar NPCs relevantes
2. **Caching**: Cache de decisões similares
3. **Simplified Mode**: Durante gameplay rápido, usar versão simplificada
4. **Background Processing**: Decisões complexas em background thread

## 11.2 Níveis de Detalhe

```python
LOD_LEVELS = {
    "high": {
        "description": "NPC completo com todas as mecânicas",
        "when": "NPC é vizinho ou potência principal"
    },
    "medium": {
        "description": "Memória simplificada, menos reações",
        "when": "NPC tem relação ativa com jogador"
    },
    "low": {
        "description": "Comportamento reativo apenas",
        "when": "NPC distante e pouco relevante"
    }
}
```

---

*— Fim do Documento de IA de NPCs —*

*Versão 1.0 — Janeiro 2025*
