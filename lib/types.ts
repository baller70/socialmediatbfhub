
export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface App {
  id: string;
  userId: string;
  name: string;
  url: string;
  icon?: string | null;
  category?: string | null;
  description?: string | null;
  position: number;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  appId: string;
  title: string;
  url: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  userId: string;
  appId: string;
  sessionStart: Date;
  sessionEnd?: Date | null;
  duration?: number | null;
  clickCount: number;
  date: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: string;
  layout: string;
  sidebarWidth: number;
  autoRefresh: boolean;
  refreshInterval: number;
  notifications: boolean;
  keyboardShortcuts: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type LayoutMode = 'single' | 'split-h' | 'split-v' | 'grid-3' | 'grid-4';

export interface IframeRef {
  id: string;
  name: string;
  url: string;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  error?: string;
}

export interface DashboardState {
  activeApps: App[];
  layout: LayoutMode;
  selectedAppIds: string[];
  iframeRefs: Map<string, IframeRef>;
}

// Desktop/Electron specific types
export interface Panel {
  id: string;
  url: string;
  title?: string;
  isActive?: boolean;
  position?: number;
  category?: string;
  icon?: string;
}

export interface DesktopState {
  panels: Panel[];
  gridLayout: GridLayout;
  sidebarWidth: number;
  isFullscreen: boolean;
}

export type GridLayout = '1x1' | '2x1' | '2x2' | '3x2' | '3x3';

export interface WebViewRef {
  id: string;
  webContents: any;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  currentUrl: string;
  title: string;
}
