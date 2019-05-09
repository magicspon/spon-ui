---
title: 'Font Family'
---

<table style="table-layout: fixed">
  <thead>
    <th>key</th>
    <th>example</th>
  </thead>
	{%- for key, value in fonts -%}
		<tr>
			<td class="font-{{ key }}">
				{{ key }}
			</td>
			<td style="font-size: 20px" class="font-{{ key }}">abcdefghijklmnopqrstuvwxyz</td>
		</tr>
	{%- endfor -%}
</table>
