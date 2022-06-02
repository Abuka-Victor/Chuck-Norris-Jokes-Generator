const footerText = `<a href="https://github.com/Abuka-Victor" target="_blank">Abuka Victor</a> - Software Developer  © ${(new Date()).getUTCFullYear()}`;
const footer = document.querySelector('#footer');
footer.innerHTML = footerText;

document.querySelector('#generator').addEventListener('submit', getJoke);
document.querySelector('#jokes').addEventListener('click', touchJoke);
document.querySelector('.clear-all').addEventListener('click', function(){
    document.querySelector('#jokes').innerHTML = '';
})

// Input Validator and Joke Function Assignment
function getJoke(e){
    const amount = document.querySelector('#amount').value;
    const firstName = document.querySelector('#firstname').value;
    const lastName = document.querySelector('#lastname').value;

    if (amount === '' && firstName === '' && lastName === '') {
        getPlainJoke();
    } else {
        if ((amount != '' && isNaN(parseInt(amount))) || amount === '0'){
            showMessage("Only NUMBERS > 0 are allowed in the amount section", 'error', '#generator');
        } else {
            let rAmount = amount === '' ? 1 : parseInt(amount);
            let rFirstName = firstName === '' ? 'Chuck' : firstName;
            let rLastName = lastName === '' ? 'Norris' : lastName;
            getPlainJokes(rAmount, rFirstName, rLastName);
        }
    }
    
    e.preventDefault();
}

// Show Error or Success Messages
function showMessage(message, statusClassName, targetClass, parentIdentifier = ".container"){
    const messageElement = document.createElement("div");
    messageElement.className = `alert ${statusClassName}`;
    messageElement.textContent = message;

    const parent = document.querySelector(parentIdentifier);
    const target = document.querySelector(targetClass);

    parent.insertBefore(messageElement, target);

    setTimeout(function(){
        document.querySelector('.alert').remove()
    },
        3000
    );

}

function getPlainJoke(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://chucknorrisgenerator.netlify.app/random", true);

    xhr.onload = function(){
        if (this.status === 200){
            const Joke = JSON.parse(this.responseText);

            const list = document.createElement('li');

            list.innerHTML = `
                <form id="copy">
                    <div>
                        <textarea disabled>${Joke.value.joke}</textarea>
                    </div>
                    <input type="submit" value="Copy" class="copy">
                    <input type="button" value="Delete" class="delete">
                </form>
            `;

            document.querySelector('#jokes').appendChild(list);
            document.querySelector("#gen").value = "Generate";
            showMessage("Successful Joke", 'success', '#generator');
        }

    };

    xhr.onprogress = function(){
        document.querySelector("#gen").value = "Loading";
    }

    xhr.onerror = function(){
        showMessage("There was an error cracking the joke egg", 'error', '#generator');
        document.querySelector("#gen").value = "Generate";
    };

    xhr.send();
}


function touchJoke(e){
    e.preventDefault();
    if (e.target.className === 'delete'){
        e.target.parentElement.parentElement.remove();
    }
    if (e.target.className === 'copy'){
        const target = e.target.previousElementSibling.firstElementChild;
        navigator.clipboard.writeText(target.textContent);
        showMessage("Joke Copied", 'success', '#jokes', '#joke-div');
        e.target.style.borderColor = 'green';
        e.target.value = "Copied!";
    }
    // e.preventDefault();
}

function getPlainJokes(amount = 1, firstname='Chuck', lastname='Norris'){
    const xhr = new XMLHttpRequest();
    const url = `https://chucknorrisgenerator.netlify.app/random/${amount}?firstName=${firstname}&lastName=${lastname}`;
    xhr.open("GET", url, true);

    xhr.onload = function(){
        if (this.status === 200){
            const Jokes = JSON.parse(this.responseText);

            Jokes.value.forEach(function(Joke){
                const list = document.createElement('li');
    
                list.innerHTML = `
                    <form id="copy">
                        <div>
                            <textarea disabled>${Joke.joke}</textarea>
                        </div>
                        <input type="submit" value="Copy" class="copy">
                        <input type="button" value="Delete" class="delete">
                    </form>
                `;
                document.querySelector('#jokes').appendChild(list);
            })

            document.querySelector("#gen").value = "Generate";
            showMessage("Successful Joke", 'success', '#generator');
        }

    };

    xhr.onprogress = function(){
        document.querySelector("#gen").value = "Loading";
    }

    xhr.onerror = function(){
        showMessage("There was an error cracking the joke egg", 'error', '#generator');
        document.querySelector("#gen").value = "Generate";
    };

    xhr.send();
}
