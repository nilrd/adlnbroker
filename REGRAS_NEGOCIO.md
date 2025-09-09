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
  - Nome (obrigatório, mínimo 2 letras apenas letras)
  - Sobrenome (opcional, apenas letras)
  - CPF (11 dígitos, obrigatório, números)
  - E-mail (obrigatório, com "@")
  - Celular (obrigatório, números)
  - Senha (obrigatória)
  - Confirmação de senha (obrigatória, deve ser igual à senha)

**Validações em tempo real:**
- Nome/Sobrenome: apenas letras, mínimo 2 letras no nome, sem números ou caracteres especiais
- CPF: exatamente 11 dígitos e válido conforme algoritmo oficial de CPF (dígitos verificadores)
- E-mail: formato válido (regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/), domínio válido, sem espaços
- Celular: formato brasileiro (11 dígitos), apenas números
- Senha: mínimo 8 caracteres, 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial
- Confirmação de senha: deve ser idêntica à senha

**Regras:**
- O botão "Criar Conta" só é habilitado com todos os campos válidos
- Sucesso no cadastro → redirecionamento automático para tela de login ou onboarding
- Se CPF ou e-mail já existirem: mensagem clara "Já existe uma conta cadastrada com este CPF ou e-mail."

**Mensagens de erro:**
- Nome inválido: "Nome deve conter pelo menos 2 letras e apenas caracteres alfabéticos."
- CPF inválido: "CPF inválido. Verifique os dígitos e tente novamente."
- E-mail inválido: "Formato de e-mail inválido. Use o formato: usuario@dominio.com"
- Celular inválido: "Celular deve conter 11 dígitos numéricos."
- Senha fraca: "Senha deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo."
- Senhas não coincidem: "As senhas não coincidem. Digite novamente."
- CPF ou e-mail já existem: "Já existe uma conta cadastrada com este CPF ou e-mail."
- Campos obrigatórios: "Preencha todos os campos obrigatórios corretamente."

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
  - Diferença ≤ 0.5% da cotação → executada
  - Diferença ≤ 2% da cotação → aceita (pendente)
  - Diferença > 2% da cotação → rejeitada
- Quantidade mínima: 1 lote (100 unidades), sem frações
- Limite absoluto de preço: R$ 0,10 a R$ 1.000,00

**Mensagens de erro:**
- Dados inválidos → "Verifique os campos e tente novamente."

---

## 6. 📌 RN-004 – Compra

**Objetivo:** Executar compras somente com saldo suficiente e preço válido.

**Comportamento do sistema:**
- Verifica saldo = valor por lote * quantidade
- Compara valor informado com cotação:
  - Igual → executada
  - Diferença ≤ 0.5% → executada
  - Diferença ≤ 2% → aceita (pendente)
  - Diferença > 2% → rejeitada
- Validação de limite absoluto: R$ 0,10 a R$ 1.000,00

**Mensagens de erro:**
- Saldo insuficiente → "Saldo insuficiente para realizar a compra."

---

## 7. 📌 RN-005 – Venda

**Objetivo:** Permitir venda apenas com ativos suficientes e preço dentro das regras.

**Comportamento do sistema:**
- Verifica quantidade do ativo em carteira
- Compara valor informado com cotação:
  - Igual → executada
  - Diferença ≤ 0.5% → executada
  - Diferença ≤ 2% → aceita (pendente)
  - Diferença > 2% → rejeitada
- Validação de limite absoluto: R$ 0,10 a R$ 1.000,00

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
- Intervalos: 1M (1 minuto), 5M (5 minutos), 30M (30 minutos), 1H (1 hora)
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

## 16. 📌 RN-014 – Exibição de Variação Diária do Saldo

**Objetivo:** Exibir a variação percentual diária do saldo do usuário no cabeçalho.

**Comportamento do sistema:**
- Calcula variação usando fórmula: ((saldoAtual - saldoInicial) / saldoInicial) * 100
- Saldo inicial é definido no primeiro login ou cadastro do usuário
- Exibe variação com setas: ▲ para positivo, ▼ para negativo
- Cores: verde para positivo, vermelho para negativo
- Ocultar variação se valor absoluto < 0.01% para evitar poluição visual
- Atualização automática quando saldo é modificado

**Regras:**
- Variação positiva: exibida em verde com seta para cima
- Variação negativa: exibida em vermelho com seta para baixo
- Variação zero ou muito pequena: oculta completamente
- Formato: +X.XX% ou -X.XX% com duas casas decimais

---

## 17. 📌 RN-015 – Controle de Visibilidade do Saldo

**Objetivo:** Permitir ao usuário ocultar/mostrar o valor do saldo no cabeçalho.

**Comportamento do sistema:**
- Botão com ícone de olho no cabeçalho (próximo ao saldo)
- Estado visível: ícone de olho aberto (fa-eye)
- Estado oculto: ícone de olho cortado (fa-eye-slash)
- Ao ocultar: substitui valor por "****"
- Ao mostrar: restaura valor real formatado
- Tooltip atualiza conforme estado: "Ocultar saldo" / "Mostrar saldo"

**Regras:**
- Estado de visibilidade é mantido durante a sessão
- Valor real é preservado internamente
- Formatação brasileira mantida ao restaurar (R$ X.XXX,XX)
- Ícone muda dinamicamente conforme estado
- Funcionalidade disponível apenas para usuários logados

---

## 18. 📌 RN-016 – Gráfico Simples

**Objetivo:** Exibir gráfico básico de cotações no dashboard principal com funcionalidades essenciais.

**Comportamento do sistema:**
- Gráfico integrado no dashboard principal
- Exibe apenas o ativo selecionado
- Tipos disponíveis: Linha e Candlestick
- Intervalos: 1M, 5M, 30M, 1H
- Atualização automática a cada 10 segundos
- Botões de compra e venda integrados
- Botão "Gráfico Completo" para expandir

**Regras:**
- Altura fixa de 400px no dashboard
- Responsivo para diferentes tamanhos de tela
- Dados limitados aos últimos 50 pontos
- Performance otimizada para não impactar o dashboard

**Mensagens de erro:**
- Falha na renderização → "Erro ao carregar gráfico. Tente novamente."
- Dados insuficientes → "Aguardando dados suficientes para exibir o gráfico."

---

## 19. 📌 RN-017 – Gráfico Completo

**Objetivo:** Fornecer visualização avançada de gráficos em página dedicada com funcionalidades completas.

**Comportamento do sistema:**
- Página dedicada para análise técnica
- Gráfico em tela cheia (altura dinâmica)
- Múltiplos indicadores técnicos disponíveis
- Zoom e pan habilitados
- Dados históricos completos (últimos 200 pontos)
- Ferramentas de desenho (linhas, retângulos, etc.)
- Exportação de imagem do gráfico
- Múltiplos timeframes simultâneos

**Regras:**
- Acesso apenas para usuários logados
- Dados carregados sob demanda
- Cache de dados para performance
- Suporte a múltiplos ativos em abas
- Indicadores: Médias móveis, RSI, MACD, Bollinger Bands

**Mensagens de erro:**
- Falha no carregamento → "Erro ao carregar gráfico completo. Verifique sua conexão."
- Indicador indisponível → "Indicador temporariamente indisponível."

---

## 20. 📌 RN-018 – Segurança do Sistema

**Objetivo:** Garantir segurança completa do sistema e proteção de dados dos usuários.

**Comportamento do sistema:**

### 20.1 Autenticação e Autorização
- Acesso ao dashboard apenas com login válido
- Sessão expira após 30 minutos de inatividade
- Logout automático em caso de inatividade
- Validação de CPF e senha em todas as requisições
- Bloqueio temporário após 5 tentativas de login incorretas

### 20.2 Proteção de Dados
- Dados sensíveis nunca expostos no frontend
- Senhas criptografadas (hash SHA-256)
- CPF mascarado em exibições (XXX.XXX.XXX-XX)
- Saldo ocultável por opção do usuário
- Dados de sessão limpos no logout

### 20.3 Validação de Entrada
- Sanitização de todos os inputs do usuário
- Validação de CPF com algoritmo oficial
- Prevenção de XSS (Cross-Site Scripting)
- Validação de tipos de dados
- Limites de caracteres em todos os campos

### 20.4 Controle de Acesso
- Verificação de autenticação em todas as operações
- Validação de propriedade dos dados
- Prevenção de acesso não autorizado a dados de outros usuários
- Logs de auditoria para operações sensíveis

**Regras:**
- Todas as operações financeiras requerem revalidação
- Dados de carteira e saldo protegidos por sessão
- Backup automático de dados críticos
- Monitoramento de tentativas de acesso suspeitas

**Mensagens de erro:**
- Sessão expirada → "Sessão expirada. Faça login novamente."
- Acesso negado → "Acesso negado. Verifique suas credenciais."
- Dados inválidos → "Dados inválidos detectados. Operação cancelada."

---

## 21. 📌 RN-019 – Funcionalidades Adicionais

**Objetivo:** Documentar funcionalidades não mencionadas anteriormente no sistema.

### 21.1 Sistema de Notificações
- Notificações de ordens executadas
- Alertas de variação de preços
- Avisos de mercado fechado
- Confirmações de operações

### 21.2 Histórico e Relatórios
- Histórico completo de operações
- Relatório de performance da carteira
- Análise de ganhos/perdas por ativo
- Estatísticas de trading

### 21.3 Personalização
- Temas claro/escuro
- Configuração de alertas personalizados
- Preferências de exibição
- Configurações de notificação

### 21.4 Integração e Exportação
- Exportação de dados em múltiplos formatos
- Integração com APIs externas (quando disponível)
- Backup de dados do usuário
- Sincronização entre dispositivos

### 21.5 Acessibilidade
- Suporte a leitores de tela
- Navegação por teclado
- Alto contraste
- Textos alternativos em imagens

### 21.6 Performance e Otimização
- Carregamento lazy de componentes
- Cache inteligente de dados
- Otimização de imagens
- Compressão de dados

**Regras:**
- Todas as funcionalidades respeitam as regras de segurança
- Performance otimizada para diferentes dispositivos
- Compatibilidade com navegadores modernos
- Fallbacks para funcionalidades não suportadas

**Mensagens de erro:**
- Funcionalidade indisponível → "Funcionalidade temporariamente indisponível."
- Erro de integração → "Erro na integração. Tente novamente mais tarde."

---

## 22. 📌 RN-020 – Responsividade do Sistema

**Objetivo:** Garantir que o sistema funcione perfeitamente em todos os dispositivos e tamanhos de tela.

**Comportamento do sistema:**

### 22.1 Breakpoints Responsivos
- Desktop: > 1200px (layout completo)
- Laptop: 992px - 1199px (layout adaptado)
- Tablet: 768px - 991px (layout em coluna)
- Mobile: 320px - 767px (layout vertical)

### 22.2 Adaptações por Dispositivo
- **Desktop:** Grid 2x2 completo, todos os painéis visíveis
- **Laptop:** Grid adaptado, painéis redimensionados
- **Tablet:** Layout em coluna única, navegação por abas
- **Mobile:** Layout vertical, menu hambúrguer, botões maiores

### 22.3 Elementos Responsivos
- Gráficos redimensionam automaticamente
- Tabelas com scroll horizontal em mobile
- Botões com tamanho mínimo de 44px (touch-friendly)
- Textos com tamanho mínimo de 16px
- Espaçamentos proporcionais ao dispositivo

**Regras:**
- Teste em todos os breakpoints principais
- Performance otimizada para dispositivos móveis
- Carregamento progressivo de recursos
- Fallbacks para funcionalidades não suportadas

**Mensagens de erro:**
- Dispositivo não suportado → "Seu dispositivo pode ter limitações. Use um navegador atualizado."

---

## 23. 📌 RN-021 – Modal de Login

**Objetivo:** Fornecer interface de autenticação através de modal sobreposto.

**Comportamento do sistema:**
- Modal centralizado na tela
- Fundo escurecido (backdrop)
- Campos: CPF e Senha
- Botões: "Entrar" e "Fechar"
- Link para "Esqueci minha senha"
- Link para "Criar conta"

**Validações:**
- CPF: formato válido (XXX.XXX.XXX-XX)
- Senha: mínimo 6 caracteres
- Validação em tempo real

**Regras:**
- Modal não pode ser fechado clicando fora
- Escape fecha o modal
- Foco automático no primeiro campo
- Loading state durante autenticação

**Mensagens de erro:**
- Credenciais inválidas → "CPF ou senha incorretos. Tente novamente."
- Campos vazios → "Preencha todos os campos obrigatórios."

---

## 24. 📌 RN-022 – Modal de Cadastro

**Objetivo:** Permitir criação de nova conta através de modal sobreposto.

**Comportamento do sistema:**
- Modal com formulário completo
- Campos: Nome, Sobrenome, CPF, E-mail, Celular, Senha, Confirmação
- Validação em tempo real
- Botões: "Criar Conta" e "Cancelar"

**Validações:**
- Todos os campos obrigatórios
- CPF válido com algoritmo oficial
- E-mail com formato correto
- Senha forte (8+ caracteres, maiúscula, minúscula, número, símbolo)
- Confirmação de senha idêntica

**Regras:**
- Modal não pode ser fechado durante validação
- Progresso visual de validação
- Sucesso → fechamento automático e redirecionamento

**Mensagens de erro:**
- Dados inválidos → "Verifique os dados informados e tente novamente."
- CPF/E-mail existente → "Já existe uma conta com estes dados."

---

## 25. 📌 RN-023 – Modal Minha Conta

**Objetivo:** Exibir e permitir edição das informações do usuário logado.

**Comportamento do sistema:**
- Modal com dados pessoais
- Campos editáveis: Nome, E-mail, Celular
- Campos somente leitura: CPF, Data de cadastro
- Botões: "Salvar Alterações" e "Fechar"
- Seção de segurança: "Alterar Senha"

**Validações:**
- E-mail: formato válido
- Celular: 11 dígitos
- Nome: mínimo 2 caracteres

**Regras:**
- Alterações salvas apenas com confirmação
- Senha atual obrigatória para alterar senha
- Logout automático após alteração de dados sensíveis

**Mensagens de erro:**
- Dados inválidos → "Verifique os dados informados."
- Senha incorreta → "Senha atual incorreta."

---

## 26. 📌 RN-024 – Sistema de Tradução

**Objetivo:** Permitir alternância entre idiomas (Português/Inglês) em todo o sistema.

**Comportamento do sistema:**
- Botão de idioma no cabeçalho
- Alternância entre PT-BR e EN-US
- Tradução de todos os textos da interface
- Persistência da preferência de idioma

**Regras:**
- Tradução completa de:
  - Labels e botões
  - Mensagens de erro
  - Tooltips e placeholders
  - Notificações
  - Relatórios e extratos
- Formatação de números e datas por idioma
- RTL support para idiomas futuros

**Mensagens de erro:**
- Falha na tradução → "Erro ao carregar idioma. Recarregue a página."

---

## 27. 📌 RN-025 – Controle de Saldo com Olho e Percentual

**Objetivo:** Exibir saldo com opção de ocultar e mostrar variação percentual diária.

**Comportamento do sistema:**
- Saldo visível por padrão
- Botão olho para ocultar/mostrar
- Variação percentual ao lado do saldo
- Cores: verde (positivo), vermelho (negativo)
- Setas: ▲ (alta), ▼ (baixa)

**Estados do botão olho:**
- **Visível:** ícone olho aberto (fa-eye)
- **Oculto:** ícone olho cortado (fa-eye-slash)
- **Valor oculto:** "•••••••" no lugar do saldo

**Regras:**
- Estado mantido durante a sessão
- Variação calculada: ((atual - inicial) / inicial) * 100
- Ocultar variação se < 0.01%
- Formato: +X.XX% ou -X.XX%

**Mensagens de erro:**
- Erro no cálculo → "Erro ao calcular variação."

---

## 28. 📌 RN-026 – Cabeçalho do Dashboard

**Objetivo:** Fornecer navegação e informações essenciais no topo do dashboard.

**Comportamento do sistema:**
- Logo da empresa (esquerda)
- Status do mercado (centro)
- Informações do usuário (direita)
- Botões de ação: Carteira, Idioma, Perfil, Menu

**Elementos do cabeçalho:**
- **Logo:** ADLN BROKER com favicon
- **Status:** Ponto colorido + "Mercado Aberto/Fechado"
- **Usuário:** Nome + Saldo + Variação
- **Ações:** Ícones para funcionalidades principais

**Regras:**
- Cabeçalho fixo no topo
- Responsivo para mobile (menu hambúrguer)
- Atualização em tempo real do status
- Inteligência de scroll (ocultar/mostrar)

**Mensagens de erro:**
- Falha na atualização → "Erro ao atualizar informações."

---

## 29. 📌 RN-027 – Página Index (Landing)

**Objetivo:** Página inicial atrativa que apresenta o sistema e direciona para login/cadastro.

**Comportamento do sistema:**
- Hero section com apresentação
- Seções: Sobre, Funcionalidades, Contato
- Botões: "Entrar" e "Criar Conta"
- Design responsivo e moderno

**Elementos da landing:**
- **Hero:** Título, subtítulo, CTA principal
- **Sobre:** Descrição do sistema
- **Funcionalidades:** Cards com features
- **Contato:** Informações e redes sociais

**Regras:**
- Carregamento rápido (< 3 segundos)
- SEO otimizado
- Acessibilidade completa
- Links funcionais para modais

**Mensagens de erro:**
- Carregamento lento → "Carregando conteúdo..."

---

## 30. 📌 RN-028 – Rodapé do Sistema

**Objetivo:** Fornecer informações complementares e links importantes no final das páginas.

**Comportamento do sistema:**
- Logo e descrição da empresa
- Links úteis organizados em colunas
- Redes sociais com ícones específicos
- Informações legais e de contato

**Elementos do rodapé:**
- **Logo:** ADLN BROKER
- **Descrição:** "Sua plataforma de investimentos de confiança"
- **Redes sociais:** Instagram, LinkedIn, YouTube, Email
- **Links legais:** Termos, Privacidade, Suporte

**Regras:**
- Ícones específicos para cada rede social
- Links não funcionais (conforme especificação)
- Design consistente com o sistema
- Responsivo para mobile

**Mensagens de erro:**
- Link indisponível → "Link em desenvolvimento."

---

## 31. 📌 RN-029 – Modais do Sistema

**Objetivo:** Documentar todos os modais disponíveis no sistema e suas funcionalidades.

### 31.1 Modal de Carteira
- Exibe ativos em carteira
- Valores atualizados em tempo real
- Botão para fechar

### 31.2 Modal de Trading
- Formulário de compra/venda
- Validação de saldo/quantidade
- Confirmação de operação

### 31.3 Modal de Depósito
- Simulação de depósito
- Valores pré-definidos
- Confirmação de transação

### 31.4 Modal de Alteração de Senha
- Campos: senha atual, nova senha, confirmação
- Validação de força da senha
- Confirmação de alteração

### 31.5 Modal de Exportação
- Opções de formato (XLSX, JSON)
- Filtros de data
- Download automático

### 31.6 Modal de Relatório de Ordens
- Lista completa de ordens
- Filtros por status
- Ações de cancelamento

**Regras:**
- Todos os modais com backdrop escuro
- Botão X para fechar
- Escape para fechar
- Foco no primeiro campo
- Validação antes de fechar

**Mensagens de erro:**
- Modal não carregado → "Erro ao carregar modal. Tente novamente."

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
| RN-014 | Exibição de Variação Diária do Saldo | ✅ Implementado |
| RN-015 | Controle de Visibilidade do Saldo | ✅ Implementado |
| RN-016 | Gráfico Simples | ✅ Implementado |
| RN-017 | Gráfico Completo | ✅ Implementado |
| RN-018 | Segurança do Sistema | ✅ Implementado |
| RN-019 | Funcionalidades Adicionais | ✅ Implementado |
| RN-020 | Responsividade do Sistema | ✅ Implementado |
| RN-021 | Modal de Login | ✅ Implementado |
| RN-022 | Modal de Cadastro | ✅ Implementado |
| RN-023 | Modal Minha Conta | ✅ Implementado |
| RN-024 | Sistema de Tradução | ✅ Implementado |
| RN-025 | Controle de Saldo com Olho e Percentual | ✅ Implementado |
| RN-026 | Cabeçalho do Dashboard | ✅ Implementado |
| RN-027 | Página Index (Landing) | ✅ Implementado |
| RN-028 | Rodapé do Sistema | ✅ Implementado |
| RN-029 | Modais do Sistema | ✅ Implementado |

---

**Documento criado pela Equipe ADLN BROKER**  
*Versão 4.0 - Agosto/2025*
