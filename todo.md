## Novo Backlog de Correções e Melhorias

### Sprint 1 — Análise aprofundada do código e identificação das causas raiz dos erros
- [x] Reanalisar `sistema.js` para entender a lógica de validação do campo Nome.
- [x] Investigar como a conta de teste está sendo persistida e carregada.
- [x] Mapear todas as referências à conta de teste no código.

### Sprint 2 — Remoção completa da conta de teste e ajuste da lógica de criação de novas contas
- [x] Remover a criação da conta de teste (`442.442.442-42`) do `sistema.js`.
- [x] Garantir que o `localStorage` não contenha dados da conta de teste.
- [x] Assegurar que novos cadastros criem contas únicas com saldo inicial de R$ 100.000,00.
- [x] Validar que o redirecionamento pós-cadastro leve para a conta recém-criada.

### Sprint 3 — Revisão e correção da validação do campo 'Nome' e e-mail
- [x] Corrigir a função `validarNome` para aceitar apenas letras (A-Z, a-z, acentos) e bloquear números/caracteres especiais, com mínimo de 3 letras.
- [x] Verificar novamente a validação de e-mail para garantir que aceite todas as extensões (`.com`, `.com.br`, etc.) e que a mensagem de erro seja clara.

### Sprint 4 — Padronização e correção das mensagens de erro em todo o sistema
- [x] Revisar todas as chamadas `mostrarMensagem` para garantir que as mensagens sejam claras, objetivas e consistentes.
- [x] Assegurar que as mensagens de erro sejam exibidas abaixo do campo correspondente, em estilo visual consistente.

### Sprint 5 — Testes abrangentes em ambiente de navegador privado e deploy das correções
- [x] Realizar testes completos em um navegador privado para simular um ambiente limpo.
- [x] Testar todas as validações de campos (nome, CPF, e-mail) no cadastro.
- [x] Testar o sistema de login com usuários inexistentes e existentes.
- [x] Verificar se os dados em "Minha Conta" correspondem ao usuário logado.
- [x] Confirmar que a conta de teste foi completamente removida.
- [x] Fazer commit e push das correções finais para o repositório.