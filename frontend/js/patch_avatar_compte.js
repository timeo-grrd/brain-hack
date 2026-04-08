const fs = require('fs');
const file = 'c:\\laragon\\www\\hackathon\\HackAThon\\frontend\\html\\compte.html';
let content = fs.readFileSync(file, 'utf8');

const replacement = `          <div class="profile-avatar">
            <div class="avatar-circle" style="overflow:hidden; border:none; background:transparent;">
              <img id="currentAvatarImg" src="../assets/logo.png" style="width:100%; height:100%; object-fit:cover;" alt="Avatar" />
            </div>
            <p class="pseudo-text" id="userPseudoText">Pseudo</p>

            <div style="margin-top: 2rem; width: 100%;">
              <h4 style="color:var(--text-dark); margin-bottom: 15px; font-size: 1.1rem; text-align:center;">Changer d'avatar</h4>
              <div id="avatarContainer" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 15px;">
                <!-- Les avatars BDD se chargeront ici -->
              </div>
              <button id="btnSaveAvatar" class="btn btn-primary" style="display:none; margin: 0 auto;">Enregistrer le changement</button>
            </div>
          </div>`;

const regex = /<div class="profile-avatar">[\s\S]*?<p class="avatar-help-text">[^<]*<\/p>\s*<\/div>/;
if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log("Avatar section patched successfully via REGEX.");
} else {
    console.log("Could not find the target string.");
}
