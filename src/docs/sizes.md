---
title: 'Sizes'
label: 'Sizes'
---

## Width Values

<table>
  <thead>
    <th>key</th>
    <th>value</th>
  </thead>
	{%- for key, value in width -%}
		<tr>
			<td style="max-width: 200px; overflow: auto;">
				{{ key }}
				<div style="width: {{ value }}; height: 4px; background: #4ae;"></div>
			</td>
			<td>{{ value }}</td>
		</tr>
	{%- endfor -%}
</table>

## Max width values

<table>
  <thead>
    <th>key</th>
    <th>rems</th>
    <th>px</th>
  </thead>
	{%- for key, value in maxWidth -%}
		<tr>
			<td style="max-width: 200px; overflow: auto;">
				{{ key }}
				<div style="width: {{ value }}; height: 4px; background: #4ae;"></div>
			</td>
			<td>{{ value }}</td>
			<td>{{ value|rem2px }}</td>
		</tr>
	{%- endfor -%}
</table>

## Height Values

<table>
  <thead>
    <th>key</th>
    <th>value</th>
  </thead>
	{%- for key, value in height -%}
		<tr>
			<td style="max-width: 200px; overflow: auto;">
				{{ key }}
				<div style="width: {{ value }}; height: 4px; background: #4ae;"></div>
			</td>
			<td>{{ value }}</td>
		</tr>
	{%- endfor -%}
</table>
