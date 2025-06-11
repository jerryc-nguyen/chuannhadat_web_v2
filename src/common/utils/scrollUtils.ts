'use client';

/**
 * Scroll storage for managing scroll positions across pages
 */
class ScrollManager {
  private scrollPositions: Map<string, number> = new Map();
  private enabled = true;

  /**
   * Save the scroll position for a specific URL
   * @param url The URL to save position for
   * @param position The scroll position (default is current scroll position)
   */
  savePosition(url: string, position?: number): void {
    if (!this.enabled) return;

    const scrollY = position !== undefined ? position : window.scrollY;
    this.scrollPositions.set(url, scrollY);
  }

  /**
   * Get saved scroll position for a URL
   * @param url The URL to retrieve position for
   * @returns The saved scroll position or undefined if not found
   */
  getPosition(url: string): number | undefined {
    return this.scrollPositions.get(url);
  }

  /**
   * Scroll to the saved position for a URL
   * @param url The URL to scroll to position for
   * @returns True if scrolled, false if no saved position
   */
  scrollToSaved(url: string): boolean {
    const position = this.getPosition(url);
    if (position !== undefined) {
      window.scrollTo(0, position);
      return true;
    }
    return false;
  }

  /**
   * Scroll to top of the page
   */
  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  /**
   * Clear all saved scroll positions
   */
  clearAll(): void {
    this.scrollPositions.clear();
  }

  /**
   * Enable or disable scroll management
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if scroll management is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Create a singleton instance
export const scrollManager = new ScrollManager();

// Helper functions
export const saveScrollPosition = (url?: string) => {
  const currentUrl = url || window.location.pathname + window.location.search;
  scrollManager.savePosition(currentUrl);
};

export const scrollToSavedPosition = (url?: string) => {
  const targetUrl = url || window.location.pathname + window.location.search;
  return scrollManager.scrollToSaved(targetUrl);
}; 
