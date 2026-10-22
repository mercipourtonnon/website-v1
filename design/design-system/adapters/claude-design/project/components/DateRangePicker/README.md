# DateRangePicker

A period rather than a date: two months side by side, and presets that resolve against today.

The `date-range-picker` component type of the config.

## Do

- Reach for `date-picker` with `datePickerMode: range` when you want a range in one calendar and no presets; reach for this when the period is the point — a reporting window, a stay, a billing month.

## Don't

- `value` takes that same notation, and a **preset name is refused there by pattern**.
