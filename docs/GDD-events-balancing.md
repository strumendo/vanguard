# Sistema de Eventos e Balanceamento

## VOLUTION

**Versão:** 1.0
**Data:** Dezembro 2025

---

# 1. Sistema de Eventos

## 1.1 Arquitetura de Eventos

### Estrutura de Dados

```json
{
  "evento": {
    "id": "evt_001",
    "tipo": "economico|politico|diplomatico|social|militar|ambiental",
    "subtipo": "crise|oportunidade|decisao|informativo",
    "titulo": "String",
    "descricao": "String",
    "imagem": "asset_path",

    "triggers": {
      "condicoes": [
        {"metrica": "inflacao", "operador": ">", "valor": 50},
        {"metrica": "pais", "operador": "==", "valor": "brasil"}
      ],
      "logica": "AND|OR",
      "probabilidade": 0.0-1.0,
      "cooldown_meses": 12,
      "once_per_game": false
    },

    "contexto_historico": "String (paralelo real)",
    "literatura_sugerida": ["livro1", "livro2"],

    "opcoes": [
      {
        "id": "opt_a",
        "texto": "String",
        "requisitos": {"metrica": "valor"},
        "efeitos": {
          "imediatos": {},
          "mensais": {},
          "duracao": 12
        },
        "eventos_consequentes": ["evt_002"]
      }
    ],

    "ia_geravel": true,
    "prioridade": 1-10,
    "duracao_decisao": "imediato|3_dias|7_dias"
  }
}
```

## 1.2 Tipos de Eventos

### Eventos Econômicos

| ID | Evento | Trigger | Opções Resumidas |
|----|--------|---------|------------------|
| ECO_001 | Crise Cambial | Reservas < 20% do ideal | Juros altos / Controle cambial / FMI |
| ECO_002 | Boom de Commodities | Preço commodity +30% | Exportar mais / Fundo soberano / Industrializar |
| ECO_003 | Fuga de Capitais | Ideologia < -30 econ | Controles / Garantias / Deixar sair |
| ECO_004 | Greve Geral | Desemprego > 15% E Aprovação trabalhadores < 30 | Negociar / Repressão / Ceder |
| ECO_005 | Descoberta de Recursos | Aleatório (raro) | Nacionalizar / Licitação / Joint venture |
| ECO_006 | Bolha Imobiliária | Juros baixos por 24+ meses | Regular / Ignorar / Intervir |
| ECO_007 | Pedido de Empréstimo FMI | Dívida > 100% OU Crise cambial | Aceitar / Recusar / Negociar termos |
| ECO_008 | Proposta de Privatização | Elite opinião > 50 | Aceitar / Recusar / Parcial |

### Eventos Políticos

| ID | Evento | Trigger | Opções Resumidas |
|----|--------|---------|------------------|
| POL_001 | Escândalo de Corrupção | Aleatório + Corrupção alta | Investigar / Abafar / Bode expiatório |
| POL_002 | Manifestação Massiva | Tensão > 60 | Diálogo / Ignorar / Repressão |
| POL_003 | Tentativa de Golpe | Militares < 20 opinião E Tensão > 70 | Resistir / Negociar / Capitular |
| POL_004 | Eleição Convocada | Ciclo eleitoral | Campanha (várias sub-opções) |
| POL_005 | Oposição Unificada | Aprovação < 40 por 6 meses | Cooptar / Atacar / Ignorar |
| POL_006 | Vazamento de Informações | Aleatório | Negar / Admitir / Caçar vazador |
| POL_007 | Reforma Constitucional | Jogador inicia OU Crise | Várias opções de reforma |
| POL_008 | Líder de Oposição Preso | Escolha do jogador | Soltar / Manter / Julgamento público |

### Eventos Diplomáticos

| ID | Evento | Trigger | Opções Resumidas |
|----|--------|---------|------------------|
| DIP_001 | Proposta de Aliança | Opinião > 60 com país | Aceitar / Recusar / Contraproposta |
| DIP_002 | Sanções Impostas | EUA/UE opinião < -50 E Ideologia diverge | Resistir / Ceder / Buscar aliados |
| DIP_003 | Crise Diplomática | Evento em outro país | Apoiar lado A / Lado B / Neutro |
| DIP_004 | Cúpula Internacional | Membro de organização | Liderar / Participar / Boicotar |
| DIP_005 | Pedido de Ajuda | Aliado em crise | Ajudar / Recusar / Ajuda limitada |
| DIP_006 | Espionagem Revelada | Aleatório + Relações tensas | Negar / Admitir / Retaliação |
| DIP_007 | Acordo Comercial | Relações > 40 | Aceitar / Negociar / Recusar |
| DIP_008 | Refugiados na Fronteira | Conflito em vizinho | Acolher / Limitar / Fechar |

### Eventos Sociais

| ID | Evento | Trigger | Opções Resumidas |
|----|--------|---------|------------------|
| SOC_001 | Movimento Social Surge | Gini > 0.50 OU Polarização > 60 | Apoiar / Reprimir / Ignorar |
| SOC_002 | Crise de Saúde Pública | Aleatório OU Gasto saúde baixo | Lockdown / Medidas leves / Negar |
| SOC_003 | Tensão Étnica/Religiosa | Polarização > 70 E Grupos relevantes | Mediação / Lado A / Lado B |
| SOC_004 | Migração em Massa | Evento externo | Fronteiras abertas / Cotas / Fechadas |
| SOC_005 | Criminalidade Explosiva | Desemprego > 20% OU Tensão > 50 | Polícia / Programa social / Lei dura |
| SOC_006 | Desastre Natural | Aleatório por região | Ajuda massiva / Limitada / Terceirizar |
| SOC_007 | Escândalo Midiático | Liberdade imprensa alta | Processar / Ignorar / Regulação |
| SOC_008 | Fome/Carestia | Inflação > 100% OU Seca | Emergência / Importar / Racionamento |

### Eventos Militares/Segurança

| ID | Evento | Trigger | Opções Resumidas |
|----|--------|---------|------------------|
| MIL_001 | Insurgência Armada | Tensão > 80 E Grupo radicalizado | Negociar / Operação militar / Cerco |
| MIL_002 | Terrorismo | Aleatório + Tensão alta | Segurança máxima / Investigar / Retaliação |
| MIL_003 | Militares Pedem Aumento | Orçamento militar baixo por 12+ meses | Ceder / Recusar / Parcial |
| MIL_004 | Oficiais Conspirando | Lealdade militar < 40 | Purga / Ignorar / Cooptar |
| MIL_005 | Fronteira Violada | Relações < -60 com vizinho | Protesto / Mobilização / Ignorar |
| MIL_006 | Tráfico Internacional | Aleatório | Operação / Cooperação internacional / Legalizar |
| MIL_007 | Milícias Surgem | Tensão > 60 E Estado fraco | Incorporar / Combater / Ignorar |
| MIL_008 | Cessar-Fogo Proposto | Em guerra civil | Aceitar / Recusar / Contraproposta |

## 1.3 Eventos por País

### Brasil — Eventos Únicos

| ID | Evento | Trigger |
|----|--------|---------|
| BRA_001 | Queimadas na Amazônia | Anual (seco) + Desmatamento alto |
| BRA_002 | Lava Jato 2.0 | Corrupção alta + Judiciário independente |
| BRA_003 | Crise Hídrica | Aleatório + Investimento infra baixo |
| BRA_004 | Tensão STF vs Executivo | Ações inconstitucionais |
| BRA_005 | Boom do Agronegócio | Preços commodities altos |
| BRA_006 | Crise no Congresso | Aprovação baixa + Polarização alta |
| BRA_007 | Movimento Sem Terra | Gini > 0.50 E Reforma agrária não feita |
| BRA_008 | Tensão Militar | Discurso anti-militar OU Cortes orçamento |

### EUA — Eventos Únicos

| ID | Evento | Trigger |
|----|--------|---------|
| USA_001 | Shutdown do Governo | Crise política + Polarização > 60 |
| USA_002 | Crise de Dívida (Teto) | Dívida próxima ao teto |
| USA_003 | Tensão Racial | Evento policial + Desigualdade |
| USA_004 | Big Tech sob Ataque | Regulação de mídia proposta |
| USA_005 | Suprema Corte Controversa | Decisão judicial polêmica |
| USA_006 | Tiroteio em Massa | Aleatório (infelizmente frequente) |
| USA_007 | Primárias Partidárias | Ciclo eleitoral |
| USA_008 | Crise na Fronteira Sul | Migração + Política de imigração |

### China — Eventos Únicos

| ID | Evento | Trigger |
|----|--------|---------|
| CHN_001 | Tensão em Taiwan | Aleatório + Relações EUA ruins |
| CHN_002 | Protestos em Hong Kong | Liberdades restritas demais |
| CHN_003 | Crise Imobiliária | Bolha + Crescimento desacelera |
| CHN_004 | Disputa Mar do Sul | Relações vizinhos < 0 |
| CHN_005 | Xinjiang sob Pressão | Sanções internacionais |
| CHN_006 | COVID/Pandemia | Aleatório raro |
| CHN_007 | Desaceleração Econômica | Crescimento < 4% por 6 meses |
| CHN_008 | Corrupção no Partido | Facções internas |

### Rússia — Eventos Únicos

| ID | Evento | Trigger |
|----|--------|---------|
| RUS_001 | Ucrânia — Escalada | Conflito ativo |
| RUS_002 | Sanções Ocidentais Ampliam | Ações militares + Relações UE/EUA < -60 |
| RUS_003 | Queda do Rublo | Sanções + Reservas baixas |
| RUS_004 | Oposição Presa/Envenenada | Tensão interna alta |
| RUS_005 | Gás como Arma | Inverno + Tensão com Europa |
| RUS_006 | Wagner/Mercenários | Conflito externo |
| RUS_007 | Sucessão em Questão | Evento especial (líder longevo) |
| RUS_008 | Protestos Anti-Guerra | Conflito prolongado + Baixas altas |

### Índia — Eventos Únicos

| ID | Evento | Trigger |
|----|--------|---------|
| IND_001 | Tensão Hindu-Muçulmana | Polarização > 50 E Eventos religiosos |
| IND_002 | Crise de Kashmir | Relações Paquistão < -40 |
| IND_003 | Protesto de Agricultores | Reforma agrícola proposta |
| IND_004 | Seca/Monção Falha | Sazonal + Aleatório |
| IND_005 | Boom de TI | Investimento em educação alto |
| IND_006 | Fronteira com China Tensa | Relações China < 0 |
| IND_007 | Crise de Castas | Políticas de cotas |
| IND_008 | Poluição Crítica | Inverno + Industrialização |

### África do Sul — Eventos Únicos

| ID | Evento | Trigger |
|----|--------|---------|
| ZAF_001 | Cortes de Energia (Loadshedding) | Investimento energia baixo |
| ZAF_002 | Tensão Racial Pós-Apartheid | Gini > 0.60 E Reforma agrária |
| ZAF_003 | Xenofobia Contra Imigrantes | Desemprego > 25% |
| ZAF_004 | Corrupção no ANC | Partido dominante por muito tempo |
| ZAF_005 | Greve Mineradora | Setor mineiro + Salários baixos |
| ZAF_006 | Crime Organizado Escala | Desemprego + Estado fraco |
| ZAF_007 | HIV/AIDS Crise | Saúde pública precária |
| ZAF_008 | BRICS Summit Host | Membro BRICS + Soft power alto |

## 1.4 Cadeia de Eventos

### Exemplo: Espiral de Crise Econômica

```
ECO_001: Crise Cambial
    ├── Opção A: Juros Altos
    │   └── [12 meses] → ECO_009: Recessão Técnica
    │       ├── Opção A: Estímulo → Risco de inflação
    │       └── Opção B: Austeridade → POL_002: Manifestação
    │
    ├── Opção B: Controle Cambial
    │   └── [6 meses] → ECO_010: Mercado Negro Surge
    │       ├── Opção A: Reprimir → Custo político
    │       └── Opção B: Liberar → Volta à crise
    │
    └── Opção C: FMI
        └── [Imediato] → ECO_007: Empréstimo FMI
            └── [Consequência] → POL_002: Manifestação (provável)
```

### Exemplo: Escalada de Tensão Social

```
SOC_001: Movimento Social Surge
    ├── Opção A: Apoiar
    │   └── Elite -20, Trabalhadores +15
    │   └── [Possível] → POL_003: Tentativa de Golpe (se Militares < 30)
    │
    ├── Opção B: Reprimir
    │   └── [Alta chance] → SOC_009: Violência Policial
    │       └── [Internacional] → DIP_002: Sanções Possíveis
    │       └── [Interno] → MIL_001: Insurgência (se Tensão > 80)
    │
    └── Opção C: Ignorar
        └── [50% chance] → POL_002: Manifestação Escala
        └── [50% chance] → Movimento perde força
```

---

# 2. Sistema de Balanceamento

## 2.1 Princípios de Balanceamento

### Trade-offs Fundamentais

```
1. CURTO vs LONGO PRAZO
   - Decisões populistas: ganho imediato, custo futuro
   - Decisões estruturais: custo imediato, ganho futuro

2. GRUPOS EM CONFLITO
   - Beneficiar um grupo geralmente prejudica outro
   - Soma raramente é zero (algumas políticas beneficiam todos)

3. ECONOMIA vs POLÍTICA
   - Eficiência econômica pode custar aprovação
   - Popularidade pode custar eficiência

4. INTERNO vs EXTERNO
   - Nacionalismo agrada internamente, isola externamente
   - Internacionalismo agrada externamente, pode irritar internamente
```

### Constantes de Balanceamento

```python
# Taxas de mudança por turno (mês)
DECAY_APROVACAO = 0.01  # 1% de queda natural por mês
DECAY_MEMORIA = 0.10    # 10% de esquecimento de eventos passados

# Limites de mudança por ação
MAX_MUDANCA_APROVACAO = 15  # Máximo +/- 15% por ação
MAX_MUDANCA_ECONOMIA = 0.5  # Máximo +/- 0.5% PIB por ação
MAX_MUDANCA_IDEOLOGIA = 20  # Máximo +/- 20 pontos por ação

# Thresholds de crise
THRESHOLD_GOLPE = 20        # Aprovação militar abaixo disso = risco
THRESHOLD_REVOLUCAO = 10    # Aprovação geral abaixo disso = risco
THRESHOLD_GUERRA_CIVIL = 90 # Tensão acima disso = guerra
THRESHOLD_COLAPSO_ECON = 1000  # Inflação acima disso = hiperinflação
```

## 2.2 Fórmulas de Interação entre Sistemas

### Economia → Política

```python
def impacto_economia_aprovacao(estado):
    """
    Calcula como métricas econômicas afetam aprovação
    """
    # Crescimento positivo = bom, mas com diminishing returns
    impacto_crescimento = min(estado.crescimento * 2, 10)

    # Inflação sempre negativa, exponencial após 10%
    if estado.inflacao <= 10:
        impacto_inflacao = -estado.inflacao * 0.5
    else:
        impacto_inflacao = -5 - (estado.inflacao - 10) * 0.2

    # Desemprego muito sensível
    impacto_desemprego = -estado.desemprego * 0.8

    # Desigualdade afeta grupos específicos
    # (calculado separadamente por grupo)

    return impacto_crescimento + impacto_inflacao + impacto_desemprego


def impacto_economia_grupos(estado, grupo):
    """
    Diferentes grupos reagem diferentemente à economia
    """
    modificadores = {
        'trabalhadores': {
            'desemprego': -2.0,  # Muito sensíveis
            'inflacao': -1.5,
            'crescimento': 0.5
        },
        'elite': {
            'desemprego': -0.2,  # Pouco sensíveis
            'inflacao': -0.5,
            'crescimento': 2.0,   # Muito importante
            'impostos': -3.0      # Odeiam impostos
        },
        'classe_media': {
            'desemprego': -1.0,
            'inflacao': -2.0,    # Muito sensíveis (poupança)
            'crescimento': 1.0
        }
    }

    mod = modificadores.get(grupo.tipo, {'default': 1.0})
    impacto = sum(
        getattr(estado, metrica) * peso
        for metrica, peso in mod.items()
        if hasattr(estado, metrica)
    )
    return impacto
```

### Política → Economia

```python
def impacto_estabilidade_economia(estado):
    """
    Instabilidade política afeta economia
    """
    if estado.estabilidade > 70:
        return 0.1  # Bônus pequeno
    elif estado.estabilidade > 50:
        return 0
    elif estado.estabilidade > 30:
        return -0.2  # Penalidade moderada
    else:
        return -0.5  # Penalidade severa (investidores fogem)


def impacto_ideologia_economia(estado):
    """
    Posição ideológica afeta comportamento econômico
    """
    efeitos = {}

    # Economia planificada vs livre mercado
    if estado.ideologia.economico < -50:
        efeitos['crescimento_potencial'] = -0.2  # Menos dinâmico
        efeitos['desigualdade_tendencia'] = -0.01  # Mais igual
        efeitos['investimento_externo'] = -20  # Afugenta
    elif estado.ideologia.economico > 50:
        efeitos['crescimento_potencial'] = 0.2  # Mais dinâmico
        efeitos['desigualdade_tendencia'] = 0.01  # Mais desigual
        efeitos['investimento_externo'] = 20  # Atrai

    return efeitos
```

### Diplomacia → Economia

```python
def impacto_relacoes_comercio(estado, pais_outro):
    """
    Relações diplomáticas afetam comércio
    """
    relacao = estado.relacoes[pais_outro]

    if relacao.opiniao > 60:
        return 1.2  # 20% bônus comercial
    elif relacao.opiniao > 20:
        return 1.0  # Normal
    elif relacao.opiniao > -20:
        return 0.8  # 20% penalidade
    elif relacao.opiniao > -60:
        return 0.5  # 50% penalidade
    else:
        return 0.1  # Quase embargo


def calcular_vulnerabilidade_sancoes(estado):
    """
    Quão vulnerável o país é a sanções
    """
    # Dependência de comércio com potenciais sancionadores
    dependencia_ocidente = (
        estado.comercio['eua'] +
        estado.comercio['ue']
    ) / estado.pib

    # Alternativas disponíveis
    alternativas = (
        estado.relacoes['china'].opiniao +
        estado.relacoes['russia'].opiniao +
        estado.relacoes['india'].opiniao
    ) / 3

    vulnerabilidade = dependencia_ocidente * 100 - alternativas * 0.3
    return max(0, min(100, vulnerabilidade))
```

## 2.3 Balanceamento de Dificuldade

### Dificuldade por País

| País | Dificuldade | Razões |
|------|-------------|--------|
| **Brasil** | Médio | Economia diversificada, polarização alta |
| **EUA** | Médio-Fácil | Economia forte, mas polarização e dívida |
| **China** | Médio | Economia grande, mas tensões internas ocultas |
| **Rússia** | Difícil | Sanções, dependência de energia, conflito |
| **Índia** | Médio | Crescimento, mas desigualdade e tensões |
| **África do Sul** | Difícil | Desigualdade extrema, infraestrutura fraca |

### Ajuste Dinâmico de Dificuldade

```python
def ajustar_dificuldade(estado, config):
    """
    Ajusta probabilidades de eventos baseado em desempenho
    """
    if config.dificuldade_dinamica:
        # Jogador está muito bem?
        if estado.aprovacao > 70 and estado.crescimento > 5:
            return {
                'prob_eventos_negativos': 1.3,  # +30%
                'intensidade_crises': 1.2
            }
        # Jogador está mal?
        elif estado.aprovacao < 30 and estado.tensao > 60:
            return {
                'prob_eventos_positivos': 1.2,  # +20%
                'intensidade_crises': 0.9
            }

    return {
        'prob_eventos_negativos': 1.0,
        'prob_eventos_positivos': 1.0,
        'intensidade_crises': 1.0
    }
```

## 2.4 Balanceamento de Ações

### Custo-Benefício de Políticas

```python
POLITICAS = {
    'aumentar_salario_minimo': {
        'custo_politico': 30,
        'tempo_implementacao': 3,  # meses
        'efeitos': {
            'trabalhadores': +15,
            'elite': -15,
            'inflacao': +0.5,
            'consumo': +2,
            'desemprego': +0.5  # Controverso mas realista
        },
        'duracao_efeitos': 24
    },

    'privatizar_empresa_estatal': {
        'custo_politico': 50,
        'tempo_implementacao': 6,
        'efeitos': {
            'elite': +20,
            'trabalhadores': -20,
            'ideologia_economico': +15,
            'eficiencia_setor': +20,
            'receita_imediata': 'grande',
            'receita_futura': -10  # Perde dividendos
        },
        'duracao_efeitos': 'permanente'
    },

    'reforma_agraria': {
        'custo_politico': 80,
        'tempo_implementacao': 24,
        'efeitos': {
            'rurais': +30,
            'elite': -40,
            'gini': -0.05,
            'producao_agricola': -10,  # Curto prazo
            'tensao': +15,
            'ideologia_economico': -20
        },
        'duracao_efeitos': 'permanente',
        'risco_especial': 'golpe_ou_resistencia'
    },

    'austeridade_fiscal': {
        'custo_politico': 60,
        'tempo_implementacao': 1,
        'efeitos': {
            'todos_grupos': -10,
            'deficit': -30,
            'crescimento': -1.0,
            'confianca_mercado': +20,
            'juros_divida': -0.5
        },
        'duracao_efeitos': 12
    }
}
```

## 2.5 Fórmulas de Vitória

### Verificação de Condições

```python
def verificar_vitoria(estado, objetivo):
    """
    Verifica se condições de vitória foram atingidas
    """
    condicoes = OBJETIVOS[objetivo]['condicoes']

    for condicao in condicoes:
        valor_atual = getattr(estado, condicao['metrica'])

        if condicao['operador'] == '>':
            if valor_atual <= condicao['valor']:
                return False
        elif condicao['operador'] == '<':
            if valor_atual >= condicao['valor']:
                return False
        elif condicao['operador'] == 'manter':
            # Precisa manter por X meses
            if estado.meses_mantendo[condicao['metrica']] < condicao['duracao']:
                return False

    return True


OBJETIVOS = {
    'estabilidade_democratica': {
        'condicoes': [
            {'metrica': 'aprovacao', 'operador': '>', 'valor': 60},
            {'metrica': 'polarizacao', 'operador': '<', 'valor': 30},
            {'metrica': 'legitimidade', 'operador': '>', 'valor': 80},
            {'metrica': 'aprovacao', 'operador': 'manter', 'valor': 60, 'duracao': 24}
        ],
        'pontuacao_bonus': {
            'eleicao_vencida': 1000,
            'nenhum_protesto_violento': 500,
            'liberdade_imprensa_alta': 300
        }
    },

    'transicao_socialista': {
        'condicoes': [
            {'metrica': 'gini', 'operador': '<', 'valor': 0.25},
            {'metrica': 'servicos_publicos', 'operador': '>', 'valor': 80},
            {'metrica': 'economia_estatal', 'operador': '>', 'valor': 70},
            {'metrica': 'estabilidade', 'operador': '>', 'valor': 50}
        ],
        'pontuacao_bonus': {
            'sem_sancoes': 500,
            'crescimento_positivo': 300,
            'apoio_trabalhadores_90': 400
        }
    },

    'hegemonia_capitalista': {
        'condicoes': [
            {'metrica': 'pib_ranking', 'operador': '<', 'valor': 4},  # Top 3
            {'metrica': 'crescimento', 'operador': '>', 'valor': 5},
            {'metrica': 'crescimento', 'operador': 'manter', 'valor': 5, 'duracao': 12}
        ],
        'condicoes_proibidas': [
            {'metrica': 'gini', 'operador': '>', 'valor': 0.55}  # Não pode ser tão desigual
        ]
    }
}
```

## 2.6 Calibração Inicial por País

### Brasil — Valores Iniciais (2025)

```python
BRASIL_2025 = {
    'economia': {
        'pib_bilhoes_usd': 2100,
        'crescimento': 2.5,
        'inflacao': 4.5,
        'desemprego': 8.0,
        'divida_pib': 78,
        'gini': 0.52,
        'reservas_bilhoes': 350
    },
    'politica': {
        'aprovacao': 35,
        'estabilidade': 55,
        'polarizacao': 75,
        'legitimidade': 60
    },
    'grupos': {
        'trabalhadores': {'opiniao': 10, 'pop': 0.35},
        'classe_media': {'opiniao': -5, 'pop': 0.25},
        'elite': {'opiniao': 20, 'pop': 0.02},
        'militares': {'opiniao': 30, 'pop': 0.01},
        'rurais': {'opiniao': 25, 'pop': 0.15},
        'jovens': {'opiniao': -15, 'pop': 0.12},
        'religiosos': {'opiniao': 35, 'pop': 0.25},
        'midia': {'opiniao': -20, 'pop': 0.03}
    },
    'ideologia': {
        'economico': 20,    # Centro-direita
        'liberdades': 10,   # Democrático (frágil)
        'identidade': 15,   # Nacionalista moderado
        'mudanca': -10      # Levemente conservador
    },
    'militar': {
        'efetivo': 360,     # milhares
        'equipamento': 55,
        'moral': 70,
        'lealdade': 65
    }
}
```

### EUA — Valores Iniciais (2025)

```python
EUA_2025 = {
    'economia': {
        'pib_bilhoes_usd': 28000,
        'crescimento': 2.3,
        'inflacao': 3.2,
        'desemprego': 4.0,
        'divida_pib': 125,
        'gini': 0.41,
        'reservas_bilhoes': 250  # Menor pois dólar é reserva
    },
    'politica': {
        'aprovacao': 42,
        'estabilidade': 60,
        'polarizacao': 80,
        'legitimidade': 70
    },
    'ideologia': {
        'economico': 40,    # Direita econômica
        'liberdades': 50,   # Alto (tradição)
        'identidade': 10,   # Variável
        'mudanca': 0        # Dividido
    }
}
```

### China — Valores Iniciais (2025)

```python
CHINA_2025 = {
    'economia': {
        'pib_bilhoes_usd': 18500,
        'crescimento': 4.5,
        'inflacao': 2.0,
        'desemprego': 5.5,  # Oficial, real pode ser maior
        'divida_pib': 85,   # Governo + empresas estatais
        'gini': 0.38,
        'reservas_bilhoes': 3200
    },
    'politica': {
        'aprovacao': 75,    # Difícil medir, assumido
        'estabilidade': 85,
        'polarizacao': 20,  # Suprimida
        'legitimidade': 70  # Performática
    },
    'ideologia': {
        'economico': -20,   # Misto (estado forte)
        'liberdades': -60,  # Autoritário
        'identidade': 30,   # Nacionalista
        'mudanca': 20       # Modernização
    }
}
```

---

# 3. Tutoriais e Curva de Aprendizado

## 3.1 Estrutura do Tutorial

### Fase 1: Primeiros 5 Minutos

```
FLUXO:
1. Seleção de país (sugestão: Brasil para lusófonos, EUA para outros)
2. Seleção de objetivo (sugestão: Estabilidade Democrática para iniciantes)
3. Introdução narrada pela IA:
   "Você assume o governo de [País] em janeiro de 2025..."
4. Dashboard simplificado (apenas 4 métricas principais)
5. Primeiro evento tutorial: Decisão simples com consequências claras

TUTORIAL 1 - O Básico:
- Ensina a ler métricas
- Ensina a tomar decisão
- Mostra consequências
- Introduz conceito de grupos
```

### Fase 2: Primeiros 30 Minutos

```
PROGRESSÃO:
Turno 1-3: Apenas política interna
Turno 4-6: Introduz economia
Turno 7-9: Introduz diplomacia
Turno 10+: Jogo completo

EVENTOS GUIADOS:
- Cada novo sistema é introduzido com evento tutorial
- IA explica contexto histórico em cada decisão
- Dicas aparecem (podem ser desabilitadas)

COMPLEXIDADE PROGRESSIVA:
Início: 2-3 métricas visíveis
30 min: Todas as métricas
1 hora: Fórmulas e relações reveladas
```

## 3.2 Sistema de Dicas

```python
DICAS = {
    'primeiro_deficit': {
        'trigger': 'deficit > 0 pela primeira vez',
        'texto': 'Seu governo está gastando mais do que arrecada...',
        'link_contexto': 'economia_101'
    },
    'aprovacao_caindo': {
        'trigger': 'aprovacao cai 10% em 3 meses',
        'texto': 'Sua aprovação está caindo. Considere políticas populares...',
        'sugestoes': ['verificar_grupos', 'programa_social']
    },
    'tensao_subindo': {
        'trigger': 'tensao > 50 pela primeira vez',
        'texto': 'A tensão social está alta. Isso pode levar a protestos...',
        'link_contexto': 'estabilidade_101'
    }
}
```

---

# 4. Métricas de Telemetria para Balanceamento

## 4.1 Dados a Coletar

```python
TELEMETRIA = {
    'por_sessao': [
        'duracao_minutos',
        'decisoes_tomadas',
        'eventos_encontrados',
        'pausas',
        'uso_de_ia'
    ],
    'por_partida': [
        'pais_escolhido',
        'objetivo_escolhido',
        'resultado_final',  # vitoria/derrota/abandono
        'turnos_jogados',
        'metricas_finais',
        'eventos_chave'
    ],
    'por_evento': [
        'evento_id',
        'opcao_escolhida',
        'tempo_decisao_segundos',
        'consultou_contexto_ia'
    ],
    'agregado': [
        'taxa_vitoria_por_pais',
        'taxa_vitoria_por_objetivo',
        'eventos_mais_dificeis',
        'pontos_de_abandono'
    ]
}
```

## 4.2 Alertas de Balanceamento

```python
ALERTAS = {
    'taxa_vitoria_alta': {
        'threshold': '> 70%',
        'acao': 'Aumentar dificuldade base ou ajustar eventos'
    },
    'taxa_vitoria_baixa': {
        'threshold': '< 30%',
        'acao': 'Reduzir dificuldade ou melhorar tutorial'
    },
    'abandono_alto': {
        'threshold': '> 50% abandonam antes turno 20',
        'acao': 'Revisar onboarding e primeiros eventos'
    },
    'evento_muito_dificil': {
        'threshold': '> 80% escolhem mesma opção',
        'acao': 'Balancear opções do evento'
    }
}
```

---

*— Fim do Documento de Eventos e Balanceamento —*

*Versão 1.0 — Dezembro 2025*
