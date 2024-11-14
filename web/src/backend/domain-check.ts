import dns from "dns";

// could use this for email domain check
export const verifyDomain = (
  email: string,
  callback: (result: boolean) => void
) => {
  const domain = email.split("@")[1];
  dns.resolveMx(domain, (err, addresses) => {
    if (err || addresses.length === 0) {
      callback(false);
    } else {
      callback(true);
    }
  });
};
