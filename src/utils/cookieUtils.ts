/**
 * 주어진 이름에 해당하는 쿠키 값을 반환합니다.
 * @param name 찾고자 하는 쿠키의 이름
 * @returns 쿠키 값을 찾으면 string, 찾지 못하면 null을 반환합니다.
 */
export function getCookie(name: string): string | null {
  // 정규식을 사용하여 쿠키 문자열에서 원하는 쿠키를 더 안정적으로 찾습니다.
  const match = document.cookie.match(
    new RegExp('(^|;\\s*)' + name + '=([^;]*)'),
  );

  // match가 존재하면 URL 디코딩된 쿠키 값을 반환하고, 없으면 null을 반환합니다.
  return match ? decodeURIComponent(match[2]) : null;
}
