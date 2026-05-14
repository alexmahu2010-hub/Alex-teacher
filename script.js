let parentCode = "";

const storageKeys = {
  categories: "teachlist.categories",
  profiles: "teachlist.profiles",
  theme: "teachlist.theme"
};

function showPage(pageId) {
  const pages = document.querySelectorAll(".page");

  pages.forEach(function (page) {
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");
}

function toggleTheme() {
  const body = document.body;
  const headerLogo = document.getElementById("headerLogo");
  const heroLogo = document.getElementById("heroLogo");
  const themeButton = document.getElementById("themeButton");

  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    headerLogo.src = "logo-dark.png";
    heroLogo.src = "logo-dark.png";
    themeButton.textContent = "Light mode";
    localStorage.setItem(storageKeys.theme, "dark");
  } else {
    headerLogo.src = "logo.png";
    heroLogo.src = "logo.png";
    themeButton.textContent = "Dark mode";
    localStorage.setItem(storageKeys.theme, "light");
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem(storageKeys.theme);
  const headerLogo = document.getElementById("headerLogo");
  const heroLogo = document.getElementById("heroLogo");
  const themeButton = document.getElementById("themeButton");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    headerLogo.src = "logo-dark.png";
    heroLogo.src = "logo-dark.png";
    themeButton.textContent = "Light mode";
  } else {
    document.body.classList.remove("dark");
    headerLogo.src = "logo.png";
    heroLogo.src = "logo.png";
    themeButton.textContent = "Dark mode";
  }
}

function checkOtherDomain() {
  const mentorDomain = document.getElementById("mentorDomain");
  const newDomainBox = document.getElementById("newDomainBox");

  if (mentorDomain.value === "alt") {
    newDomainBox.classList.remove("hidden");
  } else {
    newDomainBox.classList.add("hidden");
  }
}

function addMentorDomain() {
  const input = document.getElementById("newDomainInput");
  const mentorDomain = document.getElementById("mentorDomain");
  const domainName = input.value.trim();

  if (domainName === "") {
    alert("Scrie numele domeniului.");
    return;
  }

  addCategoryToPage(domainName);
  addCategoryToTeacherSelect(domainName);
  saveCategory(domainName);

  mentorDomain.value = domainName;
  input.value = "";
  document.getElementById("newDomainBox").classList.add("hidden");

  alert("Domeniul a fost adăugat în sistem și salvat în browser.");
}

function addCategory() {
  const input = document.getElementById("newCategoryInput");
  const categoryName = input.value.trim();

  if (categoryName === "") {
    alert("Scrie numele categoriei.");
    return;
  }

  addCategoryToPage(categoryName);
  addCategoryToTeacherSelect(categoryName);
  saveCategory(categoryName);

  input.value = "";
  alert("Categoria a fost adăugată și salvată în browser.");
}

function addCategoryToPage(categoryName) {
  const categoryGrid = document.getElementById("categoryGrid");

  const existingCategories = Array.from(
    document.querySelectorAll(".category-card")
  ).map(function (card) {
    return card.textContent.toLowerCase();
  });

  if (existingCategories.includes(categoryName.toLowerCase())) {
    return;
  }

  const card = document.createElement("div");
  card.className = "category-card";
  card.textContent = categoryName;

  categoryGrid.appendChild(card);
}

function addCategoryToTeacherSelect(categoryName) {
  const mentorDomain = document.getElementById("mentorDomain");

  const existingOptions = Array.from(mentorDomain.options).map(function (option) {
    return option.textContent.toLowerCase();
  });

  if (existingOptions.includes(categoryName.toLowerCase())) {
    return;
  }

  const newOption = document.createElement("option");
  newOption.textContent = categoryName;
  newOption.value = categoryName;

  const altOption = mentorDomain.querySelector('option[value="alt"]');
  mentorDomain.insertBefore(newOption, altOption);
}

function saveCategory(categoryName) {
  const savedCategories = JSON.parse(localStorage.getItem(storageKeys.categories)) || [];

  const exists = savedCategories.some(function (category) {
    return category.toLowerCase() === categoryName.toLowerCase();
  });

  if (!exists) {
    savedCategories.push(categoryName);
    localStorage.setItem(storageKeys.categories, JSON.stringify(savedCategories));
  }
}

function loadCategories() {
  const legacyCategories = JSON.parse(localStorage.getItem("categories")) || [];
  const savedCategories = JSON.parse(localStorage.getItem(storageKeys.categories)) || [];
  const categories = savedCategories.concat(legacyCategories);

  categories.forEach(function (category) {
    addCategoryToPage(category);
    addCategoryToTeacherSelect(category);
    saveCategory(category);
  });
}

function generateCode() {
  const studentLogin = document.getElementById("studentLogin").value.trim();
  const studentEmail = document.getElementById("studentEmail").value.trim();
  const codeBox = document.getElementById("codeBox");

  if (studentLogin === "" || studentEmail === "") {
    alert("Completează loginul și emailul elevului.");
    return;
  }

  parentCode = Math.floor(100000 + Math.random() * 900000).toString();

  codeBox.textContent = "Cod demo trimis elevului: " + parentCode;
}

function confirmParent() {
  const confirmCode = document.getElementById("confirmCode").value.trim();
  const studentAccept = document.getElementById("studentAccept").checked;

  if (confirmCode !== parentCode) {
    alert("Codul introdus nu este corect.");
    return false;
  }

  if (!studentAccept) {
    alert("Elevul trebuie să confirme că acesta este părintele său.");
    return false;
  }

  return true;
}

function getSavedProfiles() {
  return JSON.parse(localStorage.getItem(storageKeys.profiles)) || [];
}

function saveProfile(profile) {
  const profiles = getSavedProfiles();
  profiles.push(profile);
  localStorage.setItem(storageKeys.profiles, JSON.stringify(profiles));
}

function getFormData(form) {
  const data = {};
  const formData = new FormData(form);

  formData.forEach(function (value, key) {
    if (value instanceof File) {
      data[key] = value.name;
    } else {
      data[key] = value;
    }
  });

  return data;
}

function handleProfileSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const profileType = form.dataset.profileType;

  if (profileType === "parent" && !confirmParent()) {
    return;
  }

  const profile = {
    id: Date.now(),
    type: profileType,
    createdAt: new Date().toISOString(),
    data: getFormData(form)
  };

  saveProfile(profile);
  renderProfiles();
  form.reset();
  alert("Profilul a fost salvat în browser.");
  showPage("main");
}

function addText(parent, tagName, text) {
  const element = document.createElement(tagName);
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function addProfileField(parent, label, value) {
  const paragraph = document.createElement("p");
  const strong = document.createElement("strong");

  strong.textContent = label + ": ";
  paragraph.appendChild(strong);
  paragraph.append(value || "-");
  parent.appendChild(paragraph);
}

function renderProfiles() {
  const profilesBox = document.getElementById("profilesBox");
  const profiles = getSavedProfiles();

  profilesBox.replaceChildren();

  if (profiles.length === 0) {
    profilesBox.className = "empty-box";
    addText(profilesBox, "h3", "Mentorii vor apărea aici");
    addText(
      profilesBox,
      "p",
      "Nu adăugăm profesori inventați. Tu vei adăuga profesorii reali, iar noi le facem carduri detaliate."
    );
    return;
  }

  profilesBox.className = "profiles-list";
  addText(profilesBox, "h3", "Profiluri salvate în browser");

  profiles.forEach(function (profile) {
    const card = document.createElement("article");
    card.className = "profile-card";

    if (profile.type === "teacher") {
      addText(card, "h4", "Profesor: " + (profile.data.fullName || "Fără nume"));
      addProfileField(card, "Domeniu", profile.data.domain);
      addProfileField(card, "Cursuri", profile.data.courses);
      addProfileField(card, "Oraș", profile.data.city);
      addProfileField(card, "Format", profile.data.lessonFormat);
    } else if (profile.type === "student") {
      addText(
        card,
        "h4",
        "Elev: " + ((profile.data.firstName || "") + " " + (profile.data.lastName || "")).trim()
      );
      addProfileField(card, "Clasa", profile.data.grade);
      addProfileField(card, "Oraș", profile.data.city);
    } else {
      addText(
        card,
        "h4",
        "Părinte: " + ((profile.data.firstName || "") + " " + (profile.data.lastName || "")).trim()
      );
      addProfileField(card, "Login elev", profile.data.studentLogin);
      addProfileField(card, "Email elev", profile.data.studentEmail);
    }

    profilesBox.appendChild(card);
  });
}

function filterCategories() {
  const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
  const cards = document.querySelectorAll(".category-card");

  cards.forEach(function (card) {
    const matches = card.textContent.toLowerCase().includes(searchTerm);
    card.classList.toggle("hidden", !matches);
  });
}

function setupForms() {
  document.querySelectorAll(".form-card[data-profile-type]").forEach(function (form) {
    form.addEventListener("submit", handleProfileSubmit);
  });

  document.getElementById("searchInput").addEventListener("input", filterCategories);
}

loadTheme();
loadCategories();
renderProfiles();
setupForms();
