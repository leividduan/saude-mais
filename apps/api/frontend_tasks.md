# Tarefas para o Frontend

Com base nos controladores da API, aqui está uma sugestão de tarefas para a criação das telas do seu frontend:

- **Telas de Autenticação**
  - [ ] **Tela de Login (SignIn):**
    - Formulário com campos para `email` e `password`.
    - Botão "Entrar" que, em caso de sucesso, redireciona o usuário para a página principal (paciente ou médico) ou para o painel de admin.
    - Link para a tela de cadastro.
  - [ ] **Tela de Cadastro (SignUp):**
    - Formulário com campos para `name`, `email` e `password`.
    - Botão "Cadastrar" que, após o sucesso, redireciona o usuário para a tela de login.

- **Painel do Administrador**
  - [ ] **Dashboard Principal (Admin):**
    - Menu de navegação para as seções: Médicos, Pacientes, Convênios e Relatórios.
  - [ ] **Gerenciamento de Médicos (Admin):**
    - **Listagem:** Tabela exibindo `nome`, `email`, `CRM` e `especialidade` dos médicos.
    - **Ações:** Botões para `adicionar`, `editar` e `excluir` um médico.
    - **Criação/Edição:** Modal ou página com formulário para preencher/atualizar `CRM`, `especialidade` e associar a um usuário existente.
  - [ ] **Gerenciamento de Pacientes (Admin):**
    - **Listagem:** Tabela exibindo `nome`, `email`, `CPF`, `telefone` e `convênio`.
    - **Ações:** Botões para `adicionar`, `editar` e `excluir` um paciente.
    - **Criação/Edição:** Modal ou página com formulário para preencher/atualizar `CPF`, `telefone`, associar a um usuário e selecionar um `convênio`.
  - [ ] **Gerenciamento de Convênios (Admin):**
    - **Listagem:** Tabela exibindo o `nome` dos convênios.
    - **Ações:** Botões para `adicionar`, `editar` e `excluir` um convênio.
    - **Criação/Edição:** Modal ou página com formulário para preencher/atualizar o `nome` do convênio.
  - [ ] **Relatórios (Admin):**
    - Página com um formulário para gerar o relatório de consultas por convênio.
    - **Filtros:** Seleção de `convênio`, e campos opcionais para `data de início` e `data de fim`.
    - Botão "Gerar PDF" para baixar o relatório.

- **Portal do Paciente**
  - [ ] **Agendamento de Consulta:**
    - Um formulário ou um fluxo passo a passo para agendar uma nova consulta.
    - Seleção de `médico` (com base na especialidade) e escolha de `data` e `horário` disponíveis.
    - Botão "Confirmar Agendamento".
  - [ ] **Minhas Consultas (Paciente):**
    - Listagem das consultas agendadas (futuras e passadas).
    - Exibição de `médico`, `especialidade`, `data`, `hora` e `status` da consulta.
    - Botão para `cancelar` uma consulta futura.

- **Portal do Médico**
  - [ ] **Minha Agenda (Médico):**
    - Visualização da agenda do dia/semana.
    - Listagem das consultas com `nome do paciente`, `horário` e `status`.
  - [ ] **Bloqueio de Agenda (Médico):**
    - Formulário para definir um período de bloqueio na agenda.
    - Campos para `data de início`, `data de fim` e `motivo` (opcional).
