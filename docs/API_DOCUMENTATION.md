# Documentação da API

Esta é a documentação para os endpoints da API.

## Rotas de Autenticação

Arquivo: `apps/api/src/routes/auth.ts`

Controla o registro e o login de usuários.

-   **POST /auth/signup**
    -   **Descrição:** Registra um novo usuário.
    -   **Controller:** `SignUpController.handler`
    -   **Body:** `name`, `email`, `password`
    -   **Resposta de Sucesso (201):** `{ id: string }`
    -   **Respostas de Erro:**
        -   `409`: Se o e-mail já estiver em uso.

-   **POST /auth/signin**
    -   **Descrição:** Autentica um usuário e retorna um token de acesso.
    -   **Controller:** `SignInController.handler`
    -   **Body:** `email`, `password`
    -   **Resposta de Sucesso (201):** `{ accessToken: string }`
    -   **Respostas de Erro:**
        -   `401`: Credenciais inválidas.

## Rotas de Agendamento (Privada)

Arquivo: `apps/api/src/routes/appointment.ts`

Requer autenticação. Gerencia a criação e o cancelamento de consultas.

-   **POST /appointments**
    -   **Descrição:** Cria uma nova consulta para o paciente autenticado.
    -   **Controller:** `CreateAppointmentController.handler`
    -   **Body:** `doctorId`, `startTime`, `endTime`
    -   **Resposta de Sucesso (201):** `{ id, status, startTime, doctorId, patientId }`
    -   **Respostas de Erro:**
        -   `404`: Médico não encontrado.
        -   `409`: Conflito de horário com outra consulta ou bloqueio de agenda.

-   **PATCH /appointments/:id/cancel**
    -   **Descrição:** Cancela uma consulta existente para o paciente autenticado.
    -   **Controller:** `CancelAppointmentController.handler`
    -   **Parâmetros de URL:** `id` (UUID da consulta)
    -   **Resposta de Sucesso (204):** Sem conteúdo.
    -   **Respostas de Erro:**
        -   `404`: Consulta não encontrada.
        -   `409`: A consulta já está cancelada.

## Rotas do Paciente (Privada)

Arquivo: `apps/api/src/routes/patient.ts`

Requer autenticação. Fornece informações sobre o paciente autenticado.

-   **GET /patients/me/appointments**
    -   **Descrição:** Lista todas as consultas do paciente autenticado.
    -   **Controller:** `ListPatientAppointmentsController.handler`
    -   **Resposta de Sucesso (200):** Lista de consultas com detalhes do médico.

## Rotas do Médico (Privada)

Arquivo: `apps/api/src/routes/doctor.ts`

Requer autenticação. Fornece funcionalidades para o médico autenticado.

-   **GET /doctors/me/agenda**
    -   **Descrição:** Retorna a agenda do médico autenticado, incluindo consultas agendadas.
    -   **Controller:** `GetDoctorAgendaController.handler`
    -   **Resposta de Sucesso (200):** Lista de agendamentos com detalhes do paciente.

-   **POST /doctors/me/schedule-blocks**
    -   **Descrição:** Cria um bloqueio na agenda do médico autenticado.
    -   **Controller:** `BlockScheduleController.handler`
    -   **Body:** `startTime`, `endTime`, `reason` (opcional)
    -   **Resposta de Sucesso (201):** O objeto de bloqueio de agenda criado.

## Rotas de Administração (Privada, Somente Admin)

Arquivo: `apps/api/src/routes/admin.ts`

Requer autenticação e privilégios de administrador. Gerencia pacientes, médicos, convênios e relatórios.

### CRUD de Pacientes

-   **GET /admin/patients**
    -   **Descrição:** Lista todos os pacientes cadastrados.
    -   **Controller:** `ListPatientsController.handler`

-   **POST /admin/patients**
    -   **Descrição:** Cria um novo perfil de paciente para um usuário existente.
    -   **Controller:** `CreatePatientController.handler`
    -   **Body:** `userId`, `cpf`, `phone` (opcional), `healthInsuranceId` (opcional)

-   **PUT /admin/patients/:id**
    -   **Descrição:** Atualiza os dados de um paciente.
    -   **Controller:** `UpdatePatientController.handler`
    -   **Parâmetros de URL:** `id` (UUID do usuário)
    -   **Body:** `cpf` (opcional), `phone` (opcional), `healthInsuranceId` (opcional, pode ser nulo)

-   **DELETE /admin/patients/:id**
    -   **Descrição:** Remove o perfil de paciente de um usuário.
    -   **Controller:** `DeletePatientController.handler`
    -   **Parâmetros de URL:** `id` (UUID do usuário)

### CRUD de Médicos

-   **GET /admin/doctors**
    -   **Descrição:** Lista todos os médicos cadastrados.
    -   **Controller:** `ListDoctorsController.handler`

-   **POST /admin/doctors**
    -   **Descrição:** Cria um novo perfil de médico para um usuário existente e atribui a role `DOCTOR`.
    -   **Controller:** `CreateDoctorController.handler`
    -   **Body:** `userId`, `crm`, `specialty`

-   **PUT /admin/doctors/:id**
    -   **Descrição:** Atualiza os dados de um médico.
    -   **Controller:** `UpdateDoctorController.handler`
    -   **Parâmetros de URL:** `id` (UUID do usuário)
    -   **Body:** `crm` (opcional), `specialty` (opcional)

-   **DELETE /admin/doctors/:id**
    -   **Descrição:** Remove o perfil de médico e reverte a role do usuário para `PATIENT`.
    -   **Controller:** `DeleteDoctorController.handler`
    -   **Parâmetros de URL:** `id` (UUID do usuário)

### CRUD de Convênios

-   **GET /admin/health-insurances**
    -   **Descrição:** Lista todos os convênios.
    -   **Controller:** `ListHealthInsurancesController.handler`

-   **POST /admin/health-insurances**
    -   **Descrição:** Cria um novo convênio.
    -   **Controller:** `CreateHealthInsuranceController.handler`
    -   **Body:** `name`

-   **PUT /admin/health-insurances/:id**
    -   **Descrição:** Atualiza o nome de um convênio.
    -   **Controller:** `UpdateHealthInsuranceController.handler`
    -   **Parâmetros de URL:** `id` (UUID do convênio)
    -   **Body:** `name` (opcional)

-   **DELETE /admin/health-insurances/:id**
    -   **Descrição:** Deleta um convênio.
    -   **Controller:** `DeleteHealthInsuranceController.handler`
    -   **Parâmetros de URL:** `id` (UUID do convênio)

### Relatórios

-   **GET /admin/reports/appointments-by-insurance**
    -   **Descrição:** Gera um relatório em PDF das consultas por convênio.
    -   **Controller:** `AppointmentsByInsuranceController.handler`
    -   **Query Params:** `healthInsuranceId` (UUID), `startDate` (ISO Datetime opcional), `endDate` (ISO Datetime opcional)
    -   **Resposta de Sucesso (200):** Arquivo PDF.
