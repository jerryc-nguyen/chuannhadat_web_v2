# Breadcrumb Component

The `Breadcrumb` component provides a responsive navigation trail for the application. It automatically adapts between mobile (horizontal scroll) and desktop (standard list) layouts.

## Usage

The component relies on the Jotai `breadcrumbAtom` for its state. It does not accept any props directly.

```tsx
import Breadcrumb from '@components/breadcrumb';

// In your layout or page
export default function Page() {
  return (
    <div>
      <Breadcrumb />
      {/* ... content ... */}
    </div>
  );
}
```

## State Management

To update the breadcrumb, use the `breadcrumbAtom` from Jotai.

```tsx
import { useSetAtom } from 'jotai';
import { breadcrumbAtom } from '@dashboard/DashboardLayout/states/breadcrumbAtom';
import { useEffect } from 'react';

export default function MyPage() {
  const setBreadcrumb = useSetAtom(breadcrumbAtom);

  useEffect(() => {
    setBreadcrumb([
      { title: 'Home', link: '/', isActive: false },
      { title: 'Section', link: '/section', isActive: false },
      { title: 'Current Page', link: '/section/current', isActive: true },
    ]);
  }, [setBreadcrumb]);

  // ...
}
```

## Features

### Responsive Design

- **Desktop**: Displays as a standard breadcrumb list.
- **Mobile**: Displays as a horizontally scrollable container with gradient indicators and navigation buttons.

### HorizontalScrollContainer

The mobile view utilizes the `HorizontalScrollContainer` component to manage scrolling behavior.

- **Auto-scroll**: Automatically scrolls to the active breadcrumb item on load.
- **Scroll Buttons**: Shows Left/Right buttons when content overflows.
- **Gradients**: Visual cues for scrollable content.

#### Internal Component: `HorizontalScrollContainer`

If you need to implement similar horizontal scrolling behavior elsewhere, you can import the container directly:

```tsx
import { HorizontalScrollContainer } from '@components/ui/horizontal-scroll-container';

<HorizontalScrollContainer
  activeItemSelector=".active-item" // Optional: Selector to auto-scroll to
  dependencies={[data]} // Optional: Re-check scroll on data change
>
  <div className="flex">{/* Scrollable items */}</div>
</HorizontalScrollContainer>;
```
