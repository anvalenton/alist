const submitButton = document.querySelector('#submitbutton');
const kindoflistfield = document.querySelector('#kindoflistid');
const input = document.querySelector('#todoitem');
const list = document.querySelector('#todoulid');

//load kind of list to page

let kindOfList = localStorage.getItem('kindoflist');

if (kindOfList != null) {
	kindoflistfield.value = kindOfList;
}

//loading localStorage todo items to page
let localStorageObject = localStorage;
let localStorageEntries = Object.entries(localStorageObject);
let filteredEntries = [];
for (let i = 0; i < localStorageEntries.length; i++) {
	console.log(parseInt(localStorageEntries[i][0]));
	if (localStorageEntries[i][0] !== 'kindoflist') {
		filteredEntries.push(localStorageEntries[i]);
	}
}

if (filteredEntries.length > 0) {
	let numOfItems = filteredEntries.length;

	//loop over items in array
	for (let i = 0; i < numOfItems; i++) {
		const newToDoItem = document.createElement('li');
		const removeBtn = document.createElement('button');
		removeBtn.innerText = 'Remove';
		removeBtn.classList.add('buttonclass');
		const checkBox = document.createElement('checkbox');
		//giving unique id to todo item
		let uniqueID = filteredEntries[i][0];
		newToDoItem.id = uniqueID;
		//adding text to new LI
		newToDoItem.innerText = filteredEntries[i][1];
		//adding class to new item
		newToDoItem.classList.add('completed');
		newToDoItem.classList.toggle('completed');
		newToDoItem.classList.add('liclass');

		//adding text to li item
		newToDoItem.appendChild(removeBtn);
		newToDoItem.appendChild(checkBox);
		list.appendChild(newToDoItem);
	}
}

//removing or editing list

list.addEventListener('click', function(e) {
	if (e.target.tagName === 'BUTTON') {
		//remove LI from local storage
		let targetID = e.target.parentElement.id;
		//remove LI
		e.target.parentElement.remove();
		localStorage.removeItem(JSON.stringify(targetID));
		localStorage.removeItem(targetID);
	}

	if (e.target.tagName === 'LI') {
		e.target.classList.toggle('completed');
	}
});

//entering type of list, adding it to localstorage

kindoflistfield.addEventListener('keydown', function(evt) {
	if (evt.key === 'Enter') {
		// kindoflistfield.setAttribute('placeholder', kindoflistfield.value);
		//console.log(kindoflistfield.innerText);

		localStorage.setItem('kindoflist', kindoflistfield.value);
	}
});

//adding an item
input.addEventListener('keydown', function(newToDo) {
	//newToDo.preventDefault();

	if (input.isComposing === 'true' || newToDo.key === 'Enter') {
		newToDo.preventDefault();
		const list2 = document.querySelector('#todoulid');
		const newToDoItem = document.createElement('li');
		const removeBtn = document.createElement('button');
		//console.log(input.value);

		//add remove button text and class
		removeBtn.innerText = 'Remove';
		removeBtn.classList.add('buttonclass');
		const checkBox = document.createElement('checkbox');
		//giving unique id to todo item
		let uniqueID = Date.now();
		newToDoItem.id = uniqueID;
		removeBtn.id = uniqueID;
		//adding text to new LI
		newToDoItem.innerText = input.value;
		//adding class to new item
		newToDoItem.classList.add('completed');
		newToDoItem.classList.toggle('completed');
		newToDoItem.classList.add('liclass');
		newToDoItem.classList.add('draggable');
		newToDoItem.setAttribute('draggable', 'true');
		//adding item to local storage
		localStorage.setItem(JSON.stringify(uniqueID), newToDoItem.innerText);

		//appending child

		//newToDoItem.appendChild(checkBox);
		newToDoItem.appendChild(removeBtn);
		list2.appendChild(newToDoItem);
	}
});

//draggable list
const draggables = document.querySelectorAll('.draggable');
const containers = document.querySelectorAll('.container');

draggables.forEach((draggable) => {
	//adding or removing class of dragging to item
	draggable.addEventListener('dragstart', () => {
		draggable.classList.add('dragging');
	});

	draggable.addEventListener('dragend', () => {
		draggable.classList.remove('dragging');
	});
});

// dragover a valid drop target, even fired on drop target
containers.forEach((container) => {
	container.addEventListener('dragover', (e) => {
		e.preventDefault();
		const afterElement = getDragAfterElement(container, e.clientY);
		const draggable = document.querySelector('.dragging');
		if (afterElement == null) {
			list.appendChild(draggable);
		} else {
			container.insertBefore(draggable, afterElement);
		}
	});
});

function getDragAfterElement(container, y) {
	const draggableElements = [ ...container.querySelectorAll('.draggable:not(.dragging)') ];

	return draggableElements.reduce(
		(closest, child) => {
			const box = child.getBoundingClientRect();
			const offset = y - box.top - box.height / 2;
			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child };
			} else {
				return closest;
			}
		},
		{ offset: Number.NEGATIVE_INFINITY }
	).element;
}
