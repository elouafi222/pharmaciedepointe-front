export const per_page = 10;
export const extractEmail = (sender) => {
  const match = sender.match(/<(.+?)>/);
  return match ? match[1] : sender;
};
