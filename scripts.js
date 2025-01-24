const url = "https://kool.krister.ee/chat/Diary";
const element = document.querySelector("input");
const textContent = document.querySelector("#lts");
const contentSy = document.querySelector(".textContent");
textContent.addEventListener("click", function (event) {
  console.log(`Key pressed: ${event.key}`);
  console.log(`User input: ${event.target.value}`);
  const value = inputEl.value
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: value,
      num: value.length + ' letters'
    })
  });
  contentEl.innerHTML = "<p>" + value.length + ' symbols' + "</p>";
  inputEl.value = ''
});

const inputEl = document.querySelector("input");

const optionsEl = document.querySelector("#wrds");
const contentEl = document.querySelector(".textContent");
optionsEl.addEventListener("click", function (event) {
  const value = inputEl.value
  text = value.split(' ')
  len = text.filter(text => text != '')
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: value,
      num: len.length + ' words',
    })
  });
  contentEl.innerHTML = "<p>" + len.length + ' words' + "</p>";
  inputEl.value = ''

});
async function getMessages() {
  const response = await fetch(url);
  const data = await response.json();

  const element = document.querySelector(".web");
  element.innerHTML = "";

  for (const item of data) {
    const message = item.message;
    const num = item.num;
    element.innerHTML += "<p>" + message + ": " + num + "</p>";
  }
}
getMessages()
setInterval(getMessages, 3000);