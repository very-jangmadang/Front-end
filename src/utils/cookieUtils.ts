/**
 * 주어진 이름에 해당하는 쿠키 값을 반환합니다.
 * @param name 찾고자 하는 쿠키의 이름
 * @returns 쿠키 값을 찾으면 string, 찾지 못하면 null을 반환합니다.
 */
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}
