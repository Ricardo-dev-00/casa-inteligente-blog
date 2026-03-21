# Casa Inteligente Blog

Projeto de conteúdo e monetização com foco em **casa, organização, limpeza, receitas e ofertas**, construído com Next.js App Router, painel CMS próprio e integração com Supabase.

## Visão Geral

O sistema combina:

- Site público com páginas por categoria e posts dinâmicos.
- Página de ofertas com produtos ativos.
- Painel CMS em `/painel` para gerenciar posts e produtos.
- SEO técnico completo (metadata, Open Graph, robots, sitemap e JSON-LD).
- Métricas de performance e tráfego com Vercel Analytics + Speed Insights.

## Principais Funcionalidades

### Site público

- Home com destaques.
- Categorias: `cozinha`, `organizacao`, `limpeza`, `receitas`.
- Página de ofertas em `/ofertas`.
- Post dinâmico em `/posts/[slug]`.
- Páginas institucionais: `sobre`, `privacidade`, `termos-de-uso`.

### CMS

- Login por senha de admin (`CMS_ADMIN_PASSWORD`) com sessão segura em cookie HttpOnly.
- CRUD de posts.
- CRUD de produtos.
- Upload por URL para imagem de capa/produto e respectivos campos ALT.
- Associação de produtos ao post.
- Editor de estrutura de conteúdo por blocos no post:
	- Bloco de texto.
	- Bloco de sessão de produtos com seleção própria de até 3 produtos.
	- Reordenação de blocos.
- Listagem de posts e produtos por ordem de criação (mais recente primeiro).

### SEO e observabilidade

- Metadata global e por página (canonical, OG e Twitter).
- JSON-LD (`Organization`, `WebSite`, `BlogPosting`).
- `robots.txt` dinâmico com bloqueio de `/painel` e `/api/admin`.
- `sitemap.xml` dinâmico com rotas estáticas e slugs de posts publicados.
- Integração com `@vercel/analytics` e `@vercel/speed-insights`.

## Stack

- Next.js `16.2.0`
- React `19.2.4`
- Tailwind CSS `v4`
- Supabase (`@supabase/supabase-js`)
- Vercel Analytics + Speed Insights

## Requisitos

- Node.js `>= 20`
- npm `>= 10`

## Instalação

```bash
npm install
```

## Configuração de Ambiente

Crie o arquivo `.env.local` com base no `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CMS_ADMIN_PASSWORD=
```

### O que cada variável faz

- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto no Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave pública para leitura no frontend/server runtime não-admin.
- `SUPABASE_SERVICE_ROLE_KEY`: chave administrativa para rotas do CMS (`/api/admin/*`).
- `CMS_ADMIN_PASSWORD`: senha do painel CMS.

## Executando o Projeto

```bash
npm run dev
```

Aplicação disponível em `http://localhost:3000`.

## Scripts

- `npm run dev`: inicia ambiente de desenvolvimento.
- `npm run build`: gera build de produção.
- `npm run start`: inicia aplicação em modo produção.
- `npm run lint`: executa lint com ESLint.

## Estrutura de Pastas

```text
src/
	app/
		api/admin/            # Endpoints do CMS (posts, products, session)
		painel/               # Interface do painel CMS
		posts/[slug]/         # Página dinâmica de post
		robots.ts             # Robots dinâmico
		sitemap.ts            # Sitemap dinâmico
	components/             # Componentes reutilizáveis
	data/                   # Fallback local (posts/produtos)
	lib/                    # Camada de acesso a dados e auth CMS
```

## Modelo de Dados (Supabase)

O projeto utiliza principalmente 3 tabelas:

- `posts`
- `products`
- `post_products` (relação N:N)

Campos usados pela aplicação:

### `posts`

- `id`
- `slug`
- `title`
- `excerpt`
- `content`
- `category`
- `cover_image_url`
- `cover_image_alt` (opcional)
- `published`
- `created_at`

### `products`

- `id`
- `slug`
- `name`
- `category` (opcional)
- `description` (opcional)
- `image_url` (opcional)
- `image_alt` (opcional)
- `price`
- `old_price` (opcional)
- `link` (opcional)
- `active`
- `created_at`

### `post_products`

- `post_id`
- `product_id`

## Fallback Local

Quando o Supabase não está configurado para leitura pública, o projeto usa dados locais em:

- `src/data/posts.js`
- `src/data/products.js`

Observação: as rotas administrativas exigem configuração válida de `SUPABASE_SERVICE_ROLE_KEY` e `CMS_ADMIN_PASSWORD`.

## Fluxo de Publicação no CMS

1. Acesse `/painel`.
2. Faça autenticação com senha de admin.
3. Crie/edite post com:
	 - título, slug, categoria e resumo;
	 - blocos de conteúdo (texto e sessões de produtos);
	 - imagem de capa e ALT;
	 - status publicado/rascunho.
4. Para cada bloco de produtos, selecione até 3 produtos cadastrados.
5. Salve e valide o post em `/posts/[slug]`.

## Deploy

Recomendado na Vercel.

### Checklist de produção

- Definir variáveis de ambiente no projeto Vercel.
- Configurar domínio principal.
- Garantir `NEXT_PUBLIC_SITE_URL` no domínio final (quando aplicável).
- Validar:
	- `/robots.txt`
	- `/sitemap.xml`
	- metadata/canonical/OG nas páginas principais.

## Qualidade e Boas Práticas

- Rodar build antes de publicar:

```bash
npm run build
```

- Em mudanças estruturais no CMS, validar criação e edição de post no fluxo completo.
- Manter os campos ALT preenchidos para melhor acessibilidade e SEO de imagens.

## Licença

Defina aqui o modelo de licença adotado no projeto (ex.: MIT, proprietário, etc.).
