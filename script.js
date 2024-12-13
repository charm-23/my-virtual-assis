let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
  let text_speak = new SpeechSynthesisUtterance(text);
  text_speak.rate = 1;
  text_speak.pitch = 1;
  text_speak.volume = 1;
  text_speak.lang = "en-IE";
  window.speechSynthesis.speak(text_speak);
}

function wishMe() {
  let day = new Date();
  let hours = day.getHours();
  if (hours >= 0 && hours < 12) {
    speak("Good Morning, I am Anna, your virtual assisstant");
  } else if (hours >= 12 && hours < 16) {
    speak("Good Afternoon, I am Anna, your virtual assisstant");
  } else {
    speak("Good Evening, I am Anna, your virtual assisstant");
  }
}

window.addEventListener("load", () => {
  wishMe();
});

let speechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();
recognition.onresult = (event) => {
  let currentIndex = event.resultIndex;
  let transcript = event.results[currentIndex][0].transcript
    .trim()
    .toLowerCase();
  content.innerText = transcript;
  console.log("Recognized message: ", transcript);
  takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
  recognition.start();
  voice.style.display = "block";
  btn.style.display = "none";
});


async function takeCommand(message) {
  voice.style.display = "none";
  btn.style.display = "flex";

  if (
    message.includes("hello") ||
    message.includes(" hello") ||
    message.includes("hey ") ||
    message.includes("hey") ||
    message.includes(" hey") ||
    message.includes("hi ") ||
    message.includes("hi") ||
    message.includes(" hi")
  ) {
    speak("hello, how can i help you?");
  } else if (message.includes("how are you")) {
    speak("i am good, how are you?");
  } else if (message.includes("who are you")) {
    speak("i am virtual assistant ,created by Tanvi");
  } else if (message.includes("open youtube")) {
    speak("opening youtube...");
    window.open("https://www.youtube.com", "_blank");
  } else if (message.includes("open google")) {
    speak("opening youtube...");
    window.open("https://google.com/", "_blank");
  } else if (message.includes("open linkedIn")) {
    speak("opening youtube...");
    window.open("https://www.linkedin.com", "_blank");
  } else if (message.includes("open instagram")) {
    speak("opening youtube...");
    window.open("https://www.instagram.com", "_blank");
  } else if (message.includes("time")) {
    let time = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    speak(time);
  } else if (message.includes("date")) {
    let date = new Date().toLocaleString(undefined, {
      day: "numeric",
      month: "short",
    });
    speak(date);
  } else if (message.includes("open calculator")) {
    speak("opening calculator...");
    window.open("Calculator://");
  } else if (message.includes("whatsapp")) {
    speak("opening whatsapp...");
    window.open("whatsapp://");
  } else {
    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message }),
      });

      if (response.ok) {
        const data = await response.json();
        const answer = data.answer;
        speak(answer);
      } else {
        speak("Sorry, I couldn't get an answer at the moment.");
      }
    } catch (error) {
      console.error("Error contacting the backend:", error);
      speak("Sorry, something went wrong. Please try again.");
    }
  }
}
