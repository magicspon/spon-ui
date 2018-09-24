---
title: 'Fonts'
---

font-{ key }

<table>
<thead>
  <th>key</th>
  <th>ems</th>
  <th>px</th>
</thead>
{% for key, value in fonts -%}
  <tr class="font-{{ key }}">
    <td>{{ key }}</td>
    <td>{{ value }}</td>
  </tr>
{% endfor -%}
</table>
