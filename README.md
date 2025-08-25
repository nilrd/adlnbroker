# ADLN Broker - Sistema de Home Broker Simulado

## 📋 Descrição

Sistema de home broker simulado desenvolvido em HTML, CSS e JavaScript puro. Permite aos usuários realizar operações simuladas de compra e venda de ativos com base em cotações dinâmicas.

## 🚀 Funcionalidades

- **Autenticação**: Login com CPF e senha
- **Dashboard**: Interface completa de trading
- **Cotações em Tempo Real**: Atualização automática a cada 10 segundos
- **Boleta de Ordens**: Compra e venda de ativos
- **Carteira**: Acompanhamento de posições
- **Extrato**: Histórico de operações
- **Gráficos**: Visualização de candles
- **Responsivo**: Interface adaptada para mobile

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js (para gráficos)
- XLSX.js (para exportação)

## 📁 Estrutura do Projeto

```
adlnbroker-1/
├── index.html              # Página principal
├── dashboard.html          # Dashboard do sistema
├── 404.html               # Página de erro
├── README.md              # Documentação do projeto
├── REGRAS_NEGOCIO.md      # Regras de negócio completas
├── style.css              # Estilos gerais
├── landing.css            # Estilos da landing page
├── dashboard.css          # Estilos do dashboard
├── trade-modal.css        # Modal de trading
├── market-info.css        # Informações de mercado
├── menu.css               # Menu de navegação
├── mobile-fixes.css       # Correções mobile
├── wallet-modal.css       # Modal da carteira
├── sistema.js             # Sistema principal
├── landing.js             # Funcionalidades da landing page
├── new-chart.js           # Gráficos
├── auth.js                # Autenticação
├── cpf-validation.js      # Validação de CPF
├── mobile-enhancements.js # Melhorias mobile
├── market-info.js         # Informações de mercado
├── menu.js                # Funcionalidades do menu
├── favicon.png            # Ícone do site
├── logo.png               # Logo principal
└── .nojekyll              # Configuração GitHub Pages
```

## 👥 Equipe de Desenvolvimento

### Desenvolvedores
- **Nilson Brites** - [nilson.brites@gmail.com](mailto:nilson.brites@gmail.com)
- **Daniel Felix** - [danfelix147@gmail.com](mailto:danfelix147@gmail.com)
- **Lary Paula Rocha** - [larypaula.rocha@gmail.com](mailto:larypaula.rocha@gmail.com)
- **André Santos Pereira** - [asantospereira0@gmail.com](mailto:asantospereira0@gmail.com)

## 🎯 Usuários de Teste

### Usuário 1
- **CPF**: 123.456.789-00
- **Senha**: 123456
- **Nome**: João Silva

### Usuário 2
- **CPF**: 987.654.321-00
- **Senha**: 654321
- **Nome**: Maria Santos

## 📊 Regras de Negócio

Para informações detalhadas sobre todas as regras de negócio do sistema, consulte o documento completo:

**[📄 REGRAS_NEGOCIO.md](REGRAS_NEGOCIO.md)** - Documento completo com todas as regras de negócio (RN-000 a RN-013)

### Resumo das Principais Regras:

#### Cotação de Ativos
- Atualização automática a cada 10 segundos
- Variação de R$0,01 por ciclo
- Preços simulados para demonstração

#### Boleta de Ordens
- **Executada**: Valor igual à cotação atual
- **Aceita (pendente)**: Diferença ≤ R$5 da cotação
- **Rejeitada**: Diferença > R$5 da cotação

#### Quantidades
- Mínimo: 100 unidades (1 lote)
- Múltiplos de 100 obrigatórios

#### Horário de Funcionamento
- Mercado aberto: Segunda a Sexta, das 10h00 às 18h00
- Fora do horário: Ordens rejeitadas automaticamente

## 🚀 Como Executar

1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador
3. Use os dados de teste para fazer login
4. Explore as funcionalidades do sistema

## 📱 Compatibilidade

- Chrome (recomendado)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🔧 Configurações

### GitHub Pages
O projeto está configurado para deploy automático no GitHub Pages através do arquivo `.nojekyll`.

### Deploy
- Push para a branch `main` ativa o deploy automático
- O site fica disponível em: `https://[username].github.io/[repository-name]`

## 📄 Licença

Este projeto é de uso interno e educacional.

---

**Desenvolvido pela Equipe ADLN Broker**  
*Sistema de Home Broker Simulado v1.0*
