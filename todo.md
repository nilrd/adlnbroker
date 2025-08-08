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

Próximos passos:
1. Testar todas as funcionalidades
2. Verificar responsividade
3. Fazer commit das alterações

