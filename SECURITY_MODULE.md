# Módulo de Segurança ADLN Broker

## Visão Geral

O módulo de segurança foi desenvolvido para proteger o dashboard contra acesso não autorizado, implementando múltiplas camadas de proteção e monitoramento contínuo.

## Funcionalidades Principais

### 1. Proteção de Páginas
- **Páginas Protegidas**: `dashboard.html`, `/dashboard`, `dashboard`
- **Verificação Automática**: Detecta automaticamente quando o usuário está em uma página protegida
- **Redirecionamento**: Redireciona automaticamente para `index.html` se não autenticado

### 2. Controle de Sessão
- **Timeout de Sessão**: 30 minutos de inatividade
- **Monitoramento de Atividade**: Detecta movimentos do mouse, cliques, digitação, scroll
- **Renovação Automática**: Atualiza o tempo de sessão a cada atividade

### 3. Proteção contra Ataques
- **Limite de Tentativas**: Máximo 3 tentativas de login
- **Bloqueio Temporário**: 15 minutos de bloqueio após exceder tentativas
- **Tela de Bloqueio**: Interface visual informando o tempo restante

### 4. Monitoramento Contínuo
- **Verificações Periódicas**: A cada 5 segundos
- **Detecção de Acesso Direto**: Intercepta tentativas de acesso direto via URL
- **Proteção contra Botão Voltar**: Monitora navegação do navegador

## Arquivos do Sistema

### Core Files
- `security.js` - Módulo principal de segurança
- `security.css` - Estilos para interfaces de segurança
- `auth.js` - Sistema de autenticação integrado

### Integração
- `dashboard.html` - Inclui módulo de segurança
- `index.html` - Inclui módulo de segurança
- `landing.js` - Sistema de login integrado

## Configurações

```javascript
const SECURITY_CONFIG = {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    CHECK_INTERVAL: 5000, // Verificar a cada 5 segundos
    MAX_LOGIN_ATTEMPTS: 3,
    BLOCK_DURATION: 15 * 60 * 1000, // 15 minutos de bloqueio
    SECURE_PAGES: ['dashboard.html', '/dashboard', 'dashboard'],
    LOGIN_PAGE: 'index.html'
};
```

## API do Módulo

### Funções Disponíveis
```javascript
window.ADLNSecurity = {
    isAuthenticated: () => boolean,
    isSessionValid: () => boolean,
    isBlocked: () => boolean,
    recordLoginAttempt: (success) => void,
    secureLogout: () => void,
    updateActivity: () => void,
    performCheck: () => boolean,
    startMonitoring: () => void,
    stopMonitoring: () => void
};
```

### Funções de Autenticação
```javascript
window.ADLNAuth = {
    isLoggedIn: () => boolean,
    logout: () => void,
    login: (username, password) => boolean,
    checkAuth: () => boolean
};
```

## Fluxo de Segurança

### 1. Acesso ao Dashboard
```
Usuário acessa dashboard.html
    ↓
Verificação de autenticação
    ↓
Se autenticado → Carrega dashboard
Se não autenticado → Redireciona para login
```

### 2. Monitoramento Contínuo
```
Dashboard carregado
    ↓
Inicia monitoramento de segurança
    ↓
Verifica a cada 5 segundos:
- Autenticação válida
- Sessão ativa
- Atividade recente
    ↓
Se qualquer verificação falhar → Logout automático
```

### 3. Sistema de Login
```
Usuário tenta login
    ↓
Validação de credenciais
    ↓
Se correto → Registra sucesso, inicia sessão
Se incorreto → Incrementa contador de tentativas
    ↓
Se 3 tentativas → Bloqueia por 15 minutos
```

## Interfaces Visuais

### Tela de Bloqueio
- Aparece quando usuário excede tentativas de login
- Mostra timer de bloqueio
- Design consistente com o tema da aplicação

### Indicadores de Segurança
- Indicador visual de segurança ativa
- Notificações de status
- Loading screens durante verificações

## Eventos Monitorados

### Atividade do Usuário
- `mousedown`, `mousemove`, `click`
- `keypress`, `scroll`, `touchstart`
- `focus`, `blur` (janela)

### Navegação
- `beforeunload` (antes de sair)
- `popstate` (botão voltar)
- Mudanças de URL

## Armazenamento Local

### Dados de Sessão
- `adln_usuario_atual` - Usuário logado
- `adln_session_start` - Início da sessão
- `adln_last_activity` - Última atividade

### Limpeza Automática
- Dados são limpos no logout
- Dados são limpos em sessão expirada
- Dados são limpos em redirecionamento

## Compatibilidade

### Navegadores Suportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Funcionalidades Requeridas
- localStorage
- addEventListener
- setInterval/clearInterval
- window.location API

## Troubleshooting

### Problemas Comuns

1. **Dashboard não carrega**
   - Verificar se usuário está logado
   - Verificar console para erros de segurança

2. **Logout automático frequente**
   - Verificar configuração de timeout
   - Verificar se há conflitos de JavaScript

3. **Bloqueio persistente**
   - Limpar localStorage
   - Aguardar tempo de bloqueio expirar

### Debug
```javascript
// Verificar status de segurança
console.log('Segurança:', window.ADLNSecurity.isAuthenticated());
console.log('Sessão válida:', window.ADLNSecurity.isSessionValid());
console.log('Bloqueado:', window.ADLNSecurity.isBlocked());
```

## Manutenção

### Atualizações
- Manter configurações de timeout adequadas
- Revisar lista de páginas protegidas
- Monitorar logs de segurança

### Backup
- Manter backup dos arquivos de segurança
- Documentar mudanças de configuração
- Testar após atualizações

## Segurança Adicional

### Recomendações
- Implementar HTTPS em produção
- Adicionar validação server-side
- Implementar rate limiting
- Usar tokens JWT para sessões

### Monitoramento
- Logs de tentativas de login
- Logs de acessos não autorizados
- Métricas de uso do sistema

---

**Desenvolvido por Nilson Brites**
**Versão**: 1.0
**Data**: 2024
