## Tarefas

### Fase 1: Análise do código atual e estrutura do projeto
- [x] Clonar o repositório do GitHub.
- [x] Analisar a estrutura de arquivos e pastas.
- [x] Identificar os arquivos HTML, CSS e JavaScript relevantes para o dashboard.
- [x] Entender como as funcionalidades atuais são implementadas.

### Fase 2: Pesquisa e configuração de API de cotações em tempo real
- [x] Pesquisar APIs públicas e gratuitas para cotações em tempo real.
- [x] Selecionar a API mais adequada (BRAPI).
- [x] Entender a documentação da API e como integrar os dados.

### Fase 3: Implementação dos gráficos de cotações com candlesticks e curvas
- [x] Escolher uma biblioteca de gráficos JavaScript (TradingView Lightweight Charts).
- [x] Implementar o gráfico de candlesticks.
- [x] Implementar o gráfico de curvas.
- [x] Adicionar funcionalidade para o usuário alternar entre os tipos de gráfico e períodos.
- [x] Integrar os dados da API nos gráficos.

### Fase 4: Reorganização do menu e implementação das funcionalidades de conta
- [x] Diminuir o botão 'SAIR'.
- [x] Implementar um menu hambúrguer.
- [x] Adicionar 'Minha conta', 'Depositar' (não funcional) e 'Alterar Senha' ao menu hambúrguer.
- [x] Remover a funcionalidade 'Alterar Senha' do dashboard.
- [x] Criar um modal para 'Alterar Senha' solicitando senha antiga/email e novos campos de senha.
- [x] Implementar a lógica de alteração de senha e dados do usuário, mantendo o armazenamento no navegador.
- [x] Garantir que o layout seja responsivo.

### Fase 5: Testes e ajustes finais do layout responsivo
- [x] Testar todas as funcionalidades implementadas.
- [x] Verificar a responsividade do layout em diferentes tamanhos de tela.
- [x] Realizar ajustes finos no layout para evitar prejuízos às funcionalidades existentes.

### Fase 6: Commit das alterações no repositório
- [x] Realizar o commit das alterações no repositório Git.

## Status Atual

O projeto já possui:
- ✅ Gráfico de cotações em tempo real com TradingView Lightweight Charts
- ✅ Alternância entre candlestick e linha
- ✅ Seleção de intervalos (1D, 1S, 1M, 1A)
- ✅ Seleção de ativos (PETR4, VALE3, ITUB4, etc.)
- ✅ Menu hambúrguer implementado
- ✅ Modal "Minha Conta" com dados do usuário
- ✅ Modal "Depositar" (não funcional, apenas informativo)
- ✅ Modal "Alterar Senha" com validação
- ✅ Botão SAIR reduzido e integrado ao menu
- ✅ Layout responsivo
- ✅ Integração com API BRAPI para dados reais
- ✅ **Relógio da Bolsa** com horários da B3 em tempo real

Próximos passos:
1. Testar todas as funcionalidades
2. Verificar responsividade
3. Fazer commit das alterações

## Novas Funcionalidades Implementadas

### ✅ Relógio da Bolsa (Janeiro 2025)
- **Funcionalidade**: Relógio em tempo real com horários da B3
- **Localização**: Dashboard > Seção Stocks
- **Recursos**:
  - Hora atual do sistema
  - Status do mercado (Aberto, Fechado, Pré-Abertura, After Hours)
  - Countdown para próxima abertura/fechamento
  - Cores diferentes para cada status
  - Design responsivo
- **Arquivos modificados**: `dashboard.html`, `dashboard.css`, `sistema.js`
- **Documentação**: `RELOGIO_BOLSA.md`




## Sprint 1 — Validações de Campos no Cadastro

- [x] Campo Nome: Permitir apenas letras (A-Z e a-z), incluindo acentos. Bloquear números e caracteres especiais. Exigir mínimo de 3 letras. Aplicar em todos os dispositivos, inclusive modo desktop no Chrome Android.
- [x] Campo E-mail: Confirmar se `teste@teste` é intencional. Caso não seja, implementar regex que exija formato válido de e-mail (`usuario@dominio.com`, `.br`, `.org`, etc.).
- [x] Campo CPF: Substituir `alert()` por mensagem de erro exibida logo abaixo do campo em estilo visual consistente com o restante do sistema. Mensagem clara e objetiva ("CPF inválido. Digite novamente.").
- [x] Mensagens de Erro no Cadastro: Validar e padronizar mensagens de erro para cada campo. Mensagens devem indicar claramente o motivo da falha e como corrigir.

## Sprint 2 — Criação e Redirecionamento de Conta

- [x] Redirecionamento pós-cadastro: Para cada novo cadastro, criar nova conta vinculada ao CPF e dados informados. Conta nova deve iniciar com R$ 100.000,00 de saldo. Dados exibidos no Dashboard e em Minha Conta devem corresponder ao usuário logado.
- [x] Usuário de Teste (CPF 442.442.442-42): Permitir login com este usuário para fins de teste. Credenciais válidas: CPF: 442.442.442-42, Senha: Teste1234.

## Sprint 3 — Melhorias no Login

- [x] Mensagens de Erro: Exibir mensagem em vermelho logo abaixo do campo inválido. Caso usuário não exista, exibir: "Usuário não encontrado. Verifique os dados e tente novamente."
- [x] Pop-up de Boas-Vindas: Ao fazer login, desativar pop-up ou redirecionar diretamente para a página principal do usuário.

