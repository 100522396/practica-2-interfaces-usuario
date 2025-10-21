// --- Validators ---
function isValidSurname(s) {
  var text = (s || "").replace(/\s+/g, " ").trim();
  if (!text) return false;
  var parts = text.split(" ");
  if (parts.length < 2) return false;
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].length < 3) return false;
  }
  return true;
}

// AÑADIR CALENDARIO POPUP
function isRealBirthdate(iso) {
  if (!iso) return false;
  var d = new Date(iso);
  var today = new Date();
  if (isNaN(d.getTime())) return false;
  if (d > today) return false;
  var age = (today - d) / (1000 * 60 * 60 * 24 * 365.25);
  return age >= 12 && age <= 120;
}

function isValidLogin(u) {
  var v = (u || "").trim();
  return v.length >= 5;
}

function isStrongPassword(pw) {
  if (!pw || pw.length < 8) return false;
  var twoDigits = (pw.match(/\d/g) || []).length >= 2;
  var hasUpper = /[A-Z]/.test(pw);
  var hasLower = /[a-z]/.test(pw);
  var hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return twoDigits && hasUpper && hasLower && hasSpecial;
}

function isValidAvatar(file) {
  if (!file) return false;
  var ok = ["image/webp", "image/png", "image/jpeg"];
  for (var i = 0; i < ok.length; i++) {
    if (file.type === ok[i]) return true;
  }
  return false;
}

var form = document.getElementById("register-form");
if (form) {
  var btnSubmit = document.getElementById("btn-register");
  var privacy = document.getElementById("privacy");

  // Disabledd until checked
  if (privacy && btnSubmit) {
    if (!privacy.checked) {
      btnSubmit.disabled = true;
    }
    privacy.addEventListener("change", function () {
      if (privacy.checked) {
        btnSubmit.disabled = false;
      } else {
        btnSubmit.disabled = true;
      }
    });
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();

    var nameEl = document.getElementById("reg-name");
    var surnameEl = document.getElementById("reg-surname");
    var emailEl = document.getElementById("reg-email");
    var email2El = document.getElementById("reg-email2");
    var birthEl = document.getElementById("birthdate");
    var userEl = document.getElementById("reg-username");
    var passEl = document.getElementById("reg-password");
    var avatarEl = document.getElementById("reg-avatar");

    var name = nameEl ? nameEl.value.trim() : "";
    var surname = surnameEl ? surnameEl.value.trim() : "";
    var email = emailEl ? emailEl.value.trim() : "";
    var email2 = email2El ? email2El.value.trim() : "";
    var birth = birthEl ? birthEl.value : "";
    var username = userEl ? userEl.value.trim() : "";
    var password = passEl ? passEl.value : "";
    var avatarFile =
      avatarEl && avatarEl.files && avatarEl.files.length > 0
        ? avatarEl.files[0]
        : null;

    // Validations
    if (name.length < 3) {
      alert("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!isValidSurname(surname)) {
      alert("Apellidos: introduce al menos dos palabras de 3+ caracteres.");
      return;
    }
    if (!Auth.isValidEmail(email)) {
      alert("Correo no válido.");
      return;
    }
    if (email !== email2) {
      alert("El correo y su confirmación no coinciden.");
      return;
    }
    if (!isRealBirthdate(birth)) {
      alert("Fecha de nacimiento no válida.");
      return;
    }
    if (!isValidLogin(username)) {
      alert("El usuario (login) debe tener al menos 5 caracteres.");
      return;
    }
    if (!isStrongPassword(password)) {
      alert(
        "La contraseña debe tener 8+ caracteres, 2 dígitos, 1 carácter especial, 1 mayúscula y 1 minúscula."
      );
      return;
    }
    if (!isValidAvatar(avatarFile)) {
      alert("Sube una imagen de perfil en formato .webp, .png o .jpg.");
      return;
    }

    // Duplicates
    var users = Auth.getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username || users[i].email === email) {
        alert("El usuario o el email ya existen.");
        return;
      }
    }
    // Convert user avatar to DataURL
    var reader = new FileReader();
    reader.onload = function (e) {
      var newUser = {
        name: name,
        surname: surname,
        email: email,
        birthdate: birth,
        username: username,
        password: password,
        createdAt: Date.now(),
        avatarDataUrl: e.target.result,
      };

      users.push(newUser);
      Auth.setUsers(users);
      Auth.setAuthUser(newUser);

      alert("Registro realizado correctamente.");
      window.location.href = "logged.html";
    };
    reader.onerror = function () {
      alert("No se pudo leer la imagen. Inténtalo de nuevo.");
    };
    reader.readAsDataURL(avatarFile);
  });
}
