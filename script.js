const unCompleteRead = document.getElementById('inComplateBookShelfList');
const completeRead = document.getElementById('complateBookShelfList');
let getBooks = JSON.parse(localStorage.getItem('books')) || [];
const modalYesNo = document.querySelector('.modal-yes-no');
const tombolEnterBook = document.getElementById('bookSubmit');

let bacaAtoTidak = '';


// AKSI TAMBAH BUKU KEDALAM WEB STORAGE
document.addEventListener('DOMContentLoaded', function () {
  displayBooks();
  const submitForm = document.getElementById('formInputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBooksOrUpdate();
    clearFormBook();
  })
})


// TAMBAH BUKU KEDALAM WEB STORAGE
const addBooksOrUpdate = () => {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookPenulis').value;
  const year = parseInt(document.getElementById('inputBookTahun').value);
  const isComplete = document.getElementById('inputBookReadDone').checked;

  let id = +new Date;
  // memasukkan kedalam web storage
  const newBuku = Books(id, title, author, year, isComplete);
  const bookIndex = getBooks.findIndex(book => book.isEditing === true);
  // If Book Edit
  if (bookIndex !== -1) {
    // Update book
    const editedBook = getBooks[bookIndex];
    editedBook.title = title;
    editedBook.author = author;
    editedBook.year = year;
    editedBook.isComplete = isComplete;
    editedBook.isEditing = false;

    localStorage.setItem('books', JSON.stringify(getBooks));
    tombolEnterBook.textContent = `"Masukkan Buku Ke Rak" Belum / Selesai Dibaca`;
  } else {
    // Tambahkan Buku Baru
    getBooks.push(newBuku);
    localStorage.setItem('books', JSON.stringify(getBooks));
  }

  displayBooks();
}


// MENAMPILKAN DATA WEBSTORAGE
// ambil buku dari localStorage
const displayBooks = () => {
  // Bersihkan isi rak buku sebelum menambahkan buku-buku baru
  unCompleteRead.innerHTML = '';
  completeRead.innerHTML = '';
  // trampilkan buku-buku dari rak buku yang sesuai
  getBooks.forEach(book => {
    const bookHtml = bukuBuku(book);
    if (book.isComplete) {
      completeRead.innerHTML += bookHtml;
    } else {
      unCompleteRead.innerHTML += bookHtml;
    }
  })

  const btnsDel = document.querySelectorAll('.red');
  btnsDel.forEach(btnD => {
    btnD.addEventListener('click', function () {
      modalYesNo.style.display = 'flex';
    })
  })
}


//MODAL DELETE
const getIdDelet = (bookId) => {
  // Modal Yes or No
  // Klik tombol Yes
  document.querySelector('#btnYes').onclick = () => {
    toggleDelete(bookId);
    modalYesNo.style.display = 'none';
  }

  // Klik tombol No
  document.querySelector('#btnNo').onclick = () => {
    modalYesNo.style.display = 'none';
  }
  // Klik Outside Modal
  const modal = document.querySelector('.modal-yes-no');
  window.onclick = (e) => {
    if (e.target === modal) {
      modalYesNo.style.display = 'none';
    }
  }
}



// Function Declaration Buku untuk mengubah menjadi array of object
const Books = (id, title, author, year, isComplete) => {
  let isiRakbuku = {};
  isiRakbuku.id = id;
  isiRakbuku.title = title;
  isiRakbuku.author = author;
  isiRakbuku.year = year;
  isiRakbuku.isComplete = isComplete;
  isiRakbuku.isEditing = false;

  return isiRakbuku;
}

// AKSI CARI BUKU
const btnCari = document.getElementById('searchSubmit');
btnCari.addEventListener('click', function (event) {
  const cariJudul = document.getElementById('searchBookTitle').value;
  getBooks.forEach(c => {
    if (cariJudul === c.title) {
      const titleBooks = c.title;
      search(titleBooks);
    } else {
      alert('Buku yang anda cari Tidak Ada');
    }
  })
  event.preventDefault();
})


// CARIU BUKU
const search = (titleBooks) => {
  getBooks.forEach(showBook => {
    // kondisi jika sudah dibaca
    if (showBook.isComplete === false && showBook.title === titleBooks) {
      bacaAtoTidak = bukuBuku(showBook);
      unCompleteRead.innerHTML = bacaAtoTidak;
      completeRead.innerHTML = '';

    } else if (showBook.isComplete === true && showBook.title === titleBooks) {
      bacaAtoTidak = bukuBuku(showBook);
      completeRead.innerHTML = bacaAtoTidak;
      unCompleteRead.innerHTML = '';
    }
  });
}

// FUNCTION PINDAH RAK
const toggleReadStatus = (bookId) => {
  const bookIndex = getBooks.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    // Toggle isComplete
    getBooks[bookIndex].isComplete = !getBooks[bookIndex].isComplete;
    // simpan array yang baru kedalam web storage
    localStorage.setItem('books', JSON.stringify(getBooks));
    // perbarui tampilan rak buku
    displayBooks();
  }
}

// FUNCTION DELETE BOOK
const toggleDelete = (bookId) => {
  const bookIndexDelet = getBooks.findIndex(book => book.id === bookId);

  // Memotong Array menjadi array yang baru (splice(indexKeberapa, hapusnyaBerapa))
  getBooks.splice(bookIndexDelet, 1);
  // Memasukkan Array Baru kedalam Web Storage
  localStorage.setItem('books', JSON.stringify(getBooks));

  displayBooks();
  console.log(getBooks);
  console.log(`delet ${bookIndexDelet}`);
}


// CLEAR FORM
function clearFormBook() {
  document.getElementById('inputBookTitle').value = '';
  document.getElementById('inputBookPenulis').value = '';
  document.getElementById('inputBookTahun').value = '';
  document.getElementById('inputBookReadDone').checked = false;
}

// EDIT BOOK
function editBook(bookId) {
  const bookIndex = getBooks.findIndex(book => book.id === bookId);

  // CHANGE NAME SUBMIT TO UPDATE
  if (bookIndex !== -1) {

    getBooks[bookIndex].isEditing = true


    if (tombolEnterBook) {
      tombolEnterBook.textContent = 'Update Book';
    }

    displayBooks();

    // Get Value Edit from Local Storage
    const editedBook = getBooks[bookIndex];
    document.getElementById('inputBookTitle').value = editedBook.title;
    document.getElementById('inputBookPenulis').value = editedBook.author;
    document.getElementById('inputBookTahun').value = editedBook.year;
    document.getElementById('inputBookReadDone').checked = editedBook.isComplete;
  }
}





// ISI BOOKS
const bukuBuku = (bb) => {
  const readyStatusText = bb.isComplete ? 'Belum Dibaca' : 'Selesai Dibaca';
  return `<article class="book_item">
          <h3>${bb.title}</h3>
          <p>${bb.author}</p>
          <p>${bb.year}</p>
          <div class="action">
            <button id="${bb.id}" class="green" onclick="toggleReadStatus(${bb.id})">${readyStatusText}</button>
            <button id="${bb.id}" class="red" onclick="getIdDelet(${bb.id})">Delete Buku</button>
            <button id="${bb.id}" class="blue" onclick="editBook(${bb.id})" >Edit Book</button>
          </div>
        </article>`
}