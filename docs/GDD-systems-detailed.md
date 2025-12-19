# Sistemas de Jogo — Especificação Detalhada

## [Nome do Jogo — A Definir]

**Versão:** 1.0
**Data:** Dezembro 2025
**Baseado em:** GDD v0.1

---

# 1. Sistema de Tempo

## 1.1 Estrutura Temporal

| Elemento | Especificação |
|----------|---------------|
| **Unidade base** | 1 Turno = 1 Mês (in-game) |
| **Duração da partida** | 48-120 turnos (4-10 anos) configurável |
| **Velocidade** | 3 níveis: Lento (5s/turno), Normal (3s/turno), Rápido (1s/turno) |
| **Pausa** | Disponível a qualquer momento |
| **Auto-pause** | Ativa em eventos críticos e decisões importantes |

## 1.2 Ciclos Temporais

```
CICLO MENSAL (1 turno):
├── Fase 1: Atualização de Métricas
│   └── Cálculo de todas as variáveis econômicas/políticas
├── Fase 2: Processamento de Eventos
│   └── Verificação de triggers, geração de eventos
├── Fase 3: Ações do Jogador
│   └── Decisões, políticas, diplomacia
├── Fase 4: Reações da IA
│   └── Outros países e grupos reagem
└── Fase 5: Resolução
    └── Aplicação de efeitos, transição

CICLO ANUAL (12 turnos):
├── Janeiro: Relatório Econômico Anual
├── Março: Avaliação de Aprovação (se democracia)
├── Junho: Cúpulas Internacionais
├── Setembro: Assembleia Geral ONU
└── Dezembro: Balanço Anual + Eventos de Fim de Ano

CICLO ELEITORAL (varia por país):
├── Brasil: A cada 48 meses
├── EUA: A cada 48 meses (presidencial)
├── Outros: Conforme sistema político
└── Ditaduras: Sem ciclo eleitoral (mas referendos possíveis)
```

## 1.3 Condições de Fim de Partida

### Vitória

| Objetivo | Condição de Vitória | Prazo |
|----------|---------------------|-------|
| **Estabilidade Democrática** | Aprovação > 60%, Polarização < 30%, Legitimidade > 80% por 24 meses consecutivos | Sem prazo |
| **Hegemonia Capitalista** | PIB Top 3 mundial, Crescimento > 5% por 12 meses, Gini permitido até 0.45 | Sem prazo |
| **Transição Socialista** | Gini < 0.25, Serviços públicos > 80%, Economia 70%+ estatal, sem colapso | Sem prazo |
| **Revolução Popular** | Mudança de sistema político via mobilização, sobreviver 24 meses após | Sem prazo |
| **Autoritarismo Nacionalista** | Controle total por 48 meses, sem guerra civil, economia funcional | Sem prazo |
| **Soberania Regional** | Liderar bloco de 5+ países, independência de superpotências > 80% | Sem prazo |

### Derrota

| Condição | Descrição |
|----------|-----------|
| **Golpe de Estado** | Militares tomam poder (Tensão > 90 + Apoio Militar < 20) |
| **Guerra Civil Perdida** | Governo perde controle de 50%+ do território |
| **Colapso Econômico** | Hiperinflação (> 1000%) por 6 meses OU PIB cai 50% |
| **Revolução Contra** | Mobilização popular derruba governo (Aprovação < 10 por 12 meses) |
| **Invasão Estrangeira** | País é ocupado (apenas V2) |
| **Renúncia Forçada** | Aprovação < 5% + Protestos massivos + Sem apoio de nenhum grupo |

---

# 2. Sistema Político Detalhado

## 2.1 Métricas Políticas

### Aprovação Popular

```
FÓRMULA BASE:
Aprovação = Σ (Aprovação_Grupo × Peso_Grupo)

Onde Peso_Grupo = (População% × Mobilização × Relevância_Política)

MODIFICADORES MENSAIS:
+/- Economia: (Crescimento - Inflação - Desemprego) × 0.5
+/- Serviços: (Qualidade_Saúde + Qualidade_Educação) × 0.3
+/- Segurança: (100 - Taxa_Crime) × 0.2
+/- Eventos: Bônus/Penalidade de eventos recentes
+/- Carisma: Modificador de líder (se aplicável)

DECAIMENTO:
- Aprovação decai 1% por mês naturalmente (fadiga)
- Ações positivas têm efeito decrescente (diminishing returns)
```

### Estabilidade

```
FÓRMULA:
Estabilidade = 100 - (Polarização × 0.4) - (Tensão_Interna × 0.4) - (Crise_Econômica × 0.2)

THRESHOLDS:
> 80: Estável - governo funciona normalmente
60-80: Tensões - protestos esporádicos possíveis
40-60: Instável - greves e manifestações frequentes
20-40: Crise - risco de golpe ou revolução
< 20: Colapso Iminente - ações emergenciais necessárias
```

### Polarização

```
AUMENTA COM:
+ Discursos radicais (+5 a +15)
+ Repressão a grupos (+10 a +20)
+ Mídia não regulada em crise (+2/mês)
+ Desigualdade alta (Gini > 0.5: +1/mês)
+ Eleições disputadas (+10 temporário)

DIMINUI COM:
- Políticas de consenso (-2 a -5)
- Programas de integração (-1/mês)
- Mídia pública forte (-1/mês)
- Crescimento econômico distribuído (-1/mês)

LIMITE: 0-100 (não pode ser negativo)
```

### Legitimidade

```
FONTES DE LEGITIMIDADE:
├── Eleitoral: Vitória em eleições limpas (+30)
├── Constitucional: Respeito às instituições (+20)
├── Revolucionária: Apoio popular massivo (+25)
├── Tradicional: Continuidade histórica (+15)
├── Performática: Resultados econômicos/sociais (+10 a +30)
└── Internacional: Reconhecimento externo (+10)

PERDA DE LEGITIMIDADE:
- Fraude eleitoral revelada (-30)
- Violação constitucional (-20)
- Repressão violenta (-15 a -40)
- Corrupção exposta (-10 a -25)
- Fracasso econômico (-5 a -20)
```

## 2.2 Grupos Sociais — Especificação Completa

### Estrutura de Dados por Grupo

```json
{
  "grupo": {
    "nome": "String",
    "populacao_percentual": 0.0-1.0,
    "poder_economico": 0-100,
    "capacidade_mobilizacao": 0-100,
    "organizacao": 0-100,
    "preferencias_ideologicas": {
      "economico": -100 to +100,
      "liberdades": -100 to +100,
      "identidade": -100 to +100,
      "mudanca": -100 to +100
    },
    "opiniao_governo": -100 to +100,
    "demandas_atuais": ["String"],
    "aliados_naturais": ["grupo_id"],
    "rivais_naturais": ["grupo_id"]
  }
}
```

### Grupos — Brasil (Exemplo Detalhado)

| Grupo | Pop% | Poder Econ | Mobilização | Preferências (Econ/Lib/Ident/Mud) |
|-------|------|------------|-------------|-----------------------------------|
| **Trabalhadores Urbanos** | 35% | 20 | 70 | -30/+20/-10/+30 |
| **Classe Média** | 25% | 35 | 50 | +10/+40/0/+10 |
| **Elite/Oligarquia** | 2% | 80 | 30 | +80/-20/+20/-40 |
| **Militares** | 1% | 15 | 90 | +20/-60/+60/-30 |
| **Rurais/Agricultores** | 15% | 25 | 40 | +30/-20/+40/-20 |
| **Jovens/Estudantes** | 12% | 5 | 80 | -40/+60/-20/+70 |
| **Religiosos Conservadores** | 25% | 20 | 60 | +20/-40/+30/-60 |
| **Mídia/Intelectuais** | 3% | 40 | 70 | +10/+70/-10/+40 |

*Nota: Percentuais somam mais de 100% pois há sobreposição entre grupos*

### Cálculo de Opinião do Grupo

```
FÓRMULA:
Opiniao_Grupo = Base + Alinhamento_Ideologico + Beneficios_Recentes + Historico

Onde:
- Base: 0 (neutro no início)
- Alinhamento_Ideologico: Σ(|Pref_Grupo - Pos_Governo|) × -0.5
  (quanto mais distante ideologicamente, mais negativo)
- Beneficios_Recentes: Soma de políticas que beneficiam o grupo nos últimos 12 meses
- Historico: Memória de ações passadas (decai 10%/ano)

MODIFICADORES DE AÇÃO:
- Aumento salarial mínimo: Trabalhadores +15, Elite -10
- Privatização: Elite +20, Trabalhadores -15
- Aumento impostos ricos: Trabalhadores +10, Elite -25
- Lei anti-aborto: Religiosos +20, Jovens -15, Mídia -10
```

## 2.3 Sistema Eleitoral

### Tipos de Sistema

| Sistema | Países | Mecânica |
|---------|--------|----------|
| **Presidencialismo** | Brasil, EUA | Eleição direta, 2 turnos se < 50% |
| **Parlamentarismo** | (futuro) | Coalizões, voto de confiança |
| **Partido Único** | China | Sem eleições livres, legitimidade interna |
| **Autoritário** | Rússia | Eleições controladas, oposição limitada |
| **Democracia Jovem** | África do Sul | Eleições livres, instituições frágeis |

### Mecânica Eleitoral (Democracias)

```
CAMPANHA (3 meses antes):
- Jogador escolhe: focar em quais grupos?
- Gastos de campanha (afeta resultado)
- Debates (eventos especiais)
- Escândalos podem surgir

CÁLCULO DE VOTOS:
Votos% = Σ (Opiniao_Grupo × Pop_Grupo × Participacao_Grupo)

Participacao_Grupo varia por:
- Obrigatoriedade do voto
- Idade média do grupo
- Mobilização atual

RESULTADO:
> 50% primeiro turno: Vitória
< 50%: Segundo turno entre top 2
Vitória: Legitimidade +30, continua jogando
Derrota: Fim de partida OU jogar como oposição (futuro)
```

## 2.4 Ações Políticas Disponíveis

### Categoria: Legislação

| Ação | Custo Político | Tempo | Efeitos Primários |
|------|----------------|-------|-------------------|
| Reforma Tributária | Alto | 6 meses | Redistribuição, crescimento ou austeridade |
| Reforma Trabalhista | Alto | 4 meses | Flexibilização ou proteção |
| Reforma Previdenciária | Muito Alto | 8 meses | Fiscal vs Aprovação |
| Lei de Mídia | Médio | 3 meses | Controle vs Liberdade |
| Lei Ambiental | Médio | 3 meses | Sustentabilidade vs Crescimento |

### Categoria: Executivo

| Ação | Custo Político | Tempo | Efeitos Primários |
|------|----------------|-------|-------------------|
| Trocar Ministro | Baixo | Imediato | Reset de políticas setoriais |
| Discurso Nacional | Nenhum | Imediato | Aprovação +/- 5, Polarização +/- |
| Estado de Emergência | Muito Alto | Imediato | Poderes extras, Legitimidade -20 |
| Decreto Executivo | Médio | Imediato | Ação rápida, contestável |

### Categoria: Repressão/Controle

| Ação | Custo Político | Tempo | Efeitos |
|------|----------------|-------|---------|
| Censurar Mídia | Alto | Imediato | Controle +20, Legitimidade -15, Internacional -20 |
| Prender Oposição | Muito Alto | Imediato | Estabilidade +10 curto prazo, -30 longo prazo |
| Lei Marcial | Extremo | Imediato | Controle total, Economia -30%, Legitimidade -40 |

---

# 3. Sistema Econômico Detalhado

## 3.1 Métricas Econômicas

### PIB e Crescimento

```
CÁLCULO MENSAL DO PIB:
PIB_novo = PIB_anterior × (1 + Taxa_Crescimento_Mensal)

Taxa_Crescimento_Mensal = Base + Modificadores

BASE por desenvolvimento:
- Países desenvolvidos: 0.1% a 0.3%/mês
- Emergentes: 0.3% a 0.6%/mês
- Em desenvolvimento: 0.2% a 0.8%/mês (mais volátil)

MODIFICADORES:
+ Investimento infraestrutura: +0.1% a +0.3%
+ Estabilidade política: +0.1% se > 70
+ Acordos comerciais novos: +0.2% por 12 meses
+ Juros baixos: +0.1% a +0.2%
- Sanções: -0.3% a -1.0%
- Guerra/conflito: -0.5% a -2.0%
- Crise de confiança: -0.2% a -0.5%
- Inflação alta (>20%): -0.3%
```

### Inflação

```
FÓRMULA MENSAL:
Inflacao = Inflacao_Anterior + Pressoes - Controles

PRESSÕES INFLACIONÁRIAS:
+ Emissão monetária: +0.5% a +5% por emissão
+ Gastos públicos excessivos: +0.1% por % acima do sustentável
+ Desvalorização cambial: +0.2% por 10% de desvalorização
+ Choque de oferta (evento): +1% a +10%
+ Demanda aquecida: +0.1% se crescimento > 5%

CONTROLES:
- Juros altos: -0.2% por ponto acima do neutro
- Austeridade fiscal: -0.1% a -0.3%
- Controle de preços: -1% imediato, +2% em 6 meses (reprimida)
- Âncora cambial: estabiliza mas custa reservas

THRESHOLDS:
< 3%: Saudável
3-10%: Aceitável
10-20%: Problemática (aprovação -5)
20-50%: Alta (aprovação -15, crescimento -0.3%)
50-100%: Muito Alta (crise)
> 100%: Hiperinflação (colapso possível)
```

### Desemprego

```
FÓRMULA:
Desemprego = Desemprego_Anterior + Variacao

VARIAÇÃO MENSAL:
+ Recessão: +0.3% por mês de crescimento negativo
+ Automação/produtividade: +0.1% tendência
+ Política contracionista: +0.2%
- Crescimento econômico: -0.1% por 1% de crescimento
- Programas de emprego: -0.2% a -0.5%
- Expansão fiscal: -0.1% a -0.2%

THRESHOLDS:
< 5%: Pleno emprego
5-8%: Saudável
8-12%: Elevado (aprovação -5)
12-20%: Crítico (aprovação -15, tensão +10)
> 20%: Crise social (risco de instabilidade)
```

### Dívida Pública

```
FÓRMULA:
Divida/PIB = (Divida_Anterior + Deficit - Pagamentos) / PIB

SUSTENTABILIDADE:
< 40%: Muito saudável (pode gastar)
40-60%: Saudável
60-80%: Atenção (juros começam a subir)
80-100%: Preocupante (pressão internacional)
100-150%: Crítica (risco de default)
> 150%: Insustentável (FMI bate à porta)

CONSEQUÊNCIAS DE DÍVIDA ALTA:
- Juros de mercado sobem
- Investimento externo foge
- Agências rebaixam rating
- FMI oferece "ajuda" com condições
```

### Desigualdade (Coeficiente de Gini)

```
ESCALA: 0 (igualdade perfeita) a 1 (desigualdade máxima)

VALORES REAIS 2025 (aproximados):
- África do Sul: 0.63
- Brasil: 0.53
- EUA: 0.41
- China: 0.38
- Rússia: 0.36
- Índia: 0.35

MODIFICADORES:
- Tributação progressiva: -0.01 a -0.03 por reforma
- Programas sociais: -0.005 por programa robusto
- Privatizações: +0.01 a +0.02
- Liberalização: +0.01 a +0.03
- Crescimento sem redistribuição: +0.005/ano

EFEITOS:
> 0.50: Tensão social +1/mês, risco de protestos
> 0.55: Aprovação trabalhadores -2/mês
> 0.60: Instabilidade +1/mês
```

## 3.2 Setores Econômicos

### Estrutura por Setor

```json
{
  "setor": {
    "nome": "String",
    "percentual_pib": 0.0-1.0,
    "emprego_percentual": 0.0-1.0,
    "propriedade": {
      "estatal": 0.0-1.0,
      "privada_nacional": 0.0-1.0,
      "estrangeira": 0.0-1.0
    },
    "produtividade": 0-100,
    "dependencia_externa": 0-100,
    "vulnerabilidade_sancoes": 0-100
  }
}
```

### Setores — Brasil (Exemplo)

| Setor | % PIB | % Emprego | Estatal | Vulnerabilidade |
|-------|-------|-----------|---------|-----------------|
| Agronegócio | 25% | 15% | 5% | Baixa |
| Indústria | 20% | 18% | 15% | Média |
| Serviços | 45% | 55% | 10% | Baixa |
| Energia | 8% | 3% | 60% | Alta |
| Finanças | 7% | 4% | 30% | Média |

## 3.3 Ações Econômicas

### Política Fiscal

| Ação | Efeito Imediato | Efeito Longo Prazo |
|------|-----------------|---------------------|
| Aumentar Impostos Ricos | Receita +10%, Elite -20 opinião | Fuga de capitais possível |
| Reduzir Impostos | Déficit +, Crescimento +0.2% | Dívida aumenta |
| Austeridade | Déficit -, Aprovação -10 | Estabilidade fiscal |
| Expansão Fiscal | Crescimento +0.3%, Déficit + | Risco inflação |

### Política Monetária

| Ação | Efeito Imediato | Trade-off |
|------|-----------------|-----------|
| Subir Juros | Inflação -0.3%/mês | Crescimento -0.2%, Desemprego + |
| Baixar Juros | Crescimento +0.2% | Inflação +0.2%, Bolha possível |
| Emitir Moeda | Liquidez imediata | Inflação +1-5% |
| Controle Cambial | Estabilidade | Mercado negro, confiança - |

### Estruturais

| Ação | Tempo | Efeito |
|------|-------|--------|
| Nacionalizar Setor | 3-6 meses | Controle +, Investimento -, Ideologia - |
| Privatizar Setor | 3-6 meses | Receita imediata, Eficiência +/-, Ideologia + |
| Reforma Agrária | 12+ meses | Gini -, Elite -30, Produtividade ? |
| Investir Infraestrutura | 12-36 meses | Crescimento futuro +0.5% |

---

# 4. Sistema Diplomático Detalhado

## 4.1 Relações Bilaterais

### Estrutura de Dados

```json
{
  "relacao": {
    "pais_origem": "String",
    "pais_destino": "String",
    "opiniao": -100 to +100,
    "comercio_bilateral": {
      "exportacoes": valor_usd,
      "importacoes": valor_usd,
      "balanca": valor_usd
    },
    "dependencia": 0-100,
    "tratados_ativos": ["tratado_id"],
    "historico_conflitos": ["evento_id"],
    "alinhamento_ideologico": -100 to +100
  }
}
```

### Matriz de Relações Iniciais (Simplificada)

|  | Brasil | EUA | China | Rússia | Índia | África Sul |
|--|--------|-----|-------|--------|-------|------------|
| **Brasil** | - | +30 | +40 | +20 | +35 | +45 |
| **EUA** | +30 | - | -40 | -50 | +20 | +10 |
| **China** | +40 | -40 | - | +50 | -10 | +30 |
| **Rússia** | +20 | -50 | +50 | - | +30 | +20 |
| **Índia** | +35 | +20 | -10 | +30 | - | +40 |
| **África Sul** | +45 | +10 | +30 | +20 | +40 | - |

### Cálculo de Mudança de Opinião

```
FÓRMULA:
Opiniao_Nova = Opiniao_Anterior + Acoes_Recentes + Drift_Ideologico

MODIFICADORES POR AÇÃO:
+ Acordo comercial: +10 a +20
+ Visita de estado: +5 a +10
+ Apoio em crise: +15 a +25
+ Ajuda humanitária: +5 a +15
- Sanções impostas: -20 a -40
- Crítica pública: -5 a -15
- Apoiar rival: -10 a -20
- Expulsar embaixador: -30

DRIFT IDEOLÓGICO (mensal):
Se |Ideologia_A - Ideologia_B| aumenta: -0.5/mês
Se |Ideologia_A - Ideologia_B| diminui: +0.5/mês
```

## 4.2 Organizações Internacionais

### ONU e Conselho de Segurança

```
MECÂNICAS:
- Votações em resoluções (evento)
- Veto (P5 apenas)
- Sanções multilaterais
- Missões de paz

EFEITOS:
- Seguir resoluções: Legitimidade internacional +5
- Violar resoluções: Legitimidade -10, sanções possíveis
- Liderar iniciativa: Soft Power +10
```

### FMI e Banco Mundial

```
CONDIÇÕES PARA EMPRÉSTIMO:
- Dívida/PIB > 80% OU Crise cambial
- Aceitar condições (austeridade, privatizações)
- Supervisão externa

EFEITOS DO EMPRÉSTIMO:
+ Liquidez imediata
+ Estabilização de curto prazo
- Soberania -20
- Políticas impostas por 24-48 meses
- Aprovação popular -15 (esquerda -30)
```

### BRICS+

```
BENEFÍCIOS:
+ Comércio preferencial entre membros
+ Banco de desenvolvimento alternativo
+ Coordenação política
+ Reduz dependência do dólar

REQUISITOS:
- Manter boas relações com membros
- Contribuir para fundo comum
- Não alinhar demais com Ocidente
```

## 4.3 Ações Diplomáticas

| Ação | Custo | Tempo | Efeito |
|------|-------|-------|--------|
| Propor Tratado Comercial | Médio | 3-6 meses | Comércio +20%, Opinião +10 |
| Romper Relações | Baixo | Imediato | Opinião para -80, Comércio zero |
| Aplicar Sanções | Alto | 1 mês | Opinião -30, Pressão econômica no alvo |
| Entrar em Organização | Variável | 6-12 meses | Benefícios da org, Compromissos |
| Sair de Organização | Alto | 3 meses | Liberdade +, Isolamento + |
| Cúpula Bilateral | Médio | Evento | Opinião +5 a +15, Acordos possíveis |

---

# 5. Sistema de Conflito Detalhado

## 5.1 Tensão Interna

```
FÓRMULA:
Tensao = Base + Gatilhos - Estabilizadores

BASE:
- Depende do país e situação inicial

GATILHOS (+):
+ Aprovação < 30: +2/mês
+ Desemprego > 15%: +1/mês
+ Inflação > 50%: +2/mês
+ Repressão: +5 a +20 por ação
+ Gini > 0.55: +1/mês
+ Polarização > 70: +2/mês
+ Crise econômica: +3/mês

ESTABILIZADORES (-):
- Programas sociais: -1/mês
- Crescimento econômico: -1/mês se > 3%
- Negociação com grupos: -2 a -10 por acordo
- Aprovação > 60: -1/mês
```

## 5.2 Guerra Civil

### Condições de Início

```
GATILHO AUTOMÁTICO:
Tensao >= 95 por 3 meses consecutivos

GATILHO CONDICIONAL:
Tensao >= 80 E (
  Grupo com Opinião < -60 E Mobilização > 70
  OU
  Militares com Opinião < -40
  OU
  Evento de insurgência não resolvido
)
```

### Mecânica de Guerra Civil

```
FASES:
1. Eclosão: Definição de facções, territórios iniciais
2. Conflito: Turnos de combate, diplomacia interna
3. Resolução: Vitória, derrota, ou negociação

FACÇÕES POSSÍVEIS:
- Governo (jogador)
- Insurgentes (baseado em grupos descontentes)
- Separatistas (regiões específicas)
- Militares rebeldes (se golpe falhou)
- Facção externa (apoiada por outro país)

TERRITÓRIOS:
País dividido em 5-10 regiões
Cada região tem:
- Controle (% por facção)
- Recursos (econômicos, militares)
- População
- Lealdade histórica

COMBATE SIMPLIFICADO:
Força_Efetiva = Tropas × Moral × Equipamento × Terreno
Resultado = Comparação de forças + Aleatoriedade (±20%)
Perdas proporcionais ao resultado
```

### Resolução

| Resultado | Condição | Consequência |
|-----------|----------|--------------|
| Vitória Militar | Controle 100% por 6 meses | Governo mantido, trauma nacional |
| Negociação | Acordo com insurgentes | Concessões, paz frágil |
| Derrota | Governo perde capital ou 50%+ | Fim de partida ou mudança de regime |
| Intervenção Externa | Outro país intervém | Dependência, ocupação possível |

## 5.3 Forças Armadas

```
MÉTRICAS MILITARES:
- Efetivo: Número de tropas (em milhares)
- Equipamento: 0-100 (qualidade/modernização)
- Moral: 0-100 (disposição de lutar)
- Lealdade: 0-100 (lealdade ao governo)

ORÇAMENTO MILITAR:
% do PIB dedicado às forças armadas
- < 1%: Militar -5 opinião/mês, capacidade decai
- 1-2%: Manutenção
- 2-4%: Expansão moderada
- > 4%: Expansão rápida, economia sofre

AÇÕES MILITARES:
| Ação | Custo | Efeito |
|------|-------|--------|
| Modernizar | Alto | Equipamento +10, 12 meses |
| Recrutar | Médio | Efetivo +10%, 6 meses |
| Purgar Oficiais | Político | Lealdade +20, Capacidade -20 |
| Aumentar Salários | Médio | Moral +10, Lealdade +5 |
```

---

# 6. Sistema de Ideologias Detalhado

## 6.1 Eixos Ideológicos

### Escala e Posicionamento

```
ESCALA: -100 a +100 para cada eixo

EIXO ECONÔMICO:
-100: Economia totalmente planificada, propriedade coletiva
-50: Economia mista com forte presença estatal
0: Social-democracia, mercado regulado
+50: Economia de mercado com intervenção mínima
+100: Laissez-faire total, sem regulação

EIXO LIBERDADES:
-100: Totalitarismo, controle total do Estado
-50: Autoritarismo, liberdades restritas
0: Democracia iliberal, liberdades limitadas
+50: Democracia liberal, amplas liberdades
+100: Libertarianismo, Estado mínimo

EIXO IDENTIDADE:
-100: Ultranacionalismo, xenofobia
-50: Nacionalismo forte, protecionismo cultural
0: Patriotismo moderado
+50: Cosmopolitismo, abertura cultural
+100: Internacionalismo, identidade global

EIXO MUDANÇA:
-100: Reacionarismo, retorno ao passado
-50: Conservadorismo forte
0: Centrismo, mudança gradual
+50: Progressismo, reformas amplas
+100: Revolucionarismo, ruptura total
```

## 6.2 Movimento Ideológico

```
CADA DECISÃO MOVE NOS EIXOS:

Exemplo - Nacionalizar Setor de Energia:
- Econômico: -15 (mais planificado)
- Liberdades: -5 (mais controle estatal)
- Identidade: +5 (soberania nacional)
- Mudança: +10 (reforma estrutural)

Exemplo - Acordo de Livre Comércio:
- Econômico: +10 (mais mercado)
- Liberdades: +5 (menos barreiras)
- Identidade: -10 (mais integração)
- Mudança: 0 (depende do contexto)

INÉRCIA:
Após 24 meses em uma posição, movimentos custam 50% mais
Após 48 meses, movimentos custam 100% mais
Simula consolidação de regime
```

## 6.3 Preferências dos Grupos

```
ALINHAMENTO = 100 - (Distância_Média × 2)

Distância_Média = (|Eco_Grupo - Eco_Gov| + |Lib_Grupo - Lib_Gov| + ...) / 4

Se Alinhamento > 70: Grupo é base de apoio (+20 opinião)
Se Alinhamento 40-70: Grupo é neutro
Se Alinhamento < 40: Grupo é oposição (-10 opinião base)
```

---

# 7. Sistema de IA — Especificação

## 7.1 Quando a IA é Chamada

```
TRIGGERS PARA IA:

1. DECISÕES IMPORTANTES (sempre):
   - Reformas estruturais
   - Mudanças constitucionais
   - Declarações diplomáticas
   - Início/fim de conflitos

2. CONTEXTUALIZAÇÃO (sob demanda):
   - Jogador toca em "Contexto Histórico"
   - Primeira vez que encontra situação

3. EVENTOS DINÂMICOS (background):
   - IA gera eventos baseados em padrões
   - Máximo 2 eventos gerados por IA/mês

4. LITERATURA (sob demanda):
   - Jogador pede recomendações
   - Biblioteca de contextos salvos
```

## 7.2 Prompts Base

### Prompt de Contexto Histórico

```
SYSTEM:
Você é um historiador especializado em política comparada e relações
internacionais. Sua função é contextualizar decisões políticas com
paralelos históricos reais.

Regras:
1. Cite apenas eventos históricos reais e verificáveis
2. Apresente múltiplas perspectivas quando relevante
3. Não faça julgamentos morais - apresente fatos e consequências
4. Mantenha resposta em 2-3 parágrafos (máximo 200 palavras)
5. Inclua datas e nomes específicos
6. Se não houver paralelo claro, diga isso

USER:
[Contexto do jogo: País, ano, métricas atuais]
[Decisão considerada: descrição]

Forneça paralelos históricos relevantes para esta decisão.
```

### Prompt de Geração de Eventos

```
SYSTEM:
Você é um designer de jogos especializado em simulação política.
Gere eventos realistas baseados no estado atual do jogo.

Regras:
1. Evento deve ser plausível dado o contexto
2. Ofereça 2-4 opções de resposta
3. Cada opção tem consequências claras
4. Não pode contradizer o estado do jogo
5. Mantenha tom neutro e informativo

USER:
[Estado do jogo em JSON]
[Padrões recentes de decisões]
[Eventos recentes]

Gere um evento que desafie o jogador.

OUTPUT FORMAT:
{
  "titulo": "String",
  "descricao": "String (50-100 palavras)",
  "contexto_historico": "String (paralelo real)",
  "opcoes": [
    {
      "texto": "String",
      "efeitos": {objeto de efeitos}
    }
  ]
}
```

## 7.3 Validação de Output

```
VALIDAÇÕES OBRIGATÓRIAS:

1. Consistência com estado do jogo:
   - IA não pode referenciar país que não existe
   - Valores numéricos devem estar em ranges válidos
   - Eventos não podem contradizer eventos passados

2. Factualidade histórica:
   - Checagem contra base de conhecimento
   - Datas devem ser verificáveis
   - Nomes de figuras históricas corretos

3. Moderação de conteúdo:
   - Sem glorificação de violência
   - Sem conteúdo discriminatório
   - Respeito a vítimas de atrocidades

4. Formato:
   - JSON válido quando aplicável
   - Limites de caracteres respeitados
   - Campos obrigatórios presentes
```

## 7.4 Cache e Fallback

```
ESTRATÉGIA DE CACHE:

1. Contextos históricos comuns: pré-gerados (100+ situações)
2. Eventos base: catálogo de 500+ eventos pré-escritos
3. Respostas recentes: cache por 24h
4. Embeddings: pré-computados para RAG

FALLBACK SEM CONECTIVIDADE:

1. Usar eventos pré-escritos do catálogo
2. Contextos históricos genéricos
3. Desabilitar geração dinâmica
4. Notificar jogador que modo offline está ativo
5. Salvar requests para sync posterior
```

---

*— Fim do Documento de Sistemas —*

*Versão 1.0 — Dezembro 2025*
