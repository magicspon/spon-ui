---
title: 'Spacing'
label: 'Spacing'
---

## Spacing Values

Available as margin/padding tailwind classes.

<table>
  <thead>
    <th>key</th>
    <th>rems</th>
    <th>px</th>
  </thead>
{% for item in spacing %}
  <tr>
    <td>
      {m/p}-{{ item.key }}
      <div style="width: {{ item.px }}; height: 4px; background: #4ae;"></div>
    </td>
    <td>{% if item.key == 'auto' %}n/a{% else %}{% if item.px == '0px' %}0{% else %}{{ item.rem }}{% endif %}{% endif %}</td>
    <td>{% if item.key == 'auto' %}auto{% else %}{{ item.px }}{% endif %}</td>
  </tr>
{% endfor %}
</table>
