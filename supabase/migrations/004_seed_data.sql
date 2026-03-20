-- ============================================
-- Seed Data - Modules
-- ============================================

INSERT INTO modules (slug, title, description, icon, color, order_index, total_xp) VALUES
('orcamento-pessoal', 'Orcamento Pessoal', 'Aprenda a organizar seu dinheiro e criar um orcamento que funciona no seu dia a dia.', '💰', '#00FF88', 1, 280),
('poupanca-reserva', 'Poupanca e Reserva de Emergencia', 'Descubra como guardar dinheiro de forma inteligente e montar sua reserva de emergencia.', '🏦', '#00E5FF', 2, 210),
('investimentos-iniciantes', 'Investimentos para Iniciantes', 'De os primeiros passos no mundo dos investimentos: Tesouro Direto, CDBs, acoes e mais.', '📈', '#BF00FF', 3, 280),
('credito-dividas', 'Credito e Dividas', 'Entenda como funciona o credito, cartoes, financiamentos e como sair das dividas.', '💳', '#FFD600', 4, 210);

-- ============================================
-- Seed Data - Lessons
-- ============================================

-- Module 1: Orcamento Pessoal
INSERT INTO lessons (module_id, slug, title, description, content_markdown, order_index, xp_reward, duration_minutes) VALUES

((SELECT id FROM modules WHERE slug = 'orcamento-pessoal'),
'o-que-e-orcamento', 'O que e Orcamento?', 'Conceitos basicos sobre orcamento pessoal',
'## O que e um Orcamento?

Um **orcamento pessoal** e um plano que mostra quanto dinheiro voce ganha e como voce gasta. Parece simples, ne? Mas a maioria dos brasileiros nao tem um!

### Por que fazer um orcamento?

- **Controle**: Saber exatamente para onde vai seu dinheiro
- **Liberdade**: Ter dinheiro para o que realmente importa pra voce
- **Seguranca**: Estar preparado para imprevistos
- **Objetivos**: Conseguir realizar seus sonhos financeiros

### Receita vs Despesa

> **Receita** e todo dinheiro que entra: salario, freelance, mesada, renda extra.
> **Despesa** e todo dinheiro que sai: aluguel, comida, transporte, lazer.

A regra de ouro e simples: **suas receitas precisam ser maiores que suas despesas**. Se voce gasta mais do que ganha, esta se endividando.

### Tipos de Despesas

1. **Fixas**: Valores que se repetem todo mes (aluguel, internet, academia)
2. **Variaveis**: Mudam de valor todo mes (comida, transporte, lazer)
3. **Eventuais**: Aparecem de vez em quando (medico, conserto, presente)

Saber classificar seus gastos e o primeiro passo para controla-los!',
1, 50, 5),

((SELECT id FROM modules WHERE slug = 'orcamento-pessoal'),
'metodo-50-30-20', 'Metodo 50-30-20', 'A regra mais simples para dividir seu dinheiro',
'## Metodo 50-30-20

Essa e a regra mais famosa de orcamento pessoal, criada pela senadora americana **Elizabeth Warren**. E super simples!

### Como funciona?

Divida sua renda liquida (o que voce recebe depois dos descontos) em tres partes:

- **50% - Necessidades**: Gastos essenciais que voce nao pode evitar
- **30% - Desejos**: Coisas que voce quer, mas nao precisa para sobreviver
- **20% - Poupanca/Investimentos**: Guardar para o futuro

### Exemplos praticos

Se voce ganha **R$3.000** por mes:

| Categoria | % | Valor |
|-----------|---|-------|
| Necessidades | 50% | R$1.500 |
| Desejos | 30% | R$900 |
| Poupanca | 20% | R$600 |

### O que entra em cada categoria?

**Necessidades (50%)**:
- Aluguel ou prestacao da casa
- Conta de luz, agua, internet
- Alimentacao basica
- Transporte para o trabalho
- Plano de saude

**Desejos (30%)**:
- Streaming (Netflix, Spotify)
- Restaurantes e delivery
- Roupas nao essenciais
- Viagens e lazer
- Assinaturas diversas

**Poupanca/Investimentos (20%)**:
- Reserva de emergencia
- Investimentos
- Pagamento extra de dividas

> **Dica**: Se voce nao consegue encaixar tudo em 50% de necessidades, reveja seus gastos fixos. Talvez seja hora de mudar de plano de celular ou renegociar o aluguel!',
2, 50, 7),

((SELECT id FROM modules WHERE slug = 'orcamento-pessoal'),
'rastreando-gastos', 'Rastreando seus Gastos', 'Como registrar e categorizar suas despesas',
'## Rastreando seus Gastos

Voce sabe exatamente quanto gastou na ultima semana? A maioria das pessoas nao sabe. Vamos mudar isso!

### Por que rastrear?

Pesquisas mostram que so de **anotar seus gastos**, voce ja gasta menos. E serio! Quando voce ve o numero, pensa duas vezes antes de gastar.

### Metodos para rastrear

**1. Caderno/Agenda**
O metodo mais simples. Anote todo gasto no momento que fizer. No fim do dia, some tudo.

**2. Planilha**
Use Google Sheets ou Excel. Crie colunas: Data, Descricao, Categoria, Valor. No fim do mes, some por categoria.

**3. Apps de financas**
Apps como Mobills, Organizze e GuiaBolso conectam com seu banco e categorizam gastos automaticamente.

### Categorias sugeridas

- 🏠 Moradia
- 🍔 Alimentacao
- 🚌 Transporte
- 💊 Saude
- 📚 Educacao
- 🎮 Lazer
- 👕 Roupas
- 📱 Assinaturas
- 🎁 Outros

### O teste dos 30 dias

> Anote **todos** os seus gastos por 30 dias. Nao mude nada, so anote. No fim do mes, voce vai se surpreender com o resultado!

A maioria das pessoas descobre gastos "fantasma" - aquele cafezinho diario de R$8 que vira R$240 por mes!',
3, 50, 6),

((SELECT id FROM modules WHERE slug = 'orcamento-pessoal'),
'primeiro-orcamento', 'Criando seu Primeiro Orcamento', 'Passo a passo para montar seu orcamento',
'## Criando seu Primeiro Orcamento

Agora que voce ja entende os conceitos, vamos colocar a mao na massa!

### Passo 1: Liste suas Receitas

Some tudo que voce recebe no mes:
- Salario liquido
- Freelances
- Renda extra
- Mesada

**Total de receitas = R$_____**

### Passo 2: Liste suas Despesas Fixas

Gastos que se repetem todo mes:
- Aluguel: R$___
- Internet: R$___
- Celular: R$___
- Academia: R$___
- Streaming: R$___

### Passo 3: Estime Despesas Variaveis

Use a media dos ultimos 3 meses:
- Alimentacao: R$___
- Transporte: R$___
- Lazer: R$___

### Passo 4: Aplique o 50-30-20

Compare seus numeros com a regra:
1. Some todas as necessidades - esta dentro dos 50%?
2. Some todos os desejos - esta dentro dos 30%?
3. Sobram 20% para poupar?

### Passo 5: Ajuste

Se os numeros nao batem, e hora de fazer cortes:

> **Cortes faceis**: Cancelar assinaturas que nao usa, trocar marca de produtos, cozinhar mais em casa, usar transporte publico.

> **Cortes medios**: Mudar de plano de celular/internet, renegociar aluguel, trocar academia por exercicio ao ar livre.

### Regra de Ouro

Seu orcamento nao precisa ser perfeito no primeiro mes. O importante e **comecar** e ir ajustando. Revise todo mes e melhore aos poucos!',
4, 50, 8);

-- Module 2: Poupanca e Reserva
INSERT INTO lessons (module_id, slug, title, description, content_markdown, order_index, xp_reward, duration_minutes) VALUES

((SELECT id FROM modules WHERE slug = 'poupanca-reserva'),
'por-que-poupar', 'Por que Poupar?', 'A importancia da poupanca e juros compostos',
'## Por que Poupar?

"Guardar dinheiro" parece chato, ne? Mas e a coisa mais poderosa que voce pode fazer pelas suas financas.

### A magica dos Juros Compostos

Albert Einstein chamou os juros compostos de **"a oitava maravilha do mundo"**. E por um bom motivo!

Imagine que voce guarda **R$200 por mes** com rendimento de **1% ao mes**:

| Tempo | Sem juros | Com juros compostos |
|-------|-----------|---------------------|
| 1 ano | R$2.400 | R$2.556 |
| 5 anos | R$12.000 | R$16.333 |
| 10 anos | R$24.000 | R$46.009 |
| 20 anos | R$48.000 | R$197.851 |

> Em 20 anos, seus R$200/mes viram quase **R$200 mil**! E voce so colocou R$48 mil do seu bolso. O resto foram os juros trabalhando por voce!

### Mentalidade de Poupador

A regra e: **pague-se primeiro**. Assim que receber seu salario, separe o valor da poupanca ANTES de gastar com qualquer outra coisa.

Nao espere sobrar - nunca sobra! Trate a poupanca como uma conta fixa, igual ao aluguel.

### Quanto poupar?

- **Minimo**: 10% da renda
- **Ideal**: 20% da renda (regra 50-30-20)
- **Agressivo**: 30%+ (para quem quer independencia financeira mais rapido)

Comece com pouco. Ate R$50 por mes ja e um comeco. O habito e mais importante que o valor!',
1, 50, 6),

((SELECT id FROM modules WHERE slug = 'poupanca-reserva'),
'reserva-emergencia', 'Reserva de Emergencia', 'Como montar sua reserva para imprevistos',
'## Reserva de Emergencia

Antes de investir, antes de qualquer coisa: **monte sua reserva de emergencia**. Ela e sua rede de seguranca financeira.

### O que e?

Um dinheiro guardado especificamente para **emergencias reais**:
- Perda de emprego
- Problema de saude
- Conserto urgente do carro ou casa
- Emergencia familiar

> **Importante**: Black Friday NAO e emergencia. Viagem com amigos NAO e emergencia. A reserva e para imprevistos que podem prejudicar sua vida.

### Quanto guardar?

A recomendacao e ter guardado o equivalente a **3 a 6 meses dos seus gastos mensais**.

Se voce gasta R$2.500 por mes:
- Minimo: R$7.500 (3 meses)
- Ideal: R$15.000 (6 meses)

**CLT?** 3 meses pode ser suficiente (voce tem FGTS e seguro-desemprego)
**Autonomo/PJ?** 6 meses ou mais (sua renda e menos previsivel)

### Onde guardar?

A reserva precisa ter **liquidez** (voce consegue sacar rapido) e **seguranca** (nao pode perder valor):

1. **Tesouro Selic** - Rende mais que poupanca, resgate em D+1
2. **CDB com liquidez diaria** - Bancos digitais oferecem 100% do CDI
3. **Conta remunerada** - Nubank, Inter, PagBank rendem automaticamente

> **Evite**: Poupanca (rende pouco), acoes (muito risco), dinheiro em casa (nao rende e pode ser roubado)

### Como comecar do zero?

1. Calcule seus gastos mensais
2. Defina a meta (3 ou 6x seus gastos)
3. Divida em metas mensais
4. Automatize a transferencia
5. Nao toque nesse dinheiro!',
2, 50, 7),

((SELECT id FROM modules WHERE slug = 'poupanca-reserva'),
'onde-guardar', 'Onde Guardar seu Dinheiro', 'Poupanca vs CDB vs Tesouro Selic',
'## Onde Guardar seu Dinheiro?

Nem todo lugar para guardar dinheiro e igual. Vamos comparar as opcoes mais comuns no Brasil.

### Poupanca

- **Rendimento**: 0,5% ao mes + TR (quando Selic > 8,5%)
- **Liquidez**: Imediata
- **Risco**: Muito baixo (garantido pelo FGC ate R$250mil)
- **Imposto**: Isenta de IR

> **Veredito**: Facil, mas rende pouco. So recomendada se voce nao quer pensar em nada.

### CDB (Certificado de Deposito Bancario)

- **Rendimento**: 100-120% do CDI (bancos digitais pagam mais)
- **Liquidez**: Pode ter liquidez diaria ou prazo fixo
- **Risco**: Baixo (garantido pelo FGC ate R$250mil)
- **Imposto**: IR regressivo (22,5% a 15% dependendo do prazo)

> **Veredito**: Otima opcao! CDB com liquidez diaria e perfeito para reserva de emergencia.

### Tesouro Selic

- **Rendimento**: Acompanha a taxa Selic (referencia do mercado)
- **Liquidez**: D+1 (dinheiro cai no dia seguinte)
- **Risco**: O mais seguro do Brasil (garantia do governo)
- **Imposto**: IR regressivo + taxa B3 (isenta ate R$10mil)

> **Veredito**: A opcao mais segura do Brasil. Ideal para reserva de emergencia.

### Comparativo rapido

| Aspecto | Poupanca | CDB Liq. Diaria | Tesouro Selic |
|---------|----------|-----------------|---------------|
| Seguranca | Alta | Alta | Maxima |
| Rendimento | Baixo | Medio-Alto | Medio |
| Liquidez | Imediata | Imediata | D+1 |
| Valor minimo | R$1 | R$1 | ~R$30 |
| Imposto | Isento | Sim | Sim |

### Minha recomendacao

Para quem esta comecando: **CDB com liquidez diaria** de um banco digital (Nubank, Inter, C6). E simples, rende bem e voce saca quando quiser!',
3, 50, 8);

-- Module 3: Investimentos para Iniciantes
INSERT INTO lessons (module_id, slug, title, description, content_markdown, order_index, xp_reward, duration_minutes) VALUES

((SELECT id FROM modules WHERE slug = 'investimentos-iniciantes'),
'renda-fixa-variavel', 'Renda Fixa vs Renda Variavel', 'Entenda as duas grandes categorias de investimentos',
'## Renda Fixa vs Renda Variavel

No mundo dos investimentos, tudo se divide em duas grandes categorias. Entender a diferenca e fundamental!

### Renda Fixa

Voce **empresta** seu dinheiro para alguem (governo, banco, empresa) e recebe de volta com **juros**.

Caracteristicas:
- Previsibilidade: voce sabe (ou tem ideia) de quanto vai receber
- Menor risco
- Ideal para iniciantes e reserva de emergencia

**Exemplos**: Tesouro Direto, CDB, LCI, LCA, Debentures

### Renda Variavel

Voce **compra** uma parte de algo (empresa, fundo, imovel) e o valor pode subir ou descer.

Caracteristicas:
- Imprevisibilidade: voce nao sabe quanto vai ganhar (ou perder)
- Maior risco, mas maior potencial de retorno
- Ideal para longo prazo

**Exemplos**: Acoes, Fundos Imobiliarios (FIIs), ETFs, Criptomoedas

### Piramide dos Investimentos

Imagine uma piramide:

1. **Base (70-80%)**: Renda Fixa - seguranca e liquidez
2. **Meio (15-25%)**: Renda Variavel conservadora - FIIs e ETFs
3. **Topo (5-10%)**: Renda Variavel arrojada - acoes individuais, cripto

> **Regra pratica**: Quanto mais jovem voce e, mais risco pode correr. Voce tem tempo para se recuperar de quedas no mercado.

### Quanto preciso para comecar?

- Tesouro Direto: a partir de ~R$30
- CDB: a partir de R$1
- Acoes: a partir de ~R$10 (1 acao)
- ETFs: a partir de ~R$10
- FIIs: a partir de ~R$10

> Voce NAO precisa de muito dinheiro para comecar a investir!',
1, 50, 7),

((SELECT id FROM modules WHERE slug = 'investimentos-iniciantes'),
'tesouro-direto', 'Tesouro Direto', 'O investimento mais seguro do Brasil',
'## Tesouro Direto

O Tesouro Direto e um programa do **governo federal** que permite que voce empreste dinheiro para o Brasil e receba de volta com juros. E o investimento mais seguro que existe no pais!

### Tipos de Titulo

**Tesouro Selic (pos-fixado)**
- Rende de acordo com a taxa Selic
- Ideal para: reserva de emergencia, curto prazo
- Liquidez: D+1
- Risco de perda se vender antes: minimo

**Tesouro IPCA+ (hibrido)**
- Rende IPCA (inflacao) + uma taxa fixa
- Ideal para: aposentadoria, metas de longo prazo
- Garante ganho real acima da inflacao
- Risco se vender antes do vencimento: medio

**Tesouro Prefixado**
- Taxa fixa definida no momento da compra
- Ideal para: quando voce acredita que os juros vao cair
- Voce sabe exatamente quanto vai receber no vencimento
- Risco se vender antes: alto

### Como investir?

1. Abra conta em uma corretora (Rico, Clear, NuInvest - todas gratuitas)
2. Acesse a area de Tesouro Direto
3. Escolha o titulo
4. Defina o valor (minimo ~R$30)
5. Confirme a compra!

### Custos

- **Taxa B3**: 0,20% ao ano sobre o valor investido (isento ate R$10mil no Tesouro Selic)
- **IR**: Regressivo - de 22,5% (ate 180 dias) ate 15% (acima de 720 dias)
- **Taxa da corretora**: A maioria nao cobra mais

> **Dica**: Para reserva de emergencia, use **Tesouro Selic**. Para aposentadoria, use **Tesouro IPCA+**.',
2, 50, 8),

((SELECT id FROM modules WHERE slug = 'investimentos-iniciantes'),
'cdb-lci-lca', 'CDB, LCI e LCA', 'Investimentos bancarios acessiveis e seguros',
'## CDB, LCI e LCA

Esses sao investimentos emitidos por **bancos**. Quando voce compra um CDB, esta emprestando dinheiro para o banco!

### CDB - Certificado de Deposito Bancario

Voce empresta para o banco, que usa seu dinheiro para emprestar para outras pessoas (com juros maiores, claro).

**Tipos**:
- **Pos-fixado**: Rende X% do CDI (ex: 110% do CDI)
- **Prefixado**: Taxa fixa (ex: 13% ao ano)
- **IPCA+**: Inflacao + taxa fixa

**Liquidez**: Pode ser diaria ou no vencimento
**Garantia**: FGC ate R$250.000 por CPF por instituicao
**IR**: Sim, tabela regressiva

### LCI - Letra de Credito Imobiliario

Igual ao CDB, mas o banco usa o dinheiro para financiamentos imobiliarios.

**Vantagem**: **Isenta de Imposto de Renda!**
**Desvantagem**: Geralmente tem prazo minimo de 90 dias

### LCA - Letra de Credito do Agronegocio

Mesmo conceito, mas o dinheiro vai para o agronegocio.

**Vantagem**: **Isenta de Imposto de Renda!**
**Desvantagem**: Prazo minimo e valores iniciais maiores

### Comparativo

| | CDB | LCI | LCA |
|---|-----|-----|-----|
| IR | Sim | **Isento** | **Isento** |
| FGC | Sim | Sim | Sim |
| Liquidez | Diaria ou prazo | Prazo (min 90d) | Prazo (min 90d) |
| Valor min | R$1+ | R$1.000+ | R$1.000+ |

> **Dica**: Um CDB que rende 110% do CDI com IR pode render menos que uma LCI de 90% do CDI sem IR. Sempre faca a conta!

### Onde encontrar?

Bancos digitais oferecem as melhores taxas: Nubank, Inter, C6 Bank, PagBank. Compare sempre!',
3, 50, 7),

((SELECT id FROM modules WHERE slug = 'investimentos-iniciantes'),
'primeiros-passos-acoes', 'Primeiros Passos em Acoes', 'Introducao ao mercado de acoes e ETFs',
'## Primeiros Passos em Acoes

Comprar acoes significa virar **socio** de uma empresa. Se a empresa vai bem, suas acoes valorizam. Se vai mal, desvalorizam.

### O que sao Acoes?

Uma acao e a menor parte do capital de uma empresa. Quando voce compra acoes da Petrobras (PETR4), voce e literalmente dono de um pedacinho da Petrobras!

### Como funciona a Bolsa (B3)?

A B3 e o "mercado" onde acoes sao compradas e vendidas. Funciona de segunda a sexta, das 10h as 17h.

- **Compra**: Voce acha que a empresa vai valorizar
- **Venda**: Voce quer realizar o lucro ou parar a perda
- **Dividendos**: Algumas empresas distribuem parte do lucro aos acionistas

### ETFs - A melhor opcao para iniciantes

ETF (Exchange Traded Fund) e um **fundo que replica um indice**. Em vez de escolher acoes individuais, voce compra "um pacote".

**BOVA11**: Replica o Ibovespa (as maiores empresas do Brasil)
**IVVB11**: Replica o S&P 500 (as 500 maiores empresas dos EUA)
**HASH11**: Replica um indice de criptomoedas

> **Vantagem do ETF**: Diversificacao automatica! Com uma unica compra, voce investe em dezenas ou centenas de empresas.

### Riscos

- Acoes podem **cair** e voce pode perder dinheiro
- O mercado e **volatil** no curto prazo
- Nunca invista dinheiro que voce vai precisar em menos de 5 anos
- Nunca invista sua reserva de emergencia em acoes!

### Regras de ouro para iniciantes

1. Comece com **ETFs**, nao acoes individuais
2. Invista **regularmente** (todo mes um pouco)
3. Pense no **longo prazo** (5-10+ anos)
4. Nao entre em panico quando cair
5. Nunca invista em algo que voce nao entende',
4, 50, 8);

-- Module 4: Credito e Dividas
INSERT INTO lessons (module_id, slug, title, description, content_markdown, order_index, xp_reward, duration_minutes) VALUES

((SELECT id FROM modules WHERE slug = 'credito-dividas'),
'entendendo-credito', 'Entendendo o Credito', 'Score, tipos de credito e como funciona no Brasil',
'## Entendendo o Credito

Credito nao e dinheiro gratis - e dinheiro emprestado que voce vai ter que devolver, geralmente com juros!

### O que e Score de Credito?

Seu **Score** e uma nota de 0 a 1000 que indica a probabilidade de voce pagar suas contas em dia.

- **0-300**: Muito baixo (dificil conseguir credito)
- **300-500**: Baixo
- **500-700**: Bom
- **700-1000**: Excelente (melhores taxas e condicoes)

**O que aumenta seu Score**:
- Pagar contas em dia
- Ter historico de credito (usar e pagar)
- Ter nome limpo
- Cadastro Positivo ativo

**O que diminui**:
- Atrasar pagamentos
- Ter nome negativado (SPC/Serasa)
- Muitas consultas de credito em pouco tempo

### Tipos de Credito no Brasil

**Cartao de credito**: Compre agora, pague depois (com ou sem juros)
**Cheque especial**: Limite na conta corrente (JUROS ALTISSIMOS!)
**Emprestimo pessoal**: Valor fixo com parcelas
**Financiamento**: Para bens especificos (carro, casa)
**Consignado**: Descontado do salario (taxas menores)

### Taxas de juros (do mais barato ao mais caro)

1. Consignado: ~1,5-2% ao mes
2. Financiamento imobiliario: ~0,7-1% ao mes
3. Emprestimo pessoal: ~3-8% ao mes
4. Cartao de credito (rotativo): ~12-15% ao mes!
5. Cheque especial: ~8-15% ao mes!

> **Alerta**: Cartao de credito no rotativo e cheque especial sao as PIORES formas de credito. Evite a todo custo!',
1, 50, 7),

((SELECT id FROM modules WHERE slug = 'credito-dividas'),
'cartao-credito', 'Cartao de Credito sem Medo', 'Como usar o cartao com inteligencia',
'## Cartao de Credito sem Medo

O cartao de credito nao e vilao. Usado com inteligencia, e uma ferramenta poderosa!

### Como funciona?

1. Voce compra durante o mes
2. A fatura fecha em uma data especifica
3. Voce paga a fatura na data de vencimento
4. Se pagar total: **zero juros**
5. Se pagar parcial: entra no **rotativo** (juros altissimos!)

### Regras de ouro

**1. SEMPRE pague a fatura total**
O rotativo do cartao cobra ~15% ao mes. Uma divida de R$1.000 vira R$5.000 em menos de 1 ano!

**2. Nao use mais de 30% do limite**
Se seu limite e R$3.000, tente nao gastar mais de R$1.000. Isso ajuda seu Score e evita descontrole.

**3. Tenha no maximo 2 cartoes**
Mais cartoes = mais tentacao e mais dificil de controlar.

**4. Use a fatura como ferramenta**
A fatura do cartao e um extrato perfeito dos seus gastos. Use para rastrear despesas!

### Anuidade - vale a pena?

- Cartoes digitais (Nubank, Inter, C6): **sem anuidade**
- Cartoes tradicionais: podem cobrar R$200-800/ano
- So pague anuidade se os beneficios (milhas, cashback) compensarem

### Milhas e Cashback

**Milhas**: Voce acumula pontos que viram passagens aereas. Vale para quem viaja muito.
**Cashback**: Voce recebe de volta uma % do que gastou. Mais pratico para o dia a dia.

> **Dica**: Use cartao de credito como **metodo de pagamento**, nao como **emprestimo**. Se voce nao tem o dinheiro para pagar a fatura, nao compre!',
2, 50, 6),

((SELECT id FROM modules WHERE slug = 'credito-dividas'),
'sair-das-dividas', 'Como Sair das Dividas', 'Estrategias para se livrar das dividas',
'## Como Sair das Dividas

Se voce esta endividado, respire fundo. Tem solucao! Milhoes de brasileiros ja passaram por isso e conseguiram sair.

### Passo 1: Encare a realidade

Liste TODAS as suas dividas:
- Credor (banco, loja, pessoa)
- Valor total
- Taxa de juros
- Parcela mensal
- Status (em dia ou atrasada)

### Passo 2: Escolha uma estrategia

**Metodo Avalanche (matematicamente melhor)**
Pague primeiro a divida com a **maior taxa de juros**. Voce economiza mais dinheiro no total.

**Metodo Bola de Neve (psicologicamente melhor)**
Pague primeiro a **menor divida**. A sensacao de quitar uma divida te motiva a continuar!

> **Qual escolher?** Se voce e disciplinado, Avalanche. Se precisa de motivacao, Bola de Neve.

### Passo 3: Negocie!

**Serasa Limpa Nome**: Feirao de renegociacao com descontos de ate 90%!
**Procon**: Pode intermediar negociacoes
**Direto com o credor**: Ligue e pecaPRA desconto. Bancos preferem receber com desconto do que nao receber nada.

Dicas de negociacao:
- Sempre peca desconto no valor total
- Prefira pagar a vista (desconto maior)
- Se parcelar, confirme que nao tem juros nas parcelas
- Pegue tudo por escrito/email

### Passo 4: Troque divida cara por barata

Se voce tem divida no cartao (15% ao mes), faca um **emprestimo pessoal** (3-5% ao mes) para quitar o cartao. Voce troca uma divida cara por uma mais barata!

### Passo 5: Nao faca dividas novas

> Enquanto estiver pagando dividas, **congele** os cartoes. Use so dinheiro/debito. Corte gastos ao maximo. E temporario!

### Quanto tempo leva?

Depende do tamanho da divida. Mas com disciplina, a maioria das pessoas consegue sair em **12-24 meses**. O importante e comecar!',
3, 50, 8);

-- ============================================
-- Seed Data - Quizzes
-- ============================================

-- Module 1, Lesson 1: O que e Orcamento?
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'o-que-e-orcamento'), 'O que e um orcamento pessoal?', '["Um emprestimo bancario", "Um plano de receitas e despesas", "Um tipo de investimento", "Uma conta de poupanca"]', 1, 'Um orcamento pessoal e um plano que mostra quanto dinheiro voce ganha (receitas) e como voce gasta (despesas).', 1, 10),
((SELECT id FROM lessons WHERE slug = 'o-que-e-orcamento'), 'Qual e a regra de ouro do orcamento?', '["Gastar tudo que ganha", "Receitas maiores que despesas", "Investir 100% do salario", "Nunca gastar com lazer"]', 1, 'A regra de ouro e simples: suas receitas precisam ser maiores que suas despesas para nao se endividar.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'o-que-e-orcamento'), 'Qual destes e um exemplo de despesa fixa?', '["Jantar no restaurante", "Aluguel", "Presente de aniversario", "Cinema"]', 1, 'Aluguel e uma despesa fixa porque o valor se repete todo mes. Restaurante e cinema sao despesas variaveis.', 3, 10),
((SELECT id FROM lessons WHERE slug = 'o-que-e-orcamento'), 'Despesas eventuais sao gastos que:', '["Acontecem todo mes", "Voce pode evitar sempre", "Aparecem de vez em quando", "Sao sempre muito altos"]', 2, 'Despesas eventuais aparecem de vez em quando, como consultas medicas, consertos ou presentes.', 4, 10);

-- Module 1, Lesson 2: Metodo 50-30-20
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'metodo-50-30-20'), 'No metodo 50-30-20, qual porcentagem vai para necessidades?', '["20%", "30%", "50%", "60%"]', 2, 'No metodo 50-30-20, 50% da renda vai para necessidades essenciais como moradia, alimentacao e transporte.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'metodo-50-30-20'), 'Qual destes e um "desejo" e nao "necessidade"?', '["Aluguel", "Conta de luz", "Assinatura de streaming", "Plano de saude"]', 2, 'Assinaturas de streaming sao desejos. Necessidades sao gastos essenciais que voce nao pode evitar.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'metodo-50-30-20'), 'Quanto da renda deve ir para poupanca/investimentos?', '["10%", "20%", "30%", "50%"]', 1, '20% da renda deve ser direcionada para poupanca, investimentos e pagamento de dividas.', 3, 10),
((SELECT id FROM lessons WHERE slug = 'metodo-50-30-20'), 'Joao ganha R$3.000/mes. Quanto gastar com desejos pelo 50-30-20?', '["R$600", "R$900", "R$1.200", "R$1.500"]', 1, '30% de R$3.000 = R$900 para desejos como lazer, roupas nao essenciais e entretenimento.', 4, 10);

-- Module 1, Lesson 3: Rastreando Gastos
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'rastreando-gastos'), 'Qual e o beneficio principal de anotar seus gastos?', '["Ficar rico rapido", "Gastar menos naturalmente", "Impressionar os amigos", "Ganhar mais dinheiro"]', 1, 'Pesquisas mostram que so de anotar seus gastos, voce ja gasta menos. A consciencia dos numeros muda o comportamento.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'rastreando-gastos'), 'O que sao gastos "fantasma"?', '["Gastos com Halloween", "Pequenos gastos que passam despercebidos", "Gastos que nao existem", "Fraudes no cartao"]', 1, 'Gastos fantasma sao aqueles pequenos gastos do dia a dia que passam despercebidos, como o cafezinho diario.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'rastreando-gastos'), 'Quanto tempo dura o "teste dos 30 dias"?', '["1 semana", "2 semanas", "30 dias", "1 ano"]', 2, 'O teste dos 30 dias consiste em anotar todos os seus gastos por um mes inteiro para ter uma visao real.', 3, 10);

-- Module 1, Lesson 4: Primeiro Orcamento
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'primeiro-orcamento'), 'Qual e o primeiro passo para criar um orcamento?', '["Cortar todos os gastos", "Listar suas receitas", "Investir na bolsa", "Pedir emprestimo"]', 1, 'O primeiro passo e saber quanto dinheiro voce tem. Liste todas as suas fontes de receita.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'primeiro-orcamento'), 'Se suas necessidades passam de 50%, o que fazer?', '["Ignorar", "Ganhar mais", "Rever gastos fixos", "Pegar emprestimo"]', 2, 'Se as necessidades passam de 50%, e hora de rever gastos fixos: mudar de plano, renegociar aluguel, etc.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'primeiro-orcamento'), 'Seu orcamento precisa ser perfeito no primeiro mes?', '["Sim, obrigatoriamente", "Nao, o importante e comecar e ajustar", "Sim, senao nao funciona", "Nao precisa fazer orcamento"]', 1, 'O orcamento nao precisa ser perfeito. O importante e comecar e ir ajustando mes a mes.', 3, 10);

-- Module 2, Lesson 1: Por que Poupar
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'por-que-poupar'), 'Quem chamou os juros compostos de "8a maravilha do mundo"?', '["Warren Buffett", "Albert Einstein", "Bill Gates", "Elon Musk"]', 1, 'Albert Einstein e frequentemente creditado com essa frase sobre o poder dos juros compostos.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'por-que-poupar'), 'O que significa "pague-se primeiro"?', '["Compre o que quiser antes", "Separe a poupanca antes de gastar", "Pague suas dividas primeiro", "Invista na bolsa primeiro"]', 1, 'Pagar-se primeiro significa separar o valor da poupanca ANTES de gastar com qualquer outra coisa.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'por-que-poupar'), 'Qual a porcentagem ideal de poupanca pela regra 50-30-20?', '["10%", "15%", "20%", "30%"]', 2, 'Pela regra 50-30-20, o ideal e poupar/investir 20% da sua renda mensal.', 3, 10);

-- Module 2, Lesson 2: Reserva de Emergencia
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'reserva-emergencia'), 'Quanto deve ter na reserva de emergencia?', '["1 mes de gastos", "3 a 6 meses de gastos", "1 ano de gastos", "R$1.000"]', 1, 'A recomendacao e ter guardado o equivalente a 3 a 6 meses dos seus gastos mensais.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'reserva-emergencia'), 'Qual destes NAO e uma emergencia real?', '["Perda de emprego", "Black Friday", "Problema de saude", "Conserto do carro"]', 1, 'Black Friday nao e emergencia. A reserva e para imprevistos que podem prejudicar sua vida.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'reserva-emergencia'), 'Onde e melhor guardar a reserva de emergencia?', '["Debaixo do colchao", "Em acoes", "No Tesouro Selic ou CDB liquidez diaria", "Em criptomoedas"]', 2, 'A reserva precisa ter liquidez e seguranca. Tesouro Selic e CDB com liquidez diaria sao as melhores opcoes.', 3, 10),
((SELECT id FROM lessons WHERE slug = 'reserva-emergencia'), 'Autonomos devem ter reserva de quantos meses?', '["1 mes", "3 meses", "6 meses ou mais", "Nao precisam de reserva"]', 2, 'Autonomos devem ter 6 meses ou mais de reserva, pois sua renda e menos previsivel.', 4, 10);

-- Module 2, Lesson 3: Onde Guardar
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'onde-guardar'), 'Qual investimento e garantido pelo FGC ate R$250mil?', '["Tesouro Direto", "CDB e Poupanca", "Acoes", "Criptomoedas"]', 1, 'CDB, LCI, LCA e Poupanca sao garantidos pelo FGC. Tesouro Direto tem garantia do governo federal.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'onde-guardar'), 'Qual a vantagem da LCI/LCA sobre o CDB?', '["Rendem mais", "Sao isentas de Imposto de Renda", "Tem liquidez imediata", "Nao tem risco"]', 1, 'A grande vantagem de LCI e LCA e a isencao de Imposto de Renda para pessoa fisica.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'onde-guardar'), 'Para reserva de emergencia, o melhor e:', '["Poupanca", "CDB com liquidez diaria", "Acoes", "Bitcoin"]', 1, 'CDB com liquidez diaria de banco digital rende bem e permite resgate imediato. Ideal para reserva.', 3, 10);

-- Module 3, Lesson 1: Renda Fixa vs Variavel
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'renda-fixa-variavel'), 'Na renda fixa, voce:', '["Compra parte de uma empresa", "Empresta dinheiro e recebe juros", "Aposta em criptomoedas", "Compra imoveis"]', 1, 'Na renda fixa, voce empresta seu dinheiro para alguem (governo, banco, empresa) e recebe de volta com juros.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'renda-fixa-variavel'), 'Qual e um exemplo de renda variavel?', '["CDB", "Tesouro Direto", "Acoes", "LCI"]', 2, 'Acoes sao renda variavel porque seu valor pode subir ou descer. CDB, Tesouro e LCI sao renda fixa.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'renda-fixa-variavel'), 'Quanto e o minimo para investir no Tesouro Direto?', '["R$1", "Cerca de R$30", "R$500", "R$1.000"]', 1, 'O Tesouro Direto permite investimentos a partir de aproximadamente R$30.', 3, 10),
((SELECT id FROM lessons WHERE slug = 'renda-fixa-variavel'), 'Para iniciantes, a base da piramide deve ser:', '["Criptomoedas", "Acoes individuais", "Renda fixa", "Day trade"]', 2, 'A base da piramide de investimentos deve ser renda fixa (70-80%), que oferece seguranca e liquidez.', 4, 10);

-- Module 3, Lesson 2: Tesouro Direto
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'tesouro-direto'), 'O Tesouro Direto e garantido por quem?', '["Bancos privados", "FGC", "Governo Federal", "B3"]', 2, 'O Tesouro Direto e garantido pelo Governo Federal, sendo o investimento mais seguro do Brasil.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'tesouro-direto'), 'Qual titulo e ideal para reserva de emergencia?', '["Tesouro IPCA+", "Tesouro Prefixado", "Tesouro Selic", "Tesouro RendA+"]', 2, 'O Tesouro Selic tem liquidez D+1 e risco minimo de perda, ideal para reserva de emergencia.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'tesouro-direto'), 'O Tesouro IPCA+ garante ganho acima de:', '["Selic", "CDI", "Inflacao", "Dolar"]', 2, 'O Tesouro IPCA+ rende IPCA (inflacao) + uma taxa fixa, garantindo ganho real acima da inflacao.', 3, 10);

-- Module 3, Lesson 3: CDB, LCI e LCA
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'cdb-lci-lca'), 'Quando voce compra um CDB, voce esta:', '["Comprando acoes do banco", "Emprestando dinheiro para o banco", "Abrindo uma poupanca", "Fazendo um seguro"]', 1, 'Quando voce compra um CDB, esta emprestando dinheiro para o banco, que te paga juros por isso.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'cdb-lci-lca'), 'Qual a principal vantagem de LCI e LCA?', '["Rendem mais que CDB", "Sao isentas de IR", "Tem liquidez imediata", "Nao tem valor minimo"]', 1, 'LCI e LCA sao isentas de Imposto de Renda para pessoa fisica, o que pode tornar o rendimento liquido maior.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'cdb-lci-lca'), 'Ate quanto o FGC garante por CPF por instituicao?', '["R$100.000", "R$250.000", "R$500.000", "R$1.000.000"]', 1, 'O Fundo Garantidor de Creditos (FGC) garante ate R$250.000 por CPF por instituicao financeira.', 3, 10);

-- Module 3, Lesson 4: Primeiros Passos em Acoes
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'primeiros-passos-acoes'), 'O que e um ETF?', '["Uma acao especial", "Um fundo que replica um indice", "Um tipo de CDB", "Uma criptomoeda"]', 1, 'ETF (Exchange Traded Fund) e um fundo que replica um indice, permitindo diversificacao com uma unica compra.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'primeiros-passos-acoes'), 'Por que ETFs sao recomendados para iniciantes?', '["Rendem mais", "Diversificacao automatica", "Nao tem risco", "Sao isentos de IR"]', 1, 'ETFs oferecem diversificacao automatica - com uma unica compra voce investe em dezenas de empresas.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'primeiros-passos-acoes'), 'Nunca invista em acoes dinheiro que vai precisar em menos de:', '["1 mes", "1 ano", "5 anos", "10 anos"]', 2, 'Acoes sao volateis no curto prazo. Nunca invista dinheiro que vai precisar em menos de 5 anos.', 3, 10);

-- Module 4, Lesson 1: Entendendo o Credito
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'entendendo-credito'), 'Qual a faixa de Score considerada "Excelente"?', '["0-300", "300-500", "500-700", "700-1000"]', 3, 'Score entre 700 e 1000 e considerado excelente, dando acesso as melhores taxas e condicoes de credito.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'entendendo-credito'), 'Qual tipo de credito tem os juros MAIS altos?', '["Consignado", "Financiamento imobiliario", "Cartao de credito rotativo", "Emprestimo pessoal"]', 2, 'O cartao de credito rotativo cobra entre 12-15% ao mes, sendo uma das formas mais caras de credito.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'entendendo-credito'), 'O que aumenta seu Score de credito?', '["Nunca usar credito", "Pagar contas em dia", "Ter muitos cartoes", "Fazer muitas consultas"]', 1, 'Pagar contas em dia e o principal fator que aumenta seu Score de credito.', 3, 10),
((SELECT id FROM lessons WHERE slug = 'entendendo-credito'), 'Qual credito tem a menor taxa de juros?', '["Cheque especial", "Cartao de credito", "Emprestimo pessoal", "Consignado"]', 3, 'O consignado tem as menores taxas (1,5-2% ao mes) porque e descontado direto do salario, reduzindo o risco do banco.', 4, 10);

-- Module 4, Lesson 2: Cartao de Credito
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'cartao-credito'), 'O que acontece se voce pagar a fatura total do cartao?', '["Paga juros", "Zero juros", "Perde o limite", "Paga multa"]', 1, 'Se voce paga a fatura total na data de vencimento, nao paga nenhum juro. Simples assim!', 1, 10),
((SELECT id FROM lessons WHERE slug = 'cartao-credito'), 'Qual % do limite e recomendado usar no maximo?', '["10%", "30%", "50%", "80%"]', 1, 'Usar no maximo 30% do limite ajuda seu Score e evita descontrole financeiro.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'cartao-credito'), 'Cartao de credito deve ser usado como:', '["Emprestimo", "Metodo de pagamento", "Reserva de emergencia", "Investimento"]', 1, 'Use cartao de credito como metodo de pagamento, nao como emprestimo. So compre o que pode pagar.', 3, 10);

-- Module 4, Lesson 3: Sair das Dividas
INSERT INTO quizzes (lesson_id, question, options, correct_index, explanation, order_index, xp_reward) VALUES
((SELECT id FROM lessons WHERE slug = 'sair-das-dividas'), 'No metodo Avalanche, voce paga primeiro a divida com:', '["Menor valor", "Maior taxa de juros", "Maior valor", "Menor parcela"]', 1, 'No metodo Avalanche, voce paga primeiro a divida com a maior taxa de juros, economizando mais dinheiro.', 1, 10),
((SELECT id FROM lessons WHERE slug = 'sair-das-dividas'), 'O metodo Bola de Neve foca em pagar primeiro:', '["A maior divida", "A menor divida", "A divida mais antiga", "A divida com mais juros"]', 1, 'O metodo Bola de Neve foca na menor divida primeiro. A satisfacao de quitar uma divida motiva a continuar.', 2, 10),
((SELECT id FROM lessons WHERE slug = 'sair-das-dividas'), 'Trocar divida do cartao por emprestimo pessoal e:', '["Ruim, pois e mais divida", "Bom, pois troca divida cara por barata", "Indiferente", "Proibido"]', 1, 'Trocar divida do cartao (15%/mes) por emprestimo pessoal (3-5%/mes) reduz os juros que voce paga.', 3, 10),
((SELECT id FROM lessons WHERE slug = 'sair-das-dividas'), 'O Serasa Limpa Nome pode oferecer descontos de ate:', '["10%", "50%", "70%", "90%"]', 3, 'O Serasa Limpa Nome pode oferecer descontos de ate 90% em feiraoes de renegociacao de dividas.', 4, 10);

-- ============================================
-- Seed Data - Achievements
-- ============================================

INSERT INTO achievements (slug, title, description, icon, category, condition_type, condition_value, xp_bonus, is_secret) VALUES
('primeiro-passo', 'Primeiro Passo', 'Complete sua primeira aula', '🎯', 'learning', 'lessons_completed', 1, 25, false),
('curioso', 'Curioso', 'Complete 5 aulas', '🔍', 'learning', 'lessons_completed', 5, 50, false),
('dedicado', 'Dedicado', 'Complete 10 aulas', '📖', 'learning', 'lessons_completed', 10, 100, false),
('mestre-financeiro', 'Mestre Financeiro', 'Complete todas as trilhas', '🎓', 'learning', 'modules_completed', 4, 250, false),
('quiz-perfeito', 'Quiz Perfeito', 'Tire 100% em um quiz', '⭐', 'quiz', 'quiz_perfect', 1, 50, false),
('genio-quiz', 'Genio dos Quizzes', 'Tire 100% em 5 quizzes diferentes', '🧠', 'quiz', 'quiz_perfect', 5, 150, false),
('xp-hunter', 'Cacador de XP', 'Acumule 1.000 XP', '⚡', 'general', 'xp_total', 1000, 100, false),
('xp-legend', 'Lenda do XP', 'Acumule 5.000 XP', '🏆', 'general', 'xp_total', 5000, 250, true),
('streak-3', 'Em Chamas', 'Mantenha uma sequencia de 3 dias', '🔥', 'streak', 'streak', 3, 50, false),
('streak-7', 'Imparavel', 'Mantenha uma sequencia de 7 dias', '💎', 'streak', 'streak', 7, 150, false);
