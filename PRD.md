# Product Requirements Document (PRD)
## Meu Jardim - IoT Irrigation Companion App

**Version:** 1.0  
**Date:** 2024  
**Status:** Draft  


---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [User Flow](#user-flow)
3. [Detailed Feature Requirements](#detailed-feature-requirements)
4. [UI Design Guidelines](#ui-design-guidelines)
5. [Data Model](#data-model)
6. [Technical Specifications](#technical-specifications)
7. [Non-Functional Requirements](#non-functional-requirements)
8. [Success Metrics](#success-metrics)

---

## Executive Summary

### Product Vision
**Meu Jardim** is an IoT companion mobile application designed to control and monitor an ESP32-based irrigation system. The app serves as a friendly, accessible interface for elderly users with low vision, enabling them to effortlessly manage their garden irrigation system with confidence and ease.

### Problem Statement
Elderly users, particularly those with visual impairments, struggle with complex IoT interfaces that require small text, intricate navigation, and technical knowledge. Traditional irrigation control systems are often intimidating and inaccessible, leading to anxiety about whether their gardens are being properly cared for.

### Solution
A mobile app that combines:
- **Extreme Accessibility**: Large fonts, high contrast, minimal cognitive load
- **Friendly UX**: Duolingo-inspired design with chunky, colorful, approachable interface
- **Real-time Monitoring**: Clear visibility into system status and upcoming actions
- **Simple Control**: Intuitive zone management with straightforward timer settings

### Target Audience
- **Primary Persona**: Elderly users (65+ years old) with low vision
- **Example User**: "Dona Verônica" - a senior who wants to ensure her garden is well-maintained without technical complexity
- **Characteristics**: 
  - Limited technical proficiency
  - Visual impairments requiring high contrast and large text
  - Need for reassurance and clear feedback
  - Preference for simple, friendly interfaces

### Key Success Metrics
- User can check irrigation status in < 3 taps
- Zero user-reported accessibility issues
 

---

## User Flow

### Primary User Journey: Checking Irrigation Status

```
1. User opens app
   ↓
2. Home Screen displays:
   - Personalized welcome message
   - Next irrigation countdown (Hero Widget)
   - Current humidity percentage
   - Zone configuration shortcut
   ↓
3. User sees all critical information at a glance
   ↓
4. [Optional] User taps "Configurar Canais"
   ↓
5. Zone Settings Screen displays list of zones
   ↓
6. User taps a zone
   ↓
7. Modal opens with timer configuration
   ↓
8. User adjusts timer duration
   ↓
9. Changes saved to Firebase
   ↓
10. User returns to Home Screen
```

### Secondary User Journey: Offline State

```
1. User opens app without internet
   ↓
2. App detects offline state
   ↓
3. Home Screen displays:
   - Last updated timestamp
   - Cached data (if available)
   - Offline indicator
   ↓
4. User can still view cached information
   ↓
5. App automatically syncs when connection restored
```

### Error Handling Flow

```
1. Firebase connection error
   ↓
2. Display friendly error message
   ↓
3. Show "Last updated: X min ago"
   ↓
4. Retry button available
   ↓
5. Automatic retry every 30 seconds
```

---

## Detailed Feature Requirements

### Feature 1: Home Screen Dashboard

#### FR-1.1: Personalized Welcome Header
- **Priority**: High
- **Description**: Display a rotating set of friendly welcome messages
- **Acceptance Criteria**:
  - Header text: "Bem-vinda, Dona Verônica" (or randomized from 3-5 messages)
  - Font size: Minimum 28px (accessibility requirement)
  - Text color: Dark Green (#2D5016 or similar) on White background
  - High contrast ratio: WCAG AAA compliant (7:1 minimum)
  - Welcome messages rotate daily or on app open

#### FR-1.2: Hero Widget - Next Irrigation Display
- **Priority**: Critical
- **Description**: Large, prominent display of next irrigation time
- **Acceptance Criteria**:
  - Widget width: 100% of screen width
  - Widget height: ~30% of viewport height
  - Displays "Próxima Irrigação" label
  - Shows countdown timer or scheduled time (e.g., "Em 2 horas" or "14:30")
  - Includes Lottie animation of happy flower pot or watering can
  - Animation loops continuously
  - Background: Light Green (#E8F5E9 or similar)
  - Text: Dark Green, minimum 32px font size
  - Updates in real-time as countdown progresses

#### FR-1.3: Current Humidity Widget
- **Priority**: Critical
- **Description**: Display current soil humidity percentage
- **Acceptance Criteria**:
  - Widget width: 50% of screen width
  - Widget height: Matches secondary row height
  - Label: "Umidade Atual"
  - Percentage displayed in huge, bold font (minimum 48px)
  - Background color: Light Blue/Green (#B3E5FC or #C8E6C9)
  - Text color: Dark Green/Blue for contrast
  - Updates in real-time from Firebase
  - Shows "%" symbol clearly
  - Includes visual indicator (e.g., progress bar or color coding)

#### FR-1.4: Zone Configuration Shortcut
- **Priority**: High
- **Description**: Quick access button to zone settings
- **Acceptance Criteria**:
  - Widget width: 50% of screen width
  - Widget height: Matches secondary row height
  - Label: "Configurar Canais"
  - Icon: Map/zone icon (large, minimum 48x48px)
  - Background: Light Green or White
  - Touch target: Minimum 48x48px (WCAG requirement)
  - Navigates to Zone Settings Screen on tap
  - Includes haptic feedback on tap

### Feature 2: Zone Settings Screen

#### FR-2.1: Zone List Display
- **Priority**: High
- **Description**: Simple list of all irrigation zones
- **Acceptance Criteria**:
  - Displays all zones (Zone 1, Zone 2, etc.)
  - Each zone item:
    - Minimum height: 80px
    - Large, readable text (minimum 24px)
    - Zone name clearly labeled
    - Current timer duration displayed
    - Touch target: Full row height (minimum 80px)
  - High contrast between text and background
  - Scrollable if more than 3-4 zones
  - Back button to return to Home Screen

#### FR-2.2: Zone Timer Configuration Modal
- **Priority**: High
- **Description**: Modal to set irrigation duration for a specific zone
- **Acceptance Criteria**:
  - Opens when user taps a zone
  - Modal covers 80% of screen (centered)
  - Zone name displayed at top
  - Timer input:
    - Large, easy-to-read controls
    - Duration in minutes (e.g., 5, 10, 15, 20, 30, 60)
    - Can use slider or large buttons
    - Current value clearly displayed
  - Save button: Large, high contrast, minimum 60px height
  - Cancel button: Clearly labeled
  - Changes saved to Firebase immediately
  - Success feedback (visual + haptic)
  - Modal closes after successful save

### Feature 3: Real-time Data Synchronization

#### FR-3.1: Firebase Realtime Connection
- **Priority**: Critical
- **Description**: Continuous connection to Firebase Realtime Database
- **Acceptance Criteria**:
  - App connects to Firebase on launch
  - Listens for real-time updates
  - Updates UI immediately when data changes
  - Handles connection errors gracefully
  - Reconnects automatically on connection loss
  - Shows connection status indicator (subtle)

#### FR-3.2: Offline State Handling
- **Priority**: High
- **Description**: Graceful degradation when offline
- **Acceptance Criteria**:
  - Detects offline state within 5 seconds
  - Displays "Última atualização: X min atrás" (Last updated: X min ago)
  - Shows cached data if available
  - Displays offline indicator (non-intrusive)
  - Automatically syncs when connection restored
  - No error messages that alarm the user

### Feature 4: Animated Mascot

#### FR-4.1: Happy Flower Pot Animation
- **Priority**: Medium
- **Description**: Lottie animation providing visual feedback
- **Acceptance Criteria**:
  - Animation plays in Hero Widget
  - Shows happy, friendly flower pot or watering can
  - Loops continuously
  - File size: Optimized (< 200KB)
  - Animation state can reflect system health:
    - Happy animation: System healthy
    - Concerned animation: Low humidity detected
    - Celebrating animation: Irrigation completed
  - Smooth performance (60fps)

---

## UI Design Guidelines

### Color Palette

#### Primary Colors
- **White**: `#FFFFFF` - Primary background
- **Light Green**: `#E8F5E9` or `#C8E6C9` - Secondary backgrounds, widgets
- **Dark Green**: `#2D5016` or `#1B5E20` - Primary text, headers
- **Light Blue/Green**: `#B3E5FC` or `#C8E6C9` - Humidity widget background

#### Contrast Requirements
- **Text on White**: Dark Green (#1B5E20) - Contrast ratio: 12.6:1 (WCAG AAA)
- **Text on Light Green**: Dark Green (#1B5E20) - Contrast ratio: 8.2:1 (WCAG AAA)
- **Text on Light Blue**: Dark Blue (#0D47A1) - Contrast ratio: 9.1:1 (WCAG AAA)

### Typography

#### Font Sizes (Minimum)
- **Hero Text**: 32-40px (Next Irrigation)
- **Percentage Display**: 48-64px (Humidity)
- **Headers**: 28-32px (Welcome, Section Headers)
- **Body Text**: 20-24px (Labels, Descriptions)
- **Button Text**: 22-26px (Action Buttons)

#### Font Weight
- **Headers**: Bold (700)
- **Numbers**: Extra Bold (800) or Black (900)
- **Body**: Regular (400) or Medium (500)

#### Font Family
- Use system default sans-serif (San Francisco on iOS, Roboto on Android)
- Ensure maximum readability
- Avoid decorative fonts

### Spacing & Layout

#### Touch Targets
- **Minimum size**: 48x48px (WCAG requirement)
- **Recommended**: 60x60px for primary actions
- **Zone list items**: Minimum 80px height
- **Buttons**: Minimum 60px height

#### Padding & Margins
- **Screen padding**: 16-24px
- **Widget padding**: 20-24px
- **Between widgets**: 16-20px
- **Button padding**: 16-20px horizontal, 12-16px vertical

#### Grid System
- **Home Screen**: 
  - Hero Widget: Full width, ~30% height
  - Secondary Row: Two equal columns (50% each)
- **Zone Settings**: Full-width list items

### Visual Design Principles

#### 1. Duolingo-Style Aesthetics
- **Chunky**: Large, rounded elements
- **Colorful**: Vibrant but accessible colors
- **Friendly**: Warm, approachable visual language
- **Playful**: Subtle animations and delightful interactions

#### 2. High Contrast
- All text meets WCAG AAA standards (7:1 minimum)
- No light gray text on light backgrounds
- Clear visual hierarchy through size and color

#### 3. Minimal Cognitive Load
- One primary action per screen
- Clear visual hierarchy
- No hidden menus or complex navigation
- Immediate visual feedback for all actions

#### 4. Accessibility First
- All interactive elements clearly labeled
- No icon-only buttons (always include text)
- Large, readable fonts throughout
- High contrast ratios everywhere
- Support for screen readers (React Native Accessibility API)

### Component Specifications

#### Hero Widget
```
Width: 100%
Height: ~30% of viewport
Background: Light Green (#E8F5E9)
Border Radius: 16-20px
Padding: 24px
Content:
  - Label: "Próxima Irrigação" (24px, Dark Green)
  - Timer: "Em 2 horas" (36px, Bold, Dark Green)
  - Lottie Animation: 120x120px (centered)
```

#### Humidity Widget
```
Width: 50% (with 8px margin on right)
Height: Flexible (matches row)
Background: Light Blue/Green (#B3E5FC)
Border Radius: 16px
Padding: 20px
Content:
  - Label: "Umidade Atual" (20px, Dark Blue)
  - Percentage: "75%" (56px, Extra Bold, Dark Blue)
```

#### Zone Config Widget
```
Width: 50% (with 8px margin on left)
Height: Flexible (matches row)
Background: White or Light Green
Border Radius: 16px
Padding: 20px
Content:
  - Icon: 64x64px (Map/Zone icon)
  - Label: "Configurar Canais" (22px, Dark Green)
```

#### Zone List Item
```
Width: 100%
Height: 80px minimum
Background: White
Border: 1px Light Green (#C8E6C9)
Border Radius: 12px
Padding: 20px
Content:
  - Zone Name: "Zona 1" (26px, Bold, Dark Green)
  - Timer: "15 minutos" (20px, Regular, Dark Green)
```

---

## Data Model

### Firebase Realtime Database Structure

```json
{
  "meu-jardim": {
    "system": {
      "status": "active",
      "lastUpdate": "2024-01-15T14:30:00Z",
      "nextIrrigation": {
        "timestamp": "2024-01-15T16:30:00Z",
        "zoneId": "zone1"
      },
      "currentHumidity": 75,
      "humiditySensor": {
        "value": 75,
        "unit": "percentage",
        "lastReading": "2024-01-15T14:29:45Z"
      }
    },
    "zones": {
      "zone1": {
        "id": "zone1",
        "name": "Zona 1",
        "enabled": true,
        "irrigationDuration": 15,
        "unit": "minutes",
        "lastIrrigation": {
          "timestamp": "2024-01-15T12:00:00Z",
          "duration": 15
        },
        "nextIrrigation": {
          "timestamp": "2024-01-15T16:30:00Z"
        },
        "schedule": {
          "enabled": true,
          "times": ["08:00", "16:30"]
        }
      },
      "zone2": {
        "id": "zone2",
        "name": "Zona 2",
        "enabled": true,
        "irrigationDuration": 20,
        "unit": "minutes",
        "lastIrrigation": {
          "timestamp": "2024-01-15T12:05:00Z",
          "duration": 20
        },
        "nextIrrigation": {
          "timestamp": "2024-01-15T16:35:00Z"
        },
        "schedule": {
          "enabled": true,
          "times": ["08:05", "16:35"]
        }
      }
    },
    "settings": {
      "userName": "Dona Verônica",
      "welcomeMessages": [
        "Bem-vinda, Dona Verônica",
        "Olá! Seu jardim está bem cuidado",
        "Bem-vinda de volta!"
      ],
      "notifications": {
        "enabled": true,
        "irrigationStart": true,
        "irrigationComplete": true,
        "lowHumidity": true
      }
    },
    "history": {
      "irrigations": [
        {
          "id": "irr_001",
          "zoneId": "zone1",
          "timestamp": "2024-01-15T12:00:00Z",
          "duration": 15,
          "status": "completed"
        },
        {
          "id": "irr_002",
          "zoneId": "zone2",
          "timestamp": "2024-01-15T12:05:00Z",
          "duration": 20,
          "status": "completed"
        }
      ]
    }
  }
}
```

### Data Model Schema

#### System Object
```typescript
interface SystemStatus {
  status: 'active' | 'inactive' | 'error';
  lastUpdate: string; // ISO 8601 timestamp
  nextIrrigation: {
    timestamp: string; // ISO 8601 timestamp
    zoneId: string;
  };
  currentHumidity: number; // 0-100
  humiditySensor: {
    value: number;
    unit: 'percentage';
    lastReading: string; // ISO 8601 timestamp
  };
}
```

#### Zone Object
```typescript
interface Zone {
  id: string;
  name: string;
  enabled: boolean;
  irrigationDuration: number; // minutes
  unit: 'minutes';
  lastIrrigation: {
    timestamp: string; // ISO 8601 timestamp
    duration: number;
  };
  nextIrrigation: {
    timestamp: string; // ISO 8601 timestamp
  };
  schedule: {
    enabled: boolean;
    times: string[]; // Array of "HH:MM" strings
  };
}
```

#### Settings Object
```typescript
interface AppSettings {
  userName: string;
  welcomeMessages: string[];
  notifications: {
    enabled: boolean;
    irrigationStart: boolean;
    irrigationComplete: boolean;
    lowHumidity: boolean;
  };
}
```

### Firebase Security Rules (Recommended)

```javascript
{
  "rules": {
    "meu-jardim": {
      ".read": "auth != null",
      ".write": "auth != null",
      "system": {
        ".read": true,
        ".write": false // Only ESP32 can write
      },
      "zones": {
        ".read": true,
        "$zoneId": {
          "irrigationDuration": {
            ".write": "auth != null" // Users can update duration
          }
        }
      },
      "settings": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

---

## Technical Specifications

### Tech Stack

#### Frontend
- **Framework**: React Native (Expo SDK 54+)
- **Language**: TypeScript
- **Routing**: Expo Router
- **State Management**: TanStack Query (React Query)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Animation**: Lottie React Native
- **Firebase**: Firebase Realtime Database SDK

#### Dependencies (Key)
```json
{
  "expo": "^54.0.0",
  "react-native": "0.81.5",
  "react": "19.1.0",
  "typescript": "^5.9.2",
  "nativewind": "^4.2.1",
  "@tanstack/react-query": "^5.x",
  "firebase": "^10.x",
  "lottie-react-native": "^6.x",
  "expo-router": "^6.0.10"
}
```

### Architecture

#### Component Structure
```
app/
  index.tsx (Home Screen)
  zones/
    index.tsx (Zone Settings Screen)
    [id].tsx (Zone Detail Modal)
components/
  ui/
    HeroWidget.tsx
    HumidityWidget.tsx
    ZoneConfigWidget.tsx
    ZoneListItem.tsx
    TimerModal.tsx
  animations/
    HappyFlowerPot.tsx
lib/
  firebase/
    config.ts
    queries.ts
    mutations.ts
  hooks/
    useSystemStatus.ts
    useZones.ts
    useOfflineStatus.ts
  utils/
    timeFormatting.ts
    accessibility.ts
```

#### State Management Pattern
- **TanStack Query** for server state (Firebase data)
- **React Context** for UI state (modals, theme)
- **Local State** (useState) for form inputs

#### Data Fetching Strategy
- Real-time listeners on Firebase paths
- Automatic refetch on reconnect
- Optimistic updates for user actions
- Cache invalidation on mutations

### Performance Requirements

#### Load Time
- Initial app load: < 2 seconds
- Firebase connection: < 1 second
- Screen transitions: < 300ms

#### Data Updates
- Real-time updates: < 500ms latency
- UI updates: 60fps animations
- Background sync: Every 30 seconds when active

#### Resource Optimization
- Lottie animations: < 200KB per file
- Images: Optimized, WebP format
- Bundle size: < 10MB initial load

---

## Non-Functional Requirements

### Accessibility (WCAG AAA Compliance)

#### Visual
- **Contrast Ratios**: All text meets 7:1 minimum (AAA standard)
- **Font Sizes**: Minimum 20px for body, 28px+ for headers
- **Touch Targets**: Minimum 48x48px (60px recommended)
- **Color Independence**: Information not conveyed by color alone
- **Text Labels**: All icons have text labels

#### Interaction
- **Haptic Feedback**: All button presses
- **Screen Reader**: Full support via React Native Accessibility API
- **Keyboard Navigation**: Support for external keyboards (if applicable)
- **Focus Indicators**: Clear focus states for all interactive elements

#### Cognitive
- **Simple Language**: Clear, concise Portuguese
- **Error Messages**: Friendly, non-technical language
- **Loading States**: Clear feedback during data fetching
- **Confirmation**: Important actions require confirmation

### Performance

#### Responsiveness
- App responds to user input within 100ms
- Smooth 60fps animations
- No jank or stuttering during scrolling
- Instant feedback on all interactions

#### Reliability
- 99.9% uptime for Firebase connection
- Graceful degradation when offline
- Automatic retry on connection failures
- Data persistence for offline viewing

### Security & Privacy

#### Data Security
- Firebase Authentication required
- Secure connection (HTTPS/WSS only)
- No sensitive data stored locally
- Encrypted communication with ESP32

#### Privacy
- No user tracking or analytics (unless explicitly consented)
- Data only stored in Firebase
- User can request data deletion

### Compatibility

#### Platform Support
- **iOS**: 14.0+
- **Android**: API Level 24+ (Android 7.0+)
- **Screen Sizes**: 4.7" to 7" (phone and small tablet)

#### Device Requirements
- Internet connection (WiFi or cellular)
- Minimum 2GB RAM
- 50MB storage space

---

## Success Metrics

### User Experience Metrics
- **Time to Information**: User can see next irrigation time in < 3 seconds
- **Task Completion Rate**: 95%+ users successfully configure zones
- **Error Rate**: < 1% user-reported errors
- **User Satisfaction**: 4.5/5 average rating

### Technical Metrics
- **App Crashes**: < 0.1% of sessions
- **Firebase Connection Uptime**: 99.9%
- **Data Sync Latency**: < 500ms average
- **App Load Time**: < 2 seconds (cold start)

### Accessibility Metrics
- **WCAG Compliance**: 100% AAA standards met
- **Accessibility Issues**: Zero critical issues
- **Screen Reader Compatibility**: 100% features accessible

### Business Metrics
- **Daily Active Users**: Track engagement
- **Feature Adoption**: % of users configuring zones
- **Support Tickets**: < 2% of users require support

---

## Implementation Phases

### Phase 1: MVP (Weeks 1-3)
- Home Screen with Hero Widget
- Firebase connection and real-time data
- Basic humidity display
- Zone list (read-only)

### Phase 2: Core Features (Weeks 4-5)
- Zone timer configuration
- Lottie animations
- Offline state handling
- Welcome message rotation

### Phase 3: Polish (Weeks 6-7)
- Accessibility audit and fixes
- Performance optimization
- UI/UX refinements
- Testing and bug fixes

### Phase 4: Launch (Week 8)
- Beta testing with target users
- Final adjustments
- App store submission
- Documentation

---

## Appendix

### Welcome Messages (Rotating)
1. "Bem-vinda, Dona Verônica"
2. "Olá! Seu jardim está bem cuidado"
3. "Bem-vinda de volta!"
4. "Tudo pronto para regar seu jardim"
5. "Seu jardim agradece seu cuidado"

### Error Messages (User-Friendly)
- **Connection Error**: "Não foi possível conectar. Verificando novamente..."
- **Data Error**: "Os dados podem estar desatualizados. Atualizando..."
- **Save Error**: "Não foi possível salvar. Tente novamente."

### Accessibility Labels (Portuguese)
- Hero Widget: "Próxima irrigação programada"
- Humidity Widget: "Umidade atual do solo"
- Zone Config Button: "Configurar zonas de irrigação"
- Zone List Item: "Zona [número], duração [X] minutos"
- Save Button: "Salvar configurações"
- Cancel Button: "Cancelar alterações"

---

**Document Status**: Ready for Review  
**Next Steps**: 
1. Review with stakeholders
2. Create design mockups
3. Set up Firebase project
4. Begin Phase 1 implementation






