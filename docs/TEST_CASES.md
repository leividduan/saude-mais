# Cenários de Teste - API Clínica Saúde+

Este documento descreve os casos de teste para a API do sistema "Clínica Saúde+", com base nos requisitos funcionais (PRD.md) e na documentação das rotas (API_ROUTES.md).

---

## Atores (Personas)

*   **Ana (Administradora):** Responsável pela gestão do sistema.
*   **Dr. Carlos (Médico):** Profissional de saúde que utiliza o sistema para gerenciar sua agenda.
*   **Paulo (Paciente):** Usuário final que agenda e gerencia suas consultas.
*   **Usuário Não Autenticado:** Qualquer usuário sem um token de acesso válido.

---

## Módulo de Autenticação

Testes focados no registro e login de usuários.

### 1. `POST /auth/signup` - Registrar Novo Usuário

| Nº | Cenário | Ator | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **AUT-01** | **Sucesso:** Registro de novo paciente | Usuário Não Autenticado | 1. Enviar requisição com `name`, `email` (único) e `password` (válido). | **201 Created** com `{ "id": "..." }`. |
| **AUT-02** | **Falha:** Email já cadastrado | Usuário Não Autenticado | 1. Enviar requisição com um `email` que já existe no sistema. | **409 Conflict** com mensagem de erro apropriada. |
| **AUT-03** | **Falha:** Dados de entrada ausentes ou inválidos | Usuário Não Autenticado | 1. Enviar requisição sem `email` ou com `password` menor que 8 caracteres. | **400 Bad Request** com detalhes da validação. |
| **AUT-03.1** | **Falha:** Formato de email inválido | Usuário Não Autenticado | 1. Enviar requisição com um `email` sem o formato correto (ex: "usuario@.com"). | **400 Bad Request** com mensagem sobre o campo `email`. |
| **AUT-03.2** | **Falha:** Corpo da requisição vazio | Usuário Não Autenticado | 1. Enviar a requisição com um corpo JSON vazio `{}`. | **400 Bad Request** com erros de validação para campos obrigatórios. |


### 2. `POST /auth/signin` - Realizar Login

| Nº | Cenário | Ator | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **AUT-04** | **Sucesso:** Login com credenciais válidas | Paulo (Paciente) | 1. Enviar `email` e `password` corretos. | **201 Created** com `{ "accessToken": "jwt.token.aqui" }`. |
| **AUT-05** | **Falha:** Senha incorreta | Paulo (Paciente) | 1. Enviar `email` correto e `password` incorreto. | **401 Unauthorized** com mensagem de erro. |
| **AUT-06** | **Falha:** Email não cadastrado | Usuário Não Autenticado | 1. Enviar `email` de um usuário que não existe. | **401 Unauthorized** ou **404 Not Found**. |
| **AUT-06.1** | **Falha:** Corpo da requisição vazio | Usuário Não Autenticado | 1. Enviar a requisição com um corpo JSON vazio `{}`. | **400 Bad Request** com erros de validação. |

---

## Módulo do Paciente

Testes para as funcionalidades disponíveis ao paciente logado.

### 3. `POST /appointments` - Agendar Consulta

| Nº | Cenário | Ator | Pré-condições | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PAC-01** | **Sucesso:** Agendar nova consulta | Paulo | Estar logado como paciente. Médico e horário disponíveis. | 1. Enviar `doctorId` e `startTime`/`endTime` válidos. | **201 Created** com os dados da consulta. |
| **PAC-02** | **Falha:** Horário indisponível (conflito com outra consulta) | Paulo | Estar logado. O horário solicitado já está ocupado. | 1. Tentar agendar no mesmo horário de outra consulta. | **409 Conflict** com mensagem de erro. |
| **PAC-02.1** | **Falha:** Horário indisponível (bloqueado pelo médico) | Paulo | Estar logado. O médico bloqueou o período de tempo solicitado. | 1. Tentar agendar em um horário que o médico marcou como "Férias". | **409 Conflict** com mensagem sobre indisponibilidade. |
| **PAC-03** | **Falha:** Médico inexistente | Paulo | Estar logado. | 1. Enviar um `doctorId` (UUID válido) que não corresponde a nenhum médico. | **404 Not Found**. |
| **PAC-04** | **Falha:** Tentativa de acesso não autorizado | Dr. Carlos | Estar logado como médico. | 1. Tentar executar a ação de agendar uma consulta. | **403 Forbidden**. |
| **PAC-04.1** | **Falha:** Agendamento no passado | Paulo | Estar logado. | 1. Enviar um `startTime` que seja anterior à data/hora atual. | **400 Bad Request** com mensagem de erro. |
| **PAC-04.2** | **Falha:** Duração da consulta inválida | Paulo | Estar logado. | 1. Enviar um `endTime` que seja anterior ou igual ao `startTime`. | **400 Bad Request** com mensagem de erro. |


### 4. `PATCH /appointments/{id}/cancel` - Cancelar Consulta

| Nº | Cenário | Ator | Pré-condições | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PAC-05** | **Sucesso:** Cancelar a própria consulta | Paulo | Estar logado e ser o dono da consulta. A consulta está agendada. | 1. Enviar requisição para o endpoint com o ID da sua consulta. | **204 No Content**. |
| **PAC-06** | **Falha:** Cancelar consulta de outro paciente | Paulo | Estar logado. A consulta `{id}` pertence a outro paciente. | 1. Tentar cancelar uma consulta que não é sua. | **403 Forbidden** ou **404 Not Found**. |
| **PAC-07** | **Falha:** Consulta inexistente | Paulo | Estar logado. | 1. Tentar cancelar uma consulta com um ID de formato inválido ou inexistente. | **404 Not Found**. |
| **PAC-07.1** | **Falha:** Cancelar consulta já realizada ou cancelada | Paulo | Estar logado. A consulta com `{id}` já possui status "Realizada" ou "Cancelada". | 1. Tentar cancelar a mesma consulta novamente. | **409 Conflict** ou **400 Bad Request**. |
| **PAC-07.2** | **Falha:** Acesso com token expirado | Paulo | O token JWT de Paulo expirou. | 1. Tentar cancelar uma consulta. | **401 Unauthorized**. |

### 5. `GET /patients/me/appointments` - Listar Minhas Consultas

| Nº | Cenário | Ator | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **PAC-08** | **Sucesso:** Visualizar histórico de consultas | Paulo (logado) | 1. Acessar o endpoint. | **200 OK** com a lista de suas consultas (pode ser vazia). |
| **PAC-09** | **Falha:** Acesso com token inválido | Paulo | 1. Acessar o endpoint com um token JWT malformado ou inválido. | **401 Unauthorized**. |

---

## Módulo do Médico

Testes para as funcionalidades disponíveis ao médico logado.

### 6. `GET /doctors/me/agenda` - Visualizar Agenda

| Nº | Cenário | Ator | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **MED-01** | **Sucesso:** Médico visualiza a própria agenda | Dr. Carlos (logado) | 1. Acessar o endpoint. | **200 OK** com a lista de consultas agendadas para ele. |
| **MED-02** | **Falha:** Tentativa de acesso não autorizada | Paulo (logado) | 1. Tentar acessar a agenda de um médico. | **403 Forbidden**. |

### 7. `POST /doctors/me/schedule-blocks` - Bloquear Horários

| Nº | Cenário | Ator | Pré-condições | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MED-03** | **Sucesso:** Bloquear um período na agenda | Dr. Carlos (logado) | Período a ser bloqueado está livre. | 1. Enviar `startTime`, `endTime` e `reason`. | **201 Created** com os dados do bloqueio. |
| **MED-04** | **Falha:** Período inválido (`startTime` > `endTime`) | Dr. Carlos (logado) | N/A | 1. Enviar `startTime` posterior a `endTime`. | **400 Bad Request**. |
| **MED-05** | **Falha:** Conflito com consulta existente | Dr. Carlos (logado) | Existe uma consulta marcada no período de bloqueio. | 1. Tentar bloquear um horário que já tem uma consulta. | **409 Conflict**. |
| **MED-05.1**| **Falha:** Conflito com outro bloqueio | Dr. Carlos (logado) | Já existe um bloqueio no período solicitado. | 1. Tentar criar um bloqueio que se sobrepõe a outro. | **409 Conflict**. |
| **MED-05.2**| **Falha:** Bloquear período no passado | Dr. Carlos (logado) | N/A | 1. Tentar criar um bloqueio cujo `startTime` já passou. | **400 Bad Request**. |

---

## Módulo Administrativo

Testes para as funcionalidades de gestão do sistema. Todos os cenários de falha devem incluir um teste de acesso por não-administrador (Paulo ou Dr. Carlos), esperando um `403 Forbidden`.

### 8. Gestão de Pacientes (`/admin/patients`)

| Nº | Cenário | Ator | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **ADM-01** | **Sucesso:** Listar todos os pacientes | Ana (Admin) | 1. Acessar `GET /admin/patients`. | **200 OK** com a lista de pacientes. |
| **ADM-02** | **Sucesso:** Criar novo paciente | Ana (Admin) | 1. Enviar dados válidos via `POST /admin/patients`. | **201 Created**. |
| **ADM-03** | **Falha:** CPF duplicado ao criar paciente | Ana (Admin) | 1. Enviar `POST` com um CPF que já existe. | **409 Conflict**. |
| **ADM-03.1**| **Falha:** Chave estrangeira inválida (ex: `healthInsuranceId`) | Ana (Admin) | 1. Enviar `POST` com um `healthInsuranceId` que não existe. | **404 Not Found** ou **400 Bad Request**. |
| **ADM-04** | **Sucesso:** Atualizar um paciente | Ana (Admin) | 1. Enviar `PUT /admin/patients/{id}` com dados válidos. | **200 OK** ou **204 No Content**. |
| **ADM-04.1**| **Falha:** Atualizar paciente inexistente | Ana (Admin) | 1. Enviar `PUT` para um `{id}` de paciente que não existe. | **404 Not Found**. |
| **ADM-05** | **Sucesso:** Deletar um paciente | Ana (Admin) | 1. Enviar `DELETE /admin/patients/{id}` para um paciente sem vínculos críticos. | **204 No Content**. |
| **ADM-05.1**| **Falha:** Deletar paciente inexistente | Ana (Admin) | 1. Enviar `DELETE` para um `{id}` de paciente que não existe. | **404 Not Found**. |
| **ADM-06** | **Falha:** Acesso não autorizado (não-admin) | Paulo | 1. Tentar acessar `GET /admin/patients`. | **403 Forbidden**. |

### 9. Gestão de Médicos (`/admin/doctors`)

| Nº | Cenário | Ator | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **ADM-07** | **Sucesso:** Criar novo perfil de médico | Ana (Admin) | 1. Enviar `POST` com `userId`, `crm` e `specialty`. | **201 Created**. |
| **ADM-08** | **Falha:** CRM duplicado | Ana (Admin) | 1. Tentar criar um médico com um `crm` já existente. | **409 Conflict**. |
| **ADM-08.1**| **Falha:** `userId` inexistente ou já é médico | Ana (Admin) | 1. Enviar `POST` com um `userId` que não existe, ou que já está associado a um perfil de médico. | **404 Not Found** ou **409 Conflict**. |
| **ADM-09** | **Falha:** Acesso não autorizado (não-admin) | Dr. Carlos | 1. Tentar acessar `GET /admin/doctors`. | **403 Forbidden**. |
| **ADM-09.1**| **Falha:** Deletar médico inexistente | Ana (Admin) | 1. Enviar `DELETE /admin/doctors/{id}` para um ID que não existe. | **404 Not Found**. |

### 10. Gestão de Convênios (`/admin/health-insurances`)

| Nº | Cenário | Ator | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **ADM-10** | **Sucesso:** Criar novo convênio | Ana (Admin) | 1. Enviar `POST` com `name`. | **201 Created**. |
| **ADM-11** | **Falha:** Nome do convênio duplicado | Ana (Admin) | 1. Tentar criar um convênio com um `name` já existente. | **409 Conflict**. |
| **ADM-12** | **Falha:** Acesso não autorizado (não-admin) | Paulo | 1. Tentar acessar `DELETE /admin/health-insurances/{id}`. | **403 Forbidden**. |
| **ADM-12.1**| **Falha:** Deletar convênio inexistente | Ana (Admin) | 1. Enviar `DELETE` para um `{id}` de convênio que não existe. | **404 Not Found**. |

### 11. Relatórios (`/admin/reports/appointments-by-insurance`)

| Nº | Cenário | Ator | Passos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **ADM-13** | **Sucesso:** Gerar relatório em PDF | Ana (Admin) | 1. Acessar `GET` com `healthInsuranceId` válido. | **200 OK** com `Content-Type: application/pdf`. |
| **ADM-14** | **Falha:** `healthInsuranceId` não fornecido | Ana (Admin) | 1. Acessar `GET` sem a query param `healthInsuranceId`. | **400 Bad Request**. |
| **ADM-15** | **Falha:** Acesso não autorizado (não-admin) | Dr. Carlos | 1. Tentar gerar um relatório. | **403 Forbidden**. |
| **ADM-15.1**| **Falha:** Formato de data inválido | Ana (Admin) | 1. Enviar `startDate` ou `endDate` com formato inválido (ex: "2025/12/30"). | **400 Bad Request**. |
| **ADM-15.2**| **Falha:** Convênio inexistente | Ana (Admin) | 1. Enviar `healthInsuranceId` de um convênio que não existe. | **404 Not Found**. |
