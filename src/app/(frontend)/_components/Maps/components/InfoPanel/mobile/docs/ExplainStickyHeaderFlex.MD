# Sticky Header with Flexbox - Professional Implementation

## 🎯 Problem Solved

The mobile InfoPanel needed a **sticky header UX** (like Google Maps) where:

- Header becomes sticky after scrolling 80px
- Content scrolls smoothly under the header
- Drag-to-resize functionality remains intact
- Professional, native-app feel

## 🎨 Solution: Flexbox + Sticky Positioning

### **Professional Pattern Applied**

Following the **ProfessionalInfoPanel.md** flexbox pattern with header + scrollable content.

### **Key Principles:**

- **No `position: fixed`** - Uses flexbox layout instead
- **`flex-shrink-0`** prevents header compression
- **`flex-1`** makes content fill remaining space
- **`overflow-y-auto`** enables smooth scrolling
- **`position: sticky`** within flex container

## 🏗️ Layout Architecture

```
Drawer.Content (Vaul)
├── Container (flex flex-col, height: 100vh/auto)
│   ├── Header (flex-shrink-0 + sticky) ← Never shrinks, becomes sticky
│   └── Content Area (flex-1 + overflow-y-auto) ← Scrolls under sticky header
```

## 🔧 Component Structure

### **1. Container (contentRef)**

```tsx
<div
  ref={contentRef}
  className="flex flex-col max-w-md mx-auto w-full vaul-drawer-content"
  style={{
    height: snap === 1 ? '100vh' : 'auto',
    minHeight: snap !== 1 ? '200px' : 'auto'
  }}
>
```

**Purpose:**

- **Flex container** establishes vertical layout
- **Height management** adapts to drawer snap points
- **Scrollable reference** for scroll detection hook

### **2. Header (flex-shrink-0)**

```tsx
<div
  className={`flex flex-shrink-0 items-center justify-between border-b border-gray-100 p-4 pb-4 pt-5 ${
    isHeaderFixed ? 'sticky top-0 z-10 bg-white shadow-sm' : 'bg-white'
  }`}
>
  <Drawer.Title className="text-lg font-semibold">
    {isHeaderFixed ? 'Thông tin môi giới' : 'Thông tin địa điểm'}
  </Drawer.Title>
  <button onClick={onClose} className="...">
    <X size={20} />
  </button>
</div>
```

**CSS Classes & Behavior:**

- **`flex-shrink-0`**: Prevents header from shrinking during layout
- **`sticky top-0`**: Makes header stick to top when scrolled past threshold
- **`z-10`**: Stays above content but within drawer bounds
- **Conditional styling**: Different title text when sticky

### **3. Content Area (flex-1)**

```tsx
<div className="flex-1 overflow-y-auto px-4 py-4">
  {/* Profile, Posts, Related Locations sections */}
</div>
```

**CSS Classes & Behavior:**

- **`flex-1`**: Takes all remaining vertical space
- **`overflow-y-auto`**: Enables scrolling when content exceeds height
- **Padding**: `px-4 py-4` for proper content spacing

## 🎯 Simplified Approach

### **Always Sticky Strategy**

With flexbox layout, the header is **always sticky** using pure CSS - no JavaScript needed:

```tsx
<div className="sticky top-0 z-10 flex-shrink-0 bg-white">
  {/* Header content - always visible when scrolling */}
</div>
```

**Benefits:**

- **Zero JavaScript** - Pure CSS `position: sticky` behavior
- **Better performance** - No event listeners or state management
- **Simpler code** - No scroll detection logic
- **More reliable** - CSS handles sticky behavior natively

## 🎯 How It Works

### **Always Sticky Behavior**

```
┌─ Drawer Container ──────────────────┐
│ ┌─ Header (Always Sticky) ────────┐ │ ← flex-shrink-0 + sticky
│ │ 📍 Thông tin địa điểm [X]       │ │ ← Always visible
│ └─────────────────────────────────┘ │
│ ┌─ Content Area ──────────────────┐ │ ← flex-1, scrolls
│ │                                 │ │
│ │ 🏠 Profile Section              │ │
│ │ 📄 Posts Section                │ │
│ │ 📍 Related Locations            │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Header Behavior:**

- **Always sticky** - No conditional logic needed
- **Stays at top** when content scrolls
- **Consistent title** - "Thông tin địa điểm" always shown
- **Fixed positioning** within the flex container

### **Interaction Flow**

1. **User opens drawer** → Header immediately sticky with "Thông tin địa điểm"
2. **User scrolls content** → Header stays fixed at top
3. **User can drag** → Header area responds to touch for resizing
4. **User closes** → Click X button or drag down

## 🎨 Visual Design

### **Always Sticky Header:**

- **Background**: `bg-white` - Clean white background
- **Border**: `border-b border-gray-100` - Subtle bottom border
- **Position**: `sticky top-0` - Sticks to top when scrolling
- **Z-index**: `z-10` - Above content, within drawer
- **Title**: "Thông tin địa điểm" - Consistent location context

## 🚀 Benefits of This Approach

### **✅ Professional UX**

- **Native feel** like Google Maps, Instagram
- **Context preservation** - users always know location
- **Smooth interactions** - no layout jumps or glitches

### **✅ Technical Excellence**

- **Performance optimized** - passive scroll listeners, no layout thrashing
- **Maintainable code** - clean flexbox structure, no complex positioning
- **Responsive design** - adapts to different screen sizes and content
- **Accessibility** - semantic HTML, proper focus management

### **✅ Developer Experience**

- **Reusable pattern** - can apply to other panels/modals
- **Predictable behavior** - flexbox layout is reliable
- **Easy debugging** - clear component structure
- **Type safety** - full TypeScript support

## 🔧 Configuration Options

### **Threshold Adjustment**

```tsx
const isHeaderFixed = useStickyHeader(contentRef, 100); // Different threshold
```

### **Custom Styling**

```tsx
<div className={`... ${isHeaderFixed ? 'sticky top-0 border-blue-200 bg-blue-50' : ''}`}>
  {/* Custom colors for different contexts */}
</div>
```

### **Dynamic Content**

```tsx
<Drawer.Title>
  {isHeaderFixed ? `🏠 ${profileData?.name || 'Loading...'}` : 'Thông tin địa điểm'}
</Drawer.Title>
```

## 🧪 Testing Scenarios

### **✅ Should Work:**

- Scroll content → Header becomes sticky at 80px
- Drag header area → Drawer resizes properly
- Click X button → Drawer closes
- Scroll back to top → Header returns to normal
- Different content heights → Layout adapts

### **❌ Common Issues:**

- Header not sticking → Check scroll detection hook
- Layout breaking → Verify flex classes
- Drag not working → Ensure header stays in document flow
- Z-index conflicts → Check drawer layering

## 📚 Related Patterns

### **ProfessionalInfoPanel.md**

- Same flexbox foundation
- Adds footer/action buttons
- More complex layout with `flex-shrink-0` × 3

### **Mobile Modal Patterns**

- Full-screen overlays
- Bottom sheets (this implementation)
- Side panels
- Toast notifications

### **Sticky Navigation**

- Tab bars
- Floating action buttons
- Progress indicators
- Back-to-top buttons

## 🎯 Implementation Checklist

- [x] **Flexbox container** with proper height management
- [x] **Header with flex-shrink-0** prevents compression
- [x] **Content with flex-1** fills remaining space
- [x] **Always sticky header** using pure CSS `position: sticky`
- [x] **No JavaScript scroll detection** needed
- [x] **Clean visual design** with consistent styling
- [x] **Drag compatibility** maintained
- [x] **Responsive behavior** across snap points
- [x] **Performance optimized** - zero event listeners
- [x] **Simplified code** - no state management complexity

---

**This implementation provides a professional, maintainable sticky header solution that follows modern mobile UX patterns and can be reused across your application.** 🚀
