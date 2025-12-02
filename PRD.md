# Documento de Requisitos do Produto (PRD) - Clínica Saúde+

**Projeto:** Sistema de Agendamento de Consultas "Clínica Saúde+"
**Versão:** 1.0 (Baseado no Trabalho M2)
**Instituição:** UNIVALI / Escola Politécnica
**Autores:** Analiz Rocha Luz, Deivid Luan Cardoso

---

## 1. Visão Geral do Produto

O **Clínica Saúde+** é um sistema web focado na gestão e agendamento de consultas médicas. O objetivo principal é facilitar a conexão entre pacientes e profissionais de saúde, permitindo agendamento rápido, gestão de agendas médicas e administração de convênios.

### 1.1 Objetivos

* Permitir que pacientes agendem consultas de forma autônoma e online.
* Fornecer aos médicos ferramentas para gestão de sua própria agenda e bloqueio de horários.
* Centralizar a administração de cadastros (médicos, pacientes, convênios) em um perfil administrativo.

---

## 2. Atores e Personas

O sistema atende a três perfis distintos de usuários, definidos com base nos casos de uso e diagramas de classe:

| Ator | Descrição | Persona (Caso de Teste) |
| :--- | :--- | :--- |
| **Paciente** | Usuário final que busca e agenda consultas. | *Paulo*  |
| **Administrador** | Responsável pela gestão do sistema, cadastros e relatórios. | *Ana*  |
| **Médico** | Profissional de saúde que atende e gerencia sua disponibilidade. | *Dr. Carlos*  |

---

## 3. Requisitos Funcionais (RF)

### 3.1 Módulo do Paciente

Funcionalidades acessíveis ao usuário final.

* **RF01 - Autenticação:** O paciente deve conseguir realizar login no sistema.
* **RF02 - Agendar Consulta:** Permitir a seleção de especialidade, médico, data e horário para criar um agendamento.
* **RF03 - Gestão de Consultas:** O paciente deve poder **cancelar** ou **remarcar** consultas existentes.
* **RF04 - Histórico:** Visualizar uma lista de "minhas consultas".

### 3.2 Módulo do Médico

Funcionalidades para gestão da agenda profissional.

* **RF05 - Visualizar Agenda:** O médico deve ter acesso à visualização de seus compromissos.
* **RF06 - Bloqueio de Agenda:** Permitir que o médico bloqueie horários específicos na agenda [ex: férias, imprevistos](cite: 34, 70).

### 3.3 Módulo Administrativo (Backoffice)

Funcionalidades de gestão e manutenção do sistema.

* **RF07 - Gestão de Pacientes:** Cadastrar e gerenciar dados de pacientes.
* **RF08 - Gestão de Médicos:** Cadastrar médicos, incluindo CRM e especialidade.
* **RF09 - Gestão de Convênios:** Cadastrar, editar e consultar convênios aceitos .
* **RF10 - Relatórios:** Gerar relatórios (PDF) de consultas, especificamente filtrados por convênio.

---

## 4. Regras de Negócio (RN)

Restrições lógicas aplicadas aos dados e fluxos do sistema.

* **RN01 - Unicidade de CPF:** O CPF do paciente deve ser único no banco de dados.
* **RN02 - Unicidade de CRM:** O CRM do médico deve ser único no sistema.
* **RN03 - Status da Consulta:** Uma consulta deve possuir um dos seguintes status: *Agendada, Cancelada, Realizada, Falta* .
* **RN04 - Bloqueio de Usuário:** O sistema deve suportar um indicador (`statusBloqueio`) para impedir acesso de pacientes inaptos.
* **RN05 - Geração de Relatórios:** O relatório de consultas por convênio deve ser exportado em formato PDF.

---

## 5. Especificação Técnica e Arquitetura

### 5.1 Stack Tecnológico

Definição das ferramentas e linguagens utilizadas no desenvolvimento.

| Camada | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Frontend (UI)** | React | Linguagem: Javascript/Typescript  |
| **Backend (API)** | Node.js | Framework: Fastify  |
| **Banco de Dados** | PostgreSQL | Camada de persistência  |
| **Serviços** | pdf-lib | Biblioteca para geração de relatórios  |

### 5.2 Modelo de Dados (Entidades Principais)

Baseado no Diagrama de Classes e MER.

1. **Usuário (Abstrato/Base):** Contém Login e SenhaHash .
2. **Paciente:** Estende Usuário. Possui Nome, CPF, Telefone, Email e vínculo com Convênio .
3. **Médico:** Estende Usuário. Possui Nome, CRM e Especialidade .
4. **Consulta:** Relaciona Médico e Paciente. Possui DataHoraInicio, DataHoraFim e Status .
5. **Bloqueio_Agenda:** Define períodos de indisponibilidade do médico (DataInicio, DataFim, Motivo) .
6. **Convênio:** Entidade simples contendo ID e Nome .

---

## 6. Fluxo de Usuário (UX Flow)

O fluxo principal de agendamento segue 4 passos lineares, conforme protótipo :

1. **Seleção de Especialidade:** Usuário escolhe a área [ex: Cardiologia, Ortopedia](cite: 117, 120).
2. **Seleção de Profissional:** Exibição de lista de médicos com avaliações e anos de experiência .
3. **Seleção de Data/Horário:** Visualização de calendário semanal e slots de horário disponíveis .
4. **Confirmação:** Revisão dos dados (Médico, Especialidade, Data, Horário) e confirmação final .
