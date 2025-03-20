const newEle = document.getElementById("new");
const shareEle = document.getElementById("share");
const copyEle = document.getElementById("copy");
const downloadEle = document.getElementById("download");
const downImg = document.getElementById("downImg");

// Fetch Quote and Image
const getSetQuote = async () => {
  const quoteEle = document.getElementById("quote");
  const authorEle = document.getElementById("author");

  try {
    const response = await fetch(
      "https://api.freeapi.app/api/v1/public/quotes/quote/random"
    );
    const data = await response.json();

    quoteEle.innerText = data.data.content;
    authorEle.innerText = `-${data.data.author}`;

    const imgResponse = await fetch("https://picsum.photos/2400/1200");
    const imgBlob = await imgResponse.blob();
    const imgURL = URL.createObjectURL(imgBlob);

    downImg.src = imgURL;
    downImg.setAttribute("data-download", imgURL);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Share on X
const shareX = () => {
  const quoteEle = document.getElementById("quote");
  const authorEle = document.getElementById("author");
  const text = encodeURIComponent(
    `${quoteEle.innerText} \n ${authorEle.innerText}`
  );
  const url = `https://x.com/compose/post?text=${text}`;
  window.open(url, "_blank");
};

// Copy to Clipboard
const copyClipboard = async () => {
  try {
    const quoteEle = document.getElementById("quote");
    await navigator.clipboard.writeText(quoteEle.innerText);
    alert("Quote copied to clipboard 😊");
  } catch (err) {
    alert(err);
  }
};

const downloadImg = () => {
  const imageUrl = downImg.getAttribute("data-download");
  if (!imageUrl) {
    alert("Image is still loading. Try again in a moment.");
    return;
  }

  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = "bg.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  alert("Background image downloaded successfully😃");
};

// Event Listeners
downloadEle.addEventListener("click", downloadImg);
shareEle.addEventListener("click", shareX);
copyEle.addEventListener("click", copyClipboard);
newEle.addEventListener("click", getSetQuote);

window.addEventListener("load", getSetQuote);
