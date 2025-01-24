const url = "https://kool.krister.ee/chat/Diary";
const element = document.querySelector("input");
const textContent = document.querySelector("#class_add");
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

getMessages()
setInterval(getMessages, 3000);