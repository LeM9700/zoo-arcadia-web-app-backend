const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(`Mot de passe haché pour "${password}": ${hashedPassword}`);
};

hashPassword('password123'); // Change "password123" par ton mot de passe voulu
