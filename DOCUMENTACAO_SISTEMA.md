# 📄 Documentação do Sistema - ADLN Home Broker

**Versão:** 1.0  
**Data:** Agosto/2025  
**Responsável:** Alan, Daniel, Larissa e Nilson  
**Sistema:** ADLN Home Broker Simulado (HTML, CSS, JavaScript)

---

## 🧭 Visão Geral

O ADLN Home Broker é uma plataforma de investimentos simulada desenvolvida para fins educacionais e de teste. O sistema permite que usuários realizem operações simuladas de compra e venda de ativos com base em cotações dinâmicas e regras simplificadas da bolsa de valores.

### 🎯 Objetivos do Sistema

- Simular um ambiente real de trading
- Permitir testes de funcionalidades de home broker
- Fornecer interface intuitiva para operações financeiras
- Implementar validações de segurança e regras de negócio

### 🏗️ Arquitetura

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Persistência:** LocalStorage do navegador
- **Gráficos:** Chart.js
- **Exportação:** XLSX.js
- **Responsividade:** CSS Grid e Flexbox

---

## 📋 Regras de Negócio

### 📌 RN-000 – Cadastro de Usuário

**Objetivo:** Permitir que novos usuários criem uma conta no sistema, com validações de dados e critérios mínimos de segurança.

**Comportamento do Sistema:**
- Exibe tela de cadastro com campos obrigatórios
- Validações em tempo real para todos os campos
- Saldo inicial de R$ 100.000,00 para novos usuários

**Campos Obrigatórios:**
- **Nome:** Mínimo 2 letras, apenas caracteres alfabéticos
- **Sobrenome:** Opcional, apenas caracteres alfabéticos
- **CPF:** Exatamente 11 dígitos, validação algorítmica
- **E-mail:** Formato válido com "@"
- **Celular:** Apenas números, formato brasileiro
- **Senha:** Mínimo 8 caracteres, 1 maiúscula, 1 número
- **Confirmação de Senha:** Deve ser idêntica à senha

**Validações:**
- CPF único no sistema
- E-mail único no sistema
- Botão "Criar Conta" habilitado apenas com todos os campos válidos

**Mensagens de Erro:**
- CPF inválido: "CPF inválido. Digite um CPF válido."
- E-mail inválido: "E-mail inválido. Digite um e-mail válido."
- Senha fraca: "Senha deve ter mínimo 8 caracteres, 1 maiúscula e 1 número."
- CPF/E-mail duplicado: "Já existe uma conta cadastrada com este CPF ou e-mail."

---

### 📌 RN-001 – Login

**Objetivo:** Permitir que usuários autenticados acessem o sistema com CPF e senha.

**Comportamento do Sistema:**
- Validação de credenciais contra dados cadastrados
- Redirecionamento automático para dashboard após login
- Sessão persistente até logout

**Fluxo de Autenticação:**
1. Usuário insere CPF e senha
2. Sistema valida credenciais
3. Se válido → carrega dashboard com dados do usuário
4. Se inválido → exibe mensagem de erro

**Dados Carregados no Login:**
- Carteira de investimentos
- Saldo disponível
- Cotações atuais
- Book de ordens
- Extrato de operações

**Mensagens de Erro:**
- Credenciais inválidas: "CPF ou senha incorretos. Tente novamente."

---

### 📌 RN-002 – Cotação de Ativos

**Objetivo:** Exibir os preços simulados dos ativos, atualizados automaticamente.

**Comportamento do Sistema:**
- Atualização automática a cada 10 segundos
- Variação de preço: R$ 0,01 por ciclo
- Valores usados para comparação com ordens

**Ativos Disponíveis:**
- PETR4 (Petrobras PN)
- VALE3 (Vale ON)
- ITUB4 (Itaú PN)
- BBDC4 (Bradesco PN)
- ABEV3 (Ambev ON)
- MGLU3 (Magazine Luiza ON)
- BBAS3 (Banco do Brasil ON)
- LREN3 (Lojas Renner ON)

**Validação de Preços:**
- Limite de variação: 5% da cotação atual
- Preços mínimos e máximos calculados automaticamente

**Mensagens de Erro:**
- Falha de atualização: "Não foi possível atualizar as cotações no momento."

---

### 📌 RN-003 – Boleta de Compra e Venda

**Objetivo:** Permitir envio de ordens de compra ou venda de ativos.

**Comportamento do Sistema:**
- Interface intuitiva para envio de ordens
- Validação rigorosa de preços (5% de variação máxima)
- Quantidade mínima: 1 lote (100 unidades)

**Campos da Boleta:**
- **Tipo:** Compra ou Venda
- **Ativo:** Seleção do ativo desejado
- **Quantidade:** Múltiplos de 100
- **Valor por Lote:** Preço unitário

**Validação de Ordens:**
- Preço igual à cotação → **Executada**
- Diferença ≤ 1% → **Executada**
- Diferença ≤ 5% → **Aceita** (pendente)
- Diferença > 5% → **Rejeitada**

**Mensagens de Erro:**
- Dados inválidos: "Verifique os campos e tente novamente."
- Preço fora do limite: "Ordem rejeitada: Diferença de preço muito alta."

---

### 📌 RN-004 – Compra

**Objetivo:** Executar compras somente com saldo suficiente e preço válido.

**Comportamento do Sistema:**
- Verificação de saldo disponível
- Validação de preço contra cotação atual
- Atualização automática de carteira e saldo

**Validações:**
- Saldo ≥ (valor por lote × quantidade)
- Preço dentro do limite de 5% da cotação
- Quantidade em múltiplos de 100

**Fluxo de Compra:**
1. Validação de saldo
2. Validação de preço
3. Execução da ordem
4. Atualização de carteira
5. Registro no extrato

**Mensagens de Erro:**
- Saldo insuficiente: "Saldo insuficiente para realizar a compra."
- Preço inválido: "Ordem rejeitada: Preço muito baixo/alto."

---

### 📌 RN-005 – Venda

**Objetivo:** Permitir venda apenas com ativos suficientes e preço dentro das regras.

**Comportamento do Sistema:**
- Verificação de quantidade disponível na carteira
- Validação de preço contra cotação atual
- Atualização automática de carteira e saldo

**Validações:**
- Quantidade em carteira ≥ quantidade da ordem
- Preço dentro do limite de 5% da cotação
- Quantidade em múltiplos de 100

**Fluxo de Venda:**
1. Validação de quantidade em carteira
2. Validação de preço
3. Execução da ordem
4. Atualização de carteira
5. Registro no extrato

**Mensagens de Erro:**
- Quantidade insuficiente: "Você não possui ativos suficientes para realizar a venda."
- Preço inválido: "Ordem rejeitada: Preço muito baixo/alto."

---

### 📌 RN-006 – Livro de Ofertas (Book de Cotações)

**Objetivo:** Exibir cotações atuais dos ativos para referência.

**Comportamento do Sistema:**
- Atualização automática a cada 10 segundos
- Exibição de preço atual, variação e percentual
- Utilizado para validação das ordens

**Informações Exibidas:**
- Símbolo do ativo
- Preço atual
- Variação (R$)
- Variação percentual (%)
- Indicador visual (verde/vermelho)

**Mensagens de Erro:**
- Falha na atualização: "Não foi possível atualizar o Book de Ofertas no momento."

---

### 📌 RN-007 – Atualização de Carteira

**Objetivo:** Atualizar a carteira e saldo após ordens executadas.

**Comportamento do Sistema:**
- Atualização automática após execução de ordens
- Cálculo do valor total da carteira
- Exibição em tempo real

**Operações:**
- **Compra:** Adiciona ativos, reduz saldo
- **Venda:** Remove ativos, aumenta saldo

**Informações da Carteira:**
- Quantidade de cada ativo
- Valor atual por ativo
- Valor total da carteira
- Percentual de cada ativo

---

### 📌 RN-008 – Book de Ordens

**Objetivo:** Registrar todas as ordens com status e rastreamento completo.

**Comportamento do Sistema:**
- Registro automático de todas as ordens
- Status em tempo real
- Possibilidade de cancelamento

**Informações Exibidas:**
- Tipo de operação (Compra/Venda)
- Ativo
- Quantidade
- Valor por lote
- Cotação na hora do envio
- Data e hora
- Status (Aceita, Executada, Rejeitada)
- Ação (Cancelar)

**Status das Ordens:**
- **Aceita:** Ordem válida, aguardando execução
- **Executada:** Ordem processada com sucesso
- **Rejeitada:** Ordem inválida, não processada

**Mensagens de Erro:**
- Falha ao registrar: "Não foi possível registrar a ordem. Tente novamente."

---

### 📌 RN-009 – Cancelamento de Ordem

**Objetivo:** Permitir cancelamento de ordens pendentes.

**Comportamento do Sistema:**
- Apenas ordens com status "Aceita" podem ser canceladas
- Ordem cancelada é removida do Book
- Não altera saldo ou carteira

**Validações:**
- Status da ordem deve ser "Aceita"
- Apenas o usuário que criou a ordem pode cancelá-la

**Fluxo de Cancelamento:**
1. Usuário clica em "Cancelar"
2. Confirmação de cancelamento
3. Remoção da ordem do Book
4. Atualização da interface

---

### 📌 RN-010 – Extrato de Operações

**Objetivo:** Exibir apenas ordens executadas, com detalhes completos.

**Comportamento do Sistema:**
- Registro automático de ordens executadas
- Histórico completo de transações
- Ordenação por data/hora

**Informações Exibidas:**
- Tipo de operação
- Ativo
- Quantidade
- Valor total
- Data e horário

**Filtros Disponíveis:**
- Por período
- Por ativo
- Por tipo de operação

**Mensagens de Erro:**
- Falha ao carregar: "Não foi possível carregar o extrato no momento."

---

### 📌 RN-011 – Timer de Abertura e Fechamento da Bolsa

**Objetivo:** Controlar horário de operação do mercado.

**Comportamento do Sistema:**
- Controle automático de horário de funcionamento
- Rejeição de ordens fora do horário
- Indicador visual do status do mercado

**Horário de Funcionamento:**
- **Aberto:** Segunda a sexta, das 10h00 às 18h00
- **Fechado:** Fins de semana, feriados e fora do horário

**Validações:**
- Ordens rejeitadas fora do horário
- Mensagem clara sobre status do mercado

**Mensagens:**
- Mercado fechado: "Mercado fechado. Tente novamente no próximo pregão."
- Status atual: "Mercado Aberto" / "Mercado Fechado"

---

### 📌 RN-012 – Gráfico com Cotações em Tempo Real

**Objetivo:** Permitir visualização da variação de preços com gráficos interativos.

**Comportamento do Sistema:**
- Atualizações automáticas com novas cotações
- Múltiplos tipos de gráfico
- Diferentes intervalos de tempo

**Tipos de Gráfico:**
- **Linha:** Variação de preço ao longo do tempo
- **Candlestick:** Abertura, fechamento, máximo e mínimo

**Intervalos Disponíveis:**
- 1D (1 dia)
- 5M (5 minutos)
- 30M (30 minutos)
- 1H (1 hora)

**Informações Exibidas:**
- Preço atual
- Preço máximo
- Preço mínimo
- Volume (simulado)

**Mensagens de Erro:**
- Falha na atualização: "Não foi possível atualizar o gráfico no momento. Tente novamente em alguns segundos."

---

### 📌 RN-013 – Exportar Transações do Dia

**Objetivo:** Permitir exportação das transações do dia em XLSX ou JSON.

**Comportamento do Sistema:**
- Botão "Exportar Transações" no dashboard
- Escolha de formato (XLSX ou JSON)
- Download automático do arquivo

**Formato dos Dados:**
- ID da transação
- Ativo
- Tipo de operação
- Quantidade
- Preço
- Data e hora

**Validações:**
- Verificação de transações disponíveis
- Formato de arquivo válido

**Mensagens:**
- Sem transações: "Não há transações do dia."
- Sucesso: "Arquivo exportado com sucesso."

---

## 🔧 Funcionalidades Técnicas

### 📁 Estrutura de Arquivos

```
adlnbroker/
├── index.html              # Página principal
├── dashboard.html          # Dashboard do sistema
├── sistema.js              # Lógica principal
├── auth.js                 # Autenticação
├── new-chart.js            # Gráficos
├── cpf-validation.js       # Validação de CPF
├── landing.js              # JavaScript da landing
├── landing.css             # CSS da landing
├── style.css               # CSS principal
├── dashboard.css           # CSS do dashboard
├── trade-modal.css         # CSS do modal de trading
├── market-info.css         # CSS das informações de mercado
├── menu.css                # CSS do menu
├── mobile-fixes.css        # CSS para mobile
├── wallet-modal.css        # CSS do modal da carteira
├── mobile-enhancements.js  # Melhorias mobile
├── market-info.js          # Informações de mercado
├── menu.js                 # JavaScript do menu
├── favicon.png             # Ícone do site
├── logo.png                # Logo principal
├── README.md               # Documentação
└── RN HOME BROKER V_1.0.txt # Regras de negócio
```

### 🔐 Segurança

**Validações Implementadas:**
- Validação de CPF algorítmica
- Validação de e-mail
- Senha com critérios mínimos
- Autenticação por sessão
- Validação de preços (5% de variação máxima)

**Persistência de Dados:**
- LocalStorage do navegador
- Dados criptografados (base64)
- Limpeza automática no logout

### 📱 Responsividade

**Breakpoints:**
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

**Adaptações:**
- Layout flexível
- Menus colapsáveis
- Gráficos responsivos
- Modais adaptáveis

### 🎨 Design System

**Cores:**
- Primária: #F0B90B (Dourado)
- Secundária: #0B0E11 (Preto)
- Fundo: #181A20 (Cinza escuro)
- Texto: #FFFFFF (Branco)
- Sucesso: #2ed573 (Verde)
- Erro: #ff4757 (Vermelho)

**Tipografia:**
- Família: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Tamanhos: 12px, 14px, 16px, 18px, 24px, 32px

---

## 🧪 Testes

### Cenários de Teste Principais

**Cadastro:**
- Dados válidos
- CPF duplicado
- E-mail duplicado
- Senha fraca
- Campos obrigatórios

**Login:**
- Credenciais válidas
- CPF inexistente
- Senha incorreta
- Campos vazios

**Operações:**
- Compra com saldo suficiente
- Compra com saldo insuficiente
- Venda com ativos suficientes
- Venda sem ativos
- Preços válidos e inválidos

**Validações:**
- Horário de funcionamento
- Quantidades mínimas
- Limites de preço
- Cancelamento de ordens

### Dados de Teste

**Usuário Padrão:**
- CPF: 123.456.789-00
- Senha: Teste123
- Saldo inicial: R$ 100.000,00

**Ativos de Teste:**
- PETR4: R$ 28,50
- VALE3: R$ 72,30
- ITUB4: R$ 31,20

---

## 🚀 Deploy e Configuração

### Requisitos Mínimos

**Navegador:**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

**Funcionalidades:**
- JavaScript habilitado
- LocalStorage disponível
- Suporte a ES6+

### Instalação Local

1. Clone o repositório
2. Abra `index.html` no navegador
3. Ou use um servidor local:
   ```bash
   python -m http.server 8000
   ```

### Deploy em Produção

- Hospedagem estática (GitHub Pages, Netlify, Vercel)
- Configuração de HTTPS
- Compressão de arquivos
- Cache de recursos

---

## 📞 Suporte

**Contatos:**
- Alan
- Daniel Felix: danfelix147@gmail.com
- Larissa
- Nilson Brites: nilson.brites@adln.com

**Issues:**
- GitHub Issues para bugs
- Pull Requests para melhorias
- Documentação sempre atualizada

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

*Documentação gerada em Agosto/2025 - Versão 1.0*
