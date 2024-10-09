import crypto from 'crypto-browserify'

// generate random salt
export const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex')
}
// used for encrpt passwd by sha512
export const hashPassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}
