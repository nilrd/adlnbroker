## Sprint 1 — Validações e Mensagens de Erro

- [ ] Campo Nome:
  - [ ] Bloquear entrada de números imediatamente
  - [ ] Permitir apenas letras, espaços e acentos
  - [ ] Exigir mínimo de 3 letras
  - [ ] Botão de cadastro desativado se nome for inválido (NÃO IMPLEMENTAR, MANTER LÓGICA EXISTENTE)
  - [ ] Mensagem clara: 'O nome deve conter apenas letras e no mínimo 3 caracteres.'
- [ ] Campo E-mail:
  - [ ] Validar formato usuario@dominio.extensão
  - [ ] Mensagem clara: 'Digite um e-mail válido no formato usuario@dominio.com'
- [ ] Campo CPF:
  - [ ] Substituir alert() por mensagem abaixo do campo
  - [ ] Usar máscara 000.000.000-00 (JÁ EXISTENTE)
  - [ ] Mensagem: 'CPF inválido. Digite novamente no formato 000.000.000-00.'
- [ ] Mensagens de Erro Gerais:
  - [ ] Padronizar mensagens para todos os campos
  - [ ] Não recarregar página ou usar pop-ups para erros

## Sprint 2 — Lógica de Criação e Redirecionamento de Contas

- [ ] Criar nova conta para cada cadastro
- [ ] Saldo inicial R$ 100.000,00
- [ ] Exibir dados do usuário logado no Dashboard e Minha Conta
- [ ] Permitir login com CPF: 442.442.442-42, Senha: Teste1234

## Sprint 3 — Melhorias no Login

- [ ] Mensagens de erro em alert() (JÁ CORRIGIDO, VERIFICAR MENSAGENS)
  - [ ] Substituir por mensagens em vermelho abaixo do campo
  - [ ] Mensagem login incorreto: 'CPF ou senha incorretos. Tente novamente.'
  - [ ] Mensagem usuário não encontrado: 'Usuário não encontrado. Cadastre-se para continuar.'
- [ ] Pop-up de boas-vindas (JÁ CORRIGIDO)
  - [ ] Desativar após login ou redirecionar para dashboard

## Sprint 4 — Garantia de Cobertura

- [ ] Verificar todos os formulários
- [ ] Padronizar mensagens inline
- [ ] Testar em desktop e mobile (modo desktop no Chrome Android)


