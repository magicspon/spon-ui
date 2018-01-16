export const mapNodesToMachine = ($Elements, wrap = true) => {
	return $Elements.map(($node, i, a) => {
		return {
			PREV: a[i - 1]
				? {
					$el: a[i - 1],
					index: i - 1
				}
				: wrap === true
					? {
						$el: a[a.length - 1],
						index: a.length - 1
					}
					: {
						$el: $node,
						index: i
					},

			NEXT: a[i + 1]
				? {
					$el: a[i + 1],
					index: i + 1
				}
				: wrap === true
					? {
						$el: a[0],
						index: 0
					}
					: {
						$el: a[i],
						index: i
					}
		}
	})
}
