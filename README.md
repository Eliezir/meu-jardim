# 🌱 Meu Jardim

Aplicativo mobile para controle e monitoramento de sistema de irrigação IoT baseado em ESP32. Desenvolvido com foco em acessibilidade para usuários idosos com baixa visão, oferecendo uma interface amigável, intuitiva e fácil de usar.

## 📱 Sobre o Projeto

**Meu Jardim** é um aplicativo companion para sistemas de irrigação automatizados. O app permite monitorar a umidade do solo, configurar zonas de irrigação, agendar regas e visualizar previsões do tempo, tudo com uma interface inspirada no Duolingo - colorida, com fontes grandes e alta acessibilidade.

### Características Principais

- 🎯 **Interface Acessível**: Design otimizado para usuários idosos com baixa visão
- 📊 **Monitoramento em Tempo Real**: Sincronização com Firebase Realtime Database
- 💧 **Controle de Umidade**: Visualização e configuração de limites de umidade do solo
- 🌍 **Zonas de Irrigação**: Configuração individual de múltiplas zonas
- ⏰ **Agendamento**: Sistema de agendamento de irrigações
- 🌤️ **Previsão do Tempo**: Integração com OpenWeather API
- 📴 **Modo Offline**: Funcionalidade mesmo sem conexão com internet

## 🛠️ Tecnologias Utilizadas

- **React Native** (0.81.5) - Framework mobile
- **Expo** (54.0.0) - Plataforma de desenvolvimento
- **TypeScript** (5.9.2) - Tipagem estática
- **Expo Router** (6.0.10) - Roteamento baseado em arquivos
- **NativeWind** (4.2.1) - Tailwind CSS para React Native
- **TanStack Query** (5.90.11) - Gerenciamento de estado do servidor
- **Firebase** (12.6.0) - Realtime Database para sincronização
- **Lucide React Native** - Ícones
- **React Native Reanimated** - Animações performáticas

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **Bun** (gerenciador de pacotes) ou **npm/yarn**
- **Expo CLI** (instalado globalmente ou via npx)
- **Conta Firebase** com projeto configurado
- **Conta OpenWeather** (opcional, para previsão do tempo)

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Eliezir/meu-jardim.git
cd meu-jardim
```

2. Instale as dependências:
```bash
bun install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=sua-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-auth-domain
EXPO_PUBLIC_FIREBASE_DATABASE_URL=sua-database-url
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-storage-bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=seu-app-id

# OpenWeather API (Opcional)
EXPO_PUBLIC_OPENWEATHER_API_KEY=sua-openweather-api-key
EXPO_PUBLIC_WEATHER_LAT=-23.5505
EXPO_PUBLIC_WEATHER_LON=-46.6333
EXPO_PUBLIC_WEATHER_CITY=São Paulo
```

4. Inicie o servidor de desenvolvimento:
```bash
bun dev
```

## 📱 Executando o App

### iOS
```bash
bun ios
```

### Android
```bash
bun android
```

### Web
```bash
bun web
```

## 📁 Estrutura do Projeto

```
meu-jardim/
├── app/                    # Telas do aplicativo (Expo Router)
│   ├── index.tsx          # Tela inicial (Home)
│   ├── humidity.tsx       # Tela de umidade
│   ├── zones.tsx          # Tela de zonas
│   ├── schedule.tsx       # Tela de agendamento
│   ├── forecast.tsx       # Tela de previsão do tempo
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizáveis
│   ├── ui/                # Componentes de UI
│   └── AnimationScreen.tsx
├── lib/                   # Lógica de negócio
│   ├── firebase/          # Configuração e queries do Firebase
│   │   ├── config.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── realtime.ts
│   ├── hooks/             # Custom hooks
│   │   ├── useIrrigationCountdown.ts
│   │   ├── useNetworkStatus.ts
│   │   ├── usePrefetchFirebase.ts
│   │   └── usePrefetchWeather.ts
│   ├── utils/             # Utilitários
│   │   └── irrigation.ts
│   ├── query-client.ts    # Configuração do React Query
│   ├── theme.ts           # Configuração de tema
│   └── weather.ts         # Integração com OpenWeather
├── assets/                # Imagens e recursos
├── tailwind.config.js     # Configuração do Tailwind
└── package.json
```

## 🎨 Funcionalidades

### Tela Inicial (Home)
- Saudação personalizada baseada no horário
- Contador para próxima irrigação
- Status de umidade atual do solo
- Acesso rápido às zonas de irrigação
- Previsão do tempo
- Controle de início/pausa da irrigação

### Tela de Umidade
- Visualização da umidade atual do solo
- Configuração do limite mínimo de umidade
- Informações sobre níveis ideais de umidade

### Tela de Zonas
- Listagem de todas as zonas de irrigação
- Configuração individual de cada zona
- Duração de irrigação por zona

### Tela de Agendamento
- Visualização do cronograma de irrigações
- Configuração de horários

### Tela de Previsão
- Previsão do tempo atual
- Informações meteorológicas relevantes


