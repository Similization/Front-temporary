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

function ajax(method, url, body = null, callback) {
	const xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.withCredentials = true;

	xhr.addEventListener('readystatechange', function() {
		if (xhr.readyState !== XMLHttpRequest.DONE) return;

		callback(xhr.status, xhr.responseText);
	});

	if (body) {
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
		xhr.send(JSON.stringify(body));
		return;
	}

	xhr.send();
}

function checkCorrect(e) {
    var target = e.target;
    var value = target.value;
    if (!this.classList.contains('req')) {
        return;
    }
    console.log(this.type)
    switch (this.type) {
        case 'password':
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
            break;
        case 'email':
            if (/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(value)) {
                target.classList.remove('denied');
                target.classList.add('accepted');
            } else {
                target.classList.remove('accepted');
                target.classList.add('denied');
            }
            break;
        case 'text':
            var lowerCaseLetters = /[a-zA-Z0-9_]+/g;
            if(value.match(upperCaseLetters)) {  
                target.classList.remove('denied');
                target.classList.add('accepted');
            } else {
                target.classList.remove('accepted');
                target.classList.add('denied');
            }
            break;
    }
    if (value == '') {
        target.classList.remove('denied');
    }
}

function createInput(type, placeholder, value, className, section, required=false) {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.value = value;
    input.className = className;
    if (required) {
        input.classList.add('req')
        console.log(input.classList)
    }
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
		ajax(
			'POST',
			'/sign_in',
			{email, password},
			(status => {
				if (status === 200) {
					profilePage();
					return;
				}

				alert('АХТУНГ! НЕТ АВТОРИЗАЦИИ');
				signupPage();
			})
		)
	});

	root.appendChild(form);
}

function signupPage() {
	root.innerHTML = '';

	const form = document.createElement('form');

    const emailInput = createInput('email', 'email', '', 'form', '', true);
    const div1 = createDiv('login/email', emailInput, '');
    const passwordInput = createInput('password', 'password', '', 'form', '', true);
    const div2 = createDiv('password', passwordInput, '');
    const ageInput = createInput('number', 'age', '', '', '');
    const div3 = createDiv('age', ageInput, '');

    const nameInput = createInput('text', 'name', '', 'form', '', true);
    const div4 = createDiv('name', nameInput, '');
    const lastnameInput = createInput('text', 'lastname', '', 'form', '', true);
    const div5 = createDiv('lastname', lastnameInput, '');
    const surnameInput = createInput('text', 'surname', '', 'form', '');
    const div6 = createDiv('surname', surnameInput, '');

	const submitBtn = createInput('submit', '', 'registration', 'btn', '');
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
		const email = emailInput.value.trim();
		const password = passwordInput.value;
        const age = ageInput.value;
        alert(`You entered email: ${email}\nYou entered password: ${password}\nYou entered age: ${age}`)
        ajax(
			'POST',
			'sign_up',
			{email, password, age},
			(status => {
				if (status === 200) {
					start_page();
					return;
				}

				alert('ERROR');
				// signupPage();
			})
		)
    })
	const back = createBtn('back', 'back', 'startPage');

    const div = fillDiv('form', div1, div2, div3, div4, div5, div6, submitBtn, back);

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
