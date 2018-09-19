module.exports = argList => {
	const arg = {}
	let a
	let opt
	let thisOpt
	let curOpt

	for (a = 0; a < argList.length; a += 1) {
		thisOpt = argList[a].trim()
		opt = thisOpt.replace(/^\-+/, '')

		if (opt === thisOpt) {
			// argument value
			if (curOpt) arg[curOpt] = opt
			curOpt = null
		} else {
			// argument name
			curOpt = opt
			arg[curOpt] = true
		}
	}

	return arg
}
