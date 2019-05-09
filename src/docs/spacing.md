---
title: 'Spacing'
label: 'Spacing'
---

## Spacing Values

Available as margin/padding tailwind classes.

<table>
  <thead>
    <th>key</th>
    <th>value</th>
  </thead>
	{%- for key, value in spacing -%}
		<tr>
			<td>
				{{ key }}
				<div style="width: {{ value }}; height: 4px; background: #4ae;"></div>
			</td>
			<td>{{ value }}</td>
		</tr>
	{%- endfor -%}
</table>
