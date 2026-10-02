<p align="center"><img src="docs/assets/banner.svg" alt="Futuro das Cidades — Tecnologia urbana, sustentabilidade e desenvolvimento web" width="100%" /></p>

<p align="center"><strong>HTML · CSS · JavaScript · Chart.js</strong></p>
<p align="center"><a href="#sobre">Sobre</a> · <a href="#como-executar">Como executar</a> · <a href="https://github.com/Dudulonabr">Perfil do autor</a></p>

# Futuro das Cidades

## Sobre

Site educacional sobre **cidades inteligentes, sensores urbanos, prédios sustentáveis e mobilidade elétrica**. O projeto reúne conteúdo temático, gráficos e um simulador em uma experiência web com múltiplas páginas.

É um projeto de desenvolvimento front-end. Textos, notícias e indicadores devem ser tratados no contexto da demonstração acadêmica.

[Acessar o endereço da demonstração](https://dudulonabr.github.io/Futuro-das-Cidades/)

## O que você encontra

- Página inicial com seções sobre tecnologia urbana e sustentabilidade.
- Blog, contato e página dedicada a vídeo.
- Gráficos com Chart.js e simulador de economia para mobilidade elétrica.
- Navegação responsiva e recursos de acessibilidade no HTML.
- Estilos separados em componentes, responsividade e tema.
- Metadados e sitemap para organização da apresentação do site.

## Como executar

Para uma visualização simples, clone o projeto e abra `index.html` no navegador. Para servir os arquivos localmente, use Python:

```bash
git clone https://github.com/Dudulonabr/Futuro-das-Cidades.git
cd Futuro-das-Cidades
python -m http.server 8000
```

Abra **http://localhost:8000**. O site utiliza recursos externos, como bibliotecas e fontes, que podem depender de internet.

O projeto também possui ferramentas de desenvolvimento via Node.js/npm:

```bash
npm install
npm run start
```

## Organização

| Caminho | Conteúdo |
| --- | --- |
| `index.html` | Página principal |
| `blog.html`, `contato.html`, `video.html` | Páginas complementares |
| `assets/css/` | Estilos e responsividade |
| `assets/js/` | Navegação, gráficos, calculadora e contato |
| `assets/images/` | Imagens utilizadas no site |
| `package.json` | Ferramentas e scripts de desenvolvimento |
| `sitemap.xml` | Mapa das páginas |

## Scripts de desenvolvimento

| Comando | Finalidade |
| --- | --- |
| `npm run start` | Iniciar servidor local na porta 3000 |
| `npm run dev` | Servidor com observação da pasta assets |
| `npm run build` | Gerar arquivos CSS e JavaScript minificados |
| `npm run validate` | Executar validação de HTML |
| `npm run accessibility` | Executar auditoria com pa11y |
| `npm run lighthouse` | Abrir relatório Lighthouse |

Os scripts de auditoria que acessam `localhost:3000` precisam do servidor local em execução. Ter esses scripts disponíveis não equivale a certificação de acessibilidade ou a uma pontuação de desempenho validada.

## Aprendizados demonstrados

Estruturação de páginas, organização de CSS e JavaScript, layouts responsivos, integração de bibliotecas, interação com formulários e apresentação visual de conteúdo.

## Autor

**Eduardo Moreira Monteiro Lona** · São Paulo, Brasil

Estudante de **Análise e Desenvolvimento de Sistemas (UNIP)** e **Engenharia de Software (Cruzeiro do Sul)**, com formação técnica em **Informática pelo SENAC**.

[LinkedIn](https://www.linkedin.com/in/eduardo-moreira-monteiro-lona) · [E-mail](mailto:dudulona07@gmail.com) · [GitHub](https://github.com/Dudulonabr)
