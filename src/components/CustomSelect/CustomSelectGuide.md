# Custom Select Component Implementation Guide

## Step 1: Create the Component File

1. Create a new file: `components/CustomSelect.js` (or `.jsx`)
2. Copy the CustomSelect component code from the first artifact
3. Make sure you have `react-icons/fa` installed: `npm install react-icons`

## Step 2: Component Features

### Key Features Included:
- ✅ **Overflow Prevention**: Automatically positions dropdown up/down based on screen space
- ✅ **Dark Mode Support**: Full dark mode compatibility
- ✅ **Keyboard Navigation**: Arrow keys, Enter, Escape support
- ✅ **Accessibility**: ARIA labels, roles, and proper focus management
- ✅ **Click Outside**: Closes when clicking outside the component
- ✅ **Customizable Styling**: Easy to theme and customize
- ✅ **Error States**: Built-in error message display
- ✅ **Disabled State**: Proper disabled styling and behavior

## Step 3: Update Your Register Component

### Add Required State (if using country code select):
```javascript
const [countryCode, setCountryCode] = useState('+91');
```

### Import the Component:
```javascript
import CustomSelect from '@/components/CustomSelect'; // Adjust path as needed
```

### Define Options Arrays:
```javascript
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

const countryCodeOptions = [
  { value: '+91', label: '+91 (India)' },
  { value: '+1', label: '+1 (US/Canada)' },
  { value: '+44', label: '+44 (UK)' },
  // Add more as needed
];
```

## Step 4: Replace Existing Select Elements

### Replace Gender Select:
```javascript
<div className="mb-5">
  <CustomSelect
    id="gender"
    label="Gender"
    value={gender}
    onChange={(value) => setGender(value)}
    options={genderOptions}
    placeholder="Select Gender"
    required={true}
  />
</div>
```

### Replace Country Code Select (Optional):
```javascript
<div className="w-32">
  <CustomSelect
    id="country-code"
    value={countryCode}
    onChange={(value) => setCountryCode(value)}
    options={countryCodeOptions}
    placeholder="+91"
  />
</div>
```

## Step 5: Component Props Reference

### Required Props:
- `options`: Array of `{value, label}` objects
- `onChange`: Function that receives the selected value

### Optional Props:
- `value`: Currently selected value (default: '')
- `placeholder`: Placeholder text (default: 'Select an option')
- `label`: Label text for the select
- `required`: Boolean to show required asterisk
- `disabled`: Boolean to disable the select
- `className`: Additional CSS classes
- `error`: Error message to display
- `id`: HTML id attribute
- `name`: HTML name attribute

## Step 6: Usage Examples

### Basic Usage:
```javascript
<CustomSelect
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  placeholder="Choose an option"
/>
```

### With Label and Error:
```javascript
<CustomSelect
  label="Country"
  options={countryOptions}
  value={country}
  onChange={(value) => setCountry(value)}
  placeholder="Select Country"
  required={true}
  error={errors.country}
/>
```

### Disabled State:
```javascript
<CustomSelect
  options={options}
  value={value}
  onChange={onChange}
  disabled={true}
  placeholder="Not available"
/>
```

## Step 7: Customization Tips

### Custom Styling:
You can override styles by passing custom classes:
```javascript
<CustomSelect
  className="my-custom-select"
  // ... other props
/>
```

### Theme Colors:
The component uses CSS custom properties. You can customize colors by overriding:
- `--select-primary-color`: Main brand color (currently #015990)
- `--select-border-color`: Border color
- `--select-bg-color`: Background color

## Step 8: Testing Checklist

After implementation, test:
- ✅ Dropdown opens/closes correctly
- ✅ Options are selectable
- ✅ Overflow handling works (test near screen edges)
- ✅ Keyboard navigation works
- ✅ Click outside closes dropdown
- ✅ Dark mode appearance
- ✅ Disabled state works
- ✅ Error messages display
- ✅ Required field validation

## Troubleshooting

### Common Issues:
1. **Dropdown not visible**: Check z-index conflicts
2. **Styling issues**: Ensure Tailwind classes are available
3. **Icon not showing**: Make sure react-icons is installed
4. **Position issues**: Check parent container overflow settings

### Z-Index Fix:
If dropdown appears behind other elements, increase z-index:
```javascript
// In CustomSelect component, update dropdown className:
className="... z-[9999] ..." // Higher z-index
```

## Benefits of This Solution

1. **Reusable**: One component for all dropdowns
2. **Responsive**: Automatically handles screen boundaries
3. **Accessible**: Full keyboard and screen reader support
4. **Themeable**: Easy to customize colors and styling
5. **Maintainable**: Centralized dropdown logic
6. **Production Ready**: Handles edge cases and error states