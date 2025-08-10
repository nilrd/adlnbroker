# Relógio da Bolsa - ADLN Broker

## 📊 Funcionalidade Implementada

O **Relógio da Bolsa** é uma nova funcionalidade adicionada ao ADLN Broker que exibe em tempo real:

- **Hora atual** do sistema
- **Status do mercado** (Aberto, Fechado, Pré-Abertura, After Hours)
- **Countdown** para próxima abertura ou fechamento
- **Indicador visual** com cores diferentes para cada status

## 🕐 Horários da B3 (Bolsa Brasileira)

A funcionalidade segue os horários oficiais da B3:

| Período | Horário | Status |
|---------|---------|--------|
| **Pré-Abertura** | 09:00 - 09:59 | 🟡 Pré-Abertura |
| **Abertura** | 10:00 - 16:59 | 🟢 Mercado Aberto |
| **Fechamento** | 17:00 - 17:59 | 🟣 After Hours |
| **Fechado** | 18:00 - 08:59 | 🔴 Mercado Fechado |
| **Fim de Semana** | Sábado/Domingo | 🔴 Mercado Fechado (Fim de Semana) |

## 🎨 Design e Interface

### Localização
O relógio está posicionado na seção **Stocks** do dashboard, ao lado do status do mercado.

### Cores por Status
- **🟢 Mercado Aberto**: Verde (#00d4aa)
- **🟡 Pré-Abertura**: Amarelo/Laranja (#f39c12)
- **🟣 After Hours**: Roxo (#9b59b6)
- **🔴 Mercado Fechado**: Vermelho (#e74c3c)

### Elementos Visuais
- **Relógio digital** com fonte monospace
- **Ponto indicador** com animação pulsante
- **Countdown** em tempo real
- **Efeitos de sombra** para destaque visual

## 🔧 Implementação Técnica

### Arquivos Modificados

1. **`dashboard.html`**
   - Adicionado elementos HTML para o relógio
   - IDs: `market-time`, `market-countdown`, `market-status-text`

2. **`dashboard.css`**
   - Estilos para o relógio e diferentes status
   - Design responsivo para mobile
   - Animações e efeitos visuais

3. **`sistema.js`**
   - Lógica completa do relógio da bolsa
   - Funções de cálculo de horários
   - Atualização em tempo real (1 segundo)

### Funções Principais

```javascript
// Verificar status do mercado
getStatusMercado()

// Calcular countdown
calcularCountdown(dataAlvo)

// Atualizar interface
atualizarRelogioBolsa()

// Inicializar sistema
inicializarRelogioBolsa()
```

## 📱 Responsividade

O relógio é totalmente responsivo:

- **Desktop**: Exibição completa com countdown
- **Tablet**: Ajuste de tamanhos de fonte
- **Mobile**: Layout compacto mantendo funcionalidade

## 🧪 Testes

### Cenários de Teste

1. **Mercado Aberto** (10:00 - 17:00)
   - Verificar contagem regressiva para fechamento
   - Confirmar cor verde

2. **Pré-Abertura** (09:00 - 10:00)
   - Verificar contagem para abertura
   - Confirmar cor amarela

3. **After Hours** (17:00 - 18:00)
   - Verificar contagem para fechamento final
   - Confirmar cor roxa

4. **Mercado Fechado** (18:00 - 09:00)
   - Verificar contagem para próxima abertura
   - Confirmar cor vermelha

5. **Fim de Semana**
   - Verificar mensagem específica
   - Confirmar contagem para segunda-feira

### Como Testar

1. Acesse o dashboard logado
2. Observe o relógio na seção Stocks
3. Teste diferentes horários alterando o relógio do sistema
4. Verifique responsividade em diferentes tamanhos de tela

## 🚀 Próximas Melhorias

- [ ] Integração com API de feriados nacionais
- [ ] Notificações sonoras para abertura/fechamento
- [ ] Configuração de fuso horário
- [ ] Histórico de horários de negociação
- [ ] Alertas personalizados por horário

## 📝 Notas

- O relógio funciona independentemente do fuso horário do usuário
- Considera apenas dias úteis (Segunda a Sexta)
- Atualização automática a cada segundo
- Compatível com todos os navegadores modernos

---

**Desenvolvido por:** Squad ADLN (Alan, Daniel, Larissa, Nilson)  
**Data:** Janeiro 2025  
**Versão:** 1.0
