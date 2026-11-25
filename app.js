// app.js : 영화 배열을 다루는 함수 / 이현석 2651055 / 11주차


// 포스터 경로, 크기 => TMDB 이미지 주소
function posterUrl(path, size) {
  return "https://image.tmdb.org/t/p/" + size + path;
}


// 평균 평점
function average(list) {
  let sum = 0;

  for (const m of list) {
    sum += m.rating;
  }

  return sum / list.length;
}


// 최고 평점 영화
function best(list) {
  let highest = list[0];

  for (const m of list) {
    if (m.rating > highest.rating) {
      highest = m;
    }
  }

  return highest;
}


// 평점으로 영화 필터링
function filterByRating(list, min) {
  return list.filter(m => m.rating >= min);
}


// 개봉 후 지난 연도 계산
function yearsSince(dateStr) {
  const year = Number(dateStr.slice(0, 4));
  return new Date().getFullYear() - year;
}


// 영화 카드 생성
function renderCards(list) {
  const board = document.querySelector("#board");

  board.innerHTML = "";

  for (const m of list) {
    const card = document.createElement("article");
    card.className = "card";

    if (m.rating >= 8) {
      card.classList.add("hot");
    }

    card.innerHTML = `
      <img class="poster"
           src="${posterUrl(m.poster, "w342")}"
           alt="${m.title} 포스터">

      <span class="badge">${m.rating}</span>

      <div class="info">
        <h3>${m.title}</h3>
        <p class="year">${m.year}</p>
        <button class="like" type="button">♥</button>
      </div>
    `;

    board.appendChild(card);
  }


  // 영화 개수 표시
  document.getElementById("count").textContent =
    "총 " + list.length + "편";


  // 찜 개수 업데이트
  updateLikeCount();


  // 검색 결과가 없는 경우
  if (list.length === 0) {
    board.classList.add("is-empty");
  } else {
    board.classList.remove("is-empty");
  }
}


// 영화 정렬
function sortBy(list, key, desc) {
  const copy = [...list];

  copy.sort((a, b) => {
    if (typeof a[key] === "string") {
      return a[key].localeCompare(b[key]);
    }

    return a[key] - b[key];
  });

  if (desc) {
    copy.reverse();
  }

  return copy;
}


// 검색과 정렬을 함께 처리하는 함수
function getView() {
  const keyword = document.getElementById("q").value
    .trim()
    .toLowerCase();

  const found = movies.filter(m =>
    m.title.toLowerCase().includes(keyword)
  );

  const key = document.getElementById("sort").value;

  return sortBy(found, key, key !== "title");
}


// 정렬 적용
function applySort() {
  renderCards(getView());
}


// 찜 개수 업데이트
function updateLikeCount() {
  document.getElementById("likeCount").textContent =
    document.querySelectorAll(".liked").length;
}

document.querySelector(".board").addEventListener("click", (e) => {
  if (e.target.classList.contains("like")) {
    e.target.classList.toggle("liked");
    updateLikeCount();
  }
});


document.getElementById("q").addEventListener("input", (e) => {
  renderCards(getView());
});


document.getElementById("sort").addEventListener("change", applySort);


document.getElementById("q").addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.target.value = "";
    renderCards(getView());
  }
});

renderCards(getView());