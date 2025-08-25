# 📄 Documento de Regras de Negócio – Home Broker

**Versão:** 1.0  
**Data:** Agosto/2025  
**Responsável:** Alan, Daniel, Larissa e Nilson  
**Sistema:** ADLN Home Broker Simulado (HTML, CSS, JavaScript)

---

## 1. 🧭 Visão Geral

Este documento descreve as regras de negócio do sistema Home Broker Simulado. A aplicação permite que usuários realizem operações simuladas de compra e venda de ativos com base em cotações dinâmicas e regras simplificadas da bolsa de valores.

---

## 2. 📌 RN-000 – Cadastro de Usuário

**Objetivo:** Permitir que novos usuários criem uma conta no sistema, com validações de dados e critérios mínimos de segurança.

**Comportamento do sistema:**
- Exibe tela de cadastro com campos:
  - Nome (obrigatório, mínimo 2 letras)
  - Sobrenome (opcional)
  - CPF (11 dígitos, obrigatório)
  - E-mail (obrigatório, com "@")
  - Celular (obrigatório, números)
  - Senha (obrigatória)
  - Confirmação de senha (obrigatória, deve ser igual à senha)

**Validações em tempo real:**
- Nome/Sobrenome: apenas letras, mínimo 2 letras no nome, sem números ou caracteres especiais
- CPF: exatamente 11 dígitos e válido conforme algoritmo de CPF
- E-mail: formato válido
- Senha: mínimo 8 caracteres, 1 letra maiúscula e 1 número
- Confirmação de senha: deve ser idêntica à senha

**Regras:**
- O botão "Criar Conta" só é habilitado com todos os campos válidos
- Sucesso no cadastro → redirecionamento automático para tela de login ou onboarding
- Se CPF ou e-mail já existirem: mensagem clara "Já existe uma conta cadastrada com este CPF ou e-mail."

**Mensagens de erro:**
- CPF inválido ou senha incorreta: "CPF ou senha incorretos. Tente novamente."
- Campos incorretos ou faltando: "Preencha todos os campos obrigatórios corretamente."

---

## 3. 📌 RN-001 – Login

**Objetivo:** Permitir que usuários autenticados acessem o sistema com CPF e senha.

**Comportamento do sistema:**
- Usuário insere CPF e senha
- Sistema valida com dados pré-cadastrados
- Se válido → carrega:
  - Carteira
  - Saldo
  - Cotações
  - Book de ordens
  - Extrato de operações
- Logout encerra sessão e limpa dados visuais

**Mensagens de erro:**
- CPF ou senha inválidos → "CPF ou senha inválidos. Tente novamente."

---

## 4. 📌 RN-002 – Cotação de Ativos

**Objetivo:** Exibir os preços simulados dos ativos, atualizados automaticamente.

**Comportamento do sistema:**
- Atualização a cada 10 segundos
- Variação de preço: R$0,01 por ciclo
- Valores usados para comparação com ordens

**Mensagens de erro:**
- Falha de atualização → "Não foi possível atualizar as cotações no momento."

---

## 5. 📌 RN-003 – Boleta de Compra e Venda

**Objetivo:** Permitir envio de ordens de compra ou venda de ativos.

**Comportamento do sistema:**
- Usuário escolhe: tipo, ativo, quantidade, valor por lote
- Ordem validada:
  - Igual à cotação → executada
  - Diferença ≤ R$5 → aceita (pendente)
  - Diferença > R$5 → rejeitada
- Quantidade mínima: 1 lote (100 unidades), sem frações

**Mensagens de erro:**
- Dados inválidos → "Verifique os campos e tente novamente."

---

## 6. 📌 RN-004 – Compra

**Objetivo:** Executar compras somente com saldo suficiente e preço válido.

**Comportamento do sistema:**
- Verifica saldo = valor por lote * quantidade
- Compara valor informado com cotação:
  - Igual → executada
  - Diferença ≤ R$5 → aceita (pendente)
  - Diferença > R$5 → rejeitada

**Mensagens de erro:**
- Saldo insuficiente → "Saldo insuficiente para realizar a compra."

---

## 7. 📌 RN-005 – Venda

**Objetivo:** Permitir venda apenas com ativos suficientes e preço dentro das regras.

**Comportamento do sistema:**
- Verifica quantidade do ativo em carteira
- Compara valor informado com cotação:
  - Igual → executada
  - Diferença ≤ R$5 → aceita (pendente)
  - Diferença > R$5 → rejeitada

**Mensagens de erro:**
- Quantidade insuficiente → "Você não possui ativos suficientes para realizar a venda."

---

## 8. 📌 RN-006 – Livro de Ofertas (Book de Cotações)

**Objetivo:** Exibir cotações atuais dos ativos para referência.

**Comportamento do sistema:**
- Atualiza automaticamente a cada 10 segundos
- Utilizado para validação das ordens

**Mensagens de erro:**
- Falha na atualização → "Não foi possível atualizar o Book de Ofertas no momento."

---

## 9. 📌 RN-007 – Atualização de Carteira

**Objetivo:** Atualizar a carteira e saldo após ordens executadas.

**Comportamento do sistema:**
- Compra → adiciona ativos, reduz saldo
- Venda → remove ativos, aumenta saldo
- Atualizações visíveis no dashboard

---

## 10. 📌 RN-008 – Book de Ordens (Atualizado)

**Objetivo:** Registrar todas as ordens com status e rastreamento completo.

**Comportamento do sistema:**
- Exibe:
  - Tipo de operação
  - Ativo
  - Quantidade
  - Valor por lote
  - Cotação na hora do envio
  - Data/hora
  - Status (Aceita, Executada, Rejeitada)
  - Ação (Cancelar)

**Mensagens de erro:**
- Falha ao registrar ordem → "Não foi possível registrar a ordem. Tente novamente."

---

## 11. 📌 RN-009 – Cancelamento de Ordem

**Objetivo:** Permitir cancelamento de ordens pendentes.

**Comportamento do sistema:**
- Apenas ordens com status "Aceita" podem ser canceladas
- Ordem cancelada é removida do Book
- Não altera saldo ou carteira

---

## 12. 📌 RN-010 – Extrato de Operações (Atualizado)

**Objetivo:** Exibir apenas ordens executadas, com detalhes completos.

**Comportamento do sistema:**
- Mostra:
  - Tipo
  - Ativo
  - Quantidade
  - Valor total
  - Data e horário

**Mensagens de erro:**
- Falha ao carregar extrato → "Não foi possível carregar o extrato no momento."

---

## 13. 📌 RN-011 – Timer de Abertura e Fechamento da Bolsa

**Objetivo:** Controlar horário de operação do mercado.

**Comportamento do sistema:**
- Mercado aberto: seg a sex, das 10h00 às 18h00
- Fora desse período ou em feriados:
  - Ordens são rejeitadas com: "Mercado fechado. Tente novamente no próximo pregão."
- Status do mercado atualizado em tempo real

---

## 14. 📌 RN-012 – Gráfico com Cotações em Tempo Real

**Objetivo:** Permitir visualização da variação de preços com gráficos interativos.

**Comportamento do sistema:**
- Atualizações automáticas com novas cotações
- Tipos: Linha e Candlestick
- Intervalos: 1D, 5M, 30M, 1H
- Exibe preço atual, máximo e mínimo

**Mensagens de erro:**
- Falha na atualização → "Não foi possível atualizar o gráfico no momento. Tente novamente em alguns segundos."

---

## 15. 📌 RN-013 – Exportar Transações do Dia

**Objetivo:** Permitir exportação das transações do dia em XLSX ou JSON.

**Comportamento do sistema:**
- Botão "Exportar Transações" no dashboard
- Usuário escolhe formato (XLSX ou JSON)
- Sistema gera e baixa arquivo com:
  - ID, Ativo, Tipo, Quantidade, Preço, Data e Hora
- Se não houver transações:
  - Mensagem: "Não há transações do dia."

---

## 📋 Resumo das Regras de Negócio

| RN | Descrição | Status |
|---|---|---|
| RN-000 | Cadastro de Usuário | ✅ Implementado |
| RN-001 | Login | ✅ Implementado |
| RN-002 | Cotação de Ativos | ✅ Implementado |
| RN-003 | Boleta de Compra e Venda | ✅ Implementado |
| RN-004 | Compra | ✅ Implementado |
| RN-005 | Venda | ✅ Implementado |
| RN-006 | Livro de Ofertas | ✅ Implementado |
| RN-007 | Atualização de Carteira | ✅ Implementado |
| RN-008 | Book de Ordens | ✅ Implementado |
| RN-009 | Cancelamento de Ordem | ✅ Implementado |
| RN-010 | Extrato de Operações | ✅ Implementado |
| RN-011 | Timer de Abertura/Fechamento | ✅ Implementado |
| RN-012 | Gráfico em Tempo Real | ✅ Implementado |
| RN-013 | Exportar Transações | ✅ Implementado |

---

**Documento criado pela Equipe ADLN Broker**  
*Versão 1.0 - Agosto/2025*
