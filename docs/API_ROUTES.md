# Documentação das Rotas da API - Clínica Saúde+

Este documento detalha todos os endpoints da API, baseando-se nos Requisitos Funcionais (RF) definidos no `PRD.md` e na estrutura dos schemas do Prisma.

---

## Autenticação

Rotas públicas para registro e login de usuários.

### 1. Registrar Novo Usuário (Paciente)

- **Método:** `POST`
- **Endpoint:** `/auth/signup`
- **Descrição:** Cria um novo usuário no sistema (inicialmente com perfil de paciente).
- **Controlador:** `SignUpController.ts`
- **Autenticação:** Pública.
- **Corpo da Requisição:**

  ```json
  {
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "password": "senha_min_8_caracteres"
  }
  ```

- **Resposta de Sucesso (201 Created):**

  ```json
  {
    "id": "uuid-do-usuario-criado"
  }
  ```

### 2. Realizar Login

- **Método:** `POST`
- **Endpoint:** `/auth/signin`
- **Descrição:** Autentica um usuário e retorna um token de acesso JWT. (RF01)
- **Controlador:** `SignInController.ts`
- **Autenticação:** Pública.
- **Corpo da Requisição:**

  ```json
  {
    "email": "usuario@email.com",
    "password": "senha_do_usuario"
  }
  ```

- **Resposta de Sucesso (201 Created):**

  ```json
  {
    "accessToken": "jwt.token.aqui"
  }
  ```

---

## Módulo do Paciente

Endpoints para o gerenciamento de consultas pelo paciente.

### 3. Agendar Consulta

- **Método:** `POST`
- **Endpoint:** `/appointments`
- **Descrição:** Permite ao paciente agendar uma nova consulta. (RF02)
- **Autenticação:** Privada (Paciente).
- **Corpo da Requisição:**

  ```json
  {
    "doctorId": "uuid-do-medico",
    "startTime": "2025-12-10T14:00:00.000Z",
    "endTime": "2025-12-10T15:00:00.000Z"
  }
  ```

- **Resposta de Sucesso (201 Created):**

  ```json
  {
    "id": "uuid-da-consulta",
    "status": "SCHEDULED",
    "startTime": "2025-12-10T14:00:00.000Z",
    "doctorId": "uuid-do-medico",
    "patientId": "uuid-do-paciente-logado"
  }
  ```

### 4. Cancelar Consulta

- **Método:** `PATCH`
- **Endpoint:** `/appointments/{id}/cancel`
- **Descrição:** Permite ao paciente cancelar uma de suas consultas agendadas. (RF03)
- **Autenticação:** Privada (Paciente).
- **Resposta de Sucesso (204 No Content):**

### 5. Listar Minhas Consultas

- **Método:** `GET`
- **Endpoint:** `/patients/me/appointments`
- **Descrição:** Retorna o histórico de consultas do paciente logado. (RF04)
- **Autenticação:** Privada (Paciente).
- **Resposta de Sucesso (200 OK):**

  ```json
  [
    {
      "id": "uuid-da-consulta",
      "startTime": "2025-12-10T14:00:00.000Z",
      "status": "SCHEDULED",
      "doctor": {
        "name": "Dr. Carlos",
        "specialty": "Cardiologia"
      }
    }
  ]
  ```

---

## Módulo do Médico

Endpoints para a gestão da agenda do médico.

### 6. Visualizar Agenda do Médico

- **Método:** `GET`
- **Endpoint:** `/doctors/me/agenda`
- **Descrição:** Retorna a lista de consultas agendadas para o médico logado. (RF05)
- **Autenticação:** Privada (Médico).
- **Resposta de Sucesso (200 OK):**

  ```json
  [
    {
      "id": "uuid-da-consulta",
      "startTime": "2025-12-10T14:00:00.000Z",
      "status": "SCHEDULED",
      "patient": {
        "name": "Paulo"
      }
    }
  ]
  ```

### 7. Bloquear Horários na Agenda

- **Método:** `POST`
- **Endpoint:** `/doctors/me/schedule-blocks`
- **Descrição:** Permite ao médico bloquear um período em sua agenda. (RF06)
- **Autenticação:** Privada (Médico).
- **Corpo da Requisição:**

  ```json
  {
    "startTime": "2026-01-15T09:00:00.000Z",
    "endTime": "2026-01-20T18:00:00.000Z",
    "reason": "Férias"
  }
  ```

- **Resposta de Sucesso (201 Created):**

  ```json
  {
    "id": "uuid-do-bloqueio",
    "startTime": "2026-01-15T09:00:00.000Z",
    "endTime": "2026-01-20T18:00:00.000Z",
    "reason": "Férias"
  }
  ```

---

## Módulo Administrativo

Endpoints para a gestão completa do sistema pelo administrador.

### 8. Gestão de Pacientes (CRUD)

- **Descrição:** Operações de Cadastro, Leitura, Atualização e Deleção de pacientes. (RF07)
- **Autenticação:** Privada (Admin).
- **Endpoints:**
  - `GET /patients` - Lista todos os pacientes.
  - `POST /admin/patients` - Cria um novo paciente.
    - **Corpo:** `{ "userId": "uuid-do-user", "cpf": "123.456.789-00", "phone": "47999998888", "healthInsuranceId": "uuid-do-convenio" }`
  - `PUT /admin/patients/{id}` - Atualiza um paciente.
  - `DELETE /admin/patients/{id}` - Remove um paciente.

### 9. Gestão de Médicos (CRUD)

- **Descrição:** Operações de Cadastro, Leitura, Atualização e Deleção de médicos. (RF08)
- **Autenticação:** Privada (Admin).
- **Endpoints:**
  - `GET /admin/doctors` - Lista todos os médicos.
  - `POST /admin/doctors` - Cria um novo perfil de médico para um usuário existente.
    - **Corpo:** `{ "userId": "uuid-do-user", "crm": "12345-SC", "specialty": "Ortopedia" }`
  - `PUT /admin/doctors/{id}` - Atualiza um médico.
  - `DELETE /admin/doctors/{id}` - Remove um médico.

### 10. Gestão de Convênios (CRUD)

- **Descrição:** Operações de Cadastro, Leitura, Atualização e Deleção de convênios. (RF09)
- **Autenticação:** Privada (Admin).
- **Endpoints:**
  - `GET /admin/health-insurances` - Lista todos os convênios.
  - `POST /admin/health-insurances` - Cria um novo convênio.
    - **Corpo:** `{ "name": "Unimed" }`
  - `PUT /admin/health-insurances/{id}` - Atualiza um convênio.
  - `DELETE /admin/health-insurances/{id}` - Remove um convênio.

### 11. Relatório de Consultas por Convênio

- **Método:** `GET`
- **Endpoint:** `/admin/reports/appointments-by-insurance`
- **Descrição:** Gera um relatório de consultas, filtrado por convênio. (RF10)
- **Autênticação:** Privada (Admin).
- **Query Params:**
  - `healthInsuranceId` (uuid, obrigatório)
  - `startDate` (date, opcional)
  - `endDate` (date, opcional)
- **Resposta de Sucesso (200 OK):**
  - O corpo da resposta conterá o arquivo PDF gerado.
  - Headers: `Content-Type: application/pdf`
