# ADLN Broker - Plataforma de Investimentos Simulada

<div align="center">

![ADLN Broker Logo](./favicon.png)

**Plataforma de Investimentos para Testes e Desenvolvimento**

[![Status](https://img.shields.io/badge/status-ativo-brightgreen.svg)](https://github.com/nilrd/adlnbroker)
[![Versão](https://img.shields.io/badge/versão-2.0-blue.svg)](https://github.com/nilrd/adlnbroker)
[![Licença](https://img.shields.io/badge/licença-MIT-green.svg)](LICENSE)
[![Tecnologias](https://img.shields.io/badge/tecnologias-HTML%20%7C%20CSS%20%7C%20JavaScript-orange.svg)](https://github.com/nilrd/adlnbroker)

[**🌐 Acessar Plataforma**](https://nilrd.github.io/adlnbroker/) | [**📖 Documentação**](./DOCUMENTACAO_SISTEMA.md) | [**🔒 Segurança**](./MELHORIAS_SEGURANCA.md)

</div>

---

## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🛡️ Sistema de Segurança](#️-sistema-de-segurança)
- [🚀 Como Usar](#-como-usar)
- [⚙️ Configuração Local](#️-configuração-local)
- [🧪 Guia de Testes](#-guia-de-testes)
- [🏗️ Arquitetura](#️-arquitetura)
- [👥 Squad de Desenvolvimento](#-squad-de-desenvolvimento)
- [📝 Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **ADLN Broker** é uma plataforma de investimentos simulada desenvolvida durante as aulas da **E2E Treinamentos**. O projeto serve como um ambiente controlado para testes de software, simulando funcionalidades essenciais de um Home Broker real.

### 🎯 Objetivos

- ✅ **Ambiente de Testes**: Plataforma ideal para práticas de QA e testes automatizados
- ✅ **Simulação Realista**: Funcionalidades que replicam um broker real
- ✅ **Aprendizado**: Ferramenta educacional para estudantes de tecnologia
- ✅ **Desenvolvimento**: Base para implementação de novas funcionalidades

### 🎨 Design

O projeto apresenta um design moderno inspirado no universo financeiro:
- **Paleta de Cores**: Tons escuros com detalhes em dourado
- **Interface Responsiva**: Adaptável a diferentes dispositivos
- **UX Otimizada**: Navegação intuitiva e feedback visual claro

---

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- **Cadastro de Usuários**: Validação completa de dados (CPF, email, senha)
- **Login Seguro**: Sistema de autenticação com proteção contra ataques
- **Sessão Persistente**: Manutenção do estado de login
- **Logout Seguro**: Bloqueio do botão voltar e limpeza de dados

### 📊 Dashboard Principal
- **Visão Geral**: Saldo, carteira e book de ofertas
- **Book de Ofertas**: Ativos com preços em tempo real (simulado)
- **Carteira de Investimentos**: Gerenciamento de ativos
- **Extrato de Operações**: Histórico completo de transações

### 💰 Operações de Trading
- **Boleta de Compra/Venda**: Interface para envio de ordens
- **Validação de Regras**: Quantidades múltiplas de 100, preços mínimos/máximos
- **Book de Ordens**: Acompanhamento do status das ordens
- **Cálculo Automático**: Totais e comissões calculados em tempo real

### 📈 Ativos Disponíveis
- **Ações**: PETR4, VALE3, ITUB4, BBDC4, ABEV3, MGLU3, BBAS3, LREN3
- **Preços Simulados**: Variações realistas em tempo real
- **Dados Históricos**: Simulação de movimentação de mercado

### 🔧 Funcionalidades Adicionais
- **Alteração de Senha**: Atualização segura de credenciais
- **Exportação de Dados**: Relatórios em JSON e XLSX
- **Responsividade**: Interface adaptável para mobile e desktop

---

## 🛡️ Sistema de Segurança

### 🔒 Módulo de Segurança Avançado
O ADLN Broker implementa um sistema robusto de segurança:

#### **Proteções Implementadas**
- ✅ **Bloqueio do Botão Voltar**: Impede navegação após logout
- ✅ **Persistência de Logout**: Mantém estado de logout entre sessões
- ✅ **Verificação Contínua**: Monitoramento em tempo real
- ✅ **Limitação de Tentativas**: Bloqueio após múltiplas tentativas de login
- ✅ **Timeout de Sessão**: Logout automático por inatividade

#### **Configurações de Segurança**
```javascript
SESSION_TIMEOUT: 30 minutos
CHECK_INTERVAL: 5 segundos
MAX_LOGIN_ATTEMPTS: 3 tentativas
BLOCK_DURATION: 15 minutos de bloqueio
```

#### **Arquivos de Segurança**
- `security.js` - Módulo principal de segurança
- `auth.js` - Sistema de autenticação
- `security.css` - Estilos para interfaces de segurança
- `MELHORIAS_SEGURANCA.md` - Documentação completa

---

## 🚀 Como Usar

### 🌐 Acesso Online
Acesse diretamente: **[ADLN Broker](https://nilrd.github.io/adlnbroker/)**

### 📱 Primeiros Passos
1. **Cadastro**: Clique em "Abra sua Conta" e preencha os dados
2. **Login**: Use suas credenciais para acessar o dashboard
3. **Explorar**: Navegue pelas funcionalidades disponíveis
4. **Operar**: Realize compras e vendas de ativos

### 💡 Dicas de Uso
- **Saldo Inicial**: R$ 100.000,00 para novos usuários
- **Quantidades**: Múltiplas de 100 (1 lote = 100 ações)
- **Horário**: Operações simuladas em horário comercial
- **Dados**: Persistidos no localStorage do navegador

---

## ⚙️ Configuração Local

### 📋 Pré-requisitos
- Git instalado
- Navegador web moderno
- Python 3.x (opcional, para servidor local)

### 🔧 Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/nilrd/adlnbroker.git

# 2. Navegar para o diretório
cd adlnbroker

# 3. Executar servidor local (opcional)
python -m http.server 8000
```

### 🌐 Acesso Local
- **Direto**: Abra `index.html` no navegador
- **Servidor**: Acesse `http://localhost:8000`

---

## 🧪 Guia de Testes

### 🎯 Cenários de Teste Principais

#### **1. Testes de Autenticação**
```bash
✅ Cadastro com dados válidos
✅ Cadastro com CPF duplicado
✅ Login com credenciais corretas
✅ Login com senha incorreta
✅ Logout e verificação de segurança
```

#### **2. Testes de Trading**
```bash
✅ Compra com saldo suficiente
✅ Compra com saldo insuficiente
✅ Venda de ativos disponíveis
✅ Validação de quantidades (múltiplos de 100)
✅ Verificação de preços mínimos/máximos
```

#### **3. Testes de Segurança**
```bash
✅ Bloqueio após múltiplas tentativas
✅ Timeout de sessão por inatividade
✅ Bloqueio do botão voltar após logout
✅ Persistência de logout entre sessões
✅ Acesso direto ao dashboard sem login
```

### 🛠️ Ferramentas de Teste

#### **Console do Navegador**
```javascript
// Verificar estado de segurança
console.log(window.ADLNSecurity);

// Verificar autenticação
console.log(window.ADLNAuth);

// Executar testes automatizados
window.ADLNSecurityTest.runAllTests();
```

#### **Manipulação de Dados**
```javascript
// Limpar dados de teste
localStorage.clear();

// Verificar dados do usuário
console.log(JSON.parse(localStorage.getItem('adln_usuarios')));
```

### 📊 Dados de Teste

| Campo | Valor |
|-------|-------|
| **Saldo Inicial** | R$ 100.000,00 |
| **Quantidade Mínima** | 100 ações |
| **Timeout de Sessão** | 30 minutos |
| **Tentativas de Login** | 3 tentativas |
| **Duração do Bloqueio** | 15 minutos |

---

## 🏗️ Arquitetura

### 📁 Estrutura de Arquivos
```
adlnbroker/
├── 📄 index.html              # Página principal
├── 📄 dashboard.html          # Dashboard do usuário
├── 🎨 landing.css             # Estilos da página inicial
├── 🎨 dashboard.css           # Estilos do dashboard
├── 🎨 menu.css               # Estilos do menu
├── 🎨 trade-modal.css        # Estilos do modal de trading
├── 🎨 security.css           # Estilos de segurança
├── ⚙️ landing.js             # Lógica da página inicial
├── ⚙️ sistema.js             # Lógica principal do sistema
├── ⚙️ menu.js                # Lógica do menu
├── ⚙️ new-chart.js           # Gráficos e visualizações
├── 🛡️ security.js            # Módulo de segurança
├── 🔐 auth.js                # Sistema de autenticação
├── 📊 security-test-enhanced.js # Testes de segurança
├── 📚 DOCUMENTACAO_SISTEMA.md   # Documentação técnica
├── 🛡️ MELHORIAS_SEGURANCA.md   # Documentação de segurança
└── 🖼️ favicon.png            # Logo do projeto
```

### 🔧 Tecnologias Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Armazenamento**: localStorage
- **Segurança**: Módulo customizado de autenticação
- **Design**: CSS Grid, Flexbox, Responsive Design
- **Testes**: Framework de testes customizado

### 🔄 Fluxo de Dados
```
Usuário → Autenticação → Dashboard → Operações → Armazenamento
   ↓           ↓           ↓           ↓           ↓
Interface → Segurança → Sistema → Validação → localStorage
```

---

## 👥 Squad de Desenvolvimento

### 🚀 Equipe Principal
| Nome | Função | Contato |
|------|--------|---------|
| **Alan** | Desenvolvedor | - |
| **Daniel Felix** | Desenvolvedor | danfelix147@gmail.com |
| **Larissa** | Desenvolvedora | - |
| **Nilson Brites** | Desenvolvedor | nilson.brites@adln.com |

### 🎓 Instituição
**E2E Treinamentos** - Formação em Desenvolvimento e Testes de Software

---

## 📝 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2024 ADLN Broker Squad

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 📋 Padrões de Contribuição
- ✅ Código limpo e bem documentado
- ✅ Testes para novas funcionalidades
- ✅ Documentação atualizada
- ✅ Seguindo padrões de segurança

---

## 📞 Contato

### 📧 Email
- **Daniel Felix**: danfelix147@gmail.com
- **Nilson Brites**: nilson.brites@adln.com

### 🌐 Links Úteis
- **Plataforma**: [https://nilrd.github.io/adlnbroker/](https://nilrd.github.io/adlnbroker/)
- **Repositório**: [https://github.com/nilrd/adlnbroker](https://github.com/nilrd/adlnbroker)
- **Documentação**: [DOCUMENTACAO_SISTEMA.md](./DOCUMENTACAO_SISTEMA.md)

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

*Desenvolvido com ❤️ pela Squad ADLN Broker*

</div>


