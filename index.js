const root = document.getElementById('root');

const configApp = {
    startPage : {
        href: "",
        text: "Start page",
        openMethod: start_page,
    },
    signIn: {
        href: "/sign_in",
        text: "Login",
        openMethod: sign_in,
    },
    signUp: {
        href: "/sign_up",
        text: "Registration",
        openMethod: signupPage,
    },
    profile: {
        href : "/profile",
        text: "Profile",
        openMethod: start_page,
    },
    signOut: {
        href: "/sign_out",
        text: "Exit",
        openMethod: start_page,
    },
}

function checkCorrect(e) {
    var target = e.target;
    var value = target.value;

    if (this.type == 'password') {
        var count = 0;
        var lowerCaseLetters = /[a-z]/g;
        if(value.match(lowerCaseLetters)) {  
            count++;
        }
        
        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if(value.match(upperCaseLetters)) {  
            count++;
        }

        // Validate numbers
        var numbers = /[0-9]/g;
        if(value.match(numbers)) {  
            count++;
        }
        
        // Validate length
        if(value.length >= 8) {
            count++;
        }
        if (count == 4) {
            target.classList.remove('denied');
            target.classList.add('accepted');
        } else {
            target.classList.remove('accepted');
            target.classList.add('denied');
        }
    } else if (this.type == 'email') {
        if (/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(value)) {
            target.classList.remove('denied');
            target.classList.add('accepted');
        } else {
            target.classList.remove('accepted');
            target.classList.add('denied');
        }
    }
    if (value == '') {
        target.classList.remove('denied');
    }
}

function createInput(type, placeholder, value, className, section) {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.value = value;
    input.className = className;
    input.dataset.section = section;
    input.addEventListener('keyup', checkCorrect);
    return input;
}

function createDiv(text, element, className) {
    const div = document.createElement('div');

    if (text != '') {
        const p = document.createElement('p');
        p.innerHTML = text;
        div.appendChild(p);
    }

    div.appendChild(element);
    div.className = className;
    return div;
}

function fillDiv(className, ...elements) {
    const div = document.createElement('div');

    for (var i = 0; i < elements.length; i++) {
        div.appendChild(elements[i]);
    }

    div.className = className;
    return div;
}

function createBtn(textContent, href, section) {
    const back = document.createElement('a');
	back.textContent = textContent;
	back.href = href;
	back.dataset.section = section;
    back.className = 'btnStyle';
    return back
}

function start_page() {
    root.innerHTML = "";
    Object.
        entries(configApp).
        map(([key, {href, text}]) => {
            if (!text) {
                return ;
            }

			const menuElement = document.createElement('a');
			menuElement.href = href;
			menuElement.textContent = text;
			menuElement.dataset.section = key;

			return menuElement;

        }).forEach((element) => {
			if (!element) {
				return;
			}
			root.appendChild(element);
		})
}

function sign_in() {
    root.innerHTML = "";

    const form = document.createElement('form');

    const emailInput = createInput('email', 'email', '', 'form', '');
    const div1 = createDiv('login/email', emailInput, '');

    const passwordInput = createInput('password', 'password', '', 'form', '');
    const div2 = createDiv('password', passwordInput, '');

	const submitBtn = createInput('submit', '', 'enter', 'btn', '');
	const back = createBtn('back', 'back', 'startPage');

    back.addEventListener('click', (e) => {
        e.preventDefault();
        document.location.href = ''
    })

    const div = fillDiv('form', div1, div2, submitBtn, back);

	form.appendChild(div);

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const email = emailInput.value.trim();
		const password = passwordInput.value;
        alert(`You entered email: ${email}\nYou entered password: ${password}`)
		// ajax(
		// 	'POST',
		// 	'/login',
		// 	{email, password},
		// 	(status => {
		// 		if (status === 200) {
		// 			profilePage();
		// 			return;
		// 		}

		// 		alert('АХТУНГ! НЕТ АВТОРИЗАЦИИ');
		// 		signupPage();
		// 	})
		// )
	});

	root.appendChild(form);
}

function signupPage() {
	root.innerHTML = '';

	const form = document.createElement('form');

    const emailInput = createInput('email', 'email', '', 'form', '');
    const div1 = createDiv('login/email', emailInput, '');
    const passwordInput = createInput('password', 'password', '', 'form', '');
    const div2 = createDiv('password', passwordInput, '');
    const ageInput = createInput('number', 'age', '', '', '');
    const div3 = createDiv('age', ageInput, '');

	const submitBtn = createInput('submit', '', 'registration', 'btn', '');
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
		const email = emailInput.value.trim();
		const password = passwordInput.value;
        const age = ageInput.value;
        alert(`You entered email: ${email}\nYou entered password: ${password}\nYou entered age: ${age}`)
    })
	const back = createBtn('back', 'back', 'startPage');

    const div = fillDiv('form', div1, div2, div3, submitBtn, back);

	form.appendChild(div);
	root.appendChild(form);
}

start_page();

root.addEventListener('click', (e) => {
	const {target} = e;

	if (target instanceof HTMLAnchorElement) {
		e.preventDefault();

		const {section} = target.dataset;
		if (section) {
			configApp[section].openMethod();
		}
	}

});

// function createInputText(type, placeholder) {
//     const inputText = document.createElement('input');
//     inputText.type = type;
//     inputText.placeholder = placeholder;
//     return inputText;
// }

// function createInputButton(type, value, className) {
//     const inputButton = document.createElement('input');
//     inputButton.type = type;
//     inputButton.value = value;
//     inputButton.className = className;
//     return inputButton;
// }


// function createField1() {
//     const div = document.createElement('div');
//     div.innerHTML = "login: ";
//     div.appendChild(createInput('text', 'Enter login', '', 'reqField'));
//     div.appendChild(createInput('submit','', 'Press me', 'btn'));
//     return div;
// }

// function createField2() {
//     const div = document.createElement('div');
//     div.appendChild(createInputText('text', 'Enter login'));
//     div.appendChild(createInputButton('submit', 'Press me', 'btn'));
//     return div;
// }

// function createForm(params) {}

// const input = document.createElement('input')
// input.type = 'text'
// input.placeholder = 'Some text'

// root.appendChild(input)

// const button = document.createElement('input')
// button.className = 'btn'
// button.type = 'submit'
// button.value = 'Press me!'

// root.appendChild(button)

// const div1 = createField1()
// root.appendChild(div1)

// const div2 = createField2()
// root.appendChild(div2)
