/**
 * Dynamic Lightbox Component
 * 
 * Dynamically imports yet-another-react-lightbox (~100KB) only when needed
 * This removes the lightbox library from the main bundle
 */

import { lazy, Suspense, useEffect, useState } from 'react';
import type { LightboxProps, Plugin } from 'yet-another-react-lightbox';

// Dynamic import for the lightbox
const Lightbox = lazy(() => import('yet-another-react-lightbox'));

const LightboxLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
  </div>
);

interface LightboxDynamicProps extends LightboxProps {
  usePlugins?: {
    counter?: boolean;
    thumbnails?: boolean;
    zoom?: boolean;
  };
}

export default function LightboxDynamic({ usePlugins, ...props }: LightboxDynamicProps) {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [stylesLoaded, setStylesLoaded] = useState(false);

  useEffect(() => {
    const loadPluginsAndStyles = async () => {
      try {
        // Load CSS styles
        await Promise.all([
          import('yet-another-react-lightbox/styles.css'),
          usePlugins?.counter && import('yet-another-react-lightbox/plugins/counter.css'),
          usePlugins?.thumbnails && import('yet-another-react-lightbox/plugins/thumbnails.css'),
        ].filter(Boolean));

        // Load plugins
        const pluginPromises = [];
        if (usePlugins?.counter) {
          pluginPromises.push(import('yet-another-react-lightbox/plugins/counter'));
        }
        if (usePlugins?.thumbnails) {
          pluginPromises.push(import('yet-another-react-lightbox/plugins/thumbnails'));
        }
        if (usePlugins?.zoom) {
          pluginPromises.push(import('yet-another-react-lightbox/plugins/zoom'));
        }

        const loadedPlugins = await Promise.all(pluginPromises);
        setPlugins(loadedPlugins.filter(plugin => plugin?.default).map(plugin => plugin.default));
        setStylesLoaded(true);
      } catch (error) {
        // Silently handle plugin loading errors
        setStylesLoaded(true);
      }
    };

    if (usePlugins && Object.values(usePlugins).some(Boolean)) {
      loadPluginsAndStyles();
    } else {
      // Load just the base styles
      import('yet-another-react-lightbox/styles.css').then(() => setStylesLoaded(true));
    }
  }, [usePlugins]);

  if (!stylesLoaded) {
    return <LightboxLoader />;
  }

  return (
    <Suspense fallback={<LightboxLoader />}>
      <Lightbox {...props} plugins={plugins} />
    </Suspense>
  );
}

// Utility function to create lightbox with plugins
export function createLightboxWithPlugins(usePlugins: {
  counter?: boolean;
  thumbnails?: boolean;
  zoom?: boolean;
}) {
  return function LightboxWithPlugins(props: LightboxProps) {
    return <LightboxDynamic {...props} usePlugins={usePlugins} />;
  };
}
