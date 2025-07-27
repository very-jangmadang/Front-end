export const getClientId = () => {
  let clientId = localStorage.getItem('clientId');
  if (!clientId) {
    clientId = crypto.randomUUID(); // UUID는 브라우저에서만 가능
    localStorage.setItem('clientId', clientId);
  }
  return clientId;
};
