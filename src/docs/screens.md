---
title: 'Screens'
---

<table>
  <thead>
    <th>key</th>
    <th>value</th>
  </thead>
	{%- for key, value in screens -%}
		<tr>
			<td>
				{{ key }}
				<div style="width: {{ value }}; height: 4px; background: #4ae;"></div>
			</td>
			<td>{{ value }}</td>
		</tr>
	{%- endfor -%}
</table>
