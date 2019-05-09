---
title: 'Font size'
---

<table style="table-layout: fixed">
  <thead>
    <th>key</th>
    <th>example</th>
  </thead>
	{%- for key, value in fontSize -%}
		<tr>
			<td class="text-{{ key }}">
				{{ key }}
			</td>
			<td class="text-{{ key }}">{{ value }}</td>
		</tr>
	{%- endfor -%}
</table>
