
 // ----------------
 // Row Select
 // ----------------
const rowKeys = ['A', 'S', 'D', 'F']

export function keyFromRowIndex(rowIndex) {
	return rowKeys[rowIndex];
}

export function rowIndexFromKey(key) {
	return rowKeys.indexOf(key.toUpperCase());
}

export function rowIndexFromKeyCode(keyCode) {
	return rowKeys.map(x => x.charCodeAt()).indexOf(keyCode);
}

export function isRowSelect(keyCode) {
	let index = rowIndexFromKeyCode(keyCode)
	return index >= 0 && index <= rowKeys.length;
}

 // ----------------
 // Side Select
 // ----------------
const sideKeys = ['J', 'K']

export function sideFromKeyCode(keyCode) {
	if (keyCode === sideKeys[0].charCodeAt()) {
		return 'left';
	} else if (keyCode === sideKeys[1].charCodeAt()) {
		return 'right';
	} else {
		return null;
	}
}

export function isSideSelect(keyCode) {
	return sideFromKeyCode(keyCode) != null;
}
