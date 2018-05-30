// Task 1

let urlList = JSON.parse(localStorage.getItem('urlList')) || [{
  "title": "Google",
  "description": "Celebrating S.P.L. S\u00f8rensen! #GoogleDoodle",
  "image": "https:\/\/www.google.com\/logos\/doodles\/2018\/celebrating-spl-srensen-5609905737170944.2-2xa.gif",
  "url": "https:\/\/www.google.com\/"
}];

const addUrlBtn = document.querySelector('.add-url-btn');
const addUrlInput = document.querySelector('.add-url-input');
const container = document.querySelector('.url-container');

const source = document.querySelector('#url-list').innerHTML.trim();
const template = Handlebars.compile(source);

const apiKey = '5b0d5b9890cc28a74336a580a53966dcfadc625289a36';

function basicLayout(userUrlList) {
  localStorage.setItem('urlList', JSON.stringify(userUrlList));
  console.log(JSON.parse(localStorage.getItem('urlList')));

  const markup = userUrlList.reduce((acc, item) => acc + template(item), '');
  container.innerHTML = markup;

  const deleteUrlBtn = Array.from(document.querySelectorAll('.delete-url-btn'));
  deleteUrlBtn.forEach(btn => {
    btn.addEventListener('click', deleteUrl);
  });
}   

function fetchUrl(userUrl) {
  fetch(`http://api.linkpreview.net/?key=${apiKey}&q=${userUrl}`)
    .then(response => {
      if (response.ok) return response.json();

      throw new Error(`Error while fetching: ${response.statusText}`);
    })
    .then(singleUrl => {
      urlList = [singleUrl, ...urlList];
      basicLayout(urlList);
    })
    .catch(error => {
      console.error("Error: ", error);
    });
}

basicLayout(urlList);

function addUrl(evt) {
  evt.preventDefault();
  const urlAdress = addUrlInput.value;
  const pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
  const checkedUrlAdress = pattern.test(urlAdress);

  if (!checkedUrlAdress) {
    return alert('Your url adress is not valid!');
  }
  else {
    if (urlList.find(urlListItem => urlListItem.url == urlAdress) == undefined) {
      fetchUrl(urlAdress);
    }
    else {
      return alert('Such url adress exists in your list!');
    }
  }

}

addUrlBtn.addEventListener('click', addUrl);

function deleteUrl(evt) {
  evt.preventDefault();
  console.log(evt.target.name);
  urlList = urlList.filter(singleUrl => singleUrl.url !== evt.target.name);
  basicLayout(urlList);
}
