# Clean Arch Reservation System

<p align="center">
	<img src="https://img.shields.io/badge/status-em--desenvolvimento-yellow" alt="Status do Projeto" />
	<img src="https://img.shields.io/badge/arquitetura-clean--architecture-blue" alt="Arquitetura" />
	<img src="https://img.shields.io/badge/license-UNLICENSED-lightgrey" alt="Licença" />
</p>

> API de reservas de propriedades construída com NestJS, Prisma e PostgreSQL, organizada em módulos e casos de uso seguindo princípios de Clean Architecture.

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura e Boas Práticas](#arquitetura-e-boas-práticas)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Começar](#como-começar)
	- [Pré-requisitos](#pré-requisitos)
	- [Instalação e Configuração](#instalação-e-configuração)

---

## Sobre o Projeto

Este repositório implementa o backend de um sistema de reservas de propriedades, semelhante a plataformas de hospedagem, com foco em organização de código, desacoplamento entre camadas e boas práticas de arquitetura.

O objetivo principal não é apenas entregar as funcionalidades de negócio, mas servir como um exemplo de projeto que aplica **Clean Architecture** no ecossistema **NestJS**, utilizando **Prisma** como ORM e **PostgreSQL** como banco de dados relacional.

## Arquitetura e Boas Práticas

Alguns pontos de arquitetura e padrões adotados neste projeto:

- **Clean Architecture / Hexagonal**
	- Separação clara entre camadas de **aplicação** (casos de uso), **infraestrutura** (Prisma, MinIO/S3, HTTP) e **interface** (controllers HTTP do NestJS).
	- Uso de interfaces em `repositories/interface` e `ports` para representar contratos da camada de domínio/aplicação.

- **Módulos por contexto de negócio**
	- Pastas em `src/modules` para domínios como amenities, auth, payments, properties, reservations e storage.
	- Cada módulo agrupa controllers, DTOs, repositórios e casos de uso, favorecendo coesão.

- **Casos de Uso explícitos**
	- Classes em `use-cases` encapsulam regras de negócio (por exemplo, `CreateAmenityUseCase` e `ListAmenitiesUseCase`).
	- Controllers apenas orquestram requisições e delegam para os casos de uso.

- **Repositórios e Inversão de Dependência**
	- Interfaces de repositório (ex.: `IAmenityRepository`) definem a API que a aplicação espera.
	- Implementações concretas (ex.: `AmenityRepository`) utilizam o **Prisma** e são injetadas via NestJS (`provide`/`useClass`).

- **DTOs e Validação**
	- DTOs organizados em `dto/` para entrada e saída de dados.
	- Validação com `class-validator` e transformação com `class-transformer`.
	- Uso de `nestjs-zod`/`zod` quando necessário para esquemas mais ricos.

- **Autenticação e Autorização**
	- `AuthModule` dedicado à autenticação.
	- `AuthGuard` global registrado no `AppModule`, protegendo rotas por padrão.
	- Decoradores personalizados em `shared/decorators` (ex.: `@isPublic`, `@activeUserId`) para controlar acesso e contexto do usuário.

- **Configuração e Segredos**
	- `ConfigModule.forRoot({ isGlobal: true })` para variáveis de ambiente.
	- Uso do **Infisical** (via `infisical run`) para gerenciamento seguro de segredos em desenvolvimento.

- **Armazenamento de Arquivos**
	- Módulo de storage isolado (`modules/storage`) e providers em `shared/container/providers/storage`.
	- `docker-compose.yml` inclui um serviço **MinIO**, permitindo simular S3 localmente.

- **Qualidade de Código e Automação**
	- **ESLint** e **Prettier** configurados para padronização de estilo.
	- **Husky** + **lint-staged** para rodar validações antes de commits.
	- **Commitlint** com **Conventional Commits**, incentivando um histórico de commits limpo.
	- **Jest** + **ts-jest** + **Supertest** configurados para testes unitários e de integração.

---

## Funcionalidades

Algumas das capacidades previstas/implementadas na API:

- Gestão de usuários
	- Cadastro e autenticação de usuários.
	- Associação de usuários a propriedades (anfitriões) e reservas (hóspedes).

- Gestão de propriedades
	- Cadastro de propriedades com endereço, cidade, capacidade máxima e preços (base e taxa de limpeza).
	- Associação de imagens e amenidades a cada propriedade.
	- Armazenamento de imagens em provedor compatível com S3 (MinIO em desenvolvimento).

- Amenidades (Amenities)
	- CRUD de amenidades.
	- Regra de unicidade por nome (evitando duplicidades).
	- Associação de amenidades a propriedades via tabela de junção.

- Calendário de disponibilidade
	- Modelo `AvailabilityCalendar` para gerenciar datas bloqueadas e overrides de preço.
	- Restrição de unicidade por propriedade + data.

- Reservas
	- Criação de reservas com check-in, check-out, quantidade de hóspedes e valor total.
	- Status de reserva (PENDING, CONFIRMED, CANCELLED).

- Pagamentos
	- Registro de pagamentos associados a reservas.
	- Status de pagamento (PENDING, SUCCESS, FAILED) e campos para rastrear transações.

- Avaliações (Reviews)
	- Avaliação única por reserva.
	- Armazenamento de rating, comentário e autor vinculados à reserva.

---

## Tecnologias Utilizadas

### Backend

- Framework: [NestJS](https://nestjs.com/) (v11)
- Linguagem: [TypeScript](https://www.typescriptlang.org/)
- ORM: [Prisma](https://www.prisma.io/) (v7)
- Banco de Dados: [PostgreSQL](https://www.postgresql.org/)
- Autenticação: [JWT](https://jwt.io/) via `@nestjs/jwt`
- Validação: `class-validator`, `class-transformer`, `nestjs-zod` e `zod`

### Infraestrutura e DevOps

- Containerização: [Docker](https://www.docker.com/) e Docker Compose
- Banco de dados local: container Postgres (imagem `postgres:16`)
- Storage de arquivos: [MinIO](https://min.io/) simulando S3
- Gerenciamento de segredos: [Infisical](https://infisical.com/)

### Qualidade de Código e Produtividade

- Linter: [ESLint](https://eslint.org/) + `eslint-config-prettier` + `eslint-plugin-prettier`
- Formatação: [Prettier](https://prettier.io/)
- Git Hooks: [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/okonet/lint-staged)
- Padrão de commits: [Commitlint](https://commitlint.js.org/) com Conventional Commits

---

## Como Começar

### Pré-requisitos

- Node.js (versão LTS recomendada)
- [pnpm](https://pnpm.io/) ou npm
- Docker e Docker Compose
- [Infisical CLI](https://infisical.com/docs/cli/overview)

### Instalação e Configuração

1. Clone o repositório:

	 ```bash
	 git clone https://github.com/jeffaugg/clean-arch-reservation-system.git
	 cd clean-arch-reservation-system
	 ```

2. Instale as dependências (exemplo com pnpm):

	 ```bash
	 pnpm install
	 ```

3. Configure o Infisical:

	 - Faça login na sua conta:

		 ```bash
		 infisical login
		 ```

	 - Certifique-se de que o projeto e os ambientes estão configurados corretamente para fornecer as variáveis usadas em `docker-compose.yml` e na aplicação (Postgres, MinIO, JWT, etc.).

4. Suba os serviços de infraestrutura (Postgres e MinIO):

	 ```bash
	 pnpm docker-compose up -d
	 ```

5. Gere o client do Prisma:

	 ```bash
	 pnpm db:generate
	 ```

6. Execute as migrações do banco de dados (desenvolvimento):

	 ```bash
	 pnpm migrate:dev
	 ```

7. (Opcional) Popule o banco com dados iniciais:

	 ```bash
	 pnpm seed
	 ```

8. Inicie o servidor em modo desenvolvimento:

	 ```bash
	 pnpm start:dev
	 ```

	 A API ficará disponível na porta configurada (por padrão, NestJS usa a porta 3000).

---

