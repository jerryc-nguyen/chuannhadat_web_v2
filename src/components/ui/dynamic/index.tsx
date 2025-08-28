import { lazy } from 'react';
import React from 'react';

// Heavy UI components loaded dynamically
export const DynamicSidebar = lazy(() => import('../sidebar').then(m => ({
  default: m.Sidebar
})));

export const DynamicSidebarProvider = lazy(() => import('../sidebar').then(m => ({
  default: m.SidebarProvider
})));

export const DynamicMenubar = lazy(() => import('../menubar').then(m => ({
  default: m.Menubar
})));

export const DynamicDropdownMenu = lazy(() => import('../dropdown-menu').then(m => ({
  default: m.DropdownMenu
})));

export const DynamicContextMenu = lazy(() => import('../context-menu').then(m => ({
  default: m.ContextMenu
})));

export const DynamicCarousel = lazy(() => import('../carousel').then(m => ({
  default: m.Carousel
})));

export const DynamicSelect = lazy(() => import('../select').then(m => ({
  default: m.Select
})));

export const DynamicCommand = lazy(() => import('../command').then(m => ({
  default: m.Command
})));

// Lightweight fallback components
export const SidebarLoader = () => (
  <div className="w-64 h-screen bg-gray-100 animate-pulse border-r" />
);

export const MenuLoader = () => (
  <div className="h-10 bg-gray-200 animate-pulse rounded" />
);

export const SelectLoader = () => (
  <div className="h-10 bg-gray-200 animate-pulse rounded border" />
);

export const CommandLoader = () => (
  <div className="w-full h-32 bg-gray-100 animate-pulse rounded border" />
);
