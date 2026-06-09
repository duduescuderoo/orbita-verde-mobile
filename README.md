<h1 align="center">🛰️ OrbitaVerde Mobile</h1>

<p align="center">
  <strong>Monitoramento Ambiental Satelital — App Mobile</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.76-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/Expo-SDK_52-000020?style=for-the-badge&logo=expo&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/FIAP-Global%20Solution%202026-red?style=for-the-badge"/>
</p>

---

## 📌 Objetivo

Aplicativo mobile da plataforma **OrbitaVerde** — sistema de monitoramento ambiental que integra dados de satélites NASA/ESA para detectar e emitir alertas de queimadas, flares solares e desmatamento em tempo real.

Desenvolvido para a disciplina **Mobile Development & IoT** — Global Solution 2026, FIAP. Tema: **Indústria / Economia Espacial**.

---

## 👥 Integrantes

| Nome | RM |
|------|----|
| Davi Vieira | RM556798 |
| Luca Monteiro | RM556906 |
| Arthur Silva | RM553320 |
| Eduardo Escudero | RM556527 |
| Leonardo Munhoz | RM556824 |

---

## 📱 Telas do App

| Tela | Descrição |
|------|-----------|
| **Dashboard (Home)** | Painel com GPS, estatísticas de alertas por nível e os mais recentes |
| **Listagem de Alertas** | Lista completa com filtros por tipo e nível de risco |
| **Cadastrar Alerta** | Formulário com validação, captura GPS e seleção de tipo/nível |
| **Detalhes do Alerta** | Informações completas + opção de resolver a ocorrência |
| **Confirmação** | Tela de status após registro bem-sucedido |

---

## 🗺️ Recurso Mobile Utilizado — GPS

O app utiliza **Expo Location** para:

- Solicitar permissão de localização ao usuário
- Capturar coordenadas GPS em tempo real no Dashboard
- Registrar automaticamente a latitude/longitude ao cadastrar um novo alerta
- Tratar adequadamente a negação de permissão (alerta é salvo sem coordenadas)

---

## 🧭 Fluxo de Uso

```
Dashboard → aba Registrar → preenche tipo, nível, descrição, captura GPS
         → Confirmação → aba Alertas → toca no alerta → Detalhes → Resolver
```

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| React Native 0.76 | Framework mobile |
| Expo SDK 52 | Plataforma, build e ferramentas |
| TypeScript | Tipagem estática |
| Expo Router | Navegação (tabs + stack) |
| Expo Location | GPS — recurso nativo |
| AsyncStorage | Persistência local dos alertas |
| @expo/vector-icons | Ícones (Ionicons) |

---

## 🚀 Como Executar

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/): `npm install -g expo-cli`
- Emulador Android (Android Studio) **ou** Expo Go no celular

### Instalação

```bash
# Clone o repositório
git clone https://github.com/duduescuderoo/orbita-verde-mobile.git
cd orbita-verde-mobile

# Instale as dependências
npm install

# Inicie o app
npx expo start
```

Pressione `a` para abrir no emulador Android, ou escaneie o QR code com o app **Expo Go** no celular.

---

## 📁 Estrutura do Projeto

```
orbita-verde-mobile/
├── app/
│   ├── _layout.tsx          # Layout raiz (Stack navigator)
│   ├── confirmacao.tsx      # Tela de confirmação após cadastro
│   ├── alerta/
│   │   └── [id].tsx         # Tela de detalhes do alerta
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigator
│       ├── index.tsx        # Dashboard / Home
│       ├── alertas.tsx      # Listagem com filtros
│       └── cadastrar.tsx    # Formulário de cadastro
├── components/
│   ├── AlertaCard.tsx       # Card reutilizável para listagem
│   └── NivelBadge.tsx       # Badge de nível de risco colorido
├── services/
│   └── storage.ts           # AsyncStorage — CRUD de alertas
├── types/
│   └── index.ts             # Tipos TypeScript do domínio
├── constants/
│   └── theme.ts             # Cores, helpers de tema
├── app.json                 # Configuração Expo
└── package.json
```

---

## ✅ Requisitos Atendidos

| Critério | Implementação |
|----------|---------------|
| Interface Mobile (20pts) | 5 telas com layout responsivo, tema dark, navegação tabs + stack |
| Navegação e Fluxo (20pts) | Expo Router com fluxo completo: Home → Cadastro → Confirmação → Lista → Detalhes |
| Manipulação de Dados (15pts) | AsyncStorage com dados iniciais pré-carregados e CRUD completo |
| Recurso Mobile (15pts) | GPS via Expo Location — captura coordenadas e trata permissão negada |
| Tratamento de Erros (10pts) | Validação de campos obrigatórios, mensagens de erro, fallback de localização |
| Organização (20pts) | Separação clara entre telas, componentes, serviços e tipos |
