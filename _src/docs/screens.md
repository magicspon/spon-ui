---
title: 'Screens'
---

{ key }:mb-2

<table>
<thead>
  <th>key</th>
  <th>ems</th>
  <th>px</th>
</thead>
{% for key, value in breakpoints -%}
  <tr>
    <td>{{ key }}</td>
    <td>{{ value }}</td>
    <td>{{ value|rem2px}}</td>
  </tr>
{% endfor -%}
</table>
