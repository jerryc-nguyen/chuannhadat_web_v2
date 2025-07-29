'use client';

import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface FacebookMessengerProps {
  pageId: string;
  themeColor?: string;
  loggedInGreeting?: string;
  loggedOutGreeting?: string;
}

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

export default function FacebookMessenger({
  pageId,
  themeColor = '#0084FF',
  loggedInGreeting = 'Xin chào! Chúng tôi có thể giúp gì cho bạn?',
  loggedOutGreeting = 'Xin chào! Chúng tôi có thể giúp gì cho bạn?',
}: FacebookMessengerProps) {
  const isDevelopment = process.env.NODE_ENV === 'development' ||
    (typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'));

  const handleChatClick = () => {
    // In development, always go to m.me link
    if (isDevelopment) {
      const facebookPageUrl = `https://m.me/${pageId}`;
      window.open(facebookPageUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Try to show Facebook Customer Chat if available
    if (window.FB && window.FB.CustomerChat) {
      try {
        window.FB.CustomerChat.show();
        return;
      } catch (error) {
        // Facebook CustomerChat not available, will fall back to m.me link
      }
    }

    // Fallback: Open Facebook page in new tab
    const facebookPageUrl = `https://m.me/${pageId}`;
    window.open(facebookPageUrl, '_blank', 'noopener,noreferrer');
  };
  useEffect(() => {
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    // Skip Facebook SDK loading in development to avoid CORS issues
    if (isDevelopment) {
      return;
    }

    // Initialize Facebook SDK for production
    window.fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: 'v18.0'
      });

      // Parse any existing Customer Chat elements
      if (window.FB.XFBML) {
        window.FB.XFBML.parse();
      }
    };

    // Load standard Facebook SDK script (more reliable than customer chat specific)
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/vi_VN/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';

    script.onerror = () => {
      // If Facebook SDK fails to load, the fallback button will handle clicks
    };

    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    return () => {
      // Cleanup script on unmount
      const existingScript = document.getElementById('facebook-jssdk');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <>
      {/* Facebook Customer Chat Plugin - Only in production */}
      {!isDevelopment && (
        <>
          <div id="fb-root"></div>
          <div
            className="fb-customerchat"
            {...({
              attribution: "biz_inbox",
              page_id: pageId,
              theme_color: themeColor,
              logged_in_greeting: loggedInGreeting,
              logged_out_greeting: loggedOutGreeting,
              greeting_dialog_display: "show",
              greeting_dialog_delay: "3"
            } as any)}
          ></div>
        </>
      )}

      {/* Floating chat button */}
      <div className="fixed bottom-4 right-4 z-[60] md:bottom-6 md:right-6">
        <div className="group relative">
          <div
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:scale-110"
            onClick={handleChatClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleChatClick();
              }
            }}
          >
            <MessageCircle size={24} />
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 hidden whitespace-nowrap rounded-lg bg-gray-800 px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:block group-hover:opacity-100">
            {isDevelopment ? 'Chat qua Messenger' : 'Chat với chúng tôi'}
            <div className="absolute -bottom-1 right-3 h-2 w-2 rotate-45 bg-gray-800"></div>
          </div>

        </div>
      </div>
    </>
  );
} 
