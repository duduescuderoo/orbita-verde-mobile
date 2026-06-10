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
| **Login** | Autenticação com e-mail e senha, ou acesso sem conta |
| **Cadastro** | Criação de conta com nome, e-mail e senha com validação |
| **Dashboard (Home)** | Painel com mapa GPS ilustrativo, coordenadas em tempo real e estatísticas 2×2 |
| **Listagem de Alertas** | Lista completa com filtros por tipo (Ativos, Perigo, Alerta, Normal, Resolvidos) |
| **Registrar Alerta** | Formulário com validação, captura GPS e seleção de tipo/nível |
| **Detalhes do Alerta** | Informações completas + opção de resolver a ocorrência |
| **Confirmação** | Tela de status após registro bem-sucedido |
| **Perfil** | Dados do usuário, toggle dark/light mode, mapa GPS e logout |

---

## 🗺️ Recursos Mobile Nativos

### 📍 GPS — Expo Location
- Solicita permissão de localização ao usuário
- Captura coordenadas em tempo real (latitude e longitude)
- Exibe coordenadas no Dashboard e na aba Perfil
- Registra localização automaticamente ao cadastrar um alerta
- Trata adequadamente a negação de permissão (alerta salvo sem coordenadas)

### 🗺️ Mapa Ilustrativo com Pin GPS
- Mapa visual construído com React Native puro (sem API key)
- Grade, ruas e blocos de parque desenhados com `View`
- Pin GPS centralizado com animação de pulso (`Animated.Value`)
- Exibe as coordenadas reais capturadas em overlay

### 🌙 Dark / Light Mode
- Sistema de temas completo via React Context (`ThemeContext`)
- Toggle acessível na aba Perfil
- Preferência salva no AsyncStorage (persiste entre sessões)
- Todas as telas respondem ao tema dinamicamente

### 🔐 Autenticação Local
- Cadastro e login com AsyncStorage
- Sem dependência de servidor externo
- Sessão persistida entre aberturas do app
- Logout com confirmação

---

## 🧭 Fluxo de Uso

```
Login / Cadastro → Dashboard (mapa GPS + stats)
               → aba Alertas (filtros)
               → aba Registrar → captura GPS → Confirmação
               → aba Perfil → toggle tema / logout
               → Detalhes do Alerta → Resolver
```

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| React Native 0.76 | Framework mobile |
| Expo SDK 52 | Plataforma, build e ferramentas |
| TypeScript | Tipagem estática |
| Expo Router | Navegação (tabs + stack + auth group) |
| Expo Location | GPS — recurso nativo |
| AsyncStorage | Persistência local de alertas, usuários e tema |
| React Context API | Sistema de tema dark/light global |
| Animated API | Animação de pulso no pin GPS |
| @expo/vector-icons | Ícones (Ionicons) |

---

## 🚀 Como Executar

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- Emulador Android (Android Studio) **ou** app **Expo Go** no celular

### Instalação

```bash
# Clone o repositório
git clone https://github.com/duduescuderoo/orbita-verde-mobile.git
cd orbita-verde-mobile

# Instale as dependências
npm install

# Inicie o app (Expo Go)
npx expo start --go
```

Pressione `a` para abrir no emulador Android, ou escaneie o QR code com o app **Expo Go** no celular.

> ⚠️ **Importante:** use `npx expo start --go` para rodar no Expo Go sem precisar de build nativo.

---

## 📁 Estrutura do Projeto

```
orbita-verde-mobile/
├── app/
│   ├── _layout.tsx              # Layout raiz com ThemeProvider
│   ├── confirmacao.tsx          # Tela de confirmação após cadastro
│   ├── (auth)/
│   │   ├── _layout.tsx          # Layout do grupo de autenticação
│   │   ├── login.tsx            # Tela de login
│   │   └── registro.tsx         # Tela de cadastro
│   ├── alerta/
│   │   └── [id].tsx             # Tela de detalhes do alerta
│   └── (tabs)/
│       ├── _layout.tsx          # Tab navigator (4 abas)
│       ├── index.tsx            # Dashboard com mapa GPS
│       ├── alertas.tsx          # Listagem com filtros
│       ├── cadastrar.tsx        # Formulário de cadastro
│       └── perfil.tsx           # Perfil, tema e localização
├── components/
│   ├── AlertaCard.tsx           # Card reutilizável para listagem
│   ├── NivelBadge.tsx           # Badge de nível de risco colorido
│   └── MapaIlustrativo.tsx      # Mapa com pin GPS animado
├── contexts/
│   └── ThemeContext.tsx         # Contexto global de dark/light mode
├── services/
│   ├── storage.ts               # AsyncStorage — CRUD de alertas
│   └── auth.ts                  # Autenticação local (login/cadastro)
├── types/
│   └── index.ts                 # Tipos TypeScript do domínio
├── constants/
│   └── theme.ts                 # Paletas light/dark e helpers
├── app.json                     # Configuração Expo
└── package.json
```

---

## ✅ Requisitos Atendidos

| Critério | Implementação |
|----------|---------------|
| **Interface Mobile** | 8 telas com layout responsivo, dark/light mode, navegação tabs + stack + auth |
| **Navegação e Fluxo** | Expo Router com grupos `(auth)` e `(tabs)`, fluxo completo de autenticação e alertas |
| **Manipulação de Dados** | AsyncStorage com CRUD de alertas, usuários e preferência de tema |
| **Recurso Mobile — GPS** | Expo Location com captura de coordenadas, mapa ilustrativo animado e tratamento de permissão |
| **Autenticação** | Login e cadastro locais com sessão persistida |
| **Tratamento de Erros** | Validação de formulários, mensagens de erro, fallback de GPS, estado de carregamento |
| **Dark / Light Mode** | ThemeContext com toggle persistido, todas as telas respondem dinamicamente |
| **Organização** | Separação clara entre telas, componentes, contextos, serviços e tipos |
