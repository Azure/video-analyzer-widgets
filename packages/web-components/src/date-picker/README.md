# Date picker Component

`media-date-picker` is an implementation of a [Fast element](https://www.fast.design/) and [Microsoft Fluent UI date picker](https://developer.microsoft.com/en-us/fluentui#/controls/web/datepicker).

The component offers a drop-down control that’s optimized for picking a single date from a calendar view where contextual information like the day of the week or fullness of the calendar is important. You can modify the calendar and limit available dates.

```javascript
{
  "inputDate": Date; // selected date for the date picker
  "allowedDates": IAllowedDates = { // allowed dates object
    days: string;  // a list of the allowed days separate by comma
    months: string; // a list of the allowed months separate by comma
    years: string; // a list of the allowed years separate by comma
  }
}
```

## Please see examples:

-   [Example](./examples/example.html)
