# 📚 Ocorrências Escolares

Sistema web de registro e gerenciamento de ocorrências escolares com autenticação segura, filtros avançados e sistema de notificações para solicitações de exclusão.

## 🎯 Funcionalidades

- ✅ **Autenticação**: Login, cadastro e recuperação de senha com Supabase Auth
- ✅ **CRUD Completo**: Criar, ler, atualizar e deletar ocorrências
- ✅ **Dashboard**: Resumo de ocorrências com estatísticas
- ✅ **Filtros e Busca**: Por tipo de ocorrência, aluno e professor
- ✅ **Notificações**: Sistema de sino para solicitações de exclusão
- ✅ **Proteção RLS**: Apenas usuários autenticados podem acessar dados
- ✅ **Tema Responsivo**: Suporte para dark/light mode
- ✅ **Interface Responsiva**: Otimizada para desktop, tablet e mobile

## 📋 Pré-requisitos

- Node.js 16+ e npm/yarn
- Conta Supabase (criar em https://supabase.com)
- Git

## 🚀 Como Instalar e Rodar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/ocorrencias-escolares.git
cd ocorrencias-escolares
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env.local` e preenchao com suas credenciais Supabase:
```bash
cp .env.example .env.local
```

Adicione suas chaves do Supabase:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 4. Rodar em modo desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### 5. Build para produção
```bash
npm run build
```

### 6. Visualizar build localmente
```bash
npm run preview
```

## 🗄️ Configuração Supabase

### Banco de Dados
O projeto já inclui migração SQL que cria:
- Tabela `profiles`: Dados de usuários (nome, avatar, função)
- Tabela `occurrences`: Registros de ocorrências (aluno, data, tipo, descrição, encaminhamento)
- Tabela `deletion_requests`: Solicitações de exclusão de ocorrências

### Políticas de Segurança (RLS)
- Apenas usuários autenticados podem visualizar ocorrências
- Usuários podem criar/editar/deletar suas próprias ocorrências
- Solicitações de exclusão de ocorrências alheias são registradas em `deletion_requests`

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Shadcn/UI (componentes Tailwind)
- **Estilos**: Tailwind CSS, Dark Mode
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Requisições**: @tanstack/react-query, React Router
- **Formulários**: React Hook Form, Zod
- **Estado**: Zustand
- **Toasts**: React Hot Toast
- **Data**: date-fns

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis (UI, Layout)
├── hooks/           # Custom hooks (Auth, Ocorrências, Notificações)
├── pages/           # Páginas (Login, Dashboard, Ocorrências)
├── services/        # Clientes Supabase
├── types/           # Tipos TypeScript
├── lib/             # Utilitários
├── App.tsx          # Roteamento
└── main.tsx         # Entrada

supabase/
└── migrations/      # Migrações SQL
```

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave pública Supabase | `eyJhbGc...` |

## 📱 Fluxo de Uso

1. **Criar Conta**: Acesse a página de cadastro e registre-se
2. **Login**: Entre com e-mail e senha
3. **Recuperar Senha**: Clique em "Esqueceu a senha?" para receber link por email
4. **Dashboard**: Veja resumo de ocorrências e estatísticas
5. **Registrar Ocorrência**: Clique em "Nova Ocorrência" e preencha o formulário
6. **Listar**: Veja todas as ocorrências no "Histórico" com filtros e busca
7. **Editar/Deletar**: Clique nas ações da tabela
8. **Notificações**: Receba notificações quando outro professor quiser deletar uma ocorrência sua
9. **Logout**: Clique no seu perfil e selecione "Sair"

## ✨ Recursos Avançados

### Sistema de Notificações
- Quando um professor quer deletar ocorrência de outro, uma solicitação é enviada
- O dono da ocorrência recebe notificação (sino verde)
- Ao clicar na notificação, visualiza quem fez o pedido
- Pode aceitar ou rejeitar a exclusão
- Notificações marcadas como lidas ao abrir o sino

### Filtros Avançados
- **Dashboard**: Filtrar ocorrências por tipo e visualizar top tipos
- **Histórico**: Buscar por aluno, professor e tipo
- **Data**: Ordenar por data recente

## 🚢 Deploy na Vercel

### 1. Conectar GitHub ao Vercel
- Acesse https://vercel.com
- Clique em "New Project"
- Selecione o repositório `ocorrencias-escolares`

### 2. Configurar Variáveis
Na seção "Environment Variables", adicione:
```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = sua-chave-anonima
```

### 3. Deploy
- Framework Preset: Vite (automático)
- Build Command: `npm run build` (padrão)
- Output Directory: `dist/` (padrão)
- Clique em "Deploy"

A aplicação será publicada em uma URL como: `https://ocorrencias-escolares.vercel.app`

### 4. Updates Automáticos
Cada push para a branch `main` no GitHub dispara um deploy automático na Vercel.

## 🐛 Troubleshooting

### "Erro de autenticação"
- Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretos
- Certifique-se de estar em um computador/rede sem bloqueio

### "Tabelas não encontradas"
- Execute as migrações SQL do Supabase (em `supabase/migrations/`)
- Verifique se o projeto Supabase foi inicializado

### "Chunk size warning"
- Build normal, aviso apenas indica que o bundle é grande
- Aplicação funciona normalmente

## 📄 Licença

Este projeto é de uso educacional. Sinta-se livre para estudar, modificar e compartilhar.

## 📧 Suporte

Para dúvidas ou problemas, abra uma [issue](https://github.com/seu-usuario/ocorrencias-escolares/issues) no repositório.

---

**Desenvolvido com ❤️ para melhorar a gestão de ocorrências escolares**
