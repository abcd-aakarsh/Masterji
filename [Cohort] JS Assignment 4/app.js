const url =
  "https://api.freeapi.app/api/v1/public/books?page=1&limit=10&inc=kind%252Cid%252Cetag%252CvolumeInfo";

const fetchBooks = async () => {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data.data.data);
  const booksData = data.data.data;
  localStorage.setItem("booksData", JSON.stringify([...booksData]));
  console.log(booksData);
  displayBooks(booksData);
};
fetchBooks();

const randomQuote = async () => {
  const response = await fetch(
    "https://api.freeapi.app/api/v1/public/books/book/random"
  );
  const data = await response.json();
  const book = data.data;
  const bookTitle = document.getElementById("book-title");
  bookTitle.innerText = book.volumeInfo.title;
  const bookDesc = document.getElementById("book-desc");
  bookDesc.innerText = book.volumeInfo.description;
  const authorName = document.getElementById("author-name");
  authorName.innerText = `- ${book.volumeInfo.authors[0]}`;
  const heroBtn = document.getElementById("hero-btn");
  heroBtn.setAttribute("href", book.volumeInfo?.infoLink);
  const heroImg = document.getElementById("hero-img");
  const imageUrl = book.volumeInfo?.imageLinks?.thumbnail;
  heroImg.setAttribute("src", imageUrl);
};
randomQuote();

const displayBooks = (booksData) => {
  const booksContainer = document.querySelector(".books-container");
  booksData.forEach((book) => {
    const bookContainer = document.createElement("div");
    const imgDiv = document.createElement("div");
    const img = document.createElement("img");
    const bookDesc = document.createElement("div");
    const bookTitle = document.createElement("h2");
    const author = document.createElement("p");
    const bookPara = document.createElement("p");
    const rating = document.createElement("p");
    const btn = document.createElement("a");

    img.setAttribute("src", book.volumeInfo.imageLinks.thumbnail);
    img.setAttribute("alt", "book");
    imgDiv.appendChild(img);
    bookTitle.innerText = book.volumeInfo.title;
    author.innerText = book.volumeInfo.authors[0];
    bookPara.innerText = book.volumeInfo.description;
    bookPara.classList.add("text");
    rating.innerText = `AvgRating: ${
      book.volumeInfo?.averageRating
        ? book.volumeInfo?.averageRating
        : "Not Rated"
    }`;
    btn.innerHTML = "Know More";
    btn.setAttribute("href", book.volumeInfo.infoLink);
    btn.setAttribute("target", "_blank");
    btn.classList.add("btn");
    bookDesc.classList.add("book-desc-list");
    bookDesc.classList.add("book-desc");
    bookContainer.classList.add("book");
    bookContainer.classList.add("book-list-view");

    bookDesc.appendChild(bookTitle);
    bookDesc.appendChild(author);
    bookDesc.appendChild(bookPara);
    bookDesc.appendChild(rating);
    bookDesc.appendChild(btn);
    bookContainer.appendChild(imgDiv);
    bookContainer.appendChild(bookDesc);
    booksContainer.appendChild(bookContainer);
  });
};

const gridView = document.getElementById("grid");
gridView.addEventListener("click", () => {
  const booksContainer = document.querySelector(".books-container");
  const bookContainer = document.querySelectorAll(".book");
  bookContainer.forEach((e) => {
    e.classList.remove("book-list-view");
    e.classList.add("grid-book-view");
  });

  booksContainer.classList.add("grid-view");
  booksContainer.classList.remove("list-view");
});

const listView = document.getElementById("list");
listView.addEventListener("click", () => {
  const booksContainer = document.querySelector(".books-container");
  const bookContainer = document.querySelectorAll(".book");

  bookContainer.forEach((e) => {
    e.classList.add("book-list-view");
    e.classList.remove("grid-book-view");
  });

  booksContainer.classList.remove("grid-view");
  booksContainer.classList.add("list-view");
});

const inputBox = document.querySelector(".input-box");

const filterList = () => {
  const searchingValue = inputBox.value.trim();
  let books = JSON.parse(localStorage.getItem("booksData"));

  const filteredBooks = books.filter((book) => {
    return (
      book.volumeInfo?.title
        ?.toLowerCase()
        .includes(searchingValue.toLowerCase()) ||
      book.volumeInfo?.authors[0]
        ?.toLowerCase()
        .includes(searchingValue.toLowerCase())
    );
  });
  const booksContainer = document.querySelector(".books-container");
  booksContainer.innerHTML = "";
  displayBooks(filteredBooks);
};

inputBox.addEventListener("input", filterList);

const sort = document.getElementById("sort");

// sort.addEventListener("change", listener);
