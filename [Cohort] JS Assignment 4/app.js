/* Fetch function for books */

const fetchBooks = async (pageNum) => {
  const url = `https://api.freeapi.app/api/v1/public/books?page=${pageNum}&limit=10&inc=kind%252Cid%252Cetag%252CvolumeInfo`;

  const response = await fetch(url);
  const data = await response.json();

  const booksData = data.data.data;
  localStorage.setItem("booksData", JSON.stringify([...booksData]));

  displayBooks(booksData);
};
fetchBooks(1);

/* Suggested Book fetch function */

const randomBook = async () => {
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
randomBook();

/* Display books function */

const displayBooks = (booksData) => {
  const booksContainer = document.querySelector(".books-container");
  booksContainer.innerHTML = "";

  /* Creating book elements  */

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

/* Grid view function*/

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

/* List view function */

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

/* Filtering list function */

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
  if (booksContainer.classList.contains("grid-view")) {
    applyGridView();
  } else {
    applyListView();
  }
};

inputBox.addEventListener("input", filterList);

/* Sorting function */

const sort = document.getElementById("sort");

const sortingHandler = () => {
  const booksData = JSON.parse(localStorage.getItem("booksData")) || [];
  console.log("Before", booksData);
  console.log(sort.value);
  switch (sort.value) {
    case "A TO Z":
      booksData.sort((a, b) =>
        a.volumeInfo.title.localeCompare(b.volumeInfo.title)
      );
      break;
    case "Z TO A":
      booksData.sort((a, b) =>
        b.volumeInfo.title.localeCompare(a.volumeInfo.title)
      );
      break;
    case "NEW TO OLD":
      booksData.sort(
        (a, b) =>
          new Date(b.volumeInfo.publishedDate) -
          new Date(a.volumeInfo.publishedDate)
      );
      break;
    case "OLD TO NEW":
      booksData.sort(
        (a, b) =>
          new Date(a.volumeInfo.publishedDate) -
          new Date(b.volumeInfo.publishedDate)
      );
      break;
  }
  const booksContainer = document.querySelector(".books-container");
  booksContainer.innerHTML = "";
  displayBooks(booksData);
  if (booksContainer.classList.contains("grid-view")) {
    applyGridView();
  } else {
    applyListView();
  }
};

sort.addEventListener("change", sortingHandler);

/* Apply listview function after filtering */

const applyListView = () => {
  const booksContainer = document.querySelector(".books-container");
  const bookContainer = document.querySelectorAll(".book");

  bookContainer.forEach((e) => {
    e.classList.add("book-list-view");
    e.classList.remove("grid-book-view");
  });

  booksContainer.classList.remove("grid-view");
  booksContainer.classList.add("list-view");
};

/* Apply gridview function after filtering */

const applyGridView = () => {
  const booksContainer = document.querySelector(".books-container");
  const bookContainer = document.querySelectorAll(".book");
  bookContainer.forEach((e) => {
    e.classList.remove("book-list-view");
    e.classList.add("grid-book-view");
  });

  booksContainer.classList.add("grid-view");
  booksContainer.classList.remove("list-view");
};

/* Pagination function */

const pagination = document.querySelectorAll(".pagebtn");
pagination.forEach((pg) => {
  const booksContainer = document.querySelector(".books-container");
  booksContainer.innerHTML = "";
  pg.addEventListener("click", function () {
    fetchBooks(pg.value);
  });
});
